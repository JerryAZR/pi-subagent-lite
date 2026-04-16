# Changelog

## 0.1.2

- Fixed extension not loading in main pi session due to collision with `PI_CODING_AGENT` env var. Now uses `PI_SUBAGENT_LITE_DISABLE` to prevent recursive nesting only in subagent processes.
