package gr.mileflow.app.api;

import gr.mileflow.app.dto.SportReadOnlyDTO;
import gr.mileflow.app.service.ISportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "Sports",
        description = "Operations for retrieving available sports"
)
public class SportRestController {

    private final ISportService sportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('COACH', 'ATHLETE')")
    @Operation(
            summary = "Get all sports",
            description = "Returns a list of all available sports for authenticated coaches and athletes."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Sports retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            )
    })
    public ResponseEntity<List<SportReadOnlyDTO>> getSports() {
        return ResponseEntity.ok(sportService.getAllSports());
    }
}