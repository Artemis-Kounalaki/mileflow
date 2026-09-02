package gr.mileflow.app.dto;

public record AthleteCreationResponseDTO(
        AthleteReadOnlyDTO athlete,
        String temporaryPassword
) {
}
