/**
 * @author  Lucas Vogel
 */
import * as vscode from 'vscode';
import Helper from './helper/helper';
import Language from './languages';
import Sidebar from './sidebar';
import Taskbar from './taskbar';
import ImageHelper from './helper/imageHelper';
import MatucCommands from './matucCommands';
import EditorFunctionSnippets from './snippets/editorFunctionsSnippets';
import TableHelper from './helper/tableHelper';
import * as Papa from 'papaparse';
import * as path from 'path';
import ListHelper from './helper/listHelper';
import InsertHelper from './helper/insertHelper';
import HeadlineHelper from './helper/headlineHelper';
import SettingsHelper from './helper/settingsHelper';

/**
 * The Main Class to add Buttons and their functionality of the Editor Tools Bar.
 */
export default class EditorFunctions {
    private _helper: Helper;
    private _imageHelper: ImageHelper;
    private _sidebarCallback: Sidebar;
    private _taskbarCallback: Taskbar;
    private _language: Language;
    private _matucCommands: MatucCommands;
    private _snippets: EditorFunctionSnippets;
    private _tableHelper: TableHelper;
    private _listHelper: ListHelper;
    private _insertHelper: InsertHelper;
    private _headlineHelper: HeadlineHelper;
    private _settings: SettingsHelper;

    constructor(taskbarCallback, sidebarCallback, context) {
        this._helper = new Helper;
        this._imageHelper = new ImageHelper(context);
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new Language;
        this._matucCommands = new MatucCommands;
        this._snippets = new EditorFunctionSnippets;
        this._tableHelper = new TableHelper;
        this._listHelper = new ListHelper;
        this._insertHelper = new InsertHelper;
        this._headlineHelper = new HeadlineHelper;
        this._settings = new SettingsHelper;
    }

    /**
     * Setup of the Editor Functions. Here taskbar edit-buttons can be added.
     */
    public setup = () => {
        this._taskbarCallback.addButton("bold.svg", this._language.get("bold"), this.bold, this._language.get("emphasis"), "agsbs.bold");
        this._taskbarCallback.addButton("italic.svg", this._language.get("italic"), this.italic, this._language.get("emphasis"), "agsbs.italic");
        this._taskbarCallback.addButton("strikethrough.svg", this._language.get("strikethrough"), this.strikethrough, this._language.get("emphasis"), "agsbs.strikethrough");

        this._taskbarCallback.addButton("h.svg", this._language.get("headline"), this.headline, this._language.get("headline"), "agsbs.h");
        this._taskbarCallback.addButton("h1.svg", this._language.get("headline1"), this.h1, this._language.get("headline"), "agsbs.h1");
        this._taskbarCallback.addButton("h2.svg", this._language.get("headline2"), this.h2, this._language.get("headline"), "agsbs.h2");
        this._taskbarCallback.addButton("h3.svg", this._language.get("headline3"), this.h3, this._language.get("headline"), "agsbs.h3");
        this._taskbarCallback.addButton("h4.svg", this._language.get("headline4"), this.h4, this._language.get("headline"), "agsbs.h4");
        this._taskbarCallback.addButton("h5.svg", this._language.get("headline5"), this.h5, this._language.get("headline"), "agsbs.h5");
        this._taskbarCallback.addButton("h6.svg", this._language.get("headline6"), this.h6, this._language.get("headline"), "agsbs.h6");

        this._taskbarCallback.addButton('numbered_list.svg', this._language.get('orderedList'), this.orderedList, this._language.get('list'), "agsbs.numberedList");
        this._taskbarCallback.addButton('list.svg', this._language.get('unorderedList'), this.unorderedList, this._language.get('list'), "agsbs.list");

        this._taskbarCallback.addButton('table.svg', this._language.get('insertTable'), this.insertTable, this._language.get('table'), "agsbs.table");
        this._taskbarCallback.addButton('import_table_csv.svg', this._language.get('importTableCsv'), this.insertCSVTable, this._language.get('table'), "agsbs.importTableCSV");
        this._taskbarCallback.addButton("edit_table.svg", this._language.get("editTable"), this.editTable, this._language.get("table"), "agsbs.editTable");

        this._taskbarCallback.addButton("formula.svg", this._language.get("formula"), this.formula, this._language.get("formatting"), "agsbs.formula");
        this._taskbarCallback.addButton("inline_formula.svg", this._language.get("formulaInline"), this.inlineFormula, this._language.get("formatting"), "agsbs.inlineFormula");
        this._taskbarCallback.addButton("code.svg", this._language.get("code"), this.code, this._language.get("formatting"), "agsbs.code");
        this._taskbarCallback.addButton("quote.svg", this._language.get("blockquote"), this.blockquote, this._language.get("formatting"), "agsbs.quote");

        this._taskbarCallback.addButton("link.svg", this._language.get("insertLink"), this.insertLink, this._language.get("insert"), "agsbs.link");
        this._taskbarCallback.addButton('image.svg', this._language.get('insertGraphic'), this.insertImage, this._language.get('insert'), "agsbs.image");
        this._taskbarCallback.addButton('footnote.svg', this._language.get('insertFootnote'), this.insertFootnote, this._language.get('insert'), "agsbs.footnote");
        this._taskbarCallback.addButton('annotation.svg', this._language.get('authorAnnotation'), this.insertAnnotation, this._language.get('insert'), "agsbs.annotation");

        this._taskbarCallback.addButton('hr.svg', this._language.get('horizontalRule'), this.insertHorizontalRule, this._language.get('separator'), "agsbs.hr");
        this._taskbarCallback.addButton('new_page.svg', this._language.get('newPage'), this.addNewPage, this._language.get('separator'), "agsbs.newPage");
    }

    /**
     * Inserts a headline with a computed grade.
     * It tries to smartly match what the next headline could be.
     */
    public headline = async () => {
        var result = await this._headlineHelper.getNextHeadlineString();

        var headlineGrade: number = (result.match(/\#/g) || []).length;
        vscode.window.showInformationMessage(this._language.get("headlineInsertedWithGrade") + headlineGrade);
        this._headlineHelper.setSpecificHeadline(headlineGrade);
    }

    /**
     * Inserts a headline with grade 1
     */
    public h1 = async () => {
        this._headlineHelper.setSpecificHeadline(1);
    }

    /**
     * Inserts a headline with grade 2
     */
    public h2 = async () => {
        this._headlineHelper.setSpecificHeadline(2);
    }

    /**
     * Inserts a headline with grade 3
     */
    public h3 = async () => {
        this._headlineHelper.setSpecificHeadline(3);
    }

    /**
     * Inserts a headline with grade 4
     */
    public h4 = async () => {
        this._headlineHelper.setSpecificHeadline(4);
    }

    /**
     * Inserts a headline with grade 5
     */
    public h5 = async () => {
        this._headlineHelper.setSpecificHeadline(5);
    }

    /**
     * Inserts a headline with grade 6
     */
    public h6 = async () => {
        this._headlineHelper.setSpecificHeadline(6);
    }

    /**
     * Inserts a new Page identifier. It uses Matuc to determine what Page it is.
     */
    public addNewPage = async () => {
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        if (currentTextEditor.document.isDirty) {
            await currentTextEditor.document.save();
            vscode.window.showInformationMessage(this._language.get("documentHasBeenSaved"));
        }
        var matucIsInstalled = await this._matucCommands.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        var result: any = await this._matucCommands.addPageNumber();

        if (result.includes("|| - ") === false) {
            vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
            return;
        }
        var insertText = "\n" + result + "\n";
        this._helper.insertStringAtStartOfLine(insertText);
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Inserts a horizontal rule.
     */
    public insertHorizontalRule = async () => {
        var text = "\n---\n\n";
        var insertPosition: any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (insertPosition === false) {
            await this._helper.insertStringAtStartOfLineOrLinebreak(text);
            return;
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            var thisCurrentEditor = await this._helper.getCurrentTextEditor();
            var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(text, thisCurrentEditor, newEndPosition);
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Adds the 'add Annotation'-Dialogue to to the sidebar.
     */
    public insertAnnotation = async () => {
        var setttingsTextboxContentIsOptional = await this._settings.get("optionalTextboxContent");
        var form = this._snippets.get("insertAnnotationHTMLPart1");
        if (setttingsTextboxContentIsOptional === false) {
            form += "required='true'";
        }
        form += this._snippets.get("insertAnnotationHTMLPart2");
        if (setttingsTextboxContentIsOptional === false) {
            form += "required='true'";
        }
        form += this._snippets.get("insertAnnotationHTMLPart3");

        var script = this._snippets.get("insertAnnotationSCRIPT");
        this._sidebarCallback.addToSidebar(form, this._language.get("insertTextbox"), this.insertAnnotationSidebarCallback, this._language.get("insert"), "", script);
    }

    /**
     * Adds an specified annotation to the text.
     */
    public insertAnnotationSidebarCallback = async (params) => {
        var annotationType = params.annotationType.value;
        var color = params.color.value;
        var title = params.titleOfBox.value;
        var content = params.contentOfBox.value;
        var text = "";
        if (annotationType === "textFrame") {
            text = `<div class="frame ${color}">\n`;
            text += `<span class="title">${title}</span>\n`;
            text += `${content}\n`;
            text += `</div>\n`;
        }
        if (annotationType === "textBox") {
            text = `<div class="box ${color}">\n`;
            text += `<span class="title">${title}</span>\n`;
            text += `${content}\n`;
            text += `</div>\n`;
        }
        if (annotationType === "annotation") {
            text = `<div class="annotation">${content}</div>`;
            if (title !== "") {
                vscode.window.showWarningMessage(this._language.get("annotationNoTitleError"));
            }
        }
        //Check if Annotation will be placed in Table (optional, but additional check);
        var insertPosition: any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (insertPosition === false) {
            await this._helper.insertStringAtStartOfLineOrLinebreak(text);
            return;
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            var thisCurrentEditor = await this._helper.getCurrentTextEditor();
            var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(text, thisCurrentEditor, newEndPosition);
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Adds the form dialogue to the sidebar
     */
    public insertFootnote = async () => {
        var form = this._snippets.get("insertFootnoteHTML");
        this._sidebarCallback.addToSidebar(form, this._language.get("insertFootnote"), this.insertFootnoteSidebarCallback, this._language.get("insertFootnote"));
    }

    /**
     * Adds a specified footnote to the text.
     */
    public insertFootnoteSidebarCallback = async (params) => {
        var label = params.footLabel.value;
        var text = params.footText.value;
        var currentLineLabel = "[^" + label + "]";
        var includesLabel = await this._insertHelper.checkDocumentForString(currentLineLabel);

        if (text.includes("[") || text.includes("]") || text.includes("^")) {
            vscode.window.showErrorMessage(this._language.get("footLabelError"));
            return false;
        }
        if (includesLabel === true) {
            vscode.window.showErrorMessage(this._language.get("footLabelErrorDetail"));
            return false;
        }
        var pageEndLabel = "\n" + currentLineLabel + ": " + text + "\n";
        var endPoint: any = await this._insertHelper.getPageEndLine();
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getPrimarySelection(currentTextEditor);
        var position = new vscode.Range(selection.active, selection.end);
        await this._helper.insertStringAtStartOfSelection(currentLineLabel, undefined, position);
        if (endPoint === false) {
            this._helper.insertStringAtStartOfLineOrLinebreak(pageEndLabel);
        } else {
            endPoint = await this._insertHelper.getPageEndLine();
            var newEndSelection = new vscode.Selection(endPoint, endPoint);
            await this._helper.insertStringAtStartOfLineOrLinebreak(pageEndLabel, currentTextEditor, newEndSelection);
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Adds a quote identifier at the start of the current line.
     */
    public blockquote = async () => {
        await this._helper.toggleCharactersAtBeginningOfLine("> ");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Marks the current selection as code.
     */
    public code = async () => {
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = await this._helper.getWordsSelection(currentTextEditor);
        var startInsertText = "```";
        var endInsertText = "```";
        if (selection.start.line !== selection.end.line) {
            startInsertText = "\n" + startInsertText + "\n";
            endInsertText = "\n" + endInsertText;
        }
        await this._helper.toggleCharactersAtStartAndEnd(startInsertText, endInsertText);
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Toggles the current selection as a inline formula
     */
    public inlineFormula = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("$", "$");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Toggles the current selection as a formula
     */
    public formula = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("$$ ", " $$");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Toggles a unordered list.
     */
    public unorderedList = async () => {
        await this._helper.toggleCharactersAtBeginningOfLine("- ");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Adds a Marker at the current line as a ordered list.
     */
    public orderedList = async () => {
        this._listHelper.orderedList();
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Editing a existing Table
     */
    public editTable = async () => {
        var insertPosition: any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (insertPosition === false) {
            vscode.window.showErrorMessage(this._language.get("noTableFound"));
            return;
        } else {
            var tableData = await this._tableHelper.loadSelectedTable(insertPosition);
            var form = this._snippets.get('editTableHTML');
            form = form + `<input type="hidden" value="${tableData["file"]}" name="hiddenFileName" id="hiddenFileName">`; //TODO possible escape file string
            var script = this._snippets.get('editTableSCRIPT');
            script += this._snippets.get('editTableScriptPart1');
            var jsonToInsert = JSON.stringify(tableData["data"]);
            jsonToInsert = jsonToInsert.replace(/\\n/g, "\\\\n")
                .replace(/\\"/g, "\\\\\"")
                .replace(/\\'/g, "\\\\'")
                .replace(/\\&/g, "\\\\&")
                .replace(/\\r/g, "\\\\r")
                .replace(/\\t/g, "\\\\t")
                .replace(/\\b/g, "\\\\b")
                .replace(/\\f/g, "|\f");
            script += jsonToInsert;
            script += this._snippets.get('editTableScriptPart2');
            var style = this._snippets.get('editTableSTYLE');
            this._sidebarCallback.addToSidebar(form, this._language.get("insertTable"), this.editTableSidebarCallback, this._language.get("insert"), style, script);
        }
    }

    /**
     * Callback of the Sidebar for editing a table
     */
    public editTableSidebarCallback = async (params: any) => {
        var hasHeader = params.tableHeadCheckbox.checked;
        var tableType = params.tableType.value;
        var rawdata = params.tableJSON.value;
        var data: any;
        try {
            data = JSON.parse(rawdata);
        } catch (e) {
            console.log(e);
            return;
        }
        var tableData: any = await this._tableHelper.generateCSVfromJSON(rawdata);
        var fileName: string = params.hiddenFileName.value.replace(/^.*[\\\/]/, '');
        var folderName: string = params.hiddenFileName.value.substr(0, params.hiddenFileName.value.lastIndexOf("/") - 1);
        var defaultGeneratedFolderName: string = await this._tableHelper.getTableFolderName();
        var savedTable: any;
        if (folderName === defaultGeneratedFolderName) {
            savedTable = await this._tableHelper.writeCSVFile(tableData, fileName);
        } else {
            savedTable = await this._tableHelper.writeCSVFile(tableData);
            //if table exists in other folder, generate new Name, because the file could potentially already exists
            // with that name so no other file will be overridden by accident
        }
        vscode.window.showInformationMessage(this._language.get("filehasBeenWritten") + params.hiddenFileName.value);
        var extraText = "";
        if (savedTable !== false) {
            var relSavedTablePathParts = savedTable.split(path.sep);
            var relSavedTablePath = "." + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 2] + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 1];
            extraText = "exported to " + relSavedTablePath;
        }
        var table = this._tableHelper.generateTable(hasHeader, data, tableType, extraText);
        var insertSelection: any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (insertSelection === false) {
            vscode.window.showErrorMessage(this._language.get("originalTableNotFound"));
            this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            this._helper.replaceSelection(table, insertSelection);
        }
    }

    /**
     * Insert a Table from a CSV-File
     */
    public insertCSVTable = async () => {
        var thisPath = await this._helper.getCurrentDocumentFolderPath();
        var results = await this._tableHelper.getAllTablesInFolder(thisPath);
        var selectionTablesHTML = this._tableHelper.generateSelectTableOptionsHTML(results);
        var form = `
        <select name='selectTable'>
        <option selected="true" disabled="disabled" value=''>${this._language.get("selectTable")}</option>
        ${selectionTablesHTML}
        </select>
        `;
        this._sidebarCallback.addToSidebar(form, this._language.get("importTableCsv"), this.insertCSVTableSidebarCallback, this._language.get("insert"));
    }

    /**
     * Callback for insert a table from a CSV-File
     */
    public insertCSVTableSidebarCallback = async (params) => {
        var urlData = params.selectTable.value;
        var url: any;
        if (urlData === "") {
            vscode.window.showErrorMessage(this._language.get("noFileSelected"));
            return false;
        } else {
            try {
                url = JSON.parse(urlData);
            } catch (e) {
                vscode.window.showErrorMessage(this._language.get("importTableFromCsvError"));
                console.log(e);
                return false;
            }
        }
        var content: any = await this._helper.getContentOfFile(url.completePath);
        content = content.replace(/\ +$/, "");
        content = content.replace(/\n+$/, "");//removes trailing spaces and line breaks
        var result = await Papa.parse(content);
        var extraText = this._language.get("importedFrom") + " " + url.relativePath;
        var table = this._tableHelper.generateTable(false, result.data, "", extraText);
        var insertPosition: any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (insertPosition === false) {
            this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            var thisCurrentEditor = await this._helper.getCurrentTextEditor();
            var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(table, thisCurrentEditor, newEndPosition);
        }
    }

    /**
     * Insert Table Button Function
     */
    public insertTable = async () => {
        var form = this._snippets.get('insertTableHTML');
        var script = this._snippets.get('insertTableSCRIPT');
        var style = this._snippets.get('insertTableSTYLE');
        this._sidebarCallback.addToSidebar(form, this._language.get("insertTable"), this.insertTableSidebarCallback, this._language.get("insert"), style, script);
    }

    /**
     * Insert Table SidebarCallback Function
     */
    public insertTableSidebarCallback = async (params) => {
        var hasHeader = params.tableHeadCheckbox.checked;
        var tableType = params.tableType.value;
        var rawdata = params.tableJSON.value;
        var data;
        try {
            data = JSON.parse(rawdata);
        } catch (e) {
            console.log(e);
            return;
        }
        var savedTable: any = await this._tableHelper.generateCSVfromJSONandSave(rawdata);
        var extraText = "";
        if (savedTable !== false) {
            var relSavedTablePathParts = savedTable.split(path.sep);
            var relSavedTablePath = "." + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 2] + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 1];
            extraText = "exported to " + relSavedTablePath;
        }
        var table = this._tableHelper.generateTable(hasHeader, data, tableType, extraText);
        var insertPosition: any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (insertPosition === false) {
            this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            var thisCurrentEditor = await this._helper.getCurrentTextEditor();
            var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(table, thisCurrentEditor, newEndPosition);
        }
    }


    /**
     * Inserts an Image
     */
    public insertImage = async () => {
        var matucIsInstalled = await this._matucCommands.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        var thisPicturesFolderName = await this._imageHelper.getPictureFolderName();
        var thisPath = await this._helper.getCurrentDocumentFolderPath();
        var thisPicturesArray = await this._imageHelper.getAllPicturesInFolder(thisPath, thisPicturesFolderName);
        var allPicturesHTMLString = await this._imageHelper.generateSelectImagesOptionsHTML(thisPicturesArray);
        var form = "";
        var script =this._snippets.get("insertImageScript");
        form += this._snippets.get('insertImageFormPart1') + allPicturesHTMLString + this._snippets.get('insertImageFormPart2');
        this._sidebarCallback.addToSidebar(form, this._language.get("insertGraphic"), this.insertImageSidebarCallback, this._language.get("insert"),"",script);
    }

    /**
     * The Callback for inserting an image from the sidebar, inserts the image
     * @param params parameters given by the callback about the html-elements of the html-form
     */
    public insertImageSidebarCallback = async (params) => {
        var altText = "";
        var pictureTitle = "";
        var pictureSelector = JSON.parse(params.selectPicture.value);
        altText += params.altText.value;
        pictureTitle += params.graphicTitle.value;
        var pictureSource = "";
        pictureSource += pictureSelector.markdownReadyRelativePath;
        var result = await this._matucCommands.imageDescription(
            altText,
            params.outsourceCheckbox.checked,
            pictureSelector.basePath,
            pictureTitle,
            pictureSelector.markdownReadyRelativePath);
        await this._helper.insertStringAtStartOfSelection(result['internal'].verbatim);
        //typescript does not like .internal, so this workaround is used.
        if (result.hasOwnProperty("external")) { // if the description is outsourced, the returning JSON has a 'external' property
            var fileName = await this._imageHelper.getPictureFolderName();
            fileName += ".md";
            this._imageHelper.addImageDescriptionToFile(pictureSelector.basePath, fileName, result["external"].verbatim);
            //typescript does not like .external, so this workaround is used.
        }
    }

    /**
     * Adds a panel to the sidebar to add a link
     */
    public insertLink = () => {
        var form = this._snippets.get("insertLinkForm");
        var script = `
        function valueChanged(){
            var urlElement = document.getElementById("url");
            var url = urlElement.value;
            var linkTextElement = document.getElementById("linkText");
            var linkText = linkTextElement.value;
            var linkTitleElement = document.getElementById("linkTitle");
            var linkTitle = linkTitleElement.value;
            var a = document.getElementById("link");

            a.href = url;
            a.innerHTML = linkText;
            a.title = linkTitle;

        }
        `;
        this._sidebarCallback.addToSidebar(form, this._language.get("insertLink"), this.insertLinkSidebarCallback, this._language.get("insertLinkSubmit"),"",script);
    }

    /**
     * gets called when the 'insert Link'-Button is pressed
     */
    public insertLinkSidebarCallback = async (params) => {
        var stringToInsert: string;
        if (params.linkTitle.value !== "") {
            stringToInsert = `[${params.linkText.value}](${params.url.value} "${params.linkTitle.value}") `;
        } else {
            stringToInsert = `[${params.linkText.value}](${params.url.value}) `;
        }
        await this._helper.insertStringAtStartOfSelection(stringToInsert);
    }

    /**
     * Makes the current text bold.
     */
    public bold = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("**", "**");
        this._helper.focusDocument(); //Puts focus back to the text editor

    }

    /**
     * Makes the current text italic.
     */
    public italic = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("*", "*");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Makes the current text strikethrough.
     */
    public strikethrough = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("~~", "~~");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }


}