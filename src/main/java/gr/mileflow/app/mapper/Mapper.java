package gr.mileflow.app.mapper;

import gr.mileflow.app.dto.*;
import gr.mileflow.app.model.Athlete;
import gr.mileflow.app.model.Coach;
import gr.mileflow.app.model.TrainingSession;
import gr.mileflow.app.model.User;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    public User mapToUserEntity(UserInsertDTO userInsertDTO){
        return new User(userInsertDTO.username(), userInsertDTO.email());
    }

    public UserReadOnlyDTO mapToUserReadOnlyDTO(User user){
        return new UserReadOnlyDTO(user.getId(), user.getUsername(), user.getEmail());
    }

    public AthleteReadOnlyDTO mapToAthleteReadOnlyDTO(Athlete athlete){
        return new AthleteReadOnlyDTO(athlete.getId(),
                athlete.getFirstname(),
                athlete.getLastname(),
                athlete.getBirthday(),
                athlete.getGender(),athlete.getUser().getUsername(),
                athlete.getUser().getEmail());
    }

    public CoachReadOnlyDTO mapToCoachReadOnlyDTO(Coach coach){
        return new CoachReadOnlyDTO(coach.getId(), coach.getFirstname(), coach.getLastname(),
                coach.getBirthday());
    }

    public Athlete mapToAthleteEntity(AthleteInsertDTO dto){
        Athlete athlete = new Athlete();
        athlete.setFirstname(dto.firstname());
        athlete.setLastname(dto.lastname());
        athlete.setBirthday(dto.birthday());
        athlete.setGender(dto.gender());

        User user = mapToUserEntity(dto.userInsertDTO());

        athlete.addUser(user);

        return athlete;

    }

    public TrainingSessionReadOnlyDTO mapToTrainingSessionReadOnlyDTO(TrainingSession session) {
        return new TrainingSessionReadOnlyDTO(
                session.getId(),
                session.getAthlete().getId(),
                session.getSport().getId(),
                session.getSport().getName(),
                session.getSets(),
                session.getTargetTime(),
                session.getActualTime(),
                session.getSessionDate(),
                session.getDescription(),
                session.getStatus()
        );
    }
}
