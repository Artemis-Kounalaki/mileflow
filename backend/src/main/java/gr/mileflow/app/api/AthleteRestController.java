package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityInvalidArgumentException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.core.exceptions.ValidationException;
import gr.mileflow.app.dto.AthleteCreationResponseDTO;
import gr.mileflow.app.dto.AthleteInsertDTO;
import gr.mileflow.app.dto.AthleteReadOnlyDTO;
import gr.mileflow.app.dto.AthleteUpdateDTO;
import gr.mileflow.app.service.IAthleteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/athletes")
@Tag(
        name = "Athletes",
        description = "Operations for managing athlete profiles"
)
public class AthleteRestController {

    private final IAthleteService iAthleteService;

    @GetMapping("/me")
    @Operation(
            summary = "Get my athlete profile",
            description = "Returns the profile of the currently authenticated athlete."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Athlete profile retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Athlete profile not found"
            )
    })
    public ResponseEntity<AthleteReadOnlyDTO> getMyAthleteProfile(
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        String keycloakId = jwt.getSubject();

        AthleteReadOnlyDTO athleteReadOnlyDTO = iAthleteService
                .getAthleteByUser_KeycloakIdDeletedFalse(keycloakId);

        return ResponseEntity.ok(athleteReadOnlyDTO);
    }

    @PostMapping
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Create an athlete",
            description = "Creates a new athlete and associates the athlete with the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Athlete created successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid athlete data"
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
                    description = "Coach not found"
            )
    })
    public ResponseEntity<AthleteCreationResponseDTO> saveAthlete(
            @Valid @RequestBody AthleteInsertDTO insertDTO,
            @AuthenticationPrincipal Jwt jwt)
            throws EntityAlreadyExistsException, EntityNotFoundException {

        String keycloakId = jwt.getSubject();

        AthleteCreationResponseDTO response =
                iAthleteService.createAthlete(insertDTO, keycloakId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.athlete().id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Get my athletes",
            description = "Returns a paginated list of the athletes belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Athletes retrieved successfully"
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
    public ResponseEntity<Page<AthleteReadOnlyDTO>> getMyAthletes(
            @PageableDefault(size = 10, sort = "lastname")
            Pageable pageable,
            @AuthenticationPrincipal Jwt jwt)
            throws EntityNotFoundException {

        String keycloakId = jwt.getSubject();

        return ResponseEntity.ok(
                iAthleteService.getPaginatedAthletes(pageable, keycloakId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Update an athlete",
            description = "Updates the information of an athlete belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Athlete updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid athlete data"
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
                    description = "Athlete not found"
            )
    })
    public ResponseEntity<AthleteReadOnlyDTO> updateAthlete(
            @Parameter(
                    name = "id",
                    description = "ID of the athlete",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long id,
            @Valid @RequestBody AthleteUpdateDTO dto,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt)
            throws EntityAlreadyExistsException,
            EntityInvalidArgumentException,
            ValidationException,
            EntityNotFoundException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException(
                    "Athlete",
                    "Invalid athlete data",
                    bindingResult
            );
        }

        AthleteReadOnlyDTO athleteReadOnlyDTO =
                iAthleteService.updateAthlete(
                        id,
                        dto,
                        jwt.getSubject()
                );

        return ResponseEntity.ok(athleteReadOnlyDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Delete an athlete",
            description = "Soft deletes an athlete belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Athlete deleted successfully"
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
                    description = "Athlete not found"
            )
    })
    public ResponseEntity<AthleteReadOnlyDTO> deleteAthleteById(
            @Parameter(
                    name = "id",
                    description = "ID of the athlete",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt)
            throws EntityNotFoundException {

        AthleteReadOnlyDTO athleteReadOnlyDTO =
                iAthleteService.deleteAthleteById(
                        id,
                        jwt.getSubject()
                );

        return ResponseEntity.ok(athleteReadOnlyDTO);
    }
}
