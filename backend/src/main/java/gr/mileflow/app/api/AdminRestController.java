package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.*;
import gr.mileflow.app.service.IAthleteService;
import gr.mileflow.app.service.ICoachService;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Admin", description = "Superadmin operations for managing coaches and athletes")
public class AdminRestController {

    private final ICoachService coachService;
    private final IAthleteService athleteService;

    @PostMapping("/coaches")
    @Operation(
            summary = "Create a new coach",
            description = "Creates a new coach account."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Coach created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid coach data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<CoachCreationResponseDTO> createCoach(
            @Valid @RequestBody CoachInsertDTO dto
    ) throws EntityAlreadyExistsException {

        CoachCreationResponseDTO response = coachService.createCoach(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.coach().id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @GetMapping("/athletes")
    @Operation(
            summary = "Get all athletes",
            description = "Returns a paginated list of all active athletes."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Athletes retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<AthleteReadOnlyDTO>> getAthletes(
            @PageableDefault(size = 10, sort = "lastname")
            Pageable pageable) {

        return ResponseEntity.ok(athleteService.getPaginatedAthletesDeletedFalse(pageable));
    }

    @GetMapping("/coaches")
    @Operation(
            summary = "Get all coaches",
            description = "Returns a paginated list of all active coaches."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coaches retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<CoachReadOnlyDTO>> getCoaches(
            @PageableDefault(size = 10, sort = "lastname")
            Pageable pageable) {

        return ResponseEntity.ok(
                coachService.getPaginatedCoachesDeletedFalse(pageable)
        );
    }

    @PutMapping("/coaches/{id}")
    @Operation(
            summary = "Update a coach",
            description = "Updates the information of an existing coach."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coach updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid coach data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Coach not found")
    })
    public ResponseEntity<CoachReadOnlyDTO> updateCoach(
            @Parameter(
                    name = "id",
                    description = "ID of the coach",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long id,
            @Valid @RequestBody CoachUpdateDTO dto
    ) throws EntityNotFoundException, EntityAlreadyExistsException {

        return ResponseEntity.ok(
                coachService.updateCoach(id, dto)
        );
    }

    @DeleteMapping("/coaches/{id}")
    @Operation(
            summary = "Delete a coach",
            description = "Soft deletes an existing coach."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coach deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Coach not found")
    })
    public ResponseEntity<CoachReadOnlyDTO> deleteCoach(
            @Parameter(
                    name = "id",
                    description = "ID of the coach",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long id
    ) throws EntityNotFoundException {

        return ResponseEntity.ok(
                coachService.deleteCoach(id)
        );
    }

}