package gr.mileflow.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "attachments")
public class Attachment extends AbstractEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @Column(nullable = false)
    private String filename;

    @Column(name = "attachment_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AttachmentType attachmentType;

    @Column(name = "file_path", nullable = false, length = 1024)
    private String filePath;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    public enum AttachmentType {
        DOCTOR_VERIFICATION
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Attachment attachment)) return false;
        return Objects.equals(getId(), attachment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}

