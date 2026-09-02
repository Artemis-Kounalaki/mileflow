package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.PerformanceReadOnlyDTO;
import gr.mileflow.app.model.Athlete;
import gr.mileflow.app.model.Coach;
import gr.mileflow.app.model.Sport;
import gr.mileflow.app.model.TrainingSession;
import gr.mileflow.app.repository.AthleteRepository;
import gr.mileflow.app.repository.CoachRepository;
import gr.mileflow.app.repository.SportRepository;
import gr.mileflow.app.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements IPerformanceService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final CoachRepository coachRepository;
    private final AthleteRepository athleteRepository;
    private final SportRepository sportRepository;

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('COACH')")
    public PerformanceReadOnlyDTO getAthletePerformance(
            Long athleteId,
            Long sportId,
            Integer days,
            String keycloakId
    ) throws EntityNotFoundException {
        Coach coach = coachRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Coach",
                        "Active coach with keycloak id = " + keycloakId + " not found."
                ));

        Athlete athlete = athleteRepository
                .findByIdAndCoach_IdAndDeletedFalse(athleteId, coach.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Athlete",
                        "Athlete with id = " + athleteId + " not found."
                ));

        return buildPerformance(athlete.getId(), sportId, days);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ATHLETE')")
    public PerformanceReadOnlyDTO getMyPerformance(
            Long sportId,
            Integer days,
            String keycloakId
    ) throws EntityNotFoundException {
        Athlete athlete = athleteRepository
                .findByUser_KeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Athlete",
                        "Active athlete with keycloak id = " + keycloakId + " not found."
                ));

        return buildPerformance(athlete.getId(), sportId, days);
    }

    private PerformanceReadOnlyDTO buildPerformance(Long athleteId, Long sportId, Integer days)
            throws EntityNotFoundException {

        List<TrainingSession> allSessions = trainingSessionRepository
                        .findAllByAthlete_IdAndSport_IdAndDeletedFalseOrderBySessionDateDesc(
                                athleteId,
                                sportId
                        );

        List<TrainingSession> sessions = days == null ? allSessions : allSessions.stream()
                .filter(session ->
                        !session.getSessionDate().isBefore(
                                LocalDateTime.now().minusDays(days)
                        ))
                .toList();

        Sport sport = sportRepository.findByIdAndDeletedFalse(sportId).orElse(null);

        if (sport == null) {
            throw new EntityNotFoundException("Sport", "Sport with id=" + sportId + " not found.");}

        int totalSessions = sessions.size();

        int completedSessions = (int) sessions.stream()
                .filter(session -> session.getStatus() == TrainingSession.Status.COMPLETED)
                .count();

        double completionPercentage = totalSessions == 0
                ? 0
                : (completedSessions * 100.0) / totalSessions;

        Optional<TrainingSession> bestSession = sessions.stream()
                .filter(session -> session.getActualTime() != null)
                .min(Comparator.comparing(TrainingSession::getActualTime));

        LocalTime bestResult = bestSession
                .map(TrainingSession::getActualTime)
                .orElse(null);

        List<PerformanceReadOnlyDTO.ChartPoint> chart = sessions.stream()
                .filter(session -> session.getStatus() == TrainingSession.Status.COMPLETED)
                .filter(session -> session.getActualTime() != null)
                .sorted(Comparator.comparing(TrainingSession::getSessionDate))
                .map(session -> {
                    double target = session.getTargetTime().toSecondOfDay();
                    double actual = session.getActualTime().toSecondOfDay();
                    double comparison = actual == 0
                            ? 0
                            : (target / actual) * 100;

                    return new PerformanceReadOnlyDTO.ChartPoint(
                            session.getSessionDate(),
                            session.getTargetTime(),
                            session.getActualTime(),
                            comparison
                    );
                })
                .toList();

        return new PerformanceReadOnlyDTO(
                new PerformanceReadOnlyDTO.Summary(
                        sport.getId(),
                        sport.getName(),
                        totalSessions,
                        completedSessions,
                        completionPercentage,
                        bestResult
                ),
                chart
        );
    }
}