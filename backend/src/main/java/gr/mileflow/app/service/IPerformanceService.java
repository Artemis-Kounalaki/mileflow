package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.PerformanceReadOnlyDTO;

public interface IPerformanceService {
    PerformanceReadOnlyDTO getAthletePerformance(Long athleteId, Long sportId, Integer days, String keycloakId)
            throws EntityNotFoundException;
    PerformanceReadOnlyDTO getMyPerformance(Long sportId, Integer days, String keycloakId)
            throws EntityNotFoundException;}