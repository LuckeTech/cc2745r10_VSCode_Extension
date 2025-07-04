# TI CC2745R10 Build Buttons VS Code Extension

This extension adds convenient build, clean, flash, debug, and serial monitor buttons for TI CC2745R10 development directly to the VS Code status bar.

---

## Features
- Status bar buttons for Clean, Build, Rebuild, Flash, Debug, and Serial Monitor
- Grouped and visually separated for easy access
- Runs your configured VS Code tasks for each action
- Prompts you to configure your project folder if not set

---

## Getting Started

### 1. Install the Extension
- Install from the VSIX file or the VS Code Marketplace (if available).

### 2. Configure Your Project Folder
- Open VS Code settings (`Ctrl+,` or `Cmd+,` on Mac)
- Search for `tiCCS.projectFolder`
- Set the path to your TI CC2745R10 project folder

> The extension will prompt you if this is not set.

### 3. Ensure Tasks Are Defined
- Make sure your `.vscode/tasks.json` contains tasks named:
  - `TI Clean`
  - `TI Build`
  - `TI Rebuild`
  - `TI Flash`
  - `TI Serial Monitor`

Example `tasks.json` entry:
```json
{
  "label": "TI Build",
  "type": "shell",
  "command": "your-build-command-here",
  "group": "build"
}
```

### 4. Using the Buttons
- The buttons appear in the status bar at the bottom left, grouped with separators.
- Click a button to run the corresponding task or action.
- If the project folder is not configured, you will be prompted to set it.

---

## Commands
- 🧹 Clean: Runs `TI Clean` task
- 🔨 Build: Runs `TI Build` task
- 🔄 Rebuild: Runs `TI Rebuild` task
- 📡 Flash: Runs `TI Flash` task
- 🐛 Debug: Starts the default debug configuration
- 📻 Serial: Runs `TI Serial Monitor` task

---

## Troubleshooting
- **Buttons do not work:**
  - Ensure `tiCCS.projectFolder` is set in your settings
  - Ensure your `tasks.json` contains the required tasks with the correct labels
- **Publisher shows as `undefined_publisher`:**
  - Check your `package.json` and set a valid `publisher` string (e.g., `"publisher": "lucketech"`)

---

## License
See [LICENSE](LICENSE).
