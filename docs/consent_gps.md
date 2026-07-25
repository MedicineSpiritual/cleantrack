GPS Consent — Draft (EN / DE)

Purpose: provide a short, clear consent flow text for workers to accept GPS tracking when scanning QR codes. Must be localized (German + English) and record timestamp and version.

English (short):
"I consent to share my location while performing work tasks for [Company]. Location data will be recorded only when I scan QR codes to start or end work, and will be used for verification and reporting. Data is stored within the EU and processed according to the privacy policy. I can withdraw consent at any time in the app settings."

German (kurz):
"Ich stimme zu, meinen Standort während der Arbeitsausführung für [Firma] zu teilen. Standortdaten werden nur beim Scannen von QR-Codes zu Beginn oder Ende der Arbeit erfasst und zur Verifizierung und Berichterstellung verwendet. Die Daten werden innerhalb der EU gespeichert und gemäß der Datenschutzrichtlinie verarbeitet. Ich kann meine Einwilligung jederzeit in den App-Einstellungen widerrufen."

Implementation notes:
- Record consent event in audit_logs with user_id, tenant_id, consent_type: 'gps', consent_version, timestamp.
- Provide UI modal during first app use and in settings.
- Keep consent history for at least the retention period required by contract/GDPR; provide export & revoke API endpoints.
