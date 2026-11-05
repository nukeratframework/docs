# Events

Your instructions and commands only run when an **event** fires — each one tied to a specific team server activity (new host, queue task, output, timer, …).

```nukescript
event.<name>:my_function()
```

- `<name>` — event listed below
- `my_function()` — your code for that event; exactly **one** parameter
- that parameter — a dictionary with the event data (heartbeats receive `{}`); name it whatever you want (`row`, `data`, `event`, …)

> **Important:** the function called by the event must accept **exactly one parameter**. That parameter receives the event data. The name does not matter — `row` is used in examples below, but you can use any name.

> **Important:** `event.<name>:my_function()` lines must be at the **end** of the script, after all imports and functions.

## Hosts

**new_host** — first check-in. `row["tag"]`, plus host fields (`ip`, `external_ip`, `listener`, `arch`, `os`, `user`, `hostname`, `status`, `delay`, `first_seen`, `last_seen`, `next_checkin`, …)

**removed_host** — host deleted from the team server. Same keys as `new_host`.

**expired_host** — host missed its check-in window (marked expired after the event fires). Same keys as `new_host`.

## Queue

**new_queue_line** — task queued before the implant runs. `row["tag"]`, `row["host"]`, `type`, `command`, `input`, `parameters`, `is_completed`, `is_ready`, …

```python
def filter_task(row):
    if "mimikatz" in row["input"].lower():
        reject_cmd(row["tag"])
    else:
        approve_cmd(row["tag"])

event.new_queue_line:filter_task()
```

**implant_error** — queue task failed. `row` includes a non-empty `error`.

**task_completed** — queue task finished without error. `row` has `is_completed` set; `custom_response` when the task was concluded with a custom message.

## Telemetry

**new_checkin** — `row["tag"]`, `row["host"]`, `row["type"]`

**keylogger_update** — `row["tag"]`, `row["content"]`, `row["host_tag"]`

**folders_update** — file browser insert/update. `row["host"]`, `row["path"]`, `row["type"]`, `row["modified"]`, `row["size"]`

**process_update** — process tree insert/update. `row["tag"]`, `row["host"]`, `row["tree"]`

**output_received** — new terminal output. `row["terminal_id"]`, `row["host"]`, `row["input"]`, `row["output"]`

**credentials_update** — new credential stored. `row["tag"]`, `row["name"]`, `row["host"]`, `row["content"]`

**listeners_update** — new listener inserted. `row["tag"]`, `row["type"]`, `row["protocol"]`, `row["config"]`

## Heartbeats

Fixed-interval timers for periodic tasks. Your function receives `{}`.

`heartbeat_1s` · `heartbeat_5s` · `heartbeat_10s` · `heartbeat_15s` · `heartbeat_30s` · `heartbeat_1m` · `heartbeat_5m` · `heartbeat_10m` · `heartbeat_15m` · `heartbeat_20m` · `heartbeat_30m` · `heartbeat_60m` · `heartbeat_2h` · `heartbeat_12h` · `heartbeat_1d` · `heartbeat_3d` · `heartbeat_7d` · `heartbeat_15d` · `heartbeat_30d`

```python
def poll(row):
    echo(len(db.hosts("tag")))

event.heartbeat_5m:poll()
```
