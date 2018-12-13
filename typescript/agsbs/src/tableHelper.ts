import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Language from './languages';

export default class TableHelper {
    private _language: Language;
    constructor() {
        this._language = new Language;
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
    public generateTable(hasHeader: boolean, rawdata: any,tableType?: string, extraTableStartText?:string) {
        var horizontalChar = null;
        var verticalChar = null;
        var crossChar = null;
        var headerSeperatorChar = null;
        var tableTypeName = "";
        var data;
        if(extraTableStartText === undefined){
            extraTableStartText = "";
        } else {
            extraTableStartText = " " + extraTableStartText;
        }

        if(tableType === undefined || tableType === ""){
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
        } else {
            data = rawdata;
            console.log(data);
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
            console.log(returnString);
            
            returnString = "<!-- " + tableTypeName + " TABLE START"+extraTableStartText+" -->\n\n" + returnString + "\n\n<!-- " + tableTypeName + " TABLE END -->";
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
            if(rowArray.length>1 && (i!==(rowArray.length-1))){
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



}