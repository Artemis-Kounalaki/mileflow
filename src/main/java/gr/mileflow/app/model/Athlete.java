package gr.mileflow.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "athletes")
@Entity
public class Athlete extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private LocalDate birthday;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "sports_athletes",
            joinColumns = @JoinColumn(name = "athlete_id"),
            inverseJoinColumns = @JoinColumn(name = "sport_id")
    )
    private Set<Sport> sports = new HashSet<>();

    public enum Gender {
        MALE,
        FEMALE
    }
    public Set<Sport> getAllSports(){
        return Set.copyOf(sports);
    }

    @Getter(AccessLevel.PROTECTED)
    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "athlete", fetch = FetchType.LAZY)
    private Set<Attachment> attachments = new HashSet<>();

    public Set<Attachment> getAllAttachments() {
        return Set.copyOf(attachments);
    }

    public void addUser(User user){
        this.user = user;
        user.setAthlete(this);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Athlete athlete)) return false;
        return Objects.equals(getId(), athlete.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}
