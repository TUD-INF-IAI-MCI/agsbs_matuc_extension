import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Language from './languages';
import Helper from './helper';
import * as Papa from 'papaparse';
import { start } from 'repl';
import SettingsHelper from './settingsHelper';

export default class TableHelper {
    private _language: Language;
    private _helper: Helper;
    public tableStartMarker: string;
    public tableEndMarker: string;
    private _settings :SettingsHelper;
    constructor() {
        this._language = new Language;
        this._helper = new Helper;
        this._settings = new SettingsHelper;
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
    public generateTable(hasHeader: boolean, rawdata: any, tableType?: string, extraTableStartText?: string) {
        var horizontalChar = null;
        var verticalChar = null;
        var crossChar = null;
        var headerSeperatorChar = null;
        var tableTypeName = "";
        var data;
        var hasHeaderString = "NO HEADER";
        if (hasHeader === true) {
            hasHeaderString = "HAS HEADER";
        }

        if (extraTableStartText === undefined) {
            extraTableStartText = "";
        } else {
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
            data = JSON.parse('[[""]]');
        } else {
            data = rawdata;
            var lengths: any = this.determineRowsLength(data);
            var returnString = "";
            if (horizontalChar !== null) { //At beginning of Table
                returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
            }
            for (var i = 0; i < data.length; i++) { //iterating through the rows of the data
                var thisRow = data[i];
                returnString += this._generateRowMarkdown(thisRow, verticalChar, lengths) + "\n"; //the first line
                if (i === 0 && data.length > 1 && hasHeader === true) {
                    returnString += this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                } else {
                    if (i === 0 && data.length > 1 && hasHeader === false && tableType !== "gridTable") {
                        returnString += this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                    } else {
                        if (horizontalChar !== null) {
                            returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
                        }
                    }
                }

            }


            returnString = "<!-- " + this.tableStartMarker + " " + tableTypeName + " " + hasHeaderString + "" + extraTableStartText + " -->\n\n" + returnString + "\n<!-- " + tableTypeName + " " + this.tableEndMarker + " -->";
            return returnString;

        }
    }
    /**
     * Generates a CSV-File from a Array of an Array of data and saves it as a new file.
     * @param data array of an array of data
     * @param header optional. Boolean if the table has a header
     * @returns file path
     */
    public async generateCSVfromJSONandSave(data: any, header?: boolean) {
        return new Promise(async (resolve, reject) => {
            var returnResult: any = false;
            var result: any = await this.generateCSVfromJSON(data, header);
            if (result !== undefined && result !== "") {
                try {
                    returnResult = await this.writeCSVFile(result);
                } catch (e) {
                    console.log(e);
                    resolve(false);
                }
                resolve(returnResult);
            }
        });
    }

    /**
     * generates a CSV-String from JSON
     * @param data an array of an array of data
     * @param header optional. Boolean if the table has a header
     * @returns JSON
     */
    public async generateCSVfromJSON(data: any, header?: boolean) {
        var delimiter = await this._settings.get("csvDelimiter");
        return new Promise(async (resolve, reject) => {

            if (header === undefined) {
                header = false;
            }
            var result = await Papa.unparse(data,
                {
                    delimiter: delimiter,
                    header: header,
                }); //TODO: change delimiter to an optional
            resolve(result);
        });
    }

    /**
     * Generates the Markdown-code of a single line of a table with content
     * @param horizontalChar the Character that seperates the lines horizontally 
     * @param crossChar the cross between a horizontal and a vertical line
     * @param lengths array of lengths of the columns
     * @returns a string of Markdown-code
     */
    private _generateRowMarkdown(row: any, verticalChar: string, lengths: any) {
        var returnString: string = "";

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
                    returnString += " ";//Add one whitespace if Cell is empty
                }
                while ((thisLength - thisCellContent.length) > 0) {
                    returnString += " ";//Fill the remaining space with whitespace
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
    private _generateMultipleRowArrayFromRowWithPotentiallyMultipleLines(row) {
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
    private _generateHorizontalSplitterMarkdown(horizontalChar: string, crossChar: string, lengths: any) {
        var returnString: string = "";
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
        } else {
            return (""); //if no horizontal split is defined
        }
    }

    /**
     * Determines the max length of every column of a table
     * @param data A array of arrays of strings, like [["A","",""],["","BB",""],["","","CCC"]]
     * @returns array of max lengths of every column
     */
    public determineRowsLength(data: any) {
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
    public async getAllTablesInFolder(pathToFolder: any, folder?: string) {

        return new Promise(async (resolve, reject) => {
            if (folder === undefined) {
                folder = await this.getTableFolderName();
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

            } else {
                vscode.window.showErrorMessage(this._language.get('thereAreNoTableInFolder') + folderPath);
                //If there is no picture folder
            }
        });
    }
    /**
 * Gets the name of the default table folder
 * @returns String of the picture folder
 */
    public async getTableFolderName() {
        return "tabellen";
        //TODO: Add an alternative with config
    }

    /**
 * Checks if the given string of a file name is a file extension of a table
 * @param filename string of the file name
 * @returns true if the file is a table, otherwise false
 */
    public isTable(filename: string) {
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
    private _getFileExtension(filename: string) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    /**
     * Generates the HTML neccessary for the file selection in the sidebar.
     * @param files an array of files objects, as it is produced by the getAllTablesInFolder function
     * @returns an HTML-String of the file options, like <option value='FILEPATH'>FILENAME</option>...
     */
    public generateSelectTableOptionsHTML(files: any) {
        var returnString: string = '';

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
    public async getIfSelectionIsInTableAndReturnSelection(currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {
        var tableStartMarker = "<!-- " + this.tableStartMarker;
        var tableEndMarker = this.tableEndMarker + " -->";
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        var foundTableStartSelection: any = await this._helper.iterateUpwardsToCheckForString(tableStartMarker, tableEndMarker, currentTextEditor, selection);
        if (foundTableStartSelection === false) {
            return false;
        }
        var foundTableEnd = await this._helper.iterateDownwardsToCheckForString(tableEndMarker, currentTextEditor, foundTableStartSelection);
        return foundTableEnd;
        //
        //});
    }

    /**
     * Writes a CSV File.
     * @param content content of the file as a string
     * @param fileName optional. A custom filename, with or without ".csv". If no fileName is provided, it will be generated from the current date.
     * @param fileBasePath optional. a custom file base path.
     */
    public async writeCSVFile(content: string, fileName?: string, fileBasePath?: string) {
        return new Promise(async (resolve, reject) => {
            if (fileBasePath === undefined) {
                var folderName: string = this.getGeneratedTablesFolderName();
                var folderBasePath: any = await this._helper.getCurrentDocumentFolderPath();
                var fileBasePath = path.join(folderBasePath, folderName);
            }

            if (fileName === undefined) {
                var date = new Date;
                var newFileName = "generatedTable-" + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".csv";
                fileName = newFileName;
            }
            if (!fileName.endsWith(".csv")) {
                fileName += ".csv";
            }
            var thisRelPath = path.join(fileBasePath, fileName);
            var thisPath = path.resolve(thisRelPath);//For cross Platform compatibility, makes absolute path from possibly relative one
            var pathExists = await fs.existsSync(fileBasePath);
            if (pathExists === false) {
                await this._helper.mkDir(fileBasePath);
            }
            var fd = fs.openSync(thisPath, 'w+'); //Open in "add"-Mode
            fs.write(fd, content, (error) => {
                if (error) {
                    vscode.window.showErrorMessage(this._language.get('writingCSVTableFileError'));
                    reject();
                } else {
                    console.log(fileName + " " + this._language.get("hasBeenWritten"));
                    fs.closeSync(fd);
                    resolve(thisPath);
                }
            });
        });
    }

    /**
     * @returns the name of the Folder where the generated tables are
     */
    public getGeneratedTablesFolderName() {
        return "generatedTables";
    }

    public async loadSelectedTable(selection: vscode.Selection, currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        return new Promise(async (resolve, reject) => {
            var tableStartRegex = /<!--\ ?TABLE\ ?START\ ?T?Y?P?E?\ ?(GRID|PIPE|SIMPLE)\ ?(HAS\ ?HEADER|NO\ ?HEADER)[a-zA-Z\ ?]*\ *(\.\/.*)\ -->/;
            var startLineText = currentTextEditor.document.lineAt(selection.start.line).text;
            console.log(startLineText);
            var parts = startLineText.match(tableStartRegex);
            console.log(parts);
            if (parts.length !== 4) { //If The number of matched string parts from the first line is too long or too short
                resolve(false);
            } else {
                var tableType = parts[1];
                var tableHeader = parts[2] === "HAS HEADER";
                var tableSource = parts[3];
                var basePath: any = await this._helper.getCurrentDocumentFolderPath();
                var pathToFile = path.join(basePath, tableSource);
                var fileExists = await this._helper.fileExists(pathToFile);
                if (fileExists === false) {
                    vscode.window.showErrorMessage(this._language.get("errorTableFileNonExistant"));
                    resolve(false);
                }
                var content: any = await this._helper.getContentOfFile(pathToFile);
                content  = content.replace(/\n+$/gm, ""); //removes trailing line breaks. Important, otherwise the resulting array will have weird empty arrays (like [""]) at the end.
                var json = await this._helper.parseCSVtoJSON(content);
                if (json === false) {
                    vscode.window.showErrorMessage(this._language.get("parsingError"));
                    resolve(false);
                }
                console.log(json);
                if (!json.hasOwnProperty("data")) { //If the Result has no "data"-property 
                    vscode.window.showErrorMessage(this._language.get("parsingError"));
                    resolve(false);
                }
                //var jsonString = JSON.stringify(json["data"]);
                var returnObject = {};
                var returnDataObject = {};
                returnDataObject["hasHeader"] = tableHeader;
                returnDataObject["tableType"] = tableType;
                returnDataObject["data"] = json["data"];
                returnObject["data"] = returnDataObject;
                returnObject["file"] = pathToFile;
                console.log(JSON.stringify(returnObject));
                resolve(returnObject);


            }

        });



    }




}