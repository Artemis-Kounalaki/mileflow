package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.core.exceptions.EntityInvalidArgumentException;
import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.core.exceptions.ValidationException;
import gr.mileflow.app.dto.TrainingSessionInsertDTO;
import gr.mileflow.app.dto.TrainingSessionReadOnlyDTO;
import gr.mileflow.app.dto.TrainingSessionUpdateDTO;
import gr.mileflow.app.service.ITrainingSessionService;
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
public class TrainingSessionRestController {

    private final ITrainingSessionService trainingSessionService;

    @GetMapping("/athlete/{athleteId}")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<Page<TrainingSessionReadOnlyDTO>> getPaginatedTrainingSessions(
            @PathVariable Long athleteId,
            @PageableDefault(size = 10, sort = "sessionDate") Pageable pageable,
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
    public ResponseEntity<TrainingSessionReadOnlyDTO> updateTrainingSession(
            @PathVariable Long id,
            @Valid @RequestBody TrainingSessionUpdateDTO dto,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) throws EntityAlreadyExistsException, EntityInvalidArgumentException,
            ValidationException, EntityNotFoundException {

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
    public ResponseEntity<TrainingSessionReadOnlyDTO> deleteTrainingSession(
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
    public ResponseEntity<Page<TrainingSessionReadOnlyDTO>> getMyTrainingSessions(
            @PageableDefault(size = 10, sort = "sessionDate") Pageable pageable,
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