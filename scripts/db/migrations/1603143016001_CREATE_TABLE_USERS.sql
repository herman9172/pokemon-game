-- liquibase formatted sql
-- changeset haraya@akurey.com:create-users-1 endDelimiter:; stripComments:false runOnChange:true

CREATE TABLE IF NOT EXISTS tb_Users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cognito_sub VARCHAR(36) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    enabled TINYINT DEFAULT 1 NOT NULL,
    status_id TINYINT DEFAULT 1 NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NOT NULL,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NOT NULL ON UPDATE CURRENT_TIMESTAMP(),
    CONSTRAINT email_UNIQUE UNIQUE (email),
    CONSTRAINT cognito_sub_UNIQUE UNIQUE (cognito_sub),
    CONSTRAINT tb_Users_tb_UserStatus FOREIGN KEY (status_id) REFERENCES tb_UserStatus (id)
);

CREATE INDEX IF NOT EXISTS status_id_idx ON tb_Users (status_id);
