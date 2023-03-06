/**
 * @author  Lucas Vogel
 */

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import Language from "../languages";
import Helper from "./helper";
import * as Papa from "papaparse";
import SettingsHelper from "./settingsHelper";
import { File, TableSelection } from "../types/types";

/**
 * A Helper for all the table functions.
 */
export default class TableHelper {
    private _language: Language;
    private _helper: Helper;
    public tableStartMarker: string;
    public tableEndMarker: string;
    private _settings: SettingsHelper;
    constructor() {
        this._language = new Language();
        this._helper = new Helper();
        this._settings = new SettingsHelper();
        this.tableStartMarker = "TABLE START TYPE"; //Marker to identify the start of a table
        this.tableEndMarker = "TABLE END"; //Marker to identify the end of a table
    }

    /**
     * Gets the name of the default table folder
     * @returns String of the picture folder
     */
    public async getTableFolderName(): Promise<string> {
        let folderString: string = await this._settings.get("tableFolderName");
        if (folderString === "") {
            folderString = "Pictures";
        }
        return folderString;
    }

    /**
     * @returns the name of the Folder where the generated tables are
     */
    public async getGeneratedTablesFolderName() {
        const folderName: string = await this._settings.get("generatedTableFolderName");
        let folderString: string = folderName;
        if (folderString === "") {
            folderString = "generatedTables";
        }
        return folderString;
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
    public generateTable(
        hasHeader: boolean,
        rawdata: string,
        tableType?: string,
        extraTableStartText?: string
    ): string {
        let horizontalChar = null;
        let verticalChar = null;
        let crossChar = null;
        let headerSeperatorChar = null;
        let tableTypeName = "";
        let data;
        let hasHeaderString = "NO HEADER";
        if (hasHeader) {
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
            const lengths = this.determineRowsLength(data);
            let returnString = "";
            if (horizontalChar !== null) {
                //At beginning of Table
                returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
            }
            for (let i = 0; i < data.length; i++) {
                //iterating through the rows of the data
                const thisRow = data[i];
                returnString += this._generateRowMarkdown(thisRow, verticalChar, lengths) + "\n"; //the first line
                if (i === 0 && data.length > 1 && hasHeader) {
                    returnString +=
                        this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                } else {
                    if (i === 0 && data.length > 1 && hasHeader === false && tableType !== "gridTable") {
                        returnString +=
                            this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                    } else {
                        if (horizontalChar !== null) {
                            returnString +=
                                this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
                        }
                    }
                }
            }
            returnString =
                "<!-- " +
                this.tableStartMarker +
                " " +
                tableTypeName +
                " " +
                hasHeaderString +
                "" +
                extraTableStartText +
                " -->\n\n" +
                returnString +
                "\n<!-- " +
                tableTypeName +
                " " +
                this.tableEndMarker +
                " -->";
            return returnString;
        }
    }
    /**
     * Generates a CSV-File from a Array of an Array of data and saves it as a new file.
     * @param data array of an array of data
     * @param header optional. Boolean if the table has a header
     * @returns file path
     */
    public async generateCSVfromJSONandSave(data: string, header?: boolean): Promise<string | boolean> {
        const result = await this.generateCSVfromJSON(data, header);
        if (result !== undefined && result !== "") {
            try {
                return await this.writeCSVFile(result);
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }

    /**
     * generates a CSV-String from JSON
     * @param data an array of an array of data
     * @param header optional. Boolean if the table has a header
     * @returns JSON
     */
    public async generateCSVfromJSON(data: string, header?: boolean): Promise<string> {
        const delimiter = await this._settings.get("csvDelimiter");
        if (!header) {
            header = false;
        }
        const result = await Papa.unparse(data, {
            delimiter: delimiter,
            header: header
        });
        return result;
    }

    /**
     * Generates the Markdown-code of a single line of a table with content
     * @param horizontalChar the Character that seperates the lines horizontally
     * @param crossChar the cross between a horizontal and a vertical line
     * @param lengths array of lengths of the columns
     * @returns a string of Markdown-code
     */
    private _generateRowMarkdown(row: string[], verticalChar: string, lengths: number[]): string {
        let returnString = "";

        const rowArray = this._generateMultipleRowArrayFromRowWithPotentiallyMultipleLines(row);
        for (let i = 0; i < rowArray.length; i++) {
            row = rowArray[i];
            if (verticalChar === null) {
                verticalChar = ""; //fallback
            }
            if (verticalChar !== "  ") {
                //using simple tables, the first blank spaces are not added, just while using the other ones
                returnString += verticalChar;
            }
            for (let j = 0; j < row.length; j++) {
                const thisCellContent = row[j];
                let thisLength = lengths[j];
                returnString += thisCellContent;
                if (thisLength - thisCellContent.length === 0 && thisLength === 0) {
                    returnString += " "; //Add one whitespace if Cell is empty
                }
                while (thisLength - thisCellContent.length > 0) {
                    returnString += " "; //Fill the remaining space with whitespace
                    thisLength -= 1;
                }

                returnString += verticalChar;
            }
            if (rowArray.length > 1 && i !== rowArray.length - 1) {
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
    private _generateMultipleRowArrayFromRowWithPotentiallyMultipleLines(row): string[][] {
        const returnArray = [];
        let maxRowLength = 0;
        let thisCell = "";
        const maxColLength = row.length;
        for (let i = 0; i < maxColLength; i++) {
            thisCell = row[i];
            const stringParts = thisCell.split("\n");

            for (let j = 0; j < stringParts.length; j++) {
                const thisStringPart = stringParts[j];
                if (returnArray[j] === undefined) {
                    returnArray[j] = [];
                }
                returnArray[j][i] = thisStringPart;
            }
            if (maxRowLength < stringParts.length) {
                maxRowLength = stringParts.length; //Max Rows
            }
        }
        for (let rowNumber = 0; rowNumber < maxRowLength; rowNumber++) {
            for (let colNumber = 0; colNumber < maxColLength; colNumber++) {
                thisCell = returnArray[rowNumber][colNumber];
                if (!thisCell) {
                    returnArray[rowNumber][colNumber] = "";
                }
            }
        }
        return returnArray;
    }

    /**
     * generates Markdown-code of the seperator line of a table
     * @param horizontalChar the Character that seperates the lines horizontally
     * @param crossChar the cross between a horizontal and a vertical line
     * @param lengths array of lengths of the columns
     * @returns string of Markdown-code
     */
    private _generateHorizontalSplitterMarkdown(horizontalChar: string, crossChar: string, lengths: number[]) {
        let returnString = "";
        if (horizontalChar !== null) {
            if (crossChar === null) {
                crossChar = horizontalChar; //Backup if crosschar is not defined
            }
            returnString += crossChar; //crosschar at beginning of line
            for (let l = 0; l < lengths.length; l++) {
                let thisLengthSegmentNumber = lengths[l];
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
            return ""; //if no horizontal split is defined
        }
    }

    /**
     * Determines the max length of every column of a table
     * @param data A array of arrays of strings, like [["A","",""],["","BB",""],["","","CCC"]]
     * @returns array of max lengths of every column
     */
    public determineRowsLength(data: string[]): number[] {
        const lengthArray = [];
        for (let i = 0; i < data.length; i++) {
            const thisRow = data[i];
            for (let j = 0; j < thisRow.length; j++) {
                const thisCell = thisRow[j];
                if (lengthArray[j] === undefined) {
                    lengthArray[j] = 0;
                }
                const thisCurrentMaxLength = lengthArray[j];
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
    public async getAllTablesInFolder(pathToFolder: string, folder?: string): Promise<File[]> {
        if (folder === undefined) {
            folder = await this.getTableFolderName();
        }
        const folderPath = path.join(pathToFolder.toString(), folder);
        const allFilesArray: File[] = [];

        if (fs.existsSync(folderPath)) {
            return new Promise((resolve, reject) => {
                fs.readdir(folderPath, (err, files) => {
                    files.forEach((file) => {
                        if (this.isTable(file)) {
                            const completePath = path.join(folderPath, file);
                            const relativePath = "." + path.sep + folder + path.sep + file; //generate the relative file path, path.sep gives the OS folder seperator
                            const newFileObject = {
                                fileName: file,
                                folderPath: folderPath,
                                completePath: completePath,
                                relativePath: relativePath
                            } as File;
                            allFilesArray.push(newFileObject);
                        }
                    });
                    if (err) {
                        vscode.window.showErrorMessage(this._language.get("error"));
                        reject(err);
                    }
                    if (allFilesArray.length === 0) {
                        vscode.window.showErrorMessage(this._language.get("thereAreNoTableInFolder") + folderPath);
                    }
                    resolve(allFilesArray);
                });
            });
        } else {
            vscode.window.showErrorMessage(this._language.get("thereAreNoTableInFolder") + folderPath);
            //If there is no picture folder
        }
    }

    /**
     * Checks if the given string of a file name is a file extension of a table
     * @param filename string of the file name
     * @returns true if the file is a table, otherwise false
     */
    public isTable(filename: string) {
        const ext = this._getFileExtension(filename);
        switch (ext.toLowerCase()) {
            case "csv":
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
        const parts = filename.split(".");
        return parts[parts.length - 1];
    }

    /**
     * Generates the HTML neccessary for the file selection in the sidebar.
     * @param files an array of files objects, as it is produced by the getAllTablesInFolder function
     * @returns an HTML-String of the file options, like <option value='FILEPATH'>FILENAME</option>...
     */
    public generateSelectTableOptionsHTML(files: File[]): string {
        let returnString = "";

        files.forEach((fileObject) => {
            const json = JSON.stringify(fileObject);
            const myEscapedJSONString = json
                .replace(/\\n/g, "\\n")
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
    public async getIfSelectionIsInTableAndReturnSelection(
        currentTextEditor?: vscode.TextEditor,
        selection?: vscode.Selection
    ): Promise<false | vscode.Selection> {
        const tableStartMarker = "<!-- " + this.tableStartMarker;
        const tableEndMarker = this.tableEndMarker + " -->";
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        const foundTableStartSelection = await this._helper.iterateUpwardsToCheckForString(
            tableStartMarker,
            tableEndMarker,
            currentTextEditor,
            selection
        );
        if (foundTableStartSelection === false) {
            return false;
        }
        const foundTableEnd = await this._helper.iterateDownwardsToCheckForString(
            tableEndMarker,
            currentTextEditor,
            foundTableStartSelection
        );
        return foundTableEnd;
    }

    /**
     * Writes a CSV File.
     * @param content content of the file as a string
     * @param fileName optional. A custom filename, with or without ".csv". If no fileName is provided, it will be generated from the current date.
     * @param fileBasePath optional. a custom file base path.
     */
    public async writeCSVFile(content: string, fileName?: string, fileBasePath?: string): Promise<string> {
        if (!fileBasePath) {
            const folderName: string = await this.getGeneratedTablesFolderName();
            const folderBasePath: string = await this._helper.getCurrentDocumentFolderPath();
            fileBasePath = path.join(folderBasePath, folderName);
        }
        if (!fileName) {
            const date = new Date();
            const month = date.getMonth() + 1;
            const newFileName =
                "generatedTable-" +
                date.getFullYear() +
                "-" +
                month +
                "-" +
                date.getDate() +
                "_" +
                date.getHours() +
                "-" +
                date.getMinutes() +
                "-" +
                date.getSeconds() +
                ".csv";
            fileName = newFileName;
        }
        if (!fileName.endsWith(".csv")) {
            fileName += ".csv";
        }
        const thisRelPath = path.join(fileBasePath, fileName);
        const thisPath = path.resolve(thisRelPath); //For cross Platform compatibility, makes absolute path from possibly relative one
        const pathExists = await fs.existsSync(fileBasePath);
        if (!pathExists) {
            await this._helper.mkDir(fileBasePath);
        }
        const fd = fs.openSync(thisPath, "w+"); //Open in "add"-Mode
        content = content.replace(/\\/g, "\\\\");
        return new Promise((resolve, reject) => {
            fs.write(fd, content, (error) => {
                if (error) {
                    vscode.window.showErrorMessage(this._language.get("writingCSVTableFileError"));
                    console.error(error);
                    reject(error);
                } else {
                    console.log(fileName + " " + this._language.get("hasBeenWritten"));
                    fs.closeSync(fd);
                    resolve(thisPath);
                }
            });
        });
    }

    /**
     * Loads the table where the selection is currently in.
     * @param selection current Selection.
     * @param currentTextEditor optional. The TextEditor to work with.
     * @returns a Promise, that resoves to false if no table is found, otherwise a Object with the Table content.
     */
    public async loadSelectedTable(
        selection: vscode.Selection,
        currentTextEditor?: vscode.TextEditor
    ): Promise<TableSelection | string> {
        const delimiter: string = await this._settings.get("csvDelimiter");
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        const tableStartRegex =
            /<!--\ ?TABLE\ ?START\ ?T?Y?P?E?\ ?(GRID|PIPE|SIMPLE)\ ?(HAS\ ?HEADER|NO\ ?HEADER)[a-zA-Z\ ?]*\ *(\.\/.*|\.\\.*)\ -->/;
        let startLineText = currentTextEditor.document.lineAt(selection.start.line).text;
        const pathSep = [
            ["\\", "/"],
            ["/", "\\"]
        ]; //  [[winSep, unixSep],[unixSep, winSep]]
        for (let i = 0; i < pathSep.length; ++i) {
            if (startLineText.includes(pathSep[i][0]) && path.sep === pathSep[i][1]) {
                startLineText = startLineText.replace(pathSep[i][0], pathSep[i][1]);
                break;
            }
        }
        const parts = startLineText.match(tableStartRegex);
        if (parts.length !== 4) {
            //If The number of matched string parts from the first line is too long or too short
            return "";
        } else {
            const tableType = parts[1];
            const tableHeader = parts[2] === "HAS HEADER";
            const tableSource = parts[3];
            const basePath: string = await this._helper.getCurrentDocumentFolderPath();
            const pathToFile = path.join(basePath, tableSource);
            const fileExists = await this._helper.fileExists(pathToFile);
            if (!fileExists) {
                vscode.window.showErrorMessage(this._language.get("errorTableFileNonExistant"));
                return "";
            }
            let content: string = await this._helper.getContentOfFile(pathToFile);
            content = content.replace(/\n+$/gm, ""); //removes trailing line breaks. Important, otherwise the resulting array will have weird empty arrays (like [""]) at the end.
            const json = await this._helper.parseCSVtoJSON(content, delimiter);
            if (!json) {
                vscode.window.showErrorMessage(this._language.get("parsingError"));
                return "";
            }
            if (!json.hasOwnProperty("data")) {
                //If the Result has no "data"-property
                vscode.window.showErrorMessage(this._language.get("parsingError"));
                return "";
            }
            return {
                data: {
                    hasHeader: tableHeader,
                    tableType: tableType,
                    data: json["data"]
                },
                file: pathToFile
            };
        }
    }
    //delete CSVFile with the Path
    public deleteCSVFile(pathToFile: string) {
        fs.unlink(pathToFile, () => {
            "No such file found";
        });
    }
}
