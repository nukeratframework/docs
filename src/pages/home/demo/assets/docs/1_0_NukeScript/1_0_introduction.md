# Introduction

## What is NukeScript

NukeScripts automate team server tasks: react to hosts, filter the queue, run commands, query the database, and send notifications, without doing everything manually in the GUI.

Scripts are written in Python with event bindings. A worker on the team server watches the database and runs your code when something happens.

## How to use

1. Top bar → **NukeScript** → **Add**
2. Fill **Name**, **Server** (`host:port`), **Description** (max 100 chars), and **Content**
3. Save- new scripts start **disabled**
4. Select the row and press **Enable**

**Edit** or double-click to change content. **Upload** loads a `.ns` file. **Format** fixes indentation.

Validation runs on save and on **Enable**. Only enabled scripts receive events.

## Syntax

Scripts are event-driven. Layout:

1. Imports and functions first
2. Event bindings at the **end** of the file

```nukescript
event.<name>:my_function()
```

- `<name>` - known event (see **Events**)
- `my_function()` - your code for that event, with exactly **one** parameter (any name: `row`, `data`, …)
- Binding lines go **last**; they are stripped before execution and are not valid Python on their own
- Heartbeat events pass an empty dict (`{}`) as that parameter

Minimal example:

```python
def on_new_host(row):
    cmd(row["tag"], "whoami")

event.new_host:on_new_host()
```

Inside your function, use native commands (`cmd`, `echo`, `db`, etc. see **Commands**) and normal Python.

### Queue (`new_queue_line`)

- `approve_cmd(tag)`- allow the task to run
- `reject_cmd(tag)`- block and record an error
- `conclude(tag, message)`- finish with a custom response

Tasks are auto-approved if no enabled script handles the event, or if your code does not call `approve_cmd` or `reject_cmd`.

## Output

Top bar → **NS Output**.

Shows `echo()` output only. Runtime errors go to the team server log, not the output panel.

Use `echo(...)` while developing to inspect values without writing files.

## Example

Scenario: when a new host checks in, run `whoami`, validate the output, and save it to a local file on the team server.

### 1. Create the script

Top bar → **NukeScript** → **Add**

| Field | Value |
|---|---|
| Name | `save whoami` |
| Server | your team server |
| Description | save whoami from new hosts |
| Content | code below |

### 2. Paste the content

```python
def on_new_host(row):
    host = row["tag"]
    output = cmd(host, "whoami")

    if not output or "error" in output.lower():
        echo(f"{host}: cmd failed- {output}")
        return

    if "\\" not in output:
        echo(f"{host}: unexpected output, skipped")
        return

    path = f"/tmp/nukerat/{host}_whoami.txt"

    with open(path, "w") as f:
        f.write(output.strip())

    echo(f"{host}: saved to {path}")

event.new_host:on_new_host()
```

### 3. Enable

Save, select the script, and press **Enable**.

### 4. Test

Open **NS Output**. Bring a new host online and watch the output.
