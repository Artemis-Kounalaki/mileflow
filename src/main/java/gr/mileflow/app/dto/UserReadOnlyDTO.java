package gr.mileflow.app.dto;

public record UserReadOnlyDTO(
        Long id,
        String username,
        String email
) {

}
