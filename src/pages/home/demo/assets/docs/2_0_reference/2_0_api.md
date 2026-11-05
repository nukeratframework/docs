# Server API Reference

The Nukerat server exposes a JSON-over-WebSocket API. Every message follows the same envelope:

```json
{
  "id": "uuid-v4",
  "kind": "request | response | event",
  "op": "beacon.exec",
  "data": { },
  "ts": 1715600000
}
```

## Endpoints

### `beacon.list`

List active beacons.

**Request**

```json
{ "op": "beacon.list", "data": { "filter": "online" } }
```

**Response**

```json
{
  "op": "beacon.list",
  "data": {
    "beacons": [
      { "id": "7f3a...", "host": "WS-01", "user": "alice", "last_seen": 1715600000 }
    ]
  }
}
```

### `beacon.exec`

Run a command on a beacon.

| Field    | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| `id`     | string | Beacon identifier                 |
| `cmd`    | string | Command line                      |
| `tty`    | bool   | Allocate a pseudo-tty (Linux only)|
| `cwd`    | string | Working directory (optional)      |

### `file.upload`

Upload a file to a beacon. Payloads above 4 MB are streamed in chunks.

### `file.download`

Pull a file from a beacon. Returned as base64 inside the response envelope.

## Error Codes

- `400` — malformed request
- `401` — invalid or expired token
- `404` — entity not found (beacon, file, listener)
- `409` — operation conflicts with current state
- `500` — server-side failure (check server logs)

## Authentication

Every connection must present a JWT in the `Authorization` header during the upgrade request:

```
Authorization: Bearer <token>
```

Tokens are issued by `nukerat-server auth issue --user alice --role operator`.
