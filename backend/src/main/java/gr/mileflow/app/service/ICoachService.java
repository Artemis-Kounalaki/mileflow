package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.CoachCreationResponseDTO;
import gr.mileflow.app.dto.CoachInsertDTO;
import gr.mileflow.app.dto.CoachReadOnlyDTO;
import gr.mileflow.app.dto.CoachUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICoachService {
    CoachReadOnlyDTO getCoachByUser_KeycloakId(String keycloakId) throws EntityNotFoundException;

    CoachReadOnlyDTO getCoachByUser_KeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException;

    Page<CoachReadOnlyDTO> getPaginatedCoaches(Pageable pageable);
    Page<CoachReadOnlyDTO> getPaginatedCoachesDeletedFalse(Pageable pageable);

    CoachCreationResponseDTO createCoach(CoachInsertDTO dto) throws EntityAlreadyExistsException;

    CoachReadOnlyDTO updateCoach(Long coachId, CoachUpdateDTO dto) throws EntityNotFoundException, EntityAlreadyExistsException;

    CoachReadOnlyDTO deleteCoach(Long coachId) throws EntityNotFoundException;

    boolean isCoachExists(String keycloakId);

}
