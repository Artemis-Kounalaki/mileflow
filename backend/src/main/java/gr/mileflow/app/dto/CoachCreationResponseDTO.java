package gr.mileflow.app.dto;

public record CoachCreationResponseDTO(
        CoachReadOnlyDTO coach,
        String temporaryPassword
) {}
