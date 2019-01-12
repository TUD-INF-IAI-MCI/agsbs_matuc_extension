import * as vscode from 'vscode';
import Helper from './helper';


export default class InsertHelper {
    private _helper: Helper;
    constructor() {
        this._helper = new Helper;
    }
    /**
     * Returns the page identifier
     */
    private _getNewPageIdentifier(){
        return("|| - Seite ");
    }

    /**
     * checks where the current page ends by searching for the start of a new page
     * @param selection optional. The selection to work with.
     * @param currentTextEditor optional. The text editor to work with.
     * @returns false if error, otherwise a point from type vscode.Position ending at the end of the page.
     */
    public getPageEndLine = async (selection?:vscode.Selection,currentTextEditor?:vscode.TextEditor) =>{
        
         return new Promise(async (resolve, reject) => {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        var newpageString = this._getNewPageIdentifier();
        var newSelection = await this.iterateDownwardsToCheckForStringStart(newpageString);
        console.log(newSelection);
        if(newSelection !== false){
            if(selection.end.line>0){ //if there is room above the line
                var previousLineNumber = newSelection.end.line-1;
                var previousLineLength = currentTextEditor.document.lineAt(previousLineNumber).range.end.character;
                var newEndPoint = new vscode.Position(previousLineNumber,previousLineLength);
                resolve(newEndPoint);
            } else {
                resolve(false);
            }
        } else {
            // var endPoint = new vscode.Position(selection.end.line,selection.end.character);
            // return(endPoint);
            resolve(false);
        }
            
     });
    }


    public async iterateDownwardsToCheckForStringStart(testString: string, currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        var selectionStartLine = selection.end.line;
        var selectionStartsWith = await this._helper.checkIfSelectionStartsWith(testString, currentTextEditor, selection);
        if (selectionStartsWith === true) {
            return selection;
        }
        var documentEndLine = currentTextEditor.document.lineCount;
        for (var i = selectionStartLine; i < documentEndLine; i++) {
            var lineLength = currentTextEditor.document.lineAt(i).range.end.character;
            var newStartPosition = new vscode.Position(i, 0);
            var newEndPosition = new vscode.Position(i, lineLength);
            var newSelection = new vscode.Selection(newStartPosition, newEndPosition);
            selectionStartLine = selection.start.line;
            selectionStartsWith = await this._helper.checkIfSelectionStartsWith(testString, currentTextEditor, newSelection);
            if (selectionStartsWith === true) {

                return newSelection;
            }
        }
        return false;
    }

    public async checkDocumentForString (testString: string, currentTextEditor?: vscode.TextEditor){
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        var documentText:string = currentTextEditor.document.getText();
        if(documentText.includes(testString)){
            return true;
        }

        return false;
    }
    

}

