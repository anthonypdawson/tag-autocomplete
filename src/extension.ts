import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

let tags: string[] = [];

function loadTagsFromPath(tagsPath: string) {
    try {
        const file = fs.readFileSync(tagsPath, 'utf8');
        const data = yaml.load(file);
        if (Array.isArray(data)) {
            tags = data.map(String);
        } else if (typeof data === 'object' && data !== null) {
            tags = Object.keys(data);
        }
    } catch (e) {
        tags = [];
    }
}

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) { return; }
    const tagsYamlPath = context.globalState.get<string>('tagsYamlPath');
    if (tagsYamlPath) {
        loadTagsFromPath(tagsYamlPath);
    }
    context.subscriptions.push(
        vscode.commands.registerCommand('tagAutocomplete.selectTagsYaml', async () => {
            const uri = await vscode.window.showOpenDialog({
                canSelectMany: false,
                openLabel: 'Select tags.yaml',
                filters: { 'YAML': ['yaml', 'yml'] }
            });
            if (uri && uri[0]) {
                await context.globalState.update('tagsYamlPath', uri[0].fsPath);
                vscode.window.showInformationMessage(`tags.yaml set to: ${uri[0].fsPath}`);
            }
        })
    );
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown', scheme: 'file' },
            {
                provideCompletionItems(document, position) {
                    const line = document.lineAt(position.line).text;
                    // Only trigger inside a tags: [ ... ] line in front matter
                    if (/^\s*tags\s*:\s*\[.*$/.test(line)) {
                        return tags.map(tag =>
                            new vscode.CompletionItem(tag, vscode.CompletionItemKind.Value)
                        );
                    }
                    return undefined;
                }
            },
            ',' // Trigger on comma
        )
    );

    const watcher = vscode.workspace.createFileSystemWatcher('**/tags.yaml');
    watcher.onDidChange(() => {
        if (tagsYamlPath) {
            loadTagsFromPath(tagsYamlPath);
            vscode.window.showInformationMessage('Reloaded tags from tags.yaml');
        }
    });
    watcher.onDidCreate(() => {
        if (tagsYamlPath) {
            loadTagsFromPath(tagsYamlPath);
            vscode.window.showInformationMessage('Reloaded tags from tags.yaml');
        }
    });
    watcher.onDidDelete(() => {
        tags = [];
        vscode.window.showWarningMessage('tags.yaml was deleted. Tag suggestions disabled.');
    });
    context.subscriptions.push(watcher);
}

export function deactivate() { }
