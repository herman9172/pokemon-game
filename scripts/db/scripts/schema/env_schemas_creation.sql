--
-- SCHEMAS
--
CREATE SCHEMA `backoffice_db_dev` DEFAULT CHARACTER SET latin1 ;
CREATE SCHEMA `backoffice_db_qa` DEFAULT CHARACTER SET latin1 ;
CREATE SCHEMA `backoffice_db_preprod` DEFAULT CHARACTER SET latin1 ;
CREATE SCHEMA `backoffice_db_uat` DEFAULT CHARACTER SET latin1 ;

--
-- USERS
--

-- DEV
CREATE USER 'backoffice_db_user_dev'@'%' IDENTIFIED BY 'PYxf3AB9857SLAdJ';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, CREATE ROUTINE, ALTER ROUTINE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES
ON backoffice_db_dev.* TO 'backoffice_db_user_dev'@'%';

-- QA
CREATE USER 'backoffice_db_user_qa'@'%' IDENTIFIED BY '2gcrz3JjzwNR2FWW';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, CREATE ROUTINE, ALTER ROUTINE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES
ON backoffice_db_qa.* TO 'backoffice_db_user_qa'@'%';

-- PREPROD
CREATE USER 'backoffice_db_user_preprod'@'%' IDENTIFIED BY 'zXUuKjVxyB3zmtd8';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, CREATE ROUTINE, ALTER ROUTINE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES
ON backoffice_db_preprod.* TO 'backoffice_db_user_preprod'@'%';

-- UAT
CREATE USER 'backoffice_db_user_uat'@'%' IDENTIFIED BY '4yaAE4QD3xyMwSMr';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, CREATE ROUTINE, ALTER ROUTINE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES
ON backoffice_db_uat.* TO 'backoffice_db_user_uat'@'%';