import * as vscode from 'vscode';
import Language from './languages';

export default class TableHelper {
    private _language: Language;
    constructor() {
        this._language = new Language;
    }

    /**
     * Generates a Markdown table
     * @param hasHeader boolean if the first row is a header
     * @param tableType the type of the table
     * @param rawdata raw json in string form
     * @returns string of a Markdown-table
     */
    public generateTable(hasHeader: boolean, tableType: string, rawdata: any) {
        var horizontalChar = null;
        var verticalChar = null;
        var crossChar = null;
        var headerSeperatorChar = null;
        if (tableType === "gridTable") {
            horizontalChar = "-";
            verticalChar = "|";
            crossChar = "+";
            headerSeperatorChar = "=";
        }
        if (tableType === "pipeTable") {
            verticalChar = "|";
            crossChar = "|";
            headerSeperatorChar = "-";
        }
        if (tableType === "simpleTable") {
            verticalChar = "  ";
            crossChar = "  ";
            headerSeperatorChar = "-";
        }
        if (rawdata.length === 0) {
            console.log("empty");
            data = JSON.parse('[[""]]');
        } else {
            try {
                var data = JSON.parse(rawdata);
            } catch (e) {
                console.log(e);
                return;
            }
            var lengths: any = this.determineRowsLength(data);
            console.log(lengths);
            var returnString = "";
            if (horizontalChar !== null) { //At beginning of Table
                returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
            }
            for (var i = 0; i < data.length; i++) {
                var thisRow = data[i];
                returnString += this._generateRowMarkdown(thisRow, verticalChar, lengths) + "\n";
                if (i === 0 && data.length > 1 && hasHeader === true) {
                    returnString += this._generateHorizontalSplitterMarkdown(headerSeperatorChar, crossChar, lengths) + "\n";
                } else {
                    if (horizontalChar !== null) { //At beginning of Table
                        returnString += this._generateHorizontalSplitterMarkdown(horizontalChar, crossChar, lengths) + "\n";
                    }
                }

            }
            console.log(returnString);
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
        return returnString;
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


}