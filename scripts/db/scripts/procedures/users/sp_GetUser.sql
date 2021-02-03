-- Get User information
-- Updates roles in user
--
-- Returns: (multiple resultsets)
-- - Current user
-- - User roles
-- - User permissions
--

DELIMITER //

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

END//
DELIMITER ;


-- TEST
-- CALL Admin_GetAdminUser_prc('admin@mailinator.com');
-- CALL Admin_GetAdminUser_prc('not_existing_admin@mailinator.com');
