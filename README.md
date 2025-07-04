# TI CC2745R10 Build Buttons VS Code Extension

A comprehensive VS Code extension that adds convenient build, clean, flash, debug, and development tools for TI CC2745R10 development directly to your status bar and context menus.

---

## Features
- **Status bar buttons** for Clean, Build, Rebuild, Flash, Debug, Serial Monitor, SysConfig, CCS, and Configuration
- **Visual grouping** with circuit board icon separator for easy identification
- **SysConfig integration** - Right-click .syscfg files to open with TI SysConfig tool
- **Code Composer Studio integration** - Launch CCS directly from VS Code
- **Smart configuration** - Guided setup with input dialogs and validation
- **Context menus** for .syscfg files and project folders
- **Auto-detection** of .syscfg files with prompt to open in SysConfig
- **Configurable paths** for all TI tools and settings

---

## Getting Started

### 1. Install the Extension
- Install from the VSIX file or the VS Code Marketplace (if available).

### 2. Configure the Extension
- Click the **⚙️** (gear) icon in the status bar, or
- Use the command palette: `TI: Configure Extension`
- Set up your:
  - Project folder path
  - Code Composer Studio path
  - SysConfig tool path
  - Serial port settings

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

### 4. Using the Extension

**Status Bar Buttons:**

- Circuit board icon (🔲) - Extension identifier
- 🗑️ Clean - Clean project
- 🔨 Build - Build project  
- 🔄 Rebuild - Clean and rebuild
- ⚡ Flash - Flash firmware
- 🐛 Debug - Start debugging
- 📻 Serial - Open serial monitor
- ⚙️ SysConfig - Open SysConfig tool
- 🚀 CCS - Open in Code Composer Studio
- ⚙️ Configure - Set up extension

**Context Menus:**

- Right-click .syscfg files → "Open SysConfig"
- Right-click project folders → "Open in CCS"

**Smart Features:**

- Auto-detects .syscfg files and prompts to open with SysConfig
- Validates tool paths and prompts to update if not found
- Guided configuration with input dialogs

---

## Commands

All commands are available through the Command Palette (`Ctrl+Shift+P`):

- `TI: Clean` - Runs TI Clean task
- `TI: Build` - Runs TI Build task
- `TI: Rebuild` - Runs TI Rebuild task
- `TI: Flash` - Runs TI Flash task
- `TI: Debug` - Starts debugging session
- `TI: Serial` - Opens serial monitor
- `TI: Open SysConfig` - Opens current/selected .syscfg file
- `TI: Open in CCS` - Opens project in Code Composer Studio
- `TI: Configure Extension` - Opens configuration wizard

---

## Configuration Settings

Access via VS Code Settings (`Ctrl+,`) and search for "TI":

- `tiCCS.projectFolder` - Your project folder path
- `tiCCS.ccsPath` - Code Composer Studio executable path
- `tiCCS.sysconfigPath` - SysConfig tool executable path  
- `tiCCS.flashTool` - Flash tool preference (uniflash/ccs/custom)
- `tiCCS.serialPort` - Serial port for monitoring
- `tiCCS.baudRate` - Serial communication baud rate

---

## Troubleshooting

**Extension not working:**

- Click the ⚙️ Configure button to set up paths
- Ensure your tasks.json contains the required task labels

**SysConfig won't open:**

- Verify SysConfig tool path in settings
- Extension will prompt to browse for the correct tool

**CCS won't launch:**

- Check Code Composer Studio path in settings
- Ensure CCS is properly installed

**Tool paths incorrect:**

- Use the Configure Extension command for guided setup
- Browse for tools if auto-detected paths are wrong

---

## License

See [LICENSE](LICENSE).
