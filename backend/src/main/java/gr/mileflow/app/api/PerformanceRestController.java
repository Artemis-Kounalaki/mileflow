package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.PerformanceReadOnlyDTO;
import gr.mileflow.app.service.IPerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/performance")
@RequiredArgsConstructor
public class PerformanceRestController {

    private final IPerformanceService performanceService;

    @GetMapping("/athlete/{athleteId}")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<PerformanceReadOnlyDTO> getAthletePerformance(
            @PathVariable Long athleteId,
            @RequestParam Long sportId,
            @RequestParam(required = false) Integer days,
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {
        return ResponseEntity.ok(
                performanceService.getAthletePerformance(
                        athleteId,
                        sportId,
                        days,
                        jwt.getSubject()
                )
        );
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ATHLETE')")
    public ResponseEntity<PerformanceReadOnlyDTO> getMyPerformance(
            @RequestParam Long sportId,
            @RequestParam(required = false) Integer days,
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {
        return ResponseEntity.ok(
                performanceService.getMyPerformance(
                        sportId,
                        days,
                        jwt.getSubject()
                )
        );
    }
}