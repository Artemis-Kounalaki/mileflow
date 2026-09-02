package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityInvalidArgumentException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.*;
import gr.mileflow.app.model.Athlete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface IAthleteService {

    AthleteCreationResponseDTO createAthlete(AthleteInsertDTO athleteInsertDTO,
                                             String keycloakId) throws EntityAlreadyExistsException, EntityNotFoundException;

    AthleteReadOnlyDTO getAthleteByUser_KeycloakId(String keycloakId) throws EntityNotFoundException;

    AthleteReadOnlyDTO getAthleteByUser_KeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException;
    AthleteReadOnlyDTO getAthleteByIdForCoach(Long athleteId, String keycloakId) throws EntityNotFoundException;

    AthleteReadOnlyDTO updateAthlete(Long athleteId, AthleteUpdateDTO dto, String keycloakId) throws EntityNotFoundException, EntityAlreadyExistsException;
    AthleteReadOnlyDTO deleteAthleteById(Long athleteId, String keycloakId) throws EntityNotFoundException;

    Page<AthleteReadOnlyDTO> getPaginatedAthletes(Pageable pageable, String keycloakId) throws EntityNotFoundException;
    Page<AthleteReadOnlyDTO> getPaginatedAthletesDeletedFalse(Pageable pageable);

    boolean isAthleteExists(String keycloakId);


}
