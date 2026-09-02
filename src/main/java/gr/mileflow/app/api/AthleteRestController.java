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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import org.springframework.data.domain.Pageable;
import java.net.URI;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/athletes")

public class AthleteRestController {

    private final IAthleteService iAthleteService;

    @GetMapping("/me")
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
    public ResponseEntity<AthleteCreationResponseDTO> saveAthlete(
            @Valid @RequestBody AthleteInsertDTO insertDTO,
            @AuthenticationPrincipal Jwt jwt)throws EntityAlreadyExistsException, EntityNotFoundException{

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
    public ResponseEntity<Page<AthleteReadOnlyDTO>> getMyAthletes(
            @PageableDefault(size = 10, sort = "lastname") Pageable pageable,
            @AuthenticationPrincipal Jwt jwt) throws EntityNotFoundException {

        String keycloakId = jwt.getSubject();
        return ResponseEntity.ok(
                iAthleteService.getPaginatedAthletes(pageable, keycloakId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<AthleteReadOnlyDTO> updateAthlete(@PathVariable Long id, @Valid @RequestBody AthleteUpdateDTO dto,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt)
            throws EntityAlreadyExistsException, EntityInvalidArgumentException, ValidationException, EntityNotFoundException {

        // εδώ αργότερα να βάλουμε τον custom validator
        if (bindingResult.hasErrors()) {
            throw new ValidationException("Athlete", "Invalid athlete data", bindingResult);
        }

        AthleteReadOnlyDTO athleteReadOnlyDTO = iAthleteService.updateAthlete(id, dto, jwt.getSubject());
        return ResponseEntity.ok(athleteReadOnlyDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<AthleteReadOnlyDTO> deleteAthleteById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) throws EntityNotFoundException {

        AthleteReadOnlyDTO athleteReadOnlyDTO = iAthleteService.deleteAthleteById(id, jwt.getSubject());
        return ResponseEntity.ok(athleteReadOnlyDTO);
    }
}


