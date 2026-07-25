Mobile (Flutter) — Skeleton and instructions

This folder will contain the Flutter project for the Worker app. The minimal MVP needs:
- QR scanning screen (start / end)
- Local persistence (sqflite or hive) for offline-first sync
- Sync service to push check-in events to /api/checkin

To initialize locally:
1. Install Flutter SDK (stable channel) and set up Android/iOS toolchains
2. From this folder run: flutter create worker_app
3. Move created project into this folder or rename accordingly

Recommended packages:
- qr_code_scanner or mobile_scanner (for scanning)
- http or dio (for API calls)
- sqflite or hive (for local persistence)

Important offline behaviour:
- Save events locally with status=queued
- Background sync on connectivity change or app resume
- Conflict resolution: last-write-wins with server reconciliation

