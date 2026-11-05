# Configuration

Nukerat is configured via a single TOML file located at `~/.config/nukerat/config.toml` (or the path passed via `--config`).

## Minimal Example

```toml
[server]
bind = "127.0.0.1"
port = 8443
data_dir = "/var/lib/nukerat"

[auth]
mode = "jwt"
secret_file = "/etc/nukerat/secrets/jwt.key"

[logging]
level = "info"
file  = "/var/log/nukerat/server.log"
```

## All Options

### `[server]`

- **`bind`** *(string, default `127.0.0.1`)* — interface to bind the API to.
- **`port`** *(int, default `8443`)* — TCP port for the API socket.
- **`data_dir`** *(string)* — where the SQLite database, certs and uploads live.
- **`max_upload_mb`** *(int, default `512`)* — hard cap on uploaded files.

### `[auth]`

- **`mode`** *(`jwt` | `mtls` | `static`)* — authentication strategy.
- **`secret_file`** *(string)* — HMAC secret for JWT mode.
- **`token_ttl`** *(duration, default `24h`)* — how long issued tokens live.

### `[logging]`

- **`level`** *(`trace` | `debug` | `info` | `warn` | `error`)*
- **`file`** *(string)* — defaults to stderr if unset.
- **`format`** *(`text` | `json`, default `text`)*

### `[telemetry]` *(optional)*

```toml
[telemetry]
enabled = false
endpoint = "https://otel.example.com:4317"
```

## Reloading

Send `SIGHUP` to the server process to reload the config without dropping active beacons:

```bash
kill -HUP $(pidof nukerat-server)
```

Most options are reloadable; the ones marked *static* in the table above require a full restart.
