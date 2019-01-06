"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as vscode from 'vscode'
const vscode = require("vscode");
const helper_1 = require("./helper");
const languages_1 = require("./languages");
const imageHelper_1 = require("./imageHelper");
const matucCommands_1 = require("./matucCommands");
const editorFunctionsSnippets_1 = require("./editorFunctionsSnippets");
const tableHelper_1 = require("./tableHelper");
const Papa = require("papaparse");
const path = require("path");
class EditorFunctions {
    constructor(taskbarCallback, sidebarCallback, context) {
        /**
         * Setup of the Editor Functions. Here taskbar-buttons can be added.
         */
        this.setup = () => {
            this._taskbarCallback.addButton("bold.svg", this._language.get("bold"), this.bold, this._language.get("emphasis"));
            this._taskbarCallback.addButton("italic.svg", this._language.get("italic"), this.italic, this._language.get("emphasis"));
            this._taskbarCallback.addButton("strikethrough.svg", this._language.get("strikethrough"), this.strikethrough, this._language.get("emphasis"));
            this._taskbarCallback.addButton('list.svg', this._language.get('unorderedList'), this.unorderedList, this._language.get('list'));
            this._taskbarCallback.addButton('table.svg', this._language.get('insertTable'), this.insertTable, this._language.get('table'));
            this._taskbarCallback.addButton('import_table_csv.svg', this._language.get('importTableCsv'), this.insertCSVTable, this._language.get('table'));
            this._taskbarCallback.addButton("edit_table.svg", this._language.get("editTable"), this.editTable, this._language.get("table"));
            this._taskbarCallback.addButton("formula.svg", this._language.get("formula"), this.formula, this._language.get("formatting"));
            this._taskbarCallback.addButton("inline_formula.svg", this._language.get("formulaInline"), this.inlineFormula, this._language.get("formatting"));
            this._taskbarCallback.addButton("code.svg", this._language.get("code"), this.code, this._language.get("formatting"));
            this._taskbarCallback.addButton("quote.svg", this._language.get("blockquote"), this.blockquote, this._language.get("formatting"));
            this._taskbarCallback.addButton("link.svg", this._language.get("insertLink"), this.insertLink, this._language.get("insert"));
            this._taskbarCallback.addButton('image.svg', this._language.get('insertGraphic'), this.insertImage, this._language.get('insert'));
        };
        this.blockquote = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtBeginningOfLine("> ");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        this.code = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("```\n", "\n```");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        this.inlineFormula = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("$", "$");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        this.formula = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("$$ ", " $$");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Toggles a unordered list.
         */
        this.unorderedList = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtBeginningOfLine("- ");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Editing a existing Table
         */
        this.editTable = () => __awaiter(this, void 0, void 0, function* () {
            var insertPosition = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertPosition === false) {
                vscode.window.showErrorMessage(this._language.get("noTableFound"));
            }
            else {
                var tableData = yield this._tableHelper.loadSelectedTable(insertPosition);
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
        });
        /**
         * Callback of the Sidebar for editing a table
         */
        this.editTableSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            //console.log(params);
            var hasHeader = params.tableHeadCheckbox.checked;
            var tableType = params.tableType.value;
            var rawdata = params.tableJSON.value;
            console.log("rawdata " + rawdata);
            var data;
            try {
                data = JSON.parse(rawdata);
            }
            catch (e) {
                console.log(e);
                return;
            }
            var tableData = yield this._tableHelper.generateCSVfromJSON(rawdata);
            console.log("TABLEData" + tableData);
            //console.log(params.hiddenFileName);
            var fileName = params.hiddenFileName.value.replace(/^.*[\\\/]/, '');
            console.log("TABLE DATA", tableData, "END");
            var savedTable = yield this._tableHelper.writeCSVFile(tableData, fileName);
            var extraText = "";
            if (savedTable !== false) {
                var relSavedTablePathParts = savedTable.split(path.sep);
                var relSavedTablePath = "." + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 2] + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 1];
                extraText = "exported to " + relSavedTablePath;
            }
            var table = this._tableHelper.generateTable(hasHeader, data, tableType, extraText);
            var insertSelection = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertSelection === false) {
                vscode.window.showErrorMessage(this._language.get("originalTableNotFound"));
                this._helper.insertStringAtStartOfLineOrLinebreak(table);
            }
            else {
                this._helper.replaceSelection(table, insertSelection);
            }
        });
        /**
         * Insert a Table from a CSV-File
         */
        this.insertCSVTable = () => __awaiter(this, void 0, void 0, function* () {
            var thisPath = yield this._helper.getCurrentDocumentFolderPath();
            var results = yield this._tableHelper.getAllTablesInFolder(thisPath);
            var selectionTablesHTML = this._tableHelper.generateSelectTableOptionsHTML(results);
            //<input type="text" name="uriTable" placeholder="${this._language.get("uriTable")}"><br><br>
            var form = `
        
        <select name='selectTable'>
        <option selected="true" disabled="disabled" value=''>${this._language.get("selectTable")}</option>
        ${selectionTablesHTML}
        </select>
        `;
            this._sidebarCallback.addToSidebar(form, this._language.get("importTableCsv"), this.insertCSVTableSidebarCallback, this._language.get("insert"));
        });
        /**
         * Callback for insert a table from a CSV-File
         */
        this.insertCSVTableSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var urlData = params.selectTable.value;
            var url;
            if (urlData === "") {
                console.log("No File Selected");
                return false;
            }
            else {
                try {
                    url = JSON.parse(urlData);
                }
                catch (e) {
                    vscode.window.showErrorMessage(this._language.get("importTableFromCsvError"));
                    console.log(e);
                    return false;
                }
            }
            var content = yield this._helper.getContentOfFile(url.completePath);
            content = content.replace(/\ +$/, "");
            content = content.replace(/\n+$/, ""); //removes trailing spaces and line breaks
            var result = yield Papa.parse(content);
            var extraText = this._language.get("importedFrom") + " " + url.relativePath;
            var table = this._tableHelper.generateTable(false, result.data, "", extraText);
            var insertPosition = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertPosition === false) {
                this._helper.insertStringAtStartOfLineOrLinebreak(table);
            }
            else {
                vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
                var thisCurrentEditor = yield this._helper.getCurrentTextEditor();
                var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
                this._helper.insertStringAtStartOfLineOrLinebreak(table, thisCurrentEditor, newEndPosition);
            }
        });
        /**
         * Insert Table Button Function
         */
        this.insertTable = () => __awaiter(this, void 0, void 0, function* () {
            var form = this._snippets.get('insertTableHTML');
            var script = this._snippets.get('insertTableSCRIPT');
            var style = this._snippets.get('insertTableSTYLE');
            this._sidebarCallback.addToSidebar(form, this._language.get("insertTable"), this.insertTableSidebarCallback, this._language.get("insert"), style, script);
        });
        /**
         * Insert Table SidebarCallback Function
         */
        this.insertTableSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var hasHeader = params.tableHeadCheckbox.checked;
            var tableType = params.tableType.value;
            var rawdata = params.tableJSON.value;
            var data;
            try {
                data = JSON.parse(rawdata);
            }
            catch (e) {
                console.log(e);
                return;
            }
            var savedTable = yield this._tableHelper.generateCSVfromJSONandSave(rawdata);
            var extraText = "";
            if (savedTable !== false) {
                var relSavedTablePathParts = savedTable.split(path.sep);
                var relSavedTablePath = "." + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 2] + path.sep + relSavedTablePathParts[relSavedTablePathParts.length - 1];
                extraText = "exported to " + relSavedTablePath;
            }
            var table = this._tableHelper.generateTable(hasHeader, data, tableType, extraText);
            var insertPosition = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertPosition === false) {
                this._helper.insertStringAtStartOfLineOrLinebreak(table);
            }
            else {
                vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
                var thisCurrentEditor = yield this._helper.getCurrentTextEditor();
                var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
                this._helper.insertStringAtStartOfLineOrLinebreak(table, thisCurrentEditor, newEndPosition);
            }
        });
        /**
         * Inserts an Image
         */
        this.insertImage = () => __awaiter(this, void 0, void 0, function* () {
            var thisPicturesFolderName = yield this._imageHelper.getPictureFolderName();
            var thisPath = yield this._helper.getCurrentDocumentFolderPath();
            var thisPicturesArray = yield this._imageHelper.getAllPicturesInFolder(thisPath, thisPicturesFolderName);
            var allPicturesHTMLString = yield this._imageHelper.generateSelectImagesOptionsHTML(thisPicturesArray);
            var form = this._snippets.get('insertImageFormPart1') + allPicturesHTMLString + this._snippets.get('insertImageFormPart2');
            this._sidebarCallback.addToSidebar(form, this._language.get("insertGraphic"), this.insertImageSidebarCallback, this._language.get("insert"));
        });
        /**
         * The Callback for inserting an image from the sidebar, inserts the image
         * @param params parameters given by the callback about the html-elements of the html-form
         */
        this.insertImageSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            //TODO: Fallback if Matuc cannot be loaded
            //stringToInsert = '![' + altText + '](' + pictureSource + ')'; //TODO: Delete
            var altText = "";
            var pictureTitle = "";
            var pictureSelector = JSON.parse(params.selectPicture.value);
            altText += params.altText.value;
            pictureTitle += params.graphicTitle.value;
            var pictureSource = "";
            pictureSource += pictureSelector.markdownReadyRelativePath;
            //console.log(altText, false, pictureSelector.basePath, pictureTitle, pictureSelector.markdownReadyRelativePath);
            var result = yield this._matucCommands.imageDescription(altText, params.outsourceCheckbox.checked, pictureSelector.basePath, pictureTitle, pictureSelector.markdownReadyRelativePath);
            //TODO: Insert only if the selection is at the start of the line, otherwise do a linebreak first
            //TODO: Handle Alternative direct Path 
            yield this._helper.insertStringAtStartOfSelection(result['internal'].verbatim);
            //typescript does not like .internal, so this workaround is used.
            if (result.hasOwnProperty("external")) { // if the description is outsourced, the returning JSON has a 'external' property
                var fileName = yield this._imageHelper.getPictureFolderName();
                fileName += ".md";
                this._imageHelper.addImageDescriptionToFile(pictureSelector.basePath, fileName, result["external"].verbatim);
                //typescript does not like .external, so this workaround is used.
            }
        });
        /**
         * Adds a panel to the sidebar to add a link
         */
        this.insertLink = () => {
            var form = this._snippets.get("insertLinkForm");
            this._sidebarCallback.addToSidebar(form, this._language.get("insertLink"), this.insertLinkSidebarCallback, this._language.get("insertLinkSubmit"));
        };
        /**
         * gets called when the 'insert Link'-Button is pressed
         */
        this.insertLinkSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var stringToInsert;
            if (params.linkTitle.value !== "") {
                stringToInsert = `[${params.linkText.value}](${params.url.value} "${params.linkTitle.value}") `;
            }
            else {
                stringToInsert = `[${params.linkText.value}](${params.url.value}) `;
            }
            yield this._helper.insertStringAtStartOfSelection(stringToInsert);
        });
        /**
         * Makes the current text bold.
         */
        this.bold = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("**", "**");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Makes the current text italic.
         */
        this.italic = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("*", "*");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Makes the current text strikethrough.
         */
        this.strikethrough = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("~~", "~~");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        this._helper = new helper_1.default;
        this._imageHelper = new imageHelper_1.default;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new languages_1.default;
        this._matucCommands = new matucCommands_1.default;
        this._snippets = new editorFunctionsSnippets_1.default;
        this._tableHelper = new tableHelper_1.default;
    }
}
exports.default = EditorFunctions;
//# sourceMappingURL=editorFunctions.js.map