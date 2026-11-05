# Commands

Native functions available inside your script when an event runs.

## Host

**cmd**(`host_tag`, `command`) — synchronous terminal command; returns output as a string.

**async_cmd**(`host_tag`, `command`) — queue a command; returns immediately.

**process**(`host_tag`) — request process tree.

**folders**(`host_tag`, `path`) — list a remote directory.

**screenshot**(`host_tag`, `output=?`) — capture screenshot; optional local save path (keyword-only).

## Queue

**approve_cmd**(`queue_tag`) — allow task to run. Use inside a `new_queue_line` script.

**reject_cmd**(`queue_tag`) — block task and record an error.

**conclude**(`queue_tag`, `message`) — mark complete with a custom response.

## Data

**credentials**() — all stored credentials.

**credentials.add**(`name`, `host_tag`, `description`, `content`) — add credential; returns new tag.

**credentials.remove**(`tag`) — remove by tag.

**db**.`<table>`() — all rows. **db**.`<table>`(`column`) — one column across rows.

Tables: `users`, `terminal`, `hosts`, `listeners`, `folders`, `process`, `queue`, `agents`, `agents_history`, `credentials`, `keylogger`, `nukescripts`, `nukescripts_output`, `custom_notifications`, `checkins`

```python
rows = db.hosts()
tags = db.hosts("tag")
```

**keylogs**() — all keylogger entries.

## Network

**network.add_socks**(`host_tag`, `port`, `user=?`, `password=?`) — SOCKS pivot; returns status string with `session_id` (listener tag) on success.

**network.add_forward**(`host_tag`, `local_port`, `target_host`, `target_port`) — TCP port forward.

**network.remove**(`session_id`) — tear down listener by tag.

**network.restart**(`session_id`) — restart listener by tag.

## File server

**file_server.upload**(`port`, `path`) — copy local file into listener content directory.

**file_server.delete**(`port`, `filename`) — remove file from listener content directory.

## Other

**agent**(`agent_tag`, `prompt`) — send prompt to a configured AI agent.

**echo**(`content`) — write to NS Output.

**message_box**(`title`, `body`, `type=info`) — operator notification; `type` is `info`, `error`, or `success`.
