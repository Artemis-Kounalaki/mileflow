package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.PerformanceReadOnlyDTO;
import gr.mileflow.app.service.IPerformanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/performance")
@RequiredArgsConstructor
@Tag(
        name = "Performance",
        description = "Operations for retrieving athlete performance data"
)
public class PerformanceRestController {

    private final IPerformanceService performanceService;

    @GetMapping("/athlete/{athleteId}")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Get athlete performance",
            description = "Returns the performance data of a specific athlete for a selected sport and optional number of days."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Athlete performance retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Athlete or sport not found"
            )
    })
    public ResponseEntity<PerformanceReadOnlyDTO> getAthletePerformance(
            @Parameter(
                    name = "athleteId",
                    description = "ID of the athlete",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long athleteId,

            @Parameter(
                    name = "sportId",
                    description = "ID of the sport",
                    required = true,
                    in = ParameterIn.QUERY,
                    example = "1"
            )
            @RequestParam Long sportId,

            @Parameter(
                    name = "days",
                    description = "Number of previous days to include in the performance data",
                    required = false,
                    in = ParameterIn.QUERY,
                    example = "30"
            )
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
    @Operation(
            summary = "Get my performance",
            description = "Returns the performance data of the currently authenticated athlete for a selected sport and optional number of days."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Performance data retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Sport or performance data not found"
            )
    })
    public ResponseEntity<PerformanceReadOnlyDTO> getMyPerformance(
            @Parameter(
                    name = "sportId",
                    description = "ID of the sport",
                    required = true,
                    in = ParameterIn.QUERY,
                    example = "1"
            )
            @RequestParam Long sportId,

            @Parameter(
                    name = "days",
                    description = "Number of previous days to include in the performance data",
                    required = false,
                    in = ParameterIn.QUERY,
                    example = "30"
            )
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
