# @jerryan/pi-subagent-lite

A minimal pi extension that delegates tasks to isolated subagent processes.

## What makes this different?

Most subagent extensions ship with heavy abstractions: agent definition files, configurable models, working-directory overrides, and a kitchen sink of rarely-used parameters. **This one doesn't.**

- **Zero setup**: Install via pi and use it in the next session. No agent directories to manage, no agent definitions to write.
- **Minimal interface**: Only `task` and optional `skills`. We removed `model`, `cwd`, `agent`, and other parameters that add more confusion than value.
- **No agent definitions**: Unlike almost every other subagent tool, we don't use `~/.pi/agent/agents/*.md` or any custom agent discovery. If you need specialization, **reuse your existing pi skills** via the `skills` parameter.
- **One focused system prompt**: Every subagent gets the same lean, task-oriented prompt designed for delegation and clear reporting.
- **Transparent long-task handling**: Tasks longer than 4000 chars are automatically spilled to a temp file so they never hit CLI length limits.

## Features

- **Isolated context**: Each subagent runs in a separate `pi` process
- **Live progress**: See turn-by-turn updates as the subagent works
- **Optional skills**: Preload capabilities via `--skill` flags
- **Auto-spill**: Long tasks (>4000 chars) are automatically written to a temp file to avoid CLI limits
- **Clean result rendering**: Final output is clearly marked with a `✓ --- Result ---` separator

## Installation

```bash
pi install npm:@jerryan/pi-subagent-lite
```

The extension will be available the next time you start a pi session.

To try it without installing permanently:

```bash
pi -e npm:@jerryan/pi-subagent-lite
```

For local development, run inside the repo:

```bash
pi -e .
```

## Usage

Once installed, the `subagent` tool is available:

```
Run a subagent to find all test files in the project
```

With skills:

```
Run a subagent with skills ["code-review"] to review src/auth.ts
```

You can also invoke multiple subagents in parallel by making separate tool calls in the same turn.

## Tool Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task` | `string` | Yes | The task to delegate to the subagent |
| `skills` | `string[]` | No | Optional skill paths or names to load via `--skill` |

## License

MIT © jerryan
