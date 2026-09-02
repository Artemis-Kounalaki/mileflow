package gr.mileflow.app.security;

import gr.mileflow.app.dto.KeycloakUserCreationResult;
import gr.mileflow.app.dto.UserInsertDTO;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {

    private final Keycloak keycloak;

    @Value("${keycloak.admin.realm}")
    private String realm;

    public KeycloakUserCreationResult createUser(UserInsertDTO dto) {

        UserRepresentation user = new UserRepresentation();

        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setEnabled(true);
        user.setEmailVerified(false);

        String temporaryPassword =
                "MileFlow-" + UUID.randomUUID().toString().substring(0, 8);

        CredentialRepresentation credential =
                new CredentialRepresentation();

        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(temporaryPassword);
        credential.setTemporary(true);

        user.setCredentials(List.of(credential));

        try (Response response = keycloak
                .realm(realm)
                .users()
                .create(user)) {

            if (response.getStatus() != 201) {
                throw new RuntimeException(
                        "Failed to create Keycloak user. Status: "
                                + response.getStatus()
                );
            }

            String location =
                    response.getHeaderString("Location");

            String keycloakId =
                    location.substring(location.lastIndexOf("/") + 1);

            RoleRepresentation athleteRole =
                    keycloak
                            .realm(realm)
                            .roles()
                            .get("ATHLETE")
                            .toRepresentation();

            keycloak
                    .realm(realm)
                    .users()
                    .get(keycloakId)
                    .roles()
                    .realmLevel()
                    .add(List.of(athleteRole));

            return new KeycloakUserCreationResult(
                    keycloakId,
                    temporaryPassword
            );
        }
    }

    public void updateUser(
            String keycloakId,
            String username,
            String email
    ) {
        UserRepresentation user = keycloak
                .realm(realm)
                .users()
                .get(keycloakId)
                .toRepresentation();

        user.setUsername(username);
        user.setEmail(email);

        keycloak
                .realm(realm)
                .users()
                .get(keycloakId)
                .update(user);
    }

    public void disableUser(String keycloakId) {
        UserResource userResource = keycloak
                .realm(realm)
                .users()
                .get(keycloakId);

        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(false);

        userResource.update(user);
    }
}