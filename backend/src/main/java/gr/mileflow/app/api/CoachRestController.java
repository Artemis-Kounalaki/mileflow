package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.CoachReadOnlyDTO;
import gr.mileflow.app.service.ICoachService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/coaches")
@Tag(
        name = "Coaches",
        description = "Operations for managing coach profiles"
)
public class CoachRestController {

    private final ICoachService iCoachService;

    @GetMapping("/me")
    @Operation(
            summary = "Get my coach profile",
            description = "Returns the profile of the currently authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Coach profile retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Coach profile not found"
            )
    })
    public ResponseEntity<CoachReadOnlyDTO> getMyCoachProfile(
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        String keycloakId = jwt.getSubject();

        CoachReadOnlyDTO coachReadOnlyDTO = iCoachService
                .getCoachByUser_KeycloakIdDeletedFalse(keycloakId);

        return ResponseEntity.ok(coachReadOnlyDTO);
    }
}
