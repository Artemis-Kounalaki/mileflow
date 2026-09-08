package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.UserReadOnlyDTO;
import gr.mileflow.app.service.UserService;
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
@RequestMapping("api/v1/users")
@Tag(
        name = "Users",
        description = "Operations for managing user profiles"
)
public class UserRestController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(
            summary = "Get my user profile",
            description = "Returns the profile of the currently authenticated user."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User profile not found"
            )
    })
    public ResponseEntity<UserReadOnlyDTO> getUserByKeycloakId(
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        String keycloakId = jwt.getSubject();

        return ResponseEntity.ok(
                userService.getUserByKeycloakIdDeletedFalse(keycloakId)
        );
    }
}