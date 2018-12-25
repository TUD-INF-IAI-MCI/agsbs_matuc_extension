import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Language from './languages';



export default class EditorFunctionSnippets {
    private _language: Language;
    private d:any;
    constructor() {

        this._language = new Language;
        this.d=[];
        
        this.d['insertLinkForm'] = `<label for='url'>${this._language.get("link")}</label><br>
                      <input type='text' id='url' name='url' required><br>
                      <label for='linkText'>${this._language.get("linkText")}</label><br>
                      <input type='text' id='linkText' name='linkText'><br>
                      <label for='linkTitle'>${this._language.get("linkTitle")}</label><br>
                      <input type='text' id='linkTitle' name='linkTitle'>`;

        this.d['insertImageFormPart1'] = `<input type='checkbox' id='outsourceCheckbox' name='outsourceCheckbox'>
                                        <label for='outsourceCheckbox'>${this._language.get("outsourceCheckbox")}</label><br>
                                        <label for='selectPicture'>${this._language.get("selectPictureFromHere")}</label><br>
                                        <select name='selectPicture'>
                                        <option selected="true" disabled="disabled" value=''>${this._language.get("selectImageFile")}</option> `;
        this.d['insertImageFormPart2'] = `</select><br>
                                        <label for='altText'>${this._language.get("altText")}</label><br>
                                        <input type='text' id='altText' name='altText'><br>
                                        <label for='graphicTitle'>${this._language.get("graphicTitle")}</label><br>
                                        <input type='text' id='graphicTitle' name='graphicTitle'><br> `;
        this.d['insertTableHTML'] = `<input name="tableHeadCheckbox" id="tableHeadCheckbox" type="checkbox" onchange="tableHeaderToggle(this)">
                                    <label for="tableHeadCheckbox">${this._language.get("tableHeadCheckbox")}</label><br>
                                    <label for="tableType">${this._language.get("tableType")}</label><br>
                                    <select name='tableType' id='tableType'>
                                        <option value='gridTable'>${this._language.get("gridTable")}</option>
                                        <option value='pipeTable'>${this._language.get("pipeTable")}</option>
                                        <option value='simpleTable'>${this._language.get("simpleTable")}</option>
                                        
                                        
                                    </select><br>
                                    <label>${this._language.get("rows")}</label>
                                    <input type="number" name='rows' , id='rows' min="1" placeholder="1" value="1" onclick="onRowChange(this)" onkeyup="onRowChange(this)">
                                    <label>${this._language.get("columns")}</label>
                                    <input type="number" name='columns' , id='columns' min="1" placeholder="1" value="1" onclick="onColumsChange(this)" onkeyup="onColumsChange(this)">
                                    <input type="hidden" value="" name="tableJSON" id="tableJSON">
                                    <hr>
                                    <h4>${this._language.get("editTableLayout")}</h4>
                                    <div id="table"> 
                                    </div>`;
        this.d['insertTableSCRIPT'] = `var tableID = "table";
                                        var rowName = "${this._language.get("row")}";
                                        var colName = "${this._language.get("column")}";

                                        function getNumberTableColumns() {
                                            var table = document.getElementById(tableID);
                                            var rows = table.children;
                                            if (rows.length > 0) {
                                                var firstrow = rows[0];
                                                var tableCellsInFirstRow = firstrow.children;
                                                return tableCellsInFirstRow.length;
                                            } else {
                                                return 0;
                                            }
                                        }
                            
                                        function getNumberTableRows() {
                                            var table = document.getElementById(tableID);
                                            var rows = table.children;
                                            return rows.length;
                                        }
                            
                                        function addNewRow() {
                                            var table = document.getElementById(tableID);
                            
                                            var columnsHtml = "";
                                            var rowNumber = getNumberTableRows();
                                            var newRowNumber = rowNumber + 1;
                                            var columnNumber = getNumberTableColumns();
                                            for (var i = 1; i <= columnNumber; i++) { //Generates Inputfields for the length of the row
                            
                                                columnsHtml += generateCell(newRowNumber, i);
                                            }
                                            if (columnNumber === 0) { //If Table is Empty
                                                columnsHtml += generateCell(1, 1);
                                            }
                                            columnsHtml = generateRowWrapper(newRowNumber, columnsHtml);
                                            //table.innerHTML = table.innerHTML + columnsHtml
                                            table.insertAdjacentHTML('beforeend', columnsHtml);
                                            if (columnNumber === 0) { //If Table is Empty
                                                changedCell(); //To generate new JSON
                                            }
                                        }
                            
                                        function generateRowWrapper(rownumber, innerHTML) { //Wrapper arround the content of the new row 
                                            return '<div class="row" datarow="' + rownumber + '">' + innerHTML + '</div>';
                                        }
                            
                                        function generateCell(r, c) {
                                            var placeholder = generatePlaceholder(r, c);
                                            return '<textarea type="text" class="cell" placeholder="' + placeholder + '" datarow="' + r +
                                                '" datacolumn="' + c + '" onkeyup="changedCell()"></textarea>';
                                        }
                            
                                        function generatePlaceholder(r, c) { //Is used by generateCell, what content is displayed as placeholder
                                            return rowName + " " + r + " " + colName + " " + c;
                                        }
                            
                                        function addNewColumn() {
                                            var table = document.getElementById(tableID);
                                            var rows = table.children;
                                            var rowNumbers = getNumberTableRows();
                                            var colNumbers = getNumberTableColumns();
                                            if (rowNumbers > 0) {
                                                for (var i = 0; i < rowNumbers; i++) {
                                                    var thisRow = rows[i];
                                                    var newCellHTML = generateCell(i + 1, colNumbers + 1); //i+1 because the array of the rows array starts at 0
                                                    thisRow.insertAdjacentHTML('beforeend', newCellHTML);
                                                }
                                            }
                                        }
                            
                                        function removeLastRow() {
                                            var table = document.getElementById(tableID);
                                            table.removeChild(table.lastChild);
                                        }
                            
                                        function removeLastColumn() {
                                            var table = document.getElementById(tableID);
                                            var rows = table.children;
                                            var rowNumber = getNumberTableRows();
                                            for (var i = 0; i < rowNumber; i++) {
                                                var thisRow = rows[i];
                                                thisRow.removeChild(thisRow.lastChild);
                                            }
                                        }
                            
                                        function onColumsChange(e) {
                                            var number = e.value;
                                            var numberColumns = getNumberTableColumns();
                                            if (number > 0) {
                                                while (number > numberColumns) {
                                                    addNewColumn();
                                                    numberColumns += 1;
                                                }
                                                while (number < numberColumns) {
                                                    removeLastColumn();
                                                    numberColumns -= 1;
                                                }
                                            }
                                            changedCell(); //To generate new JSON
                                        }
                            
                            
                                        function onRowChange(e) {
                                            var number = e.value;
                                            var numberRows = getNumberTableRows();
                                            if (number > 0) {
                                                while (number > numberRows) {
                                                    addNewRow();
                                                    numberRows += 1;
                                                }
                                                while (number < numberRows) {
                                                    removeLastRow();
                                                    numberRows -= 1;
                                                }
                                            }
                                            changedCell(); //To generate new JSON
                                        }
                                        addNewRow(); //To insert first Element
                            
                                        function tableHeaderToggle(element) {
                                            var table = document.getElementById(tableID);
                                            if (table.childElementCount > 0) {
                                                var rows = table.children;
                                                var firstRow = rows[0];
                                                var styleToSet = "";
                                                console.log(element.checked);
                                                if (element.checked == true) {
                                                    styleToSet = "bold";
                                                } else {
                                                    styleToSet = "unset";
                                                }
                                                firstRow.style.fontWeight = styleToSet;
                                            }
                                        }
                            
                                        async function changedCell() {
                                            var tableObject = [];
                                            var table = document.getElementById(tableID);
                                            if (table.childElementCount > 0) {
                                                var rows = table.children;
                                                for (var i = 0; i < rows.length; i++) { //For each Row
                                                    var thisRow = rows [i];
                                                    if(thisRow.childElementCount>0){
                                                        var thisRowsCells = thisRow.children;
                                                        for(var j=0; j<thisRowsCells.length;j++){ //For each Cell in a Row
                                                            if(j===0){
                                                                tableObject[i] = [];
                                                            }
                                                            var thisCell = thisRowsCells[j];
                                                            var thisCellsValue = thisCell.value;
                                                            tableObject[i][j]= thisCellsValue;
                                                            adaptCellHeight(thisCell);
                                                            
                                                        }
                                                    }
                                                }
                                            }
                                            var tableJSON = document.getElementById("tableJSON");
                                            tableJSON.value = JSON.stringify(tableObject);
                                        }
                                        async function adaptCellHeight(cell){
                                            cell.style.height = (cell.scrollHeight) + "px";
                                        }
                                        `;
        this.d['insertTableSTYLE'] = `        
                                    form {
                                        width: 100%;
                                    }
                                    #table {

                                            table-layout: fixed;
                                            width: 95%;
                                    }
                                    .row{
                                        /* display: table-row; */
                                        
                                        width: 100%;
                                        display:flex;
                                    }

                                    .cell{
                                        flex-basis: 100%;
                                        width:auto;
                                        font-weight:unset;
                                        white-space: pre-wrap;
                                        word-wrap: break-word;
                                        resize:vertical;
                                        min-height: 30px;
                                        resize: none;
                                        min-width: 1px;
                                        box-sizing: border-box;
                                        margin:4px!important;
                                        overflow:hidden;
                                        outline-color: var(--vscode-input-border);
                                        
                                    }
                                    .cell:focus{
                                        outline-color: var(--vscode-inputOption-activeBorder);
                                    }
                                    `;



    }



    public get(snippetName){
        return (this.d[snippetName]);
    }
}