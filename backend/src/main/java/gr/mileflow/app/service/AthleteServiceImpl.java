package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityInvalidArgumentException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.*;
import gr.mileflow.app.mapper.Mapper;
import gr.mileflow.app.model.Athlete;
import gr.mileflow.app.model.Coach;
import gr.mileflow.app.model.User;
import gr.mileflow.app.repository.AthleteRepository;
import gr.mileflow.app.repository.CoachRepository;
import gr.mileflow.app.repository.UserRepository;
import gr.mileflow.app.security.KeycloakAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Slf4j
@RequiredArgsConstructor

public class AthleteServiceImpl implements IAthleteService {

    private final AthleteRepository athleteRepository;
    private final UserRepository userRepository;
    private final CoachRepository coachRepository;
    private final KeycloakAdminService keycloakAdminService;
    private final Mapper mapper;

    @Transactional(rollbackFor = {EntityAlreadyExistsException.class, EntityInvalidArgumentException.class})
    @Override
    public AthleteCreationResponseDTO createAthlete(AthleteInsertDTO dto, String keycloakId)
            throws EntityAlreadyExistsException, EntityNotFoundException {

        try {
            Coach coach = coachRepository
                    .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    "Coach",
                                    "Active coach with keycloak id = " + keycloakId + " not found.")
                    );

            if( userRepository.findByUsername(dto.userInsertDTO().username()).isPresent() )
                throw new EntityAlreadyExistsException("Username", "User with username "
                        + dto.userInsertDTO().username() + " already exists");

            if( userRepository.findByEmail(dto.userInsertDTO().email()).isPresent() )
                throw new EntityAlreadyExistsException("Email", "User with email "
                        + dto.userInsertDTO().email() + " already exists");

            KeycloakUserCreationResult result = keycloakAdminService.createUser(dto.userInsertDTO());
            String athleteKeycloakId = result.keycloakId();

            Athlete athlete = mapper.mapToAthleteEntity(dto);

            User user = athlete.getUser();
            user.setKeycloakId(athleteKeycloakId);

            athlete.setCoach(coach);

            athleteRepository.save(athlete);
            log.info("Athlete with username={} saved successfully.", dto.userInsertDTO().username());
            return new AthleteCreationResponseDTO(
                    mapper.mapToAthleteReadOnlyDTO(athlete),
                    result.temporaryPassword()
            );
        }
        catch(EntityAlreadyExistsException e){
            log.error("Save failed for athlete with username={}. Athlete already exists", dto.userInsertDTO().username(), e);     // Structured Logging
            throw e;
        }
    }

    @Transactional(readOnly = true)
    @Override
    public AthleteReadOnlyDTO getAthleteByIdForCoach(
            Long athleteId,
            String keycloakId
    ) throws EntityNotFoundException {
        Coach coach = coachRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

        Athlete athlete = athleteRepository
                .findByIdAndCoach_IdAndDeletedFalse(athleteId, coach.getId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Athlete", "Athlete with id = " + athleteId + " not found."));

        return mapper.mapToAthleteReadOnlyDTO(athlete);
    }

    @Transactional
    @Override
    public AthleteReadOnlyDTO updateAthlete(Long athleteId, AthleteUpdateDTO dto, String keycloakId) throws EntityNotFoundException, EntityAlreadyExistsException {
        try {
            Coach coach = coachRepository.findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                    .orElseThrow(() -> new EntityNotFoundException("Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

            Athlete athlete = athleteRepository.findByIdAndCoach_IdAndDeletedFalse(athleteId, coach.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Athlete", "Athlete with id = " + athleteId + " not found."));

            User user = athlete.getUser();

            if (!user.getUsername().equals(dto.user().username())
                    && userRepository.findByUsername(dto.user().username()).isPresent()) {
                throw new EntityAlreadyExistsException("Username", "User with username " + dto.user().username() + " already exists");
            }

            if (!user.getEmail().equals(dto.user().email())
                    && userRepository
                    .findByEmail(dto.user().email())
                    .isPresent()) {
                throw new EntityAlreadyExistsException("Email", "User with email " + dto.user().email() + " already exists");
            }


            athlete.setFirstname(dto.firstname());
            athlete.setLastname(dto.lastname());
            athlete.setBirthday(dto.birthday());
            athlete.setGender(dto.gender());

            user.setUsername(dto.user().username());
            user.setEmail(dto.user().email());

            athleteRepository.save(athlete);

            keycloakAdminService.updateUser(
                    user.getKeycloakId(),
                    user.getUsername(),
                    user.getEmail()
            );

            log.info("Athlete id={} updated successfully by coach id={}",
                    athleteId, coach.getId());

            return mapper.mapToAthleteReadOnlyDTO(athlete);
        } catch (EntityNotFoundException e) {
            log.error("Update failed for athlete with username={}. Athlete not found", dto.user().username(), e);
            throw e;
        }
    }

    @Transactional
    @Override
    public AthleteReadOnlyDTO deleteAthleteById(Long athleteId, String keycloakId) throws EntityNotFoundException {
       try {
           Coach coach = coachRepository.findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                   .orElseThrow(() -> new EntityNotFoundException("Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

           Athlete athlete = athleteRepository.findByIdAndCoach_IdAndDeletedFalse(athleteId, coach.getId())
                   .orElseThrow(() -> new EntityNotFoundException("Athlete", "Athlete with id = " + athleteId + " not found."));

           athlete.softDelete();
           athlete.getUser().softDelete();

           athleteRepository.save(athlete);
           keycloakAdminService.disableUser(athlete.getUser().getKeycloakId());

           log.info("Athlete id={} deleted by coach id={}", athleteId, coach.getId());
           return mapper.mapToAthleteReadOnlyDTO(athlete);

       }
        catch (EntityNotFoundException e) {
            log.error("Delete failed for athlete with id ={}. Athlete not found", athleteId, e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    @Override
    public AthleteReadOnlyDTO getAthleteByUser_KeycloakId(String keycloakId) throws EntityNotFoundException {
        try{
          Athlete athlete = athleteRepository.findByUser_KeycloakId(keycloakId).orElseThrow(
                  () -> new EntityNotFoundException("Athlete","Athlete with user keycloak id = "+ keycloakId + "not found.")
          );
          log.debug("Athlete with keycloak id = {} found successfully", keycloakId);
          return mapper.mapToAthleteReadOnlyDTO(athlete);
      }
      catch(EntityNotFoundException e){
          log.error("Get athlete by keycloak id = {} failed", keycloakId, e);
          throw e;
      }
    }

    @Transactional(readOnly = true)
    @Override
    public AthleteReadOnlyDTO getAthleteByUser_KeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException {
        try{
            Athlete athlete = athleteRepository.findByUser_KeycloakIdAndDeletedFalse(keycloakId).orElseThrow(
                    () -> new EntityNotFoundException("Athlete","Non-deleted athlete with user keycloak id = "+ keycloakId + "not found.")
            );
            log.debug("Non-deleted athlete with keycloak id = {} found successfully", keycloakId);
            return mapper.mapToAthleteReadOnlyDTO(athlete);
        }
        catch(EntityNotFoundException e){
            log.error("Get non-deleted athlete by keycloak id = {} failed", keycloakId, e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('COACH')")
    @Transactional(readOnly = true)
    @Override
    public Page<AthleteReadOnlyDTO> getPaginatedAthletes(Pageable pageable, String keycloakId
    ) throws EntityNotFoundException {
        try {
            Coach coach = coachRepository
                    .findByUser_KeycloakIdAndDeletedFalse(keycloakId).orElseThrow(() ->
                            new EntityNotFoundException("Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

            Page<Athlete> athletesPage =
                    athleteRepository.findAllByCoach_IdAndDeletedFalse(coach.getId(), pageable);

            log.debug(
                    "Get paginated athletes for coach={} returned successfully page={} and size={}",
                    coach.getId(), athletesPage.getNumber(), athletesPage.getSize());

            return athletesPage.map(mapper::mapToAthleteReadOnlyDTO);
        }
        catch (EntityNotFoundException e){
            log.error("Get list of non-deleted athletes failed.", e);
            throw e;
        }

    }

    @Transactional(readOnly = true)
    @Override
    public Page<AthleteReadOnlyDTO> getPaginatedAthletesDeletedFalse(Pageable pageable) {
        return null;
    }

    @Override
    public boolean isAthleteExists(String keycloakId) {
        return athleteRepository.findByUser_KeycloakId(keycloakId).isPresent();
    }
}
