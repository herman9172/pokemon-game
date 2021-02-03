-- liquibase formatted sql
-- changeset haraya@akurey.com:create-users_status-1 endDelimiter:; stripComments:false runOnChange:true

CREATE TABLE IF NOT EXISTS tb_UserStatus
(
    id TINYINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

INSERT IGNORE INTO tb_UserStatus (name) VALUES ('UNCONFIRMED'), ('CONFIRMED');
