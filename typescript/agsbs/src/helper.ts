import * as vscode from 'vscode';
import * as path from 'path';



export default class Helper{
    /**
     * Sets the Editor layout to the given specifications
     * @param layout Object of the Editor Layout
     */
    public setEditorLayout(layout:Object){
         vscode.commands.executeCommand('vscode.setEditorLayout', layout);
    }
    /**
     * Returns the last active TextEditor and returns it. In case of an error it will promt an Error to the user.
     * @returns current Text Editor or null if it cannot be determined
     */
    public async getCurrentTextEditor(){
        const textEditors = await vscode.window.visibleTextEditors;
        if(textEditors!==undefined){
            if(textEditors.length<1){
                vscode.window.showErrorMessage("No open editors.");
                return null;
            }
            if(textEditors.length>1){
                vscode.window.showErrorMessage("Too many open editors. Please just open one File and without a Split View.");
                return null;
            }
            var currentTextEditor = textEditors[0];
            if(currentTextEditor.document.languageId!=="markdown"){
                vscode.window.showErrorMessage("The current File is not a Markdown file and the current Action cannot be executed. Please open a Markdown File.");
                return null;
            }
            return currentTextEditor;

        }
    }
    /**
     * Returns the primary Selection of the given Text Editor
     * @param textEditor from type vscode.TextEditor, the TextEditor the selection is returned from
     */
    public getPrimarySelection(textEditor:vscode.TextEditor){
        return textEditor.selection;
    }
    public getWordsSelection(textEditor:vscode.TextEditor){
        
        var selection = this.getPrimarySelection(textEditor);
        var newSelection:vscode.Selection;

        if(selection.isEmpty){
            var wordRange = textEditor.document.getWordRangeAtPosition(selection.active);
            if(wordRange !== undefined){ //if there is no actual selection, but a marked word
                newSelection = new vscode.Selection(wordRange.start,wordRange.end);
            } else { //if there is no actual selection and also no marked word
                newSelection = new vscode.Selection(selection.start,selection.end);
            }
        } else { //if there is a selection
            newSelection = new vscode.Selection(selection.start,selection.end);
            
        }
        return newSelection;

    }
    /**
     * Inserts a given string at the start of a selection
     * @param currentTextEditor the current text editor
     * @param selection the current selection
     * @param charactersToInsert string that will be inserted 
     */
    public async insertStringAtStartOfSelection(currentTextEditor:vscode.TextEditor,selection:vscode.Range,charactersToInsert:any) {
        const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.start,
            charactersToInsert
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * Wraps Characters around the current selected Area.
     * @param currentTextEditor The TextEditor the Document is housed in
     * @param position Start and End of the Selection
     * @param startCharacters Characters that will be added at the beginning of the selection
     * @param endCharacters  Characters that will be added at the end of the selection
     */
    public async wrapCharactersAroundSelection(currentTextEditor:vscode.TextEditor, selection:vscode.Range,startCharacters:string,endCharacters:string){
        const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.start,
            startCharacters
        );
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.end,
            endCharacters
        );
        await vscode.workspace.applyEdit(workSpaceEdit);

    }
    /**
     * Deletes given character lengths from the start and end of a selection
     * @param currentTextEditor the given Text Editor
     * @param selection the selection the edits will be made on
     * @param numberStartCharacters number of characters that will be sliced at the beginning
     * @param numberEndCharacters  number of characters that will be sliced at the end
     */
    public async deleteCharactersInSelection(currentTextEditor:vscode.TextEditor,selection:vscode.Range,numberStartCharacters:number,numberEndCharacters:number){
       var startPointStart =selection.start;
       var startPointEnd = selection.start.translate(0,numberStartCharacters);
       var start = new vscode.Range(startPointStart,startPointEnd);
       var endPointStart = selection.end.translate(0,-1*numberEndCharacters);
       var endPointEnd = selection.end;
       var end = new vscode.Range(endPointStart,endPointEnd);

       const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.delete(
            currentTextEditor.document.uri,
            start
        );
        workSpaceEdit.delete(
            currentTextEditor.document.uri,
            end
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }
    /**
     * checks if the given selection has the given characters at the beginning and end
     * @param currentTextEditor the given Text Editor 
     * @param selection the Selection the check will be made on
     * @param startCharacters the start Characters that will be checked
     * @param endCharacters  the end Characters that will be checked
     */
    public async checkStringForMarkersAtBeginningAndEnd (currentTextEditor:vscode.TextEditor,selection:vscode.Range,startCharacters:string,endCharacters:string){
        var selectedText = currentTextEditor.document.getText(selection);
        if(selectedText === undefined){
            return false;
        }
        if((startCharacters.length + endCharacters.length)>selectedText.length){
            return false; //if the selected text is shorter than the Characters to check against
        }
        var textlength= selectedText.length;
        var startSubstring = selectedText.substr(0,startCharacters.length);
        var endSubstring = selectedText.substr((textlength-endCharacters.length),textlength);
        if(startCharacters === startSubstring && endCharacters === endSubstring){
            return true;
        }
        
    }
    /**
     * Toggles the existence of given Characters in a Selection, also checks around the selection for better matching
     * @param currentTextEditor the given Text Editor
     * @param selection the selection that will be edited and checked
     * @param startCharacters Characters at the beginning of the selection that will be added or removed
     * @param endCharacters Characters at the end of the selection that will be added or removed
     */
    public async toggleCharactersAtStartAndEnd (currentTextEditor:vscode.TextEditor,selection:vscode.Range,startCharacters:string,endCharacters:string){
        if(startCharacters.length === 0){
            return false;
        }

        if(await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor,selection,startCharacters,endCharacters) === true){
            //If they match immediately
            await this.deleteCharactersInSelection(currentTextEditor,selection,startCharacters.length,endCharacters.length);
            return true;
        } 

        //If they don't match
        var extendedSelection:vscode.Selection;
        if(selection.start.character>=startCharacters.length){//Extend selection to the Left if it is possible
            
            extendedSelection = new vscode.Selection( selection.start.translate(0,-1*startCharacters.length),selection.end);
            if(await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor,extendedSelection,startCharacters,endCharacters) === true){
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor,extendedSelection,startCharacters.length,endCharacters.length);
                return true;
            } 
        } 
        if(selection.start.character>=(startCharacters.length+endCharacters.length)){//Extend selection to the Left (stadt + endcharacters) if it is possible
            //reason: if there is nothing selected, and the button gets pressed, the cursor will jump at the end after the characters
            extendedSelection = new vscode.Selection( selection.start.translate(0,(-1*startCharacters.length + -1*endCharacters.length)),selection.end);
            if(await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor,extendedSelection,startCharacters,endCharacters) === true){
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor,extendedSelection,startCharacters.length,endCharacters.length);
                return true;
            } 
        } 
        var lineLength = currentTextEditor.document.lineAt(selection.end.line).range.end.character;
        if(selection.end.character<=lineLength-endCharacters.length){//Extend selection to the Right if it is possible
            
            extendedSelection = new vscode.Selection( selection.start,selection.end.translate(0,endCharacters.length));
            if(await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor,extendedSelection,startCharacters,endCharacters) === true){
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor,extendedSelection,startCharacters.length,endCharacters.length);
                return true;
            } 
        } 
        if(selection.start.character>=startCharacters.length &&selection.end.character<=lineLength-endCharacters.length){//Extend selection in both directions if it is possible
            
            extendedSelection = new vscode.Selection( selection.start.translate(0,-1*startCharacters.length),selection.end.translate(0,endCharacters.length));
            if(await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor,extendedSelection,startCharacters,endCharacters) === true){
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor,extendedSelection,startCharacters.length,endCharacters.length);
                return true;
            } 
        } 
        if(selection.start.character>=startCharacters.length &&selection.end.character<=lineLength-endCharacters.length){//Extend selection to the full length of the line
            var newStartPositionAtLineStart = new vscode.Position(selection.start.line,0);
            var newStartPositionAtLineEnd = new vscode.Position(selection.end.line,lineLength);
            extendedSelection = new vscode.Selection( newStartPositionAtLineStart,newStartPositionAtLineEnd);
            if(await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor,extendedSelection,startCharacters,endCharacters) === true){
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor,extendedSelection,startCharacters.length,endCharacters.length);
                return true;
            } 
        } 

            //If they are different and the selection is not longer than the length of the startCharacters
            await this.wrapCharactersAroundSelection(currentTextEditor,selection,startCharacters,endCharacters);
            return true;
        
            
        
    }
    /**
     * Creates a custom File Resource URI that can be used in the Webview
     * @param name Name of the Icon WITH file extension. So for example "bold.png"
     * @param context Context of the Extension
     * @returns resource from type vscode.Uri
     */
    public getWebviewResourceIconURI (name,context):vscode.Uri {
        var ressource = this.getWebviewResourceURI(name,"icons",context);
        return ressource;
    }
    /**
     * Gets custom File Ressource URI for use in Webview.
     * @param name Name of the File with extension
     * @param folder Folder or Folder Structure the File is in
     * @param context Context of the Webview
     * @returns vscode URI for use in a WebView
     */
    public getWebviewResourceURI (name,folder,context):vscode.Uri {
        const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, folder, name));

        // And get the special URI to use with the webview
        const ressource = onDiskPath.with({ scheme: 'vscode-resource' });
        return ressource;
    }
    /** Generates a semi random UUID.
     * @returns a UUID.
     */
    public generateUuid(){
    return 'xxxx-xxxx-xxx-yxxx-xxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
}