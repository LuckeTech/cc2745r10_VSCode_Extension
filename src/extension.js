const vscode = require('vscode');

const REQUIRED_CONFIG_KEY = 'tiCCS.projectFolder';

function isConfigured() {
    const config = vscode.workspace.getConfiguration();
    const folder = config.get(REQUIRED_CONFIG_KEY);
    return folder && folder.trim() !== '';
}

function promptForConfig() {
    vscode.window.showErrorMessage(
        'TI CC2745R10: Project folder is not configured. Please set it in your settings.',
        'Open Settings'
    ).then(selection => {
        if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', REQUIRED_CONFIG_KEY);
        }
    });
}

function runTaskOrPrompt(taskName) {
    if (!isConfigured()) {
        promptForConfig();
        return;
    }
    vscode.commands.executeCommand('workbench.action.tasks.runTask', taskName);
}

function activate(context) {
    console.log('TI CC2745R10 Buttons extension activated');

    // Create separator status bar items
    const leftSeparator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
    leftSeparator.text = '|';
    leftSeparator.tooltip = 'TI Buttons Start';
    leftSeparator.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

    const rightSeparator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 94);
    rightSeparator.text = '|';
    rightSeparator.tooltip = 'TI Buttons End';
    rightSeparator.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

    // Create status bar items
    const cleanButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    const buildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    const rebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
    const flashButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97);
    const debugButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 96);
    const serialButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 95);

    // Configure buttons
    cleanButton.text = "$(trash) Clean";
    cleanButton.tooltip = "Clean TI CC2745R10 project";
    cleanButton.command = "ti.clean";
    cleanButton.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');

    buildButton.text = "$(tools) Build";
    buildButton.tooltip = "Build TI CC2745R10 project";
    buildButton.command = "ti.build";
    buildButton.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

    rebuildButton.text = "$(sync) Rebuild";
    rebuildButton.tooltip = "Clean and rebuild TI CC2745R10 project";
    rebuildButton.command = "ti.rebuild";

    flashButton.text = "$(debug-alt) Flash";
    flashButton.tooltip = "Flash TI CC2745R10 firmware";
    flashButton.command = "ti.flash";
    flashButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');

    debugButton.text = "$(bug) Debug";
    debugButton.tooltip = "Start debugging TI CC2745R10";
    debugButton.command = "ti.debug";

    serialButton.text = "$(radio-tower) Serial";
    serialButton.tooltip = "Open serial monitor";
    serialButton.command = "ti.serial";

    // Show buttons
    leftSeparator.show();
    cleanButton.show();
    buildButton.show();
    rebuildButton.show();
    flashButton.show();
    debugButton.show();
    serialButton.show();
    rightSeparator.show();

    // Register commands
    const cleanCmd = vscode.commands.registerCommand('ti.clean', () => {
        runTaskOrPrompt('TI Clean');
    });

    const buildCmd = vscode.commands.registerCommand('ti.build', () => {
        runTaskOrPrompt('TI Build');
    });

    const rebuildCmd = vscode.commands.registerCommand('ti.rebuild', () => {
        runTaskOrPrompt('TI Rebuild');
    });

    const flashCmd = vscode.commands.registerCommand('ti.flash', () => {
        runTaskOrPrompt('TI Flash');
    });

    const debugCmd = vscode.commands.registerCommand('ti.debug', () => {
        if (!isConfigured()) {
            promptForConfig();
            return;
        }
        vscode.commands.executeCommand('workbench.action.debug.start');
    });

    const serialCmd = vscode.commands.registerCommand('ti.serial', () => {
        runTaskOrPrompt('TI Serial Monitor');
    });

    // Add to context
    context.subscriptions.push(
        leftSeparator, rightSeparator,
        cleanButton, buildButton, rebuildButton, flashButton, debugButton, serialButton,
        cleanCmd, buildCmd, rebuildCmd, flashCmd, debugCmd, serialCmd
    );

    // Show welcome message
    vscode.window.showInformationMessage('TI CC2745R10 build buttons are now available in the status bar!');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
