---
name: Offline clinical media
description: User-mandated storage and privacy boundaries for clinical photography and radiology.
---

Clinical photos and radiographs are patient medical data. Keep original files and previews in browser-local IndexedDB; do not add server persistence, cloud storage, external image services, or fake patient records.

**Why:** The user’s briefs explicitly require offline-first handling and prohibit external uploads and mock patient data.

**How to apply:** Keep import, preview generation, viewing, and storage device-local. Never seed patient fixtures into the clinic app.