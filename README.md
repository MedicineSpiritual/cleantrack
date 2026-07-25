CleanTrack — Project scaffold

Purpose
This repository contains the starting scaffold for CleanTrack — a SaaS platform for cleaning companies (QR-based check-ins, multi-tenant). Use this repo as the canonical codebase for the MVP and follow the Master Documentation in /CleanTrack_Analysis.docx and PRD_Sprint1.md.

Next steps
1) Implement Sprint1: Auth + Multi-tenant Core + QR Engine (see PRD_Sprint1.md).
2) Setup Supabase project (region: EU if required by data residency).
3) Implement backend schema and RLS policies.
4) Create mobile Flutter skeleton in /mobile and web admin in /app.

Conventions
- TypeScript for web backend/Next.js
- Flutter for mobile
- Use Supabase (Postgres + Auth + Storage)

Files & folders
- /app — Next.js admin app routes
- /modules — domain logic modules
- /mobile — Flutter project
- /docs — PRD and designs
- /scripts — helper scripts

Contact
Project owner: (you)

Created: 2026-07-25
