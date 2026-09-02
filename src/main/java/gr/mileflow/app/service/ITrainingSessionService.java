package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.TrainingSessionInsertDTO;
import gr.mileflow.app.dto.TrainingSessionReadOnlyDTO;
import gr.mileflow.app.dto.TrainingSessionUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ITrainingSessionService {

    Page<TrainingSessionReadOnlyDTO> getPaginatedTrainingSessions(Long athleteId,  String keycloakId, Pageable pageable) throws EntityNotFoundException;

    TrainingSessionReadOnlyDTO createTrainingSession(TrainingSessionInsertDTO dto, String keycloakId) throws EntityNotFoundException;

    TrainingSessionReadOnlyDTO updateTrainingSession(Long sessionId, TrainingSessionUpdateDTO dto, String keycloakId) throws EntityNotFoundException, EntityAlreadyExistsException;

    TrainingSessionReadOnlyDTO deleteTrainingSessionById(Long sessionId, String keycloakId) throws EntityNotFoundException;

    List<TrainingSessionReadOnlyDTO> getTodayTrainingSessions(String keycloakId) throws EntityNotFoundException;

    Page<TrainingSessionReadOnlyDTO> getMyTrainingSessions(String keycloakId, Pageable pageable) throws EntityNotFoundException;
}
