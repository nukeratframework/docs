# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/).

## 0.7.0 — 2026-05-10

### Added

- New **Docs** panel with built-in Markdown rendering.
- Folder tree now supports drag-and-drop file uploads.
- Beacon graph view (early preview).

### Changed

- Migrated the GUI to React 19 and Tailwind 4.
- Reduced terminal latency by ~40% on long-lived sessions.

### Fixed

- Crash when closing the last panel while a fetch is in flight.
- Host selector flickering on re-connect.

---

## 0.6.2 — 2026-04-22

### Fixed

- Path traversal in the file download endpoint (`CVE-2026-XXXXX`).
- Wrong charset in non-UTF8 file previews.

---

## 0.6.0 — 2026-03-30

### Added

- Pluggable transports: HTTPS, TCP and SMB.
- Initial Armory integration with `~30` BOFs.
- Operator audit log.

### Removed

- Legacy `v0.4` protocol — operators must regenerate beacons.

---

## 0.5.0 — 2026-02-14

First public preview. *Happy Valentine's Day.*
