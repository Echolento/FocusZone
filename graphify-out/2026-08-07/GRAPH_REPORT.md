# Graph Report - FocusZone  (2026-08-07)

## Corpus Check
- 43 files · ~65,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 267 nodes · 332 edges · 30 communities (21 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28bcf938`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useSession
- SessionContext.tsx
- dependencies
- expo
- package.json
- What You Must Do When Invoked
- tsconfig.json
- graphify.js
- declarations.d.ts
- permissions
- Current Flow
- graphify reference: extra exports and benchmark
- package.json
- HomeScreen.tsx
- FullScreenAlarmActivity
- FocusZoneFullScreenAlarmModule
- graphify reference: query, path, explain
- opencode.json
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- FocusZone
- app.plugin.js
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `useSession()` - 23 edges
2. `expo` - 13 edges
3. `What You Must Do When Invoked` - 12 edges
4. `/graphify` - 10 edges
5. `AppContent()` - 8 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `permissions` - 7 edges
8. `SessionProvider()` - 7 edges
9. `FocusZone Design` - 7 edges
10. `Current Flow` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AppContent()` --references--> `react`  [EXTRACTED]
  App.tsx → package.json
- `SessionProvider()` --references--> `react`  [EXTRACTED]
  src/SessionContext.tsx → package.json
- `useTimer()` --calls--> `useSession()`  [EXTRACTED]
  App.tsx → src/SessionContext.tsx
- `useKeepAwake()` --calls--> `useSession()`  [EXTRACTED]
  App.tsx → src/SessionContext.tsx
- `AppContent()` --calls--> `useSession()`  [EXTRACTED]
  App.tsx → src/SessionContext.tsx

## Import Cycles
- None detected.

## Communities (30 total, 9 thin omitted)

### Community 0 - "useSession"
Cohesion: 0.10
Nodes (26): App(), AppContent(), plugins, Page, styles, useKeepAwake(), useTimer(), expo-audio (+18 more)

### Community 1 - "SessionContext.tsx"
Cohesion: 0.15
Nodes (24): ALERT_OPTIONS, SENSITIVITY_OPTIONS, SettingsScreen(), SettingsScreenProps, styles, initialSession, SessionAction, SessionContext (+16 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (27): expo, expo-audio, expo-dev-client, expo-haptics, expo-keep-awake, expo-sensors, expo-status-bar, focuszone-fullscreen-alarm (+19 more)

### Community 3 - "expo"
Cohesion: 0.12
Nodes (15): projectId, expo, extra, icon, ios, name, orientation, owner (+7 more)

### Community 4 - "package.json"
Cohesion: 0.11
Nodes (18): eas-cli, @expo/ngrok, devDependencies, eas-cli, @expo/ngrok, @types/react, typescript, main (+10 more)

### Community 5 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 6 - "tsconfig.json"
Cohesion: 0.40
Nodes (4): expo/tsconfig.base, compilerOptions, strict, extends

### Community 9 - "permissions"
Cohesion: 0.13
Nodes (15): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+7 more)

### Community 10 - "Current Flow"
Cohesion: 0.14
Nodes (13): Active Session, Arming, Current Flow, Current Interaction Contract, Current Visual Language, FocusZone Design, Home, Open Design Decision (+5 more)

### Community 11 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 12 - "package.json"
Cohesion: 0.29
Nodes (6): expo-module, platforms, main, name, version, android

### Community 13 - "HomeScreen.tsx"
Cohesion: 0.40
Nodes (5): dialAngle(), HomeScreen(), HomeScreenProps, styles, DURATION_PRESETS

### Community 14 - "FullScreenAlarmActivity"
Cohesion: 0.40
Nodes (3): Activity, Bundle, FullScreenAlarmActivity

### Community 16 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 18 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 19 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 20 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 21 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **128 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `Page`, `styles`, `name` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `react` connect `dependencies` to `useSession`, `SessionContext.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `expo` connect `expo` to `useSession`, `permissions`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `Page` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useSession` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `SessionContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1455026455026455 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._