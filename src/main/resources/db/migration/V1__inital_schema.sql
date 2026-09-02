    -- V1_initial_schema.sql
    -- MySQL 8 / InnoDB / utf8mb4_0900_ai_ci


    CREATE TABLE users (
        id BIGINT NOT NULL AUTO_INCREMENT,

        keycloak_id VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,

        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        deleted_at DATETIME NULL,

        PRIMARY KEY (id),
        INDEX ix_users_deleted (deleted),
        INDEX ix_users_deleted_at (deleted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE sports (
        id BIGINT NOT NULL AUTO_INCREMENT,

        name VARCHAR(255) NOT NULL UNIQUE,

        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        deleted_at DATETIME NULL,

        PRIMARY KEY (id),
        INDEX ix_sports_deleted (deleted),
        INDEX ix_sports_deleted_at (deleted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE coaches (
        id BIGINT NOT NULL AUTO_INCREMENT,
        user_id BIGINT NOT NULL UNIQUE,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        birthday DATE NOT NULL,

        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        deleted_at DATETIME NULL,

        PRIMARY KEY (id),
        INDEX ix_coaches_deleted (deleted),
        INDEX ix_coaches_deleted_at (deleted_at),

		CONSTRAINT fk_coaches_users FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE athletes (
        id BIGINT NOT NULL AUTO_INCREMENT,
        user_id BIGINT NOT NULL UNIQUE,
        coach_id BIGINT NOT NULL,

        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        birthday DATE NOT NULL,
        gender VARCHAR(255) NOT NULL,

        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        deleted_at DATETIME NULL,

        PRIMARY KEY (id),
        INDEX ix_athletes_deleted (deleted),
        INDEX ix_athletes_deleted_at (deleted_at),
        INDEX idx_athletes_coach_id (coach_id),

		CONSTRAINT fk_athletes_users FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,

        CONSTRAINT fk_athletes_coach
            FOREIGN KEY (coach_id)
            REFERENCES coaches(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE sports_athletes (
        sport_id BIGINT NOT NULL,
        athlete_id BIGINT NOT NULL,
        CONSTRAINT pk_sports_athletes PRIMARY KEY (sport_id, athlete_id),

        CONSTRAINT fk_sports_athletes_sport
            FOREIGN KEY (sport_id) REFERENCES sports(id)
            ON DELETE CASCADE,

        CONSTRAINT fk_sports_athletes_athlete
            FOREIGN KEY (athlete_id) REFERENCES athletes(id)
            ON DELETE CASCADE,

        INDEX idx_sports_athletes_athlete_id (athlete_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

       CREATE TABLE attachments (
        id BIGINT NOT NULL AUTO_INCREMENT,
        athlete_id BIGINT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        attachment_type VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        expiration_date DATE NOT NULL,

        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        deleted_at DATETIME NULL,

        PRIMARY KEY (id),
        INDEX ix_attachments_deleted (deleted),
        INDEX ix_attachments_deleted_at (deleted_at),
        INDEX ix_attachments_athlete_id (athlete_id),

		CONSTRAINT fk_attachment_athletes FOREIGN KEY (athlete_id)
            REFERENCES athletes(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE training_sessions (
        id BIGINT NOT NULL AUTO_INCREMENT,
        coach_id BIGINT NOT NULL,
        athlete_id BIGINT NOT NULL,
        sport_id BIGINT NOT NULL,
        sets INT NOT NULL,
        target_time TIME NOT NULL,
        actual_time TIME,
        session_date DATETIME NOT NULL,
        description VARCHAR(1000),
        status VARCHAR(50) NOT NULL,

        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        deleted_at DATETIME NULL,


        PRIMARY KEY (id),
    CONSTRAINT fk_training_sessions_coach
        FOREIGN KEY (coach_id)
        REFERENCES coaches(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_training_sessions_athlete
        FOREIGN KEY (athlete_id)
        REFERENCES athletes(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_training_sessions_sport
        FOREIGN KEY (sport_id)
        REFERENCES sports(id)
        ON DELETE RESTRICT,

	INDEX ix_training_sessions_coach_deleted (coach_id, deleted),
	INDEX ix_training_sessions_athlete_date (athlete_id, session_date),
	INDEX ix_training_sessions_sport (sport_id),
	INDEX ix_training_sessions_date (session_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

