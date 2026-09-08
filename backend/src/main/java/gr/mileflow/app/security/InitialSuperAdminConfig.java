package gr.mileflow.app.security;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class InitialSuperAdminConfig {

    private final KeycloakAdminService keycloakAdminService;

    @Bean
    CommandLineRunner createInitialSuperAdmin() {
        return args -> {

            int maxAttempts = 60;

            for (int attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    keycloakAdminService.createInitialSuperAdmin(
                            "admin",
                            "admin@mileflow.local",
                            "admin"
                    );

                    System.out.println("Initial Superadmin ready.");
                    return;

                } catch (Exception e) {

                    if (attempt == maxAttempts) {
                        throw e;
                    }

                    System.out.println(
                            "Keycloak not ready. Retrying in 3 seconds... ("
                                    + attempt + "/" + maxAttempts + ")"
                    );

                    Thread.sleep(3000);
                }
            }
        };
    }
}