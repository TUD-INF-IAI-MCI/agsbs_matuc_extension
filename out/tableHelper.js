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
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const languages_1 = require("./languages");
const helper_1 = require("./helper");
class TableHelper {
    constructor() {
        this._language = new languages_1.default;
        this._helper = new helper_1.default;
        this.tableStartMarker = "TABLE START TYPE";
        this.tableEndMarker = "TABLE END";
    }
    /**
     * Generates a Markdown table
     * @param hasHeader boolean if the first row is a header
     * @param rawdata raw json in string form
     * @returns string of a Markdown-table
     * @param tableType optional. The type of the table
     * @param extraTableStartText optional. Extra Text at the starting comment
     * @returns String of the table
     */
    generateTable(hasHeader, rawdata, tableType, extraTableStartText) {
        var horizontalChar = null;
        var verticalChar = null;
        var crossChar = null;
        var headerSeperatorChar = null;
        var tableTypeName = "";
        var data;
        if (extraTableStartText === undefined) {
            extraTableStartText = "";
        }
        else {
            extraTableStartText = " " + extraTableStartText;
        }
        if (tableType === undefined || tableType === "") {
            tableType = "gridTable";
        }
        if (tableType === "gridTable") {
            horizontalChar = "-";
            verticalChar = "|";
            crossChar = "+";
            headerSeperatorChar = "=";
            tableTypeName = "GRID";
        }
        if (tableType === "pipeTable") {
            verticalChar = "|";
            crossChar = "|";
            headerSeperatorChar = "-";
            tableTypeName = "PIPE";
        }
        if (tableType === "simpleTable") {
            verticalChar = "  ";
            crossChar = "  ";
            headerSeperatorChar = "-";
            tableTypeName = "SIMPLE";
        }
        if (rawdata.length === 0) {
            console.log("empty");
            data = JSON.parse('[[""]]');
        }
        else {
            data = rawdata;
            var lengths = this.determineRowsLength(data);
            var returnString = "";
            if (horizontalChar !== null) { //At beginning of Table
                returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
            }
            for (var i = 0; i < data.length; i++) { //iterating through the rows of the data
                var thisRow = data[i];
                returnString += this._generateRowMarkdown(thisRow, verticalChar, lengths) + "\n"; //the first line
                if (i === 0 && data.length > 1 && hasHeader === true) {
                    returnString += this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                }
                else {
                    if (i === 0 && data.length > 1 && hasHeader === false && tableType !== "gridTable") {
                        returnString += this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                    }
                    else {
                        if (horizontalChar !== null) {
                            returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
                        }
                    }
                }
            }
            console.log(returnString);
            returnString = "<!-- " + this.tableStartMarker + " " + tableTypeName + "" + extraTableStartText + " -->\n\n" + returnString + "\n<!-- " + tableTypeName + " " + this.tableEndMarker + " -->";
            return returnString;
        }
    }
    /**
     * Generates the Markdown-code of a single line of a table with content
     * @param horizontalChar the Character that seperates the lines horizontally
     * @param crossChar the cross between a horizontal and a vertical line
     * @param lengths array of lengths of the columns
     * @returns a string of Markdown-code
     */
    _generateRowMarkdown(row, verticalChar, lengths) {
        var returnString = "";
        var rowArray = this._generateMultipleRowArrayFromRowWithPotentiallyMultipleLines(row);
        for (var i = 0; i < rowArray.length; i++) {
            row = rowArray[i];
            if (verticalChar === null) {
                verticalChar = ""; //fallback
            }
            if (verticalChar !== "  ") { //using simple tables, the first blank spaces are not added, just while using the other ones
                returnString += verticalChar;
            }
            for (var j = 0; j < row.length; j++) {
                var thisCellContent = row[j];
                var thisLength = lengths[j];
                returnString += thisCellContent;
                if ((thisLength - thisCellContent.length) === 0 && thisLength === 0) {
                    returnString += " "; //Add one whitespace if Cell is empty
                }
                while ((thisLength - thisCellContent.length) > 0) {
                    returnString += " "; //Fill the remaining space with whitespace
                    thisLength -= 1;
                }
                returnString += verticalChar;
            }
            if (rowArray.length > 1 && (i !== (rowArray.length - 1))) {
                returnString += "\n";
            }
        }
        return returnString;
    }
    /**
     * Generates an array of array of an array that containes line breaks, so that they are underneath each other.
     * This is used for generating tables where individual cells can contain line breaks.
     * @param row Array of strings
     * @returns Array of an array of strings
     */
    _generateMultipleRowArrayFromRowWithPotentiallyMultipleLines(row) {
        var returnArray = [];
        var maxRowLength = 0;
        var maxColLength = row.length;
        for (var i = 0; i < maxColLength; i++) {
            var thisCell = row[i];
            var stringParts = thisCell.split("\n");
            for (var j = 0; j < stringParts.length; j++) {
                var thisStringPart = stringParts[j];
                if (returnArray[j] === undefined) {
                    returnArray[j] = [];
                }
                returnArray[j][i] = thisStringPart;
            }
            if (maxRowLength < stringParts.length) {
                maxRowLength = stringParts.length; //Max Rows
            }
        }
        for (var rowNumber = 0; rowNumber < maxRowLength; rowNumber++) {
            for (var colNumber = 0; colNumber < maxColLength; colNumber++) {
                thisCell = returnArray[rowNumber][colNumber];
                if (thisCell === null || thisCell === undefined) {
                    returnArray[rowNumber][colNumber] = "";
                }
            }
        }
        return (returnArray);
    }
    /**
     * generates Markdown-code of the seperator line of a table
     * @param horizontalChar the Character that seperates the lines horizontally
     * @param crossChar the cross between a horizontal and a vertical line
     * @param lengths array of lengths of the columns
     * @returns string of Markdown-code
     */
    _generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) {
        var returnString = "";
        if (horizontalChar !== null) {
            if (crossChar === null) {
                crossChar = horizontalChar; //Backup if crosschar is not defined
            }
            returnString += crossChar; //crosschar at beginning of line
            for (var l = 0; l < lengths.length; l++) {
                var thisLengthSegmentNumber = lengths[l];
                if (thisLengthSegmentNumber === 0) {
                    returnString += horizontalChar;
                }
                while (thisLengthSegmentNumber > 0) {
                    returnString += horizontalChar;
                    thisLengthSegmentNumber -= 1;
                }
                returnString += crossChar;
            }
            return returnString;
        }
        else {
            return (""); //if no horizontal split is defined
        }
    }
    /**
     * Determines the max length of every column of a table
     * @param data A array of arrays of strings, like [["A","",""],["","BB",""],["","","CCC"]]
     * @returns array of max lengths of every column
     */
    determineRowsLength(data) {
        if (data.length === 0) {
            return 0;
        }
        var lengthArray = [];
        for (var i = 0; i < data.length; i++) {
            var thisRow = data[i];
            for (var j = 0; j < thisRow.length; j++) {
                var thisCell = thisRow[j];
                if (lengthArray[j] === undefined) {
                    lengthArray[j] = 0;
                }
                var thisCurrentMaxLength = lengthArray[j];
                if (thisCell.length > thisCurrentMaxLength) {
                    lengthArray[j] = thisCell.length;
                }
            }
        }
        return lengthArray;
    }
    /**
 * Gets all tables in a folder relative to the currently open file
 * @param path path to the folder
 * @param folder optional. the name of the folder, for example 'tables'
 * @returns Array of objects of files. The objects have the structure
 * {fileName:'tabelle.csv', folderPath:'/Users/.../dir/tabellen', completePath:'/Users/.../dir/tabellen/tabelle.csv', relativePath:'./tabellen/tabelle.csv'}
 */
    getAllTablesInFolder(pathToFolder, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (folder === undefined) {
                    folder = yield this.getTableFolderName();
                }
                var folderPath = path.join(pathToFolder.toString(), folder);
                var allFilesArray = [];
                if (fs.existsSync(folderPath)) {
                    fs.readdir(folderPath, (err, files) => {
                        files.forEach(file => {
                            if (this.isTable(file) === true) {
                                var completePath = path.join(folderPath, file);
                                var relativePath = "." + path.sep + folder + path.sep + file; //generate the relative file path, path.sep gives the OS folder seperator
                                var newFileObject = { fileName: file, folderPath: folderPath, completePath: completePath, relativePath: relativePath };
                                allFilesArray.push(newFileObject);
                            }
                        });
                        if (err) {
                            vscode.window.showErrorMessage(this._language.get("error"));
                        }
                        if (allFilesArray.length === 0) {
                            vscode.window.showErrorMessage(this._language.get("thereAreNoTableInFolder") + folderPath);
                        }
                        resolve(allFilesArray);
                    });
                }
                else {
                    vscode.window.showErrorMessage(this._language.get('thereAreNoTableInFolder') + folderPath);
                    //If there is no picture folder
                }
            }));
        });
    }
    /**
 * Gets the name of the default table folder
 * @returns String of the picture folder
 */
    getTableFolderName() {
        return __awaiter(this, void 0, void 0, function* () {
            return "tabellen";
            //TODO: Add an alternative with config
        });
    }
    /**
 * Checks if the given string of a file name is a file extension of a table
 * @param filename string of the file name
 * @returns true if the file is a table, otherwise false
 */
    isTable(filename) {
        var ext = this._getFileExtension(filename);
        switch (ext.toLowerCase()) {
            case 'csv':
                //etc
                return true;
        }
        return false;
    }
    /**
 * Gets the extension of a given file, like 'table.csv' returns 'csv'
 * @param filename string of the file name
 * @returns the string of the file extension
 */
    _getFileExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
    /**
     * Generates the HTML neccessary for the file selection in the sidebar.
     * @param files an array of files objects, as it is produced by the getAllTablesInFolder function
     * @returns an HTML-String of the file options, like <option value='FILEPATH'>FILENAME</option>...
     */
    generateSelectTableOptionsHTML(files) {
        var returnString = '';
        files.forEach(fileObject => {
            //var markdownReadyRelativePath = fileObject.relativePath.replace(" ","%20"); //Markdown cannot handle Spaces
            //var markdownReadyFileName = fileObject.fileName.replace(" ", "%20");
            //fileObject.markdownReadyRelativePath = markdownReadyRelativePath;
            var json = JSON.stringify(fileObject);
            var myEscapedJSONString = json.replace(/\\n/g, "\\n")
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f"); //replacing all special characters to savely inject the json into the value
            returnString += `<option value='${myEscapedJSONString}'>${fileObject.fileName}</option>`;
            //adding extra attributes that will later be transfered to the params-object, so it can be used later
        });
        return returnString;
    }
    /**
     * Checks if current selection is a table or the cursor is in a table. If true, it returns the selection of the table
     * @param currentTextEditor optional. The given text editor.
     * @param selection optional. The selection to check
     * @returns false if the selection is not a table/ not in a table, returns selection of the table if it is in a table
     */
    getIfSelectionIsInTableAndReturnSelection(currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            var tableStartMarker = "<!-- " + this.tableStartMarker;
            var tableEndMarker = this.tableEndMarker + " -->";
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this._helper.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this._helper.getWordsSelection(currentTextEditor);
            }
            var foundTableStartSelection = yield this._helper.iterateUpwardsToCheckForString(tableStartMarker, currentTextEditor, selection);
            if (foundTableStartSelection === false) {
                return false;
            }
            var foundTableEnd = yield this._helper.iterateDownwardsToCheckForString(tableEndMarker, currentTextEditor, foundTableStartSelection);
            console.log("TABLE END", foundTableEnd);
            return foundTableEnd;
            //
            //});
        });
    }
}
exports.default = TableHelper;
//# sourceMappingURL=tableHelper.js.map