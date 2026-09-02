package gr.mileflow.app.api;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.UserReadOnlyDTO;
import gr.mileflow.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")

public class UserRestController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserReadOnlyDTO> getUserByKeycloakId( @AuthenticationPrincipal Jwt jwt) throws EntityNotFoundException
    {
        String keycloakId = jwt.getSubject();
        return ResponseEntity.ok(userService.getUserByKeycloakIdDeletedFalse(keycloakId));
    }

}
