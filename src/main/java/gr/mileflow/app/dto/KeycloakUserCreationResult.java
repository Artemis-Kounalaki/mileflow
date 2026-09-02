package gr.mileflow.app.dto;

public record KeycloakUserCreationResult(
        String keycloakId,
        String temporaryPassword
) {
}

