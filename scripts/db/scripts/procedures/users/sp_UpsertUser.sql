-- Upsert User
-- Updates roles in user
--
-- Returns: (multiple resultsets)
-- - Current upserted user
-- - User roles
-- - User permissions
--

DELIMITER //

CREATE OR REPLACE PROCEDURE sp_UpsertUser(
    pCognitoSub VARCHAR(36),
    pEmail VARCHAR(50),
    pPhone VARCHAR(20),
    pFirstName VARCHAR(30),
    pLastName VARCHAR(30),
    pEnabled TINYINT
)

BEGIN
  -- Declare variables
  DECLARE vExistsUser BIT DEFAULT 0;

  -- Error handler
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
  ROLLBACK;
      RESIGNAL;
  END;

  -- Verify existing user
  SELECT 1 INTO vExistsUser FROM tb_Users WHERE email = pEmail LIMIT 1;

  START TRANSACTION;

    -- Upsert the user
    IF (vExistsUser = 0) THEN
      INSERT INTO tb_Users (cognito_sub, email, phone, first_name, last_name, enabled, status_id)
      VALUES(pCognitoSub, pEmail, pPhone, pFirstName, pLastName, pEnabled, 1);
    ELSE
      --  update the user
      UPDATE tb_Users
      SET
        phone = pPhone,
        first_name = pFirstName,
        last_name = pLastName,
        enabled = pEnabled
      WHERE email = pEmail;
    END IF;

  COMMIT;

  -- Return User Info
  CALL sp_GetUser(pEmail);

END//
DELIMITER ;

-- TEST
-- CALL Admin_UpsertAdminUser_prc('456', 'username', 'email', 'phone', 'name', 'lastname', 1, JSON_ARRAY('ADMIN'));
-- CALL Admin_UpsertAdminUser_prc('456', 'username', 'email', 'phone', 'name', 'lastname', 1, JSON_ARRAY('ADMIN'));
