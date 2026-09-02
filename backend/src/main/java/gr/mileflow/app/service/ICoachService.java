package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.CoachReadOnlyDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICoachService {
    CoachReadOnlyDTO getCoachByUser_KeycloakId(String keycloakId) throws EntityNotFoundException;

    CoachReadOnlyDTO getCoachByUser_KeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException;

    Page<CoachReadOnlyDTO> getPaginatedCoaches(Pageable pageable);
    Page<CoachReadOnlyDTO> getPaginatedCoachesDeletedFalse(Pageable pageable);

    boolean isCoachExists(String keycloakId);

}
