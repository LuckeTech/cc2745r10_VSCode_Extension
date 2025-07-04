const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const REQUIRED_CONFIG_KEY = 'tiCCS.projectFolder';

function getConfig() {
    return vscode.workspace.getConfiguration('tiCCS');
}

function isConfigured() {
    const config = getConfig();
    const folder = config.get('projectFolder');
    return folder && folder.trim() !== '';
}

function checkToolExists(toolPath) {
    try {
        return fs.existsSync(toolPath);
    } catch (error) {
        return false;
    }
}

function promptForConfig() {
    vscode.window.showErrorMessage(
        'TI CC2745R10: Extension is not properly configured. Would you like to configure it now?',
        'Configure Now', 'Open Settings'
    ).then(selection => {
        if (selection === 'Configure Now') {
            vscode.commands.executeCommand('ti.configure');
        } else if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', '@ext:undefined_publisher.ti-cc2745r10-buttons');
        }
    });
}

async function openSysConfigFile(filePath) {
    const config = getConfig();
    const sysconfigPath = config.get('sysconfigPath');
    
    if (!checkToolExists(sysconfigPath)) {
        const result = await vscode.window.showErrorMessage(
            `SysConfig tool not found at: ${sysconfigPath}`,
            'Update Path', 'Browse for Tool'
        );
        
        if (result === 'Update Path') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'tiCCS.sysconfigPath');
        } else if (result === 'Browse for Tool') {
            const selected = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                filters: { 'Executable': ['exe'] },
                title: 'Select SysConfig Tool'
            });
            
            if (selected && selected[0]) {
                await config.update('sysconfigPath', selected[0].fsPath, vscode.ConfigurationTarget.Global);
                openSysConfigFile(filePath);
            }
        }
        return;
    }
    
    const terminal = vscode.window.createTerminal('SysConfig');
    terminal.sendText(`"${sysconfigPath}" "${filePath}"`);
    terminal.show();
}

async function openInCCS(projectPath) {
    const config = getConfig();
    const ccsPath = config.get('ccsPath');
    
    if (!checkToolExists(ccsPath)) {
        vscode.window.showErrorMessage(`Code Composer Studio not found at: ${ccsPath}`);
        return;
    }
    
    const terminal = vscode.window.createTerminal('CCS');
    terminal.sendText(`"${ccsPath}" -data "${projectPath}"`);
    terminal.show();
}

async function configureExtension() {
    const config = getConfig();
    
    // Project Folder
    const projectFolder = await vscode.window.showInputBox({
        prompt: 'Enter your TI CC2745R10 project folder path',
        value: config.get('projectFolder') || '',
        placeHolder: 'C:/path/to/your/project'
    });
    
    if (projectFolder) {
        await config.update('projectFolder', projectFolder, vscode.ConfigurationTarget.Workspace);
    }
    
    // CCS Path
    const ccsPath = await vscode.window.showInputBox({
        prompt: 'Enter path to Code Composer Studio executable',
        value: config.get('ccsPath') || 'C:/ti/ccs2020/ccs/eclipse/ccstudio.exe',
        placeHolder: 'C:/ti/ccs2020/ccs/eclipse/ccstudio.exe'
    });
    
    if (ccsPath) {
        await config.update('ccsPath', ccsPath, vscode.ConfigurationTarget.Global);
    }
    
    // SysConfig Path
    const sysconfigPath = await vscode.window.showInputBox({
        prompt: 'Enter path to SysConfig executable',
        value: config.get('sysconfigPath') || 'C:/ti/sysconfig_1.24.1/nw/nw.exe',
        placeHolder: 'C:/ti/sysconfig_1.24.1/nw/nw.exe'
    });
    
    if (sysconfigPath) {
        await config.update('sysconfigPath', sysconfigPath, vscode.ConfigurationTarget.Global);
    }
    
    vscode.window.showInformationMessage('TI CC2745R10 extension configured successfully!');
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
    const leftSeparator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 110);
    leftSeparator.text = '$(circuit-board)';
    leftSeparator.tooltip = 'TI CC2745R10 Tools';
    leftSeparator.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

    const rightSeparator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 94);
    rightSeparator.text = '|';
    rightSeparator.tooltip = 'TI Tools End';
    rightSeparator.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

    // Create status bar items with better priorities
    const cleanButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 109);
    const buildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 108);
    const rebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 107);
    const flashButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 106);
    const debugButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 105);
    const serialButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 104);
    const sysconfigButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 103);
    const ccsButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 102);
    const configButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);

    // Configure buttons with better styling
    cleanButton.text = "$(trash)";
    cleanButton.tooltip = "Clean TI CC2745R10 project";
    cleanButton.command = "ti.clean";
    cleanButton.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');

    buildButton.text = "$(tools)";
    buildButton.tooltip = "Build TI CC2745R10 project";
    buildButton.command = "ti.build";
    buildButton.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

    rebuildButton.text = "$(sync)";
    rebuildButton.tooltip = "Clean and rebuild TI CC2745R10 project";
    rebuildButton.command = "ti.rebuild";
    rebuildButton.backgroundColor = new vscode.ThemeColor('statusBarItem.activeBackground');

    flashButton.text = "$(zap)";
    flashButton.tooltip = "Flash TI CC2745R10 firmware";
    flashButton.command = "ti.flash";
    flashButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');

    debugButton.text = "$(bug)";
    debugButton.tooltip = "Start debugging TI CC2745R10";
    debugButton.command = "ti.debug";

    serialButton.text = "$(radio-tower)";
    serialButton.tooltip = "Open serial monitor";
    serialButton.command = "ti.serial";

    sysconfigButton.text = "$(gear)";
    sysconfigButton.tooltip = "Open SysConfig for current file";
    sysconfigButton.command = "ti.openSysConfig";

    ccsButton.text = "$(rocket)";
    ccsButton.tooltip = "Open project in Code Composer Studio";
    ccsButton.command = "ti.openCCS";

    configButton.text = "$(settings-gear)";
    configButton.tooltip = "Configure TI CC2745R10 extension";
    configButton.command = "ti.configure";

    // Show buttons
    leftSeparator.show();
    cleanButton.show();
    buildButton.show();
    rebuildButton.show();
    flashButton.show();
    debugButton.show();
    serialButton.show();
    sysconfigButton.show();
    ccsButton.show();
    configButton.show();
    rightSeparator.show();

    // Register commands with enhanced functionality
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

    // New enhanced commands
    const openSysConfigCmd = vscode.commands.registerCommand('ti.openSysConfig', async (uri) => {
        let filePath = uri?.fsPath;
        
        if (!filePath) {
            // Try to get current active editor
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.fileName.endsWith('.syscfg')) {
                filePath = activeEditor.document.fileName;
            } else {
                // Let user select a .syscfg file
                const selected = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    filters: { 'SysConfig Files': ['syscfg'] },
                    title: 'Select SysConfig File'
                });
                
                if (selected && selected[0]) {
                    filePath = selected[0].fsPath;
                }
            }
        }
        
        if (filePath) {
            await openSysConfigFile(filePath);
        } else {
            vscode.window.showWarningMessage('No .syscfg file selected or found.');
        }
    });

    const openCCSCmd = vscode.commands.registerCommand('ti.openCCS', async (uri) => {
        const config = getConfig();
        let projectPath = uri?.fsPath || config.get('projectFolder');
        
        if (!projectPath) {
            const selected = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                title: 'Select Project Folder'
            });
            
            if (selected && selected[0]) {
                projectPath = selected[0].fsPath;
                await config.update('projectFolder', projectPath, vscode.ConfigurationTarget.Workspace);
            }
        }
        
        if (projectPath) {
            await openInCCS(projectPath);
        } else {
            vscode.window.showWarningMessage('No project folder configured or selected.');
        }
    });

    const configureCmd = vscode.commands.registerCommand('ti.configure', configureExtension);

    // Add to context
    context.subscriptions.push(
        leftSeparator, rightSeparator,
        cleanButton, buildButton, rebuildButton, flashButton, debugButton, serialButton,
        sysconfigButton, ccsButton, configButton,
        cleanCmd, buildCmd, rebuildCmd, flashCmd, debugCmd, serialCmd,
        openSysConfigCmd, openCCSCmd, configureCmd
    );

    // Check configuration on startup
    if (!isConfigured()) {
        vscode.window.showInformationMessage(
            'TI CC2745R10 extension activated! Click the gear icon in the status bar to configure.',
            'Configure Now'
        ).then(selection => {
            if (selection === 'Configure Now') {
                vscode.commands.executeCommand('ti.configure');
            }
        });
    } else {
        vscode.window.showInformationMessage('TI CC2745R10 build tools are ready!');
    }

    // Auto-detect .syscfg files and show context action
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.fileName.endsWith('.syscfg')) {
            vscode.window.showInformationMessage(
                'SysConfig file detected. You can open it with the TI SysConfig tool.',
                'Open in SysConfig'
            ).then(selection => {
                if (selection === 'Open in SysConfig') {
                    vscode.commands.executeCommand('ti.openSysConfig');
                }
            });
        }
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
