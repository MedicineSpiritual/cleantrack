@echo off
REM Run SQL migrations against your Postgres/Supabase database.
REM Option A: Using Supabase CLI (recommended when installed):
REM   supabase db push --project-ref <proj-ref> --schema scripts/migrations

REM Option B: Using psql (manual):
REM   psql "host=<HOST> port=5432 dbname=<DB> user=<USER> password=<PASSWORD> sslmode=require" -f scripts\migrations\001_init.sql

echo "Run one of the commands above after replacing placeholders with your project-specific values."
pause
