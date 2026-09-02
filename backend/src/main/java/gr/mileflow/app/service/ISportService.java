package gr.mileflow.app.service;

import gr.mileflow.app.dto.SportReadOnlyDTO;

import java.util.List;

public interface ISportService {
    public List<SportReadOnlyDTO> getAllSports();
}
