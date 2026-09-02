package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.CoachReadOnlyDTO;
import gr.mileflow.app.mapper.Mapper;
import gr.mileflow.app.model.Athlete;
import gr.mileflow.app.model.Coach;
import gr.mileflow.app.repository.CoachRepository;
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

    @Transactional(readOnly = true)
    @Override
    public Page<CoachReadOnlyDTO> getPaginatedCoaches(Pageable pageable) {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public Page<CoachReadOnlyDTO> getPaginatedCoachesDeletedFalse(Pageable pageable) {
        return null;
    }

    @Override
    public boolean isCoachExists(String keycloakId) {
       return coachRepository.findByUser_KeycloakId(keycloakId).isPresent();
    }
}
