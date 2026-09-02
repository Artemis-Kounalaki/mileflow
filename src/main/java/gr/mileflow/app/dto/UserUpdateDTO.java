package gr.mileflow.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(

        @NotNull(message = "To username δεν μπορεί να είναι null.")
        @Size(min = 2, max = 20, message = "Το username πρέπει να είναι μεταξύ 2-20 χαρακτήρες.")
        String username,

        @NotNull(message = "To email δεν μπορεί να είναι null.")
        @Email
        String email

) {
}
