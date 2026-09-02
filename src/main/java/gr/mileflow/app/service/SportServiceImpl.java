package gr.mileflow.app.service;

import gr.mileflow.app.dto.SportReadOnlyDTO;
import gr.mileflow.app.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor

public class SportServiceImpl implements ISportService{

    private final SportRepository sportRepository;

    public List<SportReadOnlyDTO> getAllSports() {
        return sportRepository.findAllByDeletedFalse()
                .stream()
                .map(sport -> new SportReadOnlyDTO(
                        sport.getId(),
                        sport.getName()
                ))
                .toList();
    }
}
