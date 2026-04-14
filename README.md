# @jerryan/pi-subagent-lite

A minimal pi extension that delegates tasks to isolated subagent processes.

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
