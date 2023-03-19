/**
 * @author  Lucas Vogel
 */
import * as vscode from "vscode";
import Helper from "./helper/helper";
import Language from "./languages";
import Sidebar from "./sidebar";
import Taskbar from "./taskbar";
import ImageHelper from "./helper/imageHelper";
import MatucCommands from "./matucCommands";
import EditorFunctionSnippets from "./snippets/editorFunctionsSnippets";
import TableHelper from "./helper/tableHelper";
import * as Papa from "papaparse";
import * as path from "path";
import ListHelper from "./helper/listHelper";
import InsertHelper from "./helper/insertHelper";
import HeadlineHelper from "./helper/headlineHelper";
import SettingsHelper from "./helper/settingsHelper";
import { showNotification } from "./helper/notificationHelper";
import GitCommands from "./gitCommands";
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
    private _gitCommands: GitCommands;

    constructor(taskbarCallback, sidebarCallback, context) {
        this._helper = new Helper();
        this._imageHelper = new ImageHelper(context);
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new Language();
        this._matucCommands = new MatucCommands(sidebarCallback);
        this._snippets = new EditorFunctionSnippets();
        this._tableHelper = new TableHelper();
        this._listHelper = new ListHelper();
        this._insertHelper = new InsertHelper();
        this._headlineHelper = new HeadlineHelper();
        this._settings = new SettingsHelper();
        this._gitCommands = new GitCommands();
    }

    /**
     * Setup of the Editor Functions. Here taskbar edit-buttons can be added.
     */
    public setup = () => {
        this._taskbarCallback.addButton(
            "bold.svg",
            this._language.get("bold"),
            this.bold,
            this._language.get("emphasis"),
            "agsbs.bold"
        );
        this._taskbarCallback.addButton(
            "italic.svg",
            this._language.get("italic"),
            this.italic,
            this._language.get("emphasis"),
            "agsbs.italic"
        );
        this._taskbarCallback.addButton(
            "strikethrough.svg",
            this._language.get("strikethrough"),
            this.strikethrough,
            this._language.get("emphasis"),
            "agsbs.strikethrough"
        );

        this._taskbarCallback.addButton(
            "h.svg",
            this._language.get("headline"),
            this.headline,
            this._language.get("headline"),
            "agsbs.h"
        );
        this._taskbarCallback.addButton(
            "h1.svg",
            this._language.get("headline1"),
            this.h1,
            this._language.get("headline"),
            "agsbs.h1"
        );
        this._taskbarCallback.addButton(
            "h2.svg",
            this._language.get("headline2"),
            this.h2,
            this._language.get("headline"),
            "agsbs.h2"
        );
        this._taskbarCallback.addButton(
            "h3.svg",
            this._language.get("headline3"),
            this.h3,
            this._language.get("headline"),
            "agsbs.h3"
        );
        this._taskbarCallback.addButton(
            "h4.svg",
            this._language.get("headline4"),
            this.h4,
            this._language.get("headline"),
            "agsbs.h4"
        );
        this._taskbarCallback.addButton(
            "h5.svg",
            this._language.get("headline5"),
            this.h5,
            this._language.get("headline"),
            "agsbs.h5"
        );
        this._taskbarCallback.addButton(
            "h6.svg",
            this._language.get("headline6"),
            this.h6,
            this._language.get("headline"),
            "agsbs.h6"
        );

        this._taskbarCallback.addButton(
            "numbered_list.svg",
            this._language.get("orderedList"),
            this.orderedList,
            this._language.get("list"),
            "agsbs.numberedList"
        );
        this._taskbarCallback.addButton(
            "list.svg",
            this._language.get("unorderedList"),
            this.unorderedList,
            this._language.get("list"),
            "agsbs.list"
        );

        this._taskbarCallback.addButton(
            "table.svg",
            this._language.get("insertTable"),
            this.insertTable,
            this._language.get("table"),
            "agsbs.table"
        );
        this._taskbarCallback.addButton(
            "import_table_csv.svg",
            this._language.get("importTableCsv"),
            this.insertCSVTable,
            this._language.get("table"),
            "agsbs.importTableCSV"
        );
        this._taskbarCallback.addButton(
            "edit_table.svg",
            this._language.get("editTable"),
            this.editTable,
            this._language.get("table"),
            "agsbs.editTable"
        );
        this._taskbarCallback.addButton(
            "deleteTable.svg",
            this._language.get("deleteTable"),
            this.deleteTable,
            this._language.get("table"),
            "agsbs.deleteTable"
        );

        this._taskbarCallback.addButton(
            "formula.svg",
            this._language.get("formula"),
            this.formula,
            this._language.get("formatting"),
            "agsbs.formula"
        );
        this._taskbarCallback.addButton(
            "inline_formula.svg",
            this._language.get("formulaInline"),
            this.inlineFormula,
            this._language.get("formatting"),
            "agsbs.inlineFormula"
        );
        this._taskbarCallback.addButton(
            "code.svg",
            this._language.get("code"),
            this.code,
            this._language.get("formatting"),
            "agsbs.code"
        );
        this._taskbarCallback.addButton(
            "quote.svg",
            this._language.get("blockquote"),
            this.blockquote,
            this._language.get("formatting"),
            "agsbs.quote"
        );

        this._taskbarCallback.addButton(
            "link.svg",
            this._language.get("insertLink"),
            this.insertLink,
            this._language.get("insert"),
            "agsbs.link"
        );
        this._taskbarCallback.addButton(
            "image.svg",
            this._language.get("insertGraphic"),
            this.insertImage,
            this._language.get("insert"),
            "agsbs.image"
        );
        this._taskbarCallback.addButton(
            "footnote.svg",
            this._language.get("insertFootnote"),
            this.insertFootnote,
            this._language.get("insert"),
            "agsbs.footnote"
        );
        this._taskbarCallback.addButton(
            "annotation.svg",
            this._language.get("authorAnnotation"),
            this.insertAnnotation,
            this._language.get("insert"),
            "agsbs.annotation"
        );

        this._taskbarCallback.addButton(
            "hr.svg",
            this._language.get("horizontalRule"),
            this.insertHorizontalRule,
            this._language.get("separator"),
            "agsbs.hr"
        );
        this._taskbarCallback.addButton(
            "new_page.svg",
            this._language.get("newPage"),
            this.addNewPage,
            this._language.get("separator"),
            "agsbs.newPage"
        );
    };

    /**
     * Inserts a headline with a computed grade.
     * It tries to smartly match what the next headline could be.
     */
    public headline = async () => {
        const result = await this._headlineHelper.getNextHeadlineString();

        const headlineGrade: number = (result.match(/\#/g) || []).length;
        showNotification({ message: this._language.get("headlineInsertedWithGrade") + headlineGrade });
        this._headlineHelper.setSpecificHeadline(headlineGrade);
    };

    /**
     * Inserts a headline with grade 1
     */
    public h1 = async () => {
        this._headlineHelper.setSpecificHeadline(1);
    };

    /**
     * Inserts a headline with grade 2
     */
    public h2 = async () => {
        this._headlineHelper.setSpecificHeadline(2);
    };

    /**
     * Inserts a headline with grade 3
     */
    public h3 = async () => {
        this._headlineHelper.setSpecificHeadline(3);
    };

    /**
     * Inserts a headline with grade 4
     */
    public h4 = async () => {
        this._headlineHelper.setSpecificHeadline(4);
    };

    /**
     * Inserts a headline with grade 5
     */
    public h5 = async () => {
        this._headlineHelper.setSpecificHeadline(5);
    };

    /**
     * Inserts a headline with grade 6
     */
    public h6 = async () => {
        this._headlineHelper.setSpecificHeadline(6);
    };

    /**
     * Inserts a new Page identifier. It uses Matuc to determine what Page it is.
     */
    public addNewPage = async () => {
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        if (currentTextEditor.document.isDirty) {
            await currentTextEditor.document.save();
            showNotification({ message: this._language.get("documentHasBeenSaved") });
        }
        const matucIsInstalled = await this._matucCommands.matucIsInstalled();
        if (!matucIsInstalled) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        const result = await this._matucCommands.addPageNumber();

        if (!result.includes("|| - ")) {
            vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
            return;
        }
        const insertText = "\n" + result + "\n";
        this._helper.insertStringAtStartOfLine(insertText);
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Inserts a horizontal rule.
     */
    public insertHorizontalRule = async () => {
        const text = "\n---\n\n";
        const insertPosition = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (!insertPosition) {
            await this._helper.insertStringAtStartOfLineOrLinebreak(text);
            return;
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            const thisCurrentEditor = await this._helper.getCurrentTextEditor();
            const newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(text, thisCurrentEditor, newEndPosition);
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Adds the 'add Annotation'-Dialogue to to the sidebar.
     */
    public insertAnnotation = async () => {
        const settingsTextboxTitleIsOptional = await this._settings.get("optionalTextboxTitle");
        const settingsTextboxContentIsOptional = await this._settings.get("optionalTextboxContent");
        let html = this._snippets.get("insertAnnotationHTMLPart1");
        if (!settingsTextboxTitleIsOptional) {
            html += "required='true'";
        }
        html += this._snippets.get("insertAnnotationHTMLPart2");
        if (!settingsTextboxContentIsOptional) {
            html += "required='true'";
        }
        html += this._snippets.get("insertAnnotationHTMLPart3");

        const script = this._snippets.get("insertAnnotationSCRIPT");
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("insertTextbox"),
            callback: this.insertAnnotationSidebarCallback,
            buttonText: this._language.get("insert"),
            script
        });
    };

    /**
     * Adds an specified annotation to the text.
     */
    public insertAnnotationSidebarCallback = async (params: {
        annotationType: { value: string };
        color: { value: string };
        titleOfBox: { value: string };
        contentOfBox: { value: string };
    }): Promise<void> => {
        const annotationType = params.annotationType.value;
        const color = params.color.value;
        const title = params.titleOfBox.value;
        const content = params.contentOfBox.value;
        let text = "";
        if (annotationType === "textFrame") {
            text = `<div class="frame ${color}">\n`;
            if (title !== "") {
                text += `<span class="title">${title}</span>\n`;
            }
            text += `${content}\n`;
            text += `</div>\n`;
        }
        if (annotationType === "textBox") {
            text = `<div class="box ${color}">\n`;
            if (title !== "") {
                text += `<span class="title">${title}</span>\n`;
            }
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
        const insertPosition = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (!insertPosition) {
            await this._helper.insertStringAtStartOfLineOrLinebreak(text);
            return;
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            const thisCurrentEditor = await this._helper.getCurrentTextEditor();
            const newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(text, thisCurrentEditor, newEndPosition);
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Adds the form dialogue to the sidebar
     */
    public insertFootnote = async () => {
        const html = this._snippets.get("insertFootnoteHTML");
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("insertFootnote"),
            callback: this.insertFootnoteSidebarCallback,
            buttonText: this._language.get("insertFootnote")
        });
    };

    /**
     * Adds a specified footnote to the text.
     */
    public insertFootnoteSidebarCallback = async (params: {
        footLabel: { value: string };
        footText: { value: string };
    }): Promise<void | boolean> => {
        const label = params.footLabel.value;
        const text = params.footText.value;
        const currentLineLabel = "[^" + label + "]";
        const includesLabel = await this._insertHelper.checkDocumentForString(currentLineLabel);

        if (text.includes("[") || text.includes("]") || text.includes("^")) {
            vscode.window.showErrorMessage(this._language.get("footLabelError"));
            return false;
        }
        if (includesLabel) {
            vscode.window.showErrorMessage(this._language.get("footLabelErrorDetail"));
            return false;
        }
        const pageEndLabel = "\n" + currentLineLabel + ": " + text + "\n";
        const endPoint = await this._insertHelper.getPageEndLine();
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const selection = this._helper.getPrimarySelection(currentTextEditor);
        const position = new vscode.Range(selection.active, selection.end);
        await this._helper.insertStringAtStartOfSelection(currentLineLabel, undefined, position);
        if (endPoint === false) {
            this._helper.insertStringAtStartOfLineOrLinebreak(pageEndLabel);
        } else {
            const newEndSelection = new vscode.Selection(endPoint, endPoint);
            await this._helper.insertStringAtStartOfLineOrLinebreak(pageEndLabel, currentTextEditor, newEndSelection);
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Adds a quote identifier at the start of the current line.
     */
    public blockquote = async () => {
        await this._helper.toggleCharactersAtBeginningOfLine("> ");
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Marks the current selection as code.
     */
    public code = async () => {
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const selection = await this._helper.getWordsSelection(currentTextEditor);
        let startInsertText = "```";
        let endInsertText = "```";
        if (selection.start.line !== selection.end.line) {
            startInsertText = "\n" + startInsertText + "\n";
            endInsertText = "\n" + endInsertText;
        }
        await this._helper.multiCursorsToggleCharactersAtStartAndEnd(startInsertText, endInsertText);
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Toggles the current selection as a inline formula
     */
    public inlineFormula = async () => {
        await this._helper.multiCursorsToggleCharactersAtStartAndEnd("$", "$");
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Toggles the current selection as a formula
     */
    public formula = async () => {
        await this._helper.multiCursorsToggleCharactersAtStartAndEnd("$$ ", " $$");
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Toggles a unordered list.
     */
    public unorderedList = async () => {
        this._listHelper.unorderedList();
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Adds a Marker at the current line as a ordered list.
     */
    public orderedList = async () => {
        this._listHelper.orderedList();
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Editing an existing Table
     */
    public editTable = async () => {
        const currentSelection: false | vscode.Selection =
            await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const projectFolder = await this._helper.getFolderFromFilePath(currentTextEditor.document.uri.fsPath);
        if (!currentSelection) {
            vscode.window.showErrorMessage(this._language.get("noTableFound"));
            return;
        } else {
            const selectedTable = (await this._tableHelper.loadSelectedTable(currentSelection)).file;
            const lastIndex = selectedTable.lastIndexOf("\\"); // Find the last occurrence of the backslash character
            //const csvFilename = "./" + selectedTable.slice(lastIndex + 1);
            await this._helper.focusDocument();
            await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(selectedTable));
            const editCsv = vscode.extensions.getExtension("janisdd.vscode-edit-csv");
            editCsv.activate().then(async () => {
                await vscode.commands.executeCommand("edit-csv.edit");
                // watch csv file changes
                const watcher = vscode.workspace.createFileSystemWatcher(selectedTable);
                watcher.onDidChange(async () => {
                    await this._tableHelper.replaceTable(selectedTable, currentTextEditor, currentSelection);
                    const csvFilename = selectedTable.slice(lastIndex + 1);
                    //save md file
                    await currentTextEditor.document.save();
                    //add csv to commit
                    await this._gitCommands.addFile(projectFolder, selectedTable);
                    //add md to commit
                    await this._gitCommands.addFile(projectFolder, currentTextEditor.document.uri.fsPath);
                    await this._gitCommands.commit(this._language.get("tableEditCommit") + csvFilename, projectFolder);
                    //dispose watcher only after edit-csv is closed
                    if (!editCsv.isActive) {
                        watcher.dispose();
                    }
                });
            });
        }
    };

    /**
     * Callback of the Sidebar for editing a table
     */
    public editTableSidebarCallback = async (params: {
        tableHeadCheckbox: { checked: boolean };
        tableType: { value: string };
        tableJSON: { value: string };
        hiddenFileName: { value: string };
    }) => {
        const hasHeader = params.tableHeadCheckbox.checked;
        const tableType = params.tableType.value;
        const rawdata = params.tableJSON.value;
        let data;
        try {
            data = JSON.parse(rawdata);
        } catch (e) {
            console.log(e);
            return;
        }
        const tableData = await this._tableHelper.generateCSVfromJSON(rawdata);
        const fileName: string = params.hiddenFileName.value.replace(/^.*[\\\/]/, "");
        const folderName: string = params.hiddenFileName.value.substr(
            0,
            params.hiddenFileName.value.lastIndexOf("/") - 1
        );
        const defaultGeneratedFolderName: string = await this._tableHelper.getTableFolderName();
        let savedTable;
        if (folderName === defaultGeneratedFolderName) {
            savedTable = await this._tableHelper.writeCSVFile(tableData, fileName);
        } else {
            savedTable = await this._tableHelper.writeCSVFile(tableData);
            //if table exists in other folder, generate new Name, because the file could potentially already exists
            // with that name so no other file will be overridden by accident
        }
        showNotification({ message: this._language.get("filehasBeenWritten") + params.hiddenFileName.value });
        let extraText = "";
        if (savedTable) {
            const relSavedTablePathParts = savedTable.split(path.sep);
            const relSavedTablePath =
                "." +
                path.sep +
                relSavedTablePathParts[relSavedTablePathParts.length - 2] +
                path.sep +
                relSavedTablePathParts[relSavedTablePathParts.length - 1];
            extraText = "exported to " + relSavedTablePath;
        }
        const table = this._tableHelper.generateTable(hasHeader, data, tableType, extraText);
        const insertSelection = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (!insertSelection) {
            vscode.window.showErrorMessage(this._language.get("originalTableNotFound"));
            this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            this._helper.replaceSelection(table, insertSelection);
        }
    };

    //Selects and Deletes Table in Markdown when cursor is between the comments of the Table
    public deleteTable = async () => {
        const insertSelection = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (!insertSelection) {
            vscode.window.showErrorMessage(this._language.get("noTableFound"));
        } else {
            //Get ./generatedTable/example.csv from the comment and delete the csv
            const tableData = await this._tableHelper.loadSelectedTable(insertSelection);
            const tablePath = tableData["file"];
            await this._tableHelper.deleteCSVFile(tablePath);
            this._helper.replaceSelection("", insertSelection);
        }
    };

    /**
     * Insert a Table from a CSV-File
     */
    public insertCSVTable = async () => {
        const thisPath = await this._helper.getCurrentDocumentFolderPath();
        const results = await this._tableHelper.getAllTablesInFolder(thisPath);
        const selectionTablesHTML = this._tableHelper.generateSelectTableOptionsHTML(results);
        const html = `
        <select name='selectTable'>
        <option selected="true" disabled="disabled" value=''>${this._language.get("selectTable")}</option>
        ${selectionTablesHTML}
        </select>
        `;
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("importTableCsv"),
            callback: this.insertCSVTablesidebar,
            buttonText: this._language.get("insert")
        });
    };

    /**
     * Callback for insert a table from a CSV-File
     */
    public insertCSVTablesidebar = async (params) => {
        const urlData = params.selectTable.value;
        let url;
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
        let content = await this._helper.getContentOfFile(url.completePath);
        content = content.replace(/\ +$/, "");
        content = content.replace(/\n+$/, ""); //removes trailing spaces and line breaks
        const result = await Papa.parse(content);
        const extraText = this._language.get("importedFrom") + " " + url.relativePath;
        const table = this._tableHelper.generateTable(false, result.data, "", extraText);
        const insertPosition = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (!insertPosition) {
            this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            const thisCurrentEditor = await this._helper.getCurrentTextEditor();
            const newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(table, thisCurrentEditor, newEndPosition);
        }
    };

    /**
     * Insert Table Button Function
     */
    public insertTable = async () => {
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const currentSelection = currentTextEditor.selection;

        if (!currentSelection) {
            vscode.window.showErrorMessage(this._language.get("noCursorFound"));
            return;
        }

        //create empty .csv file in /generatedTables
        const file = await this._tableHelper.writeCSVFile(",\n,");
        await this._helper.focusDocument();
        await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(file));
        //open edit csv extension
        const editCsv = vscode.extensions.getExtension("janisdd.vscode-edit-csv");
        editCsv.activate().then(async () => {
            await vscode.commands.executeCommand("edit-csv.edit");
            // watch file changes
            const watcher = vscode.workspace.createFileSystemWatcher(file);
            const fileContents = await this._helper.getContentOfFile(file);
            watcher.onDidChange(async () => {
                // watcher is triggered in rare case when the file contents did not change
                const fileContentsAfterChange = await this._helper.getContentOfFile(file);
                if (fileContents === fileContentsAfterChange) return;

                await this._tableHelper.replaceTable(file, currentTextEditor, currentSelection);
                // close edit csv extension and csv file
                await vscode.commands.executeCommand("edit-csv.goto-source");
                await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                // close opened csv file window
                await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                watcher.dispose();
            });
        });
    };

    /**
     * Insert Table sidebar Function
     */
    public insertTablesidebar = async (params) => {
        const hasHeader = params.tableHeadCheckbox.checked;
        const tableType = params.tableType.value;
        const rawdata = params.tableJSON.value;
        let data;
        try {
            data = JSON.parse(rawdata);
        } catch (e) {
            console.log(e);
            return;
        }
        const savedTable = await this._tableHelper.generateCSVfromJSONandSave(rawdata);
        let extraText = "";
        if (savedTable) {
            const relSavedTablePathParts = savedTable.split(path.sep);
            const relSavedTablePath =
                "." +
                path.sep +
                relSavedTablePathParts[relSavedTablePathParts.length - 2] +
                path.sep +
                relSavedTablePathParts[relSavedTablePathParts.length - 1];
            extraText = "exported to " + relSavedTablePath;
        }
        const table = this._tableHelper.generateTable(hasHeader, data, tableType, extraText);
        const insertPosition = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if (!insertPosition) {
            this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
            const thisCurrentEditor = await this._helper.getCurrentTextEditor();
            const newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(table, thisCurrentEditor, newEndPosition);
        }
    };

    /**
     * Inserts an Image
     */
    public insertImage = async () => {
        const matucIsInstalled = await this._matucCommands.matucIsInstalled();
        if (!matucIsInstalled) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        const thisPicturesFolderName = await this._imageHelper.getPictureFolderName();
        const thisPath = await this._helper.getCurrentDocumentFolderPath();
        const thisPicturesArray = await this._imageHelper.getAllPicturesInFolder(thisPath, thisPicturesFolderName);
        const allPicturesHTMLString = await this._imageHelper.generateSelectImagesOptionsHTML(thisPicturesArray);
        let html = "";
        const script = this._snippets.get("insertImageScript");
        html +=
            this._snippets.get("insertImageFormPart1") +
            allPicturesHTMLString +
            this._snippets.get("insertImageFormPart2");
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("insertGraphic"),
            callback: this.insertImagesidebar,
            buttonText: this._language.get("insert"),
            script
        });
    };

    /**
     * The Callback for inserting an image from the sidebar, inserts the image
     * @param params parameters given by the callback about the html-elements of the html-form
     */
    public insertImagesidebar = async (params) => {
        let altText = "";
        let pictureTitle = "";
        const pictureSelector = JSON.parse(params.selectPicture.value);
        altText += params.altText.value;
        pictureTitle += params.graphicTitle.value;
        const result = await this._matucCommands.imageDescription(
            altText,
            params.outsourceCheckbox.checked,
            pictureSelector.basePath,
            pictureTitle,
            pictureSelector.markdownReadyRelativePath
        );
        await this._helper.insertStringAtStartOfSelection(result["internal"].verbatim);
        //typescript does not like .internal, so this workaround is used.
        if (result.hasOwnProperty("external")) {
            // if the description is outsourced, the returning JSON has a 'external' property
            let fileName = await this._imageHelper.getPictureFolderName();
            fileName += ".md";
            this._imageHelper.addImageDescriptionToFile(
                pictureSelector.basePath,
                fileName,
                result["external"].verbatim
            );
            //typescript does not like .external, so this workaround is used.
        }
    };

    /**
     * Adds a panel to the sidebar to add a link
     */
    public insertLink = () => {
        const html = this._snippets.get("insertLinkForm");
        const script = `
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
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("insertLink"),
            callback: this.insertLinksidebar,
            buttonText: this._language.get("insertLinkSubmit"),
            script
        });
    };

    /**
     * gets called when the 'insert Link'-Button is pressed
     */
    public insertLinksidebar = async (params) => {
        let stringToInsert: string;
        if (params.linkTitle.value !== "") {
            stringToInsert = `[${params.linkText.value}](${params.url.value} "${params.linkTitle.value}") `;
        } else {
            stringToInsert = `[${params.linkText.value}](${params.url.value}) `;
        }
        await this._helper.insertStringAtStartOfSelection(stringToInsert);
    };

    /**
     * Makes the current text bold.
     */
    public bold = async () => {
        await this._helper.multiCursorsToggleCharactersAtStartAndEnd("**", "**");
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Makes the current text italic.
     */
    public italic = async () => {
        await this._helper.multiCursorsToggleCharactersAtStartAndEnd("_", "_");
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Makes the current text strikethrough.
     */
    public strikethrough = async () => {
        await this._helper.multiCursorsToggleCharactersAtStartAndEnd("~~", "~~");
        this._helper.focusDocument(); //Puts focus back to the text editor
    };
}
