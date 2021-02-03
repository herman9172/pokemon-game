-- liquibase formatted sql
-- changeset haraya@akurey.com:alter-GetUser_sp-1 endDelimiter:// stripComments:false runOnChange:true

-- Get User information
-- Updates roles in user
--
-- Returns: (multiple resultsets)
-- - Current user
-- - User roles
-- - User permissions
--

CREATE OR REPLACE PROCEDURE sp_GetUser(
    pEmail VARCHAR(50)
)

BEGIN
    -- Verify existing user
    IF (SELECT COUNT(1) FROM tb_Users WHERE email = pEmail) = 0 THEN
        SIGNAL SQLSTATE 'HY000' SET MYSQL_ERRNO = 1032, MESSAGE_TEXT = 'User not found';
    END IF;

    -- Return user information
    SELECT id,
           cognito_sub,
           email,
           phone,
           first_name,
           last_name,
           enabled,
           status_id,
           created_at
    FROM tb_Users
    WHERE email = pEmail;

END

-- TEST
-- CALL sp_GetUser('admin@mailinator.com');
-- CALL sp_GetUser('not_existing_admin@mailinator.com');
