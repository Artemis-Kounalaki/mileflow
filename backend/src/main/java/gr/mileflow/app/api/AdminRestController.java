package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityAlreadyExistsException;
import gr.mileflow.app.dto.AthleteReadOnlyDTO;
import gr.mileflow.app.dto.CoachCreationResponseDTO;
import gr.mileflow.app.dto.CoachInsertDTO;
import gr.mileflow.app.dto.CoachReadOnlyDTO;
import gr.mileflow.app.service.IAthleteService;
import gr.mileflow.app.service.ICoachService;
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
public class AdminRestController {

    private final ICoachService coachService;
    private final IAthleteService athleteService;

    @PostMapping("/coaches")
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
    public ResponseEntity<Page<AthleteReadOnlyDTO>> getAthletes(
            @PageableDefault(size = 10, sort = "lastname")
            Pageable pageable) {

        return ResponseEntity.ok(athleteService.getPaginatedAthletesDeletedFalse(pageable));
    }

    @GetMapping("/coaches")
    public ResponseEntity<Page<CoachReadOnlyDTO>> getCoaches(
            @PageableDefault(size = 10, sort = "lastname")
            Pageable pageable) {

        return ResponseEntity.ok(
                coachService.getPaginatedCoachesDeletedFalse(pageable)
        );
    }
}