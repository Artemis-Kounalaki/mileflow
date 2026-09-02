package gr.mileflow.app.service;

import gr.mileflow.app.core.exceptions.EntityNotFoundException;
import gr.mileflow.app.dto.UserReadOnlyDTO;
import gr.mileflow.app.mapper.Mapper;
import gr.mileflow.app.model.User;
import gr.mileflow.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor

public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final Mapper mapper;

    @Transactional(readOnly = true)
    @Override
    public UserReadOnlyDTO getUserByKeycloakId(String keycloakId) throws EntityNotFoundException {
        try{
            User user = userRepository.findByKeycloakId(keycloakId).orElseThrow( () ->
                    new EntityNotFoundException("User", "User with user keycloak id = "+ keycloakId + "not found."));
            log.debug("User with keycloak = {} found successfully", keycloakId);
            return mapper.mapToUserReadOnlyDTO(user);
        }
        catch (EntityNotFoundException e){
            log.error("Get failed. User with keycloak ={} not found", keycloakId);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    @Override
    public UserReadOnlyDTO getUserByKeycloakIdDeletedFalse(String keycloakId) throws EntityNotFoundException {
        try{
            User user = userRepository.findByKeycloakIdAndDeletedFalse(keycloakId).orElseThrow( () ->
                    new EntityNotFoundException("User", "User with user keycloak id "+ keycloakId + "not found."));
            log.debug("Active user with keycloak id = {} found successfully", keycloakId);
            return mapper.mapToUserReadOnlyDTO(user);
        }
        catch (EntityNotFoundException e){
            log.error("Get failed. Active user with keycloak id = {} not found", keycloakId);
            throw e;
        }
    }

    //TODO : add exception
    @Override
    public boolean isUserExists(String username)  {
        return userRepository.findByUsername(username).isPresent();
    }
}
