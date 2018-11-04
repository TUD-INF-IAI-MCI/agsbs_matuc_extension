import * as vscode from 'vscode'

export default class Helper{

    public setEditorLayout(layout:Object){
         vscode.commands.executeCommand('vscode.setEditorLayout', layout);
    }
}