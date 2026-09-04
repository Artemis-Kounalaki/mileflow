package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.*;
import gr.mileflow.app.mapper.Mapper;
import gr.mileflow.app.model.Athlete;
import gr.mileflow.app.model.Coach;
import gr.mileflow.app.model.User;
import gr.mileflow.app.repository.CoachRepository;
import gr.mileflow.app.repository.UserRepository;
import gr.mileflow.app.security.KeycloakAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CoachServiceImpl implements ICoachService{

    private final CoachRepository coachRepository;
    private final Mapper mapper;
    private final UserRepository userRepository;
    private final KeycloakAdminService keycloakAdminService;

    @Transactional(readOnly = true)
    @Override
    public CoachReadOnlyDTO getCoachByUser_KeycloakId(String keycloakId) throws EntityNotFoundException {
        try{
            Coach coach = coachRepository.findByUser_KeycloakId(keycloakId).orElseThrow(
                    () -> new EntityNotFoundException("Coach","Coach with user keycloak id = "+ keycloakId + "not found.")
            );
            log.debug("Coach with keycloak id = {} found successfully", keycloakId);
            return mapper.mapToCoachReadOnlyDTO(coach);
        }
        catch(EntityNotFoundException e){
            log.error("Get coach by keycloak id = {} failed", keycloakId, e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    @Override
    public CoachReadOnlyDTO getCoachByUser_KeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException {
        try{
            Coach coach = coachRepository.findByUser_KeycloakIdAndDeletedFalse(keycloakId).orElseThrow(
                    () -> new EntityNotFoundException("Coach","Active coach with user keycloak id = "+ keycloakId + "not found.")
            );
            log.debug("Active coach with keycloak id = {} found successfully", keycloakId);
            return mapper.mapToCoachReadOnlyDTO(coach);
        }
        catch(EntityNotFoundException e){
            log.error("Get active coach by keycloak id = {} failed", keycloakId, e);
            throw e;
        }
    }

    @Transactional
    @Override
    public CoachCreationResponseDTO createCoach(CoachInsertDTO dto)
            throws EntityAlreadyExistsException {

        try {
            if (userRepository.findByUsername(dto.user().username()).isPresent()) {
                throw new EntityAlreadyExistsException(
                        "Username",
                        "User with username " + dto.user().username() + " already exists"
                );
            }

            if (userRepository.findByEmail(dto.user().email()).isPresent()) {
                throw new EntityAlreadyExistsException(
                        "Email",
                        "User with email " + dto.user().email() + " already exists"
                );
            }

            KeycloakUserCreationResult result =
                    keycloakAdminService.createUser(dto.user(), "COACH");

            User user = new User(
                    dto.user().username(),
                    dto.user().email()
            );

            user.setKeycloakId(result.keycloakId());

            Coach coach = new Coach();
            coach.setUser(user);
            coach.setFirstname(dto.firstname());
            coach.setLastname(dto.lastname());
            coach.setBirthday(dto.birthday());

            coachRepository.save(coach);

            log.info(
                    "Coach with username={} created successfully.",
                    dto.user().username()
            );

            return new CoachCreationResponseDTO(
                    mapper.mapToCoachReadOnlyDTO(coach),
                    result.temporaryPassword()
            );

        } catch (EntityAlreadyExistsException e) {
            log.error(
                    "Create coach failed for username={}.",
                    dto.user().username(),
                    e
            );
            throw e;
        }
    }


    @Transactional
    @Override
    public CoachReadOnlyDTO updateCoach(Long coachId, CoachUpdateDTO dto) throws EntityNotFoundException, EntityAlreadyExistsException {

        Coach coach = coachRepository.findByIdAndDeletedFalse(coachId).orElseThrow(() ->
                        new EntityNotFoundException("Coach", "Active coach with id = " + coachId + " not found."));

        User user = coach.getUser();

        if (!user.getUsername().equals(
                dto.user().username()) && userRepository.findByUsername(dto.user().username()).isPresent())
        {
            throw new EntityAlreadyExistsException("Username", "User with username " + dto.user().username() + " already exists");
        }

        if (!user.getEmail().equals(dto.user().email()) && userRepository.findByEmail(dto.user().email()).isPresent()) {

            throw new EntityAlreadyExistsException("Email", "User with email " + dto.user().email() + " already exists");
        }

        coach.setFirstname(dto.firstname());
        coach.setLastname(dto.lastname());
        coach.setBirthday(dto.birthday());

        user.setUsername(dto.user().username());
        user.setEmail(dto.user().email());

        coachRepository.save(coach);

        keycloakAdminService.updateUser(user.getKeycloakId(), user.getUsername(), user.getEmail());

        log.info("Coach id={} updated successfully.", coachId);

        return mapper.mapToCoachReadOnlyDTO(coach);
    }

    @Transactional
    @Override
    public CoachReadOnlyDTO deleteCoach(Long coachId)
            throws EntityNotFoundException {

        Coach coach = coachRepository
                .findByIdAndDeletedFalse(coachId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Coach", "Active coach with id = " + coachId + " not found."));

        coach.softDelete();
        coach.getUser().softDelete();

        coachRepository.save(coach);
        keycloakAdminService.disableUser(coach.getUser().getKeycloakId());

        log.info("Coach id={} deleted successfully.", coachId);

        return mapper.mapToCoachReadOnlyDTO(coach);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<CoachReadOnlyDTO> getPaginatedCoaches(Pageable pageable) {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public Page<CoachReadOnlyDTO> getPaginatedCoachesDeletedFalse(Pageable pageable) {

        Page<Coach> coachesPage = coachRepository.findAllByDeletedFalse(pageable);

        log.debug("Get paginated active coaches returned successfully page={} and size={}",
                coachesPage.getNumber(), coachesPage.getSize());

        return coachesPage.map(mapper::mapToCoachReadOnlyDTO);
    }

    @Override
    public boolean isCoachExists(String keycloakId) {
       return coachRepository.findByUser_KeycloakId(keycloakId).isPresent();
    }
}
