package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.CoachReadOnlyDTO;
import gr.mileflow.app.service.ICoachService;
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

public class CoachRestController {

    private final ICoachService iCoachService;

    @GetMapping("/me")
    public ResponseEntity<CoachReadOnlyDTO> getMyCoachProfile(
            @AuthenticationPrincipal Jwt jwt
    ) throws EntityNotFoundException{

        String keycloakId = jwt.getSubject();
        CoachReadOnlyDTO coachReadOnlyDTO = iCoachService
                .getCoachByUser_KeycloakIdDeletedFalse(keycloakId);

        return ResponseEntity.ok(coachReadOnlyDTO);

    }




}
