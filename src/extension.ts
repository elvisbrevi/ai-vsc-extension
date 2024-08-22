// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Repository } from "./typings/git";
import { getRepo } from "./utils/repo";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const addCommitMessage = vscode.commands.registerCommand(
    "ia-extension.addCommitMessage",
    (params) => {
      const repoUri = params?.rootUri?.toString() || undefined;
      let repo: Repository | false = getRepo(repoUri);

      if (!repo) {
        vscode.window.showErrorMessage("No repository found");
        return;
      } else {
        repo.inputBox.value = "wwww";
      }
    }
  );

  context.subscriptions.push(addCommitMessage);
}

// This method is called when your extension is deactivated
export function deactivate() {}
