package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityInvalidArgumentException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.core.exceptions.ValidationException;
import gr.mileflow.app.dto.TrainingSessionInsertDTO;
import gr.mileflow.app.dto.TrainingSessionReadOnlyDTO;
import gr.mileflow.app.dto.TrainingSessionUpdateDTO;
import gr.mileflow.app.service.ITrainingSessionService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/training-sessions")
@RequiredArgsConstructor
@Tag(
        name = "Training Sessions",
        description = "Operations for managing training sessions"
)
public class TrainingSessionRestController {

    private final ITrainingSessionService trainingSessionService;

    @GetMapping("/athlete/{athleteId}")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Get athlete training sessions",
            description = "Returns a paginated list of training sessions for a specific athlete belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Training sessions retrieved successfully"
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
    public ResponseEntity<Page<TrainingSessionReadOnlyDTO>> getPaginatedTrainingSessions(
            @Parameter(
                    name = "athleteId",
                    description = "ID of the athlete",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long athleteId,

            @PageableDefault(size = 10, sort = "sessionDate")
            Pageable pageable,

            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        return ResponseEntity.ok(
                trainingSessionService.getPaginatedTrainingSessions(
                        athleteId,
                        jwt.getSubject(),
                        pageable
                )
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Create a training session",
            description = "Creates a new training session for an athlete belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Training session created successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid training session data"
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
                    description = "Athlete, coach or sport not found"
            )
    })
    public ResponseEntity<TrainingSessionReadOnlyDTO> createTrainingSession(
            @Valid @RequestBody TrainingSessionInsertDTO dto,
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        return ResponseEntity.ok(
                trainingSessionService.createTrainingSession(
                        dto,
                        jwt.getSubject()
                )
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Update a training session",
            description = "Updates an existing training session belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Training session updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid training session data"
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
                    description = "Training session not found"
            )
    })
    public ResponseEntity<TrainingSessionReadOnlyDTO> updateTrainingSession(
            @Parameter(
                    name = "id",
                    description = "ID of the training session",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long id,

            @Valid @RequestBody TrainingSessionUpdateDTO dto,

            BindingResult bindingResult,

            @AuthenticationPrincipal Jwt jwt
    ) throws EntityAlreadyExistsException,
            EntityInvalidArgumentException,
            ValidationException,
            EntityNotFoundException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException(
                    "TrainingSession",
                    "Invalid training session data",
                    bindingResult
            );
        }

        TrainingSessionReadOnlyDTO trainingSession =
                trainingSessionService.updateTrainingSession(
                        id,
                        dto,
                        jwt.getSubject()
                );

        return ResponseEntity.ok(trainingSession);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Delete a training session",
            description = "Deletes a training session belonging to the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Training session deleted successfully"
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
                    description = "Training session not found"
            )
    })
    public ResponseEntity<TrainingSessionReadOnlyDTO> deleteTrainingSession(
            @Parameter(
                    name = "id",
                    description = "ID of the training session",
                    required = true,
                    in = ParameterIn.PATH,
                    example = "1"
            )
            @PathVariable Long id,

            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        return ResponseEntity.ok(
                trainingSessionService.deleteTrainingSessionById(
                        id,
                        jwt.getSubject()
                )
        );
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('COACH')")
    @Operation(
            summary = "Get today's training sessions",
            description = "Returns all training sessions scheduled for today for the authenticated coach."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Today's training sessions retrieved successfully"
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
    public ResponseEntity<List<TrainingSessionReadOnlyDTO>> getTodayTrainingSessions(
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        return ResponseEntity.ok(
                trainingSessionService.getTodayTrainingSessions(
                        jwt.getSubject()
                )
        );
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ATHLETE')")
    @Operation(
            summary = "Get my training sessions",
            description = "Returns a paginated list of training sessions for the currently authenticated athlete."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Training sessions retrieved successfully"
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
                    description = "Training sessions not found"
            )
    })
    public ResponseEntity<Page<TrainingSessionReadOnlyDTO>> getMyTrainingSessions(
            @PageableDefault(size = 10, sort = "sessionDate")
            Pageable pageable,

            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException {

        return ResponseEntity.ok(
                trainingSessionService.getMyTrainingSessions(
                        jwt.getSubject(),
                        pageable
                )
        );
    }
}