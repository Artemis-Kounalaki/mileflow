package gr.mileflow.app.api;

import gr.mileflow.app.dto.SportReadOnlyDTO;
import gr.mileflow.app.service.ISportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sports")
@RequiredArgsConstructor
public class SportRestController {
    private final ISportService sportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('COACH', 'ATHLETE')")
    public ResponseEntity<List<SportReadOnlyDTO>> getSports() {
        return ResponseEntity.ok(sportService.getAllSports());
    }
}