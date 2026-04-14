# @jerryan/pi-subagent-lite

A minimal pi extension that delegates tasks to isolated subagent processes.

## What makes this different?

Most subagent extensions ship with heavy abstractions: agent definition files, configurable models, working-directory overrides, and a kitchen sink of rarely-used parameters. **This one doesn't.**

- **Minimal interface**: Only `task` and optional `skills`. We removed `model`, `cwd`, `agent`, and other parameters that add more confusion than value.
- **No agent definitions**: Unlike almost every other subagent tool, we don't use `~/.pi/agent/agents/*.md` or any custom agent discovery. If you need specialization, **reuse your existing pi skills** via the `skills` parameter.
- **Zero setup**: Install, symlink, reload. No agent directories to manage, no YAML frontmatter to write, no config files to tune.
- **One focused system prompt**: Every subagent gets the same lean, task-oriented prompt designed for delegation and clear reporting.
- **Transparent long-task handling**: Tasks longer than 4000 chars are automatically spilled to a temp file so they never hit CLI length limits.
- **Clean live UI**: See real-time turn progress while the subagent works, and a clear `✓ --- Result ---` separator when it's done.

## Features

- **Isolated context**: Each subagent runs in a separate `pi` process
- **Live progress**: See turn-by-turn updates as the subagent works
- **Optional skills**: Preload capabilities via `--skill` flags
- **Auto-spill**: Long tasks (>4000 chars) are automatically written to a temp file to avoid CLI limits
- **Clean result rendering**: Final output is clearly marked with a `✓ --- Result ---` separator

## Installation

```bash
# From npm
npm install -g @jerryan/pi-subagent-lite

# Then symlink into pi's extensions directory
mkdir -p ~/.pi/agent/extensions/pi-subagent-lite
ln -sf "$(npm root -g)/@jerryan/pi-subagent-lite/index.ts" ~/.pi/agent/extensions/pi-subagent-lite/index.ts
```

Or clone and link manually:

```bash
git clone https://github.com/JerryAZR/pi-subagent-lite.git
mkdir -p ~/.pi/agent/extensions/pi-subagent-lite
ln -sf "$(pwd)/pi-subagent-lite/index.ts" ~/.pi/agent/extensions/pi-subagent-lite/index.ts
```

## Usage

Once installed and reloaded, the `subagent` tool is available:

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
