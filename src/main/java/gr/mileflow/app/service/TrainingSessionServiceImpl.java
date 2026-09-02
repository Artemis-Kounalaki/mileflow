package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.TrainingSessionInsertDTO;
import gr.mileflow.app.dto.TrainingSessionReadOnlyDTO;
import gr.mileflow.app.dto.TrainingSessionUpdateDTO;
import gr.mileflow.app.mapper.Mapper;
import gr.mileflow.app.model.Athlete;
import gr.mileflow.app.model.Coach;
import gr.mileflow.app.model.Sport;
import gr.mileflow.app.model.TrainingSession;
import gr.mileflow.app.repository.AthleteRepository;
import gr.mileflow.app.repository.CoachRepository;
import gr.mileflow.app.repository.SportRepository;
import gr.mileflow.app.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrainingSessionServiceImpl implements ITrainingSessionService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final CoachRepository coachRepository;
    private final AthleteRepository athleteRepository;
    private final SportRepository sportRepository;
    private final Mapper mapper;

    @Transactional
    @PreAuthorize("hasRole('COACH')")
    @Override
    public Page<TrainingSessionReadOnlyDTO> getPaginatedTrainingSessions(Long athleteId, String keycloakId, Pageable pageable) throws EntityNotFoundException {
        Coach coach = coachRepository.findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() -> new EntityNotFoundException("Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

        Athlete athlete = athleteRepository.findByIdAndCoach_IdAndDeletedFalse(athleteId, coach.getId())
                .orElseThrow(() -> new EntityNotFoundException("Athlete", "Athlete with id = " + athleteId + " not found."));

        Page<TrainingSession> sessionsPage = trainingSessionRepository
                        .findAllByAthlete_IdAndAthlete_Coach_IdAndDeletedFalse(athlete.getId(), coach.getId(), pageable);

        return sessionsPage.map(mapper::mapToTrainingSessionReadOnlyDTO);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('COACH')")
    public TrainingSessionReadOnlyDTO createTrainingSession(
            TrainingSessionInsertDTO dto,
            String keycloakId
    ) throws EntityNotFoundException {

        Coach coach = coachRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId).orElseThrow(() ->
                        new EntityNotFoundException("Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

        Athlete athlete = athleteRepository
                .findByIdAndCoach_IdAndDeletedFalse(dto.athleteId(), coach.getId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Athlete", "Athlete with id = " + dto.athleteId() + " not found."));

        Sport sport = sportRepository
                .findByIdAndDeletedFalse(dto.sportId())
                .orElseThrow(() -> new EntityNotFoundException("Sport", "Sport with id = " + dto.sportId() + " not found."));

        TrainingSession session = new TrainingSession();
        session.setCoach(coach);
        session.setAthlete(athlete);
        session.setSport(sport);
        session.setSets(dto.sets());
        session.setTargetTime(dto.targetTime());
        session.setSessionDate(dto.sessionDate());
        session.setDescription(dto.description());
        session.setStatus(dto.status());

        TrainingSession savedSession =
                trainingSessionRepository.save(session);

        log.info("Training session id={} created for athlete id={} by coach id={}",
                savedSession.getId(),
                athlete.getId(),
                coach.getId());

        return mapper.mapToTrainingSessionReadOnlyDTO(savedSession);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('COACH')")
    public TrainingSessionReadOnlyDTO updateTrainingSession(
            Long sessionId,
            TrainingSessionUpdateDTO dto,
            String keycloakId
    ) throws EntityNotFoundException {

        Coach coach = coachRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Coach",
                                "Active coach with keycloak id = " + keycloakId + " not found."));

        TrainingSession session = trainingSessionRepository
                .findByIdAndAthlete_Coach_IdAndDeletedFalse(sessionId, coach.getId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "TrainingSession",
                                "Training session with id = " + sessionId + " not found."));

        Sport sport = sportRepository
                .findByIdAndDeletedFalse(dto.sportId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Sport",
                                "Sport with id = " + dto.sportId() + " not found."));

        session.setSport(sport);
        session.setSets(dto.sets());
        session.setTargetTime(dto.targetTime());
        session.setActualTime(dto.actualTime());
        session.setSessionDate(dto.sessionDate());
        session.setDescription(dto.description());
        session.setStatus(dto.status());

        TrainingSession updatedSession = trainingSessionRepository.save(session);

        log.info("Training session id={} updated by coach id={}",
                sessionId,
                coach.getId());

        return mapper.mapToTrainingSessionReadOnlyDTO(updatedSession);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('COACH')")
    public TrainingSessionReadOnlyDTO deleteTrainingSessionById(
            Long sessionId,
            String keycloakId
    ) throws EntityNotFoundException {

        Coach coach = coachRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Coach",
                                "Active coach with keycloak id = " + keycloakId + " not found."));

        TrainingSession session = trainingSessionRepository
                .findByIdAndAthlete_Coach_IdAndDeletedFalse(sessionId, coach.getId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "TrainingSession",
                                "Training session with id = " + sessionId + " not found."));

        session.softDelete();

        trainingSessionRepository.save(session);

        log.info("Training session id={} deleted by coach id={}", sessionId, coach.getId());

        return mapper.mapToTrainingSessionReadOnlyDTO(session);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('COACH')")
    public List<TrainingSessionReadOnlyDTO> getTodayTrainingSessions(String keycloakId)
            throws EntityNotFoundException {

        Coach coach = coachRepository.findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() -> new EntityNotFoundException("Coach", "Active coach with keycloak id = " + keycloakId + " not found."));

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();

        return trainingSessionRepository
                .findAllByCoach_IdAndSessionDateGreaterThanEqualAndSessionDateLessThanAndDeletedFalseOrderBySessionDateAsc(
                        coach.getId(), startOfDay, startOfNextDay)
                .stream()
                .map(mapper::mapToTrainingSessionReadOnlyDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ATHLETE')")
    public Page<TrainingSessionReadOnlyDTO> getMyTrainingSessions(
            String keycloakId,
            Pageable pageable
    ) throws EntityNotFoundException {

        Athlete athlete = athleteRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Athlete",
                                "Active athlete with keycloak id = " + keycloakId + " not found."
                        )
                );

        Page<TrainingSession> sessionsPage =
                trainingSessionRepository
                        .findAllByAthlete_IdAndDeletedFalse(
                                athlete.getId(),
                                pageable
                        );

        return sessionsPage.map(mapper::mapToTrainingSessionReadOnlyDTO);
    }
}