package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.UserReadOnlyDTO;

public interface IUserService {

    //TODO saveUser
    UserReadOnlyDTO getUserByKeycloakId(String keycloakId) throws EntityNotFoundException;
    UserReadOnlyDTO getUserByKeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException;
    boolean isUserExists(String username);

}
