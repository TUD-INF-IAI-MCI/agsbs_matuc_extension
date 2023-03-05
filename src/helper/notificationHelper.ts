import * as vscode from "vscode";

export async function showNotification({ message, timeout }: { message: string; timeout?: number }) {
    //get user settings for notification timeout default is 5000
    const userTimeout = +vscode.workspace.getConfiguration("agsbs").get("notificationTimeout");
    if (!timeout) timeout = userTimeout ? userTimeout : 5000;
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            cancellable: false
        },
        async (progress) => {
            progress.report({ increment: 100, message: `${message}` });
            await new Promise((resolve) => setTimeout(resolve, timeout));
        }
    );
}
