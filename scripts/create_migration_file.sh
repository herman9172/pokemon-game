#!/bin/bash

# Define delimiter
DELIMITER="${1:-";"}"

# Define Author from git
AUTHOR=$(git config user.email)

# Migration filepath
MIGRATIONS_PATH=$(dirname $0)/db/migrations

# Filepath timestamp
EPOCH_TIMESTAMP=$(date +%s)"000" # Simulates javascript Date timestamp

# Changeset filename
CHANGESET_NAME="${2:-"REPLACE_MIGRATION_FILENAME"}"
MIGRATION_CHANGESET_ID="${EPOCH_TIMESTAMP}_${CHANGESET_NAME}"
MIGRATION_FILENAME="${MIGRATION_CHANGESET_ID}.sql"

# Create dummy migration file
printf -- '-- liquibase formatted sql
-- changeset %s:%s endDelimiter:%s stripComments:false runOnChange:true\n\n' \
$AUTHOR $MIGRATION_CHANGESET_ID $DELIMITER > "${MIGRATIONS_PATH}/${MIGRATION_FILENAME}"
