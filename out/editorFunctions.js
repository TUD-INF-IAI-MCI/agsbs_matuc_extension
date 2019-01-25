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
/**
 * @author  Lucas Vogel
 */
const vscode = require("vscode");
const helper_1 = require("./helper/helper");
const languages_1 = require("./languages");
const imageHelper_1 = require("./helper/imageHelper");
const matucCommands_1 = require("./matucCommands");
const editorFunctionsSnippets_1 = require("./snippets/editorFunctionsSnippets");
const tableHelper_1 = require("./helper/tableHelper");
const Papa = require("papaparse");
const path = require("path");
const listHelper_1 = require("./helper/listHelper");
const insertHelper_1 = require("./helper/insertHelper");
const headlineHelper_1 = require("./helper/headlineHelper");
const settingsHelper_1 = require("./helper/settingsHelper");
/**
 * The Main Class to add Buttons and their functionality of the Editor Tools Bar.
 */
class EditorFunctions {
    constructor(taskbarCallback, sidebarCallback, context) {
        /**
         * Setup of the Editor Functions. Here taskbar edit-buttons can be added.
         */
        this.setup = () => {
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
        };
        /**
         * Inserts a headline with a computed grade.
         * It tries to smartly match what the next headline could be.
         */
        this.headline = () => __awaiter(this, void 0, void 0, function* () {
            var result = yield this._headlineHelper.getNextHeadlineString();
            var headlineGrade = (result.match(/\#/g) || []).length;
            vscode.window.showInformationMessage(this._language.get("headlineInsertedWithGrade") + headlineGrade);
            this._headlineHelper.setSpecificHeadline(headlineGrade);
        });
        /**
         * Inserts a headline with grade 1
         */
        this.h1 = () => __awaiter(this, void 0, void 0, function* () {
            this._headlineHelper.setSpecificHeadline(1);
        });
        /**
         * Inserts a headline with grade 2
         */
        this.h2 = () => __awaiter(this, void 0, void 0, function* () {
            this._headlineHelper.setSpecificHeadline(2);
        });
        /**
         * Inserts a headline with grade 3
         */
        this.h3 = () => __awaiter(this, void 0, void 0, function* () {
            this._headlineHelper.setSpecificHeadline(3);
        });
        /**
         * Inserts a headline with grade 4
         */
        this.h4 = () => __awaiter(this, void 0, void 0, function* () {
            this._headlineHelper.setSpecificHeadline(4);
        });
        /**
         * Inserts a headline with grade 5
         */
        this.h5 = () => __awaiter(this, void 0, void 0, function* () {
            this._headlineHelper.setSpecificHeadline(5);
        });
        /**
         * Inserts a headline with grade 6
         */
        this.h6 = () => __awaiter(this, void 0, void 0, function* () {
            this._headlineHelper.setSpecificHeadline(6);
        });
        /**
         * Inserts a new Page identifier. It uses Matuc to determine what Page it is.
         */
        this.addNewPage = () => __awaiter(this, void 0, void 0, function* () {
            var currentTextEditor = yield this._helper.getCurrentTextEditor();
            if (currentTextEditor.document.isDirty) {
                yield currentTextEditor.document.save();
                vscode.window.showInformationMessage(this._language.get("documentHasBeenSaved"));
            }
            var matucIsInstalled = yield this._matucCommands.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var result = yield this._matucCommands.addPageNumber();
            if (result.includes("|| - ") === false) {
                vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
                return;
            }
            var insertText = "\n" + result + "\n";
            this._helper.insertStringAtStartOfLine(insertText);
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Inserts a horizontal rule.
         */
        this.insertHorizontalRule = () => __awaiter(this, void 0, void 0, function* () {
            var text = "\n---\n\n";
            var insertPosition = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertPosition === false) {
                yield this._helper.insertStringAtStartOfLineOrLinebreak(text);
                return;
            }
            else {
                vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
                var thisCurrentEditor = yield this._helper.getCurrentTextEditor();
                var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
                this._helper.insertStringAtStartOfLineOrLinebreak(text, thisCurrentEditor, newEndPosition);
            }
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Adds the 'add Annotation'-Dialogue to to the sidebar.
         */
        this.insertAnnotation = () => __awaiter(this, void 0, void 0, function* () {
            var setttingsTextboxContentIsOptional = yield this._settings.get("optionalTextboxContent");
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
        });
        /**
         * Adds an specified annotation to the text.
         */
        this.insertAnnotationSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
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
            var insertPosition = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertPosition === false) {
                yield this._helper.insertStringAtStartOfLineOrLinebreak(text);
                return;
            }
            else {
                vscode.window.showWarningMessage(this._language.get("tableInsertionPositionConflictWarning"));
                var thisCurrentEditor = yield this._helper.getCurrentTextEditor();
                var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
                this._helper.insertStringAtStartOfLineOrLinebreak(text, thisCurrentEditor, newEndPosition);
            }
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Adds the form dialogue to the sidebar
         */
        this.insertFootnote = () => __awaiter(this, void 0, void 0, function* () {
            var form = this._snippets.get("insertFootnoteHTML");
            this._sidebarCallback.addToSidebar(form, this._language.get("insertFootnote"), this.insertFootnoteSidebarCallback, this._language.get("insertFootnote"));
        });
        /**
         * Adds a specified footnote to the text.
         */
        this.insertFootnoteSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var label = params.footLabel.value;
            var text = params.footText.value;
            var currentLineLabel = "[^" + label + "]";
            var includesLabel = yield this._insertHelper.checkDocumentForString(currentLineLabel);
            if (text.includes("[") || text.includes("]") || text.includes("^")) {
                vscode.window.showErrorMessage(this._language.get("footLabelError"));
                return false;
            }
            if (includesLabel === true) {
                vscode.window.showErrorMessage(this._language.get("footLabelErrorDetail"));
                return false;
            }
            var pageEndLabel = currentLineLabel + ": " + text;
            var endPoint = yield this._insertHelper.getPageEndLine();
            if (endPoint === false) {
                yield this._helper.insertStringAtStartOfLine(currentLineLabel + "\n" + pageEndLabel + "\n");
            }
            else {
                yield this._helper.insertStringAtStartOfLineOrLinebreak(currentLineLabel);
                endPoint = yield this._insertHelper.getPageEndLine();
                var currentTextEditor = yield this._helper.getCurrentTextEditor();
                var newEndSelection = new vscode.Selection(endPoint, endPoint);
                yield this._helper.insertStringAtStartOfLineOrLinebreak(pageEndLabel, currentTextEditor, newEndSelection);
            }
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Adds a quote identifier at the start of the current line.
         */
        this.blockquote = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtBeginningOfLine("> ");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Marks the current selection as code.
         */
        this.code = () => __awaiter(this, void 0, void 0, function* () {
            var currentTextEditor = yield this._helper.getCurrentTextEditor();
            var selection = yield this._helper.getWordsSelection(currentTextEditor);
            var startInsertText = "```";
            var endInsertText = "```";
            if (selection.start.line !== selection.end.line) {
                startInsertText = "\n" + startInsertText + "\n";
                endInsertText = "\n" + endInsertText;
            }
            yield this._helper.toggleCharactersAtStartAndEnd(startInsertText, endInsertText);
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Toggles the current selection as a inline formula
         */
        this.inlineFormula = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.toggleCharactersAtStartAndEnd("$", "$");
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Toggles the current selection as a formula
         */
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
         * Adds a Marker at the current line as a ordered list.
         */
        this.orderedList = () => __awaiter(this, void 0, void 0, function* () {
            this._listHelper.orderedList();
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Editing a existing Table
         */
        this.editTable = () => __awaiter(this, void 0, void 0, function* () {
            var insertPosition = yield this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
            if (insertPosition === false) {
                vscode.window.showErrorMessage(this._language.get("noTableFound"));
                return;
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
            var tableData = yield this._tableHelper.generateCSVfromJSON(rawdata);
            var fileName = params.hiddenFileName.value.replace(/^.*[\\\/]/, '');
            var folderName = params.hiddenFileName.value.substr(0, params.hiddenFileName.value.lastIndexOf("/") - 1);
            var defaultGeneratedFolderName = yield this._tableHelper.getTableFolderName();
            var savedTable;
            if (folderName === defaultGeneratedFolderName) {
                savedTable = yield this._tableHelper.writeCSVFile(tableData, fileName);
            }
            else {
                savedTable = yield this._tableHelper.writeCSVFile(tableData);
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
                vscode.window.showErrorMessage(this._language.get("noFileSelected"));
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
            var matucIsInstalled = yield this._matucCommands.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var thisPicturesFolderName = yield this._imageHelper.getPictureFolderName();
            var thisPath = yield this._helper.getCurrentDocumentFolderPath();
            var thisPicturesArray = yield this._imageHelper.getAllPicturesInFolder(thisPath, thisPicturesFolderName);
            var allPicturesHTMLString = yield this._imageHelper.generateSelectImagesOptionsHTML(thisPicturesArray);
            var form = "";
            form += this._snippets.get('insertImageFormPart1') + allPicturesHTMLString + this._snippets.get('insertImageFormPart2');
            this._sidebarCallback.addToSidebar(form, this._language.get("insertGraphic"), this.insertImageSidebarCallback, this._language.get("insert"));
        });
        /**
         * The Callback for inserting an image from the sidebar, inserts the image
         * @param params parameters given by the callback about the html-elements of the html-form
         */
        this.insertImageSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var altText = "";
            var pictureTitle = "";
            var pictureSelector = JSON.parse(params.selectPicture.value);
            altText += params.altText.value;
            pictureTitle += params.graphicTitle.value;
            var pictureSource = "";
            pictureSource += pictureSelector.markdownReadyRelativePath;
            var result = yield this._matucCommands.imageDescription(altText, params.outsourceCheckbox.checked, pictureSelector.basePath, pictureTitle, pictureSelector.markdownReadyRelativePath);
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
        this._listHelper = new listHelper_1.default;
        this._insertHelper = new insertHelper_1.default;
        this._headlineHelper = new headlineHelper_1.default;
        this._settings = new settingsHelper_1.default;
    }
}
exports.default = EditorFunctions;
//# sourceMappingURL=editorFunctions.js.map