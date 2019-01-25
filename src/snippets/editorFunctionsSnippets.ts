/**
 * @author  Lucas Vogel
 */
import Language from '../languages';



export default class EditorFunctionSnippets {
    private _language: Language;
    private d: any;

    /**
     * Gets a snippet
     * @param snippetName identifier of the snippet
     * @returns snippet
     */
    public get(snippetName: string) {
        return (this.d[snippetName]);
    }

    constructor() {
        this._language = new Language;
        this.d = [];

        /****************INSERT LINK ****************** */
        this.d['insertLinkForm'] = `<label for='url'>${this._language.get("link")}</label><br  role="none">
                      <input type='text' id='url' name='url' required><br  role="none">
                      <div class="spacing" role="none"></div>
                      <label for='linkText'>${this._language.get("linkText")}</label><br  role="none">
                      <input type='text' id='linkText' name='linkText'><br  role="none">
                      <div class="spacing" role="none"></div>
                      <label for='linkTitle'>${this._language.get("linkTitle")}</label><br  role="none">
                      <input type='text' id='linkTitle' name='linkTitle'>`;
        /****************INSERT IMAGE ****************** */
        this.d['insertImageFormPart1'] = `<input type='checkbox' id='outsourceCheckbox' name='outsourceCheckbox'>
                                    <label for='outsourceCheckbox'>${this._language.get("outsourceCheckbox")}</label><br  role="none">
                                    
                                    <label for='selectPicture'>${this._language.get("selectPictureFromHere")}</label><br  role="none">
                                        <select name='selectPicture'>
                                        <option selected="true" disabled="disabled" value=''>${this._language.get("selectImageFile")}</option> `;
        this.d['insertImageFormPart2'] = `</select><br  role="none">
                                        <div class="spacing" role="none"></div>
                                        <label for='altText'>${this._language.get("altText")}</label><br  role="none">
                                        <input type='text' id='altText' name='altText'><br  role="none">
                                        <div class="spacing" role="none"></div>
                                        <label for='graphicTitle'>${this._language.get("graphicTitle")}</label><br  role="none">
                                        <input type='text' id='graphicTitle' name='graphicTitle'><br  role="none"> `;
        /****************INSERT TABLE ****************** */
        this.d['insertTableHTML'] = `<input name="tableHeadCheckbox" id="tableHeadCheckbox" type="checkbox" onchange="tableHeaderToggle(this)">
                                    <label for="tableHeadCheckbox">${this._language.get("tableHeadCheckbox")}</label><br  role="none">
                                    <div class="spacing" role="none"></div>
                                    
                                    <label for="tableType">${this._language.get("tableType")}</label><br  role="none">
                                    <select name='tableType' id='tableType'>
                                        <option value='gridTable'>${this._language.get("gridTable")}</option>
                                        <option value='pipeTable'>${this._language.get("pipeTable")}</option>
                                        <option value='simpleTable'>${this._language.get("simpleTable")}</option>
                                        
                                        
                                    </select><br  role="none">
                                    <div class="spacing" role="none"></div>
                                    <label>${this._language.get("rows")}</label>
                                    <input type="number" name='rows' , id='rows' min="1" placeholder="1" value="1" onclick="onRowChange(this)" onkeyup="onRowChange(this)">
                                    <div class="spacing" role="none"></div>
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

        //**************EDIT TABLE **************** */
        this.d['editTableHTML'] = `<input name="tableHeadCheckbox" id="tableHeadCheckbox" type="checkbox" onchange="tableHeaderToggle(this)">
                                    <label for="tableHeadCheckbox">${this._language.get("tableHeadCheckbox")}</label><br  role="none">
                                    <div class="spacing" role="none"></div>
                                    <label for="tableType">${this._language.get("tableType")}</label><br  role="none">
                                    <select name='tableType' id='tableType'>
                                        <option value='gridTable'>${this._language.get("gridTable")}</option>
                                        <option value='pipeTable'>${this._language.get("pipeTable")}</option>
                                        <option value='simpleTable'>${this._language.get("simpleTable")}</option>
                                        
                                        
                                    </select><br  role="none">
                                    <div class="spacing" role="none"></div>
                                    <label>${this._language.get("rows")}</label>
                                    <input type="number" name='rows' , id='rows' min="1" placeholder="1" value="1" onclick="onRowChange(this)" onkeyup="onRowChange(this)">
                                    <div class="spacing" role="none"></div>
                                    <label>${this._language.get("columns")}</label>
                                    <input type="number" name='columns' , id='columns' min="1" placeholder="1" value="1" onclick="onColumsChange(this)" onkeyup="onColumsChange(this)">
                                    <input type="hidden" value="" name="tableJSON" id="tableJSON">
                                    <hr>
                                    <h4>${this._language.get("editTableLayout")}</h4>
                                    <div id="table"> 
                                    </div>`;
        this.d['editTableSCRIPT'] = `var tableID = "table";
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
        this.d['editTableSTYLE'] = `        
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

        this.d['editTableScriptPart1'] = `var jsonString=\``;
        this.d['editTableScriptPart2'] = `\`;
            var tableHeadCheckboxText = "tableHeadCheckbox";
            var tableTypeSelector = "tableType";
            var tableTypeText = [];
            tableTypeText["GRID"] = "gridTable";
            tableTypeText["PIPE"] = "pipeTable";
            tableTypeText["SIMPLE"] = "simpleTable";
            var rowsSelectorName = "rows";
            var columnsSelectorName = "columns";
            var tableBoxName = "table";
                                    warn ("Test");
            function loadJSON(){
                warn("start Loading");
                warn(jsonString);
                try {
                    var escapedJSONString = jsonString;//jsonString.replace(/\\n/g, "\\\\n");
                    //  .replace(/\\'/g, "\\\\'")
                    //  .replace(/\\&/g, "\\\\&")
                    //  .replace(/\\r/g, "\\\\r")
                    //  .replace(/\\t/g, "\\\\t")
                    //  .replace(/\\b/g, "\\\\b");
                    //  .replace(/\\f/g, "|\f");
                    warn(escapedJSONString);
                    var json = JSON.parse(escapedJSONString);
                
                //var json = JSON.parse(jsonString);
                } catch (e){
                    warn (e);
                }
                
                warn("was loaded");
                return json;
            }
            async function loadIntoForm(json){
                warn("loading into form");
                var headerCheckbox =  document.getElementById(tableHeadCheckboxText);
                if(json.hasHeader === true){
                   headerCheckbox.checked = true;
                } else {
                    headerCheckbox.checked = false;
                }
                var thisTableType = tableTypeText[json.tableType];
                if(thisTableType!== undefined && thisTableType!==""){
                var thistableTypeSelector = document.getElementById(tableTypeSelector);
                thistableTypeSelector.value = thisTableType;
                }
                var rowsSelector = document.getElementById(rowsSelectorName);
                var colSelector = document.getElementById(columnsSelectorName);
                var rowNumber = json["data"].length;
                var colNumber = json["data"][0].length;
                if(rowNumber === undefined || rowNumber===null){
                    return false;
                }
                if(colNumber === undefined || colNumber===null){
                    return false;
                }
                console.log(rowNumber,colNumber);
                rowsSelector.value = rowNumber;
                onRowChange(rowsSelector); //call to other scriptblock from the normal insert table script.
                colSelector.value = colNumber;
                onColumsChange(colSelector); //call to other scriptblock from the normal insert table script.
                loadCellsWithContent(json["data"]);
            }

            function loadCellsWithContent (data){
                console.log(data);
                var table = document.getElementById(tableBoxName);
                var rows = table.children;
                console.log(rows);
                for (var i=0;i<rows.length;i++){
                    var thisRow = rows[i];
                    var thisJSONRow = data[i];
                    var thisCols = thisRow.children;
                    console.log(thisRow);
                    for (var j = 0;j<thisCols.length;j++){
                        
                        var thisCell = thisCols[j];
                        var thisJSONCell = thisJSONRow[j];
                        console.log(thisCell,thisJSONCell);
                        thisCell.value = thisJSONCell;
                        changedCell(); //Call to update the hidden form
                    }
                }
            }

            window.onload = async function(){
                warn("Load");
                var parsedJSON = loadJSON();
                warn("Load2");
                loadIntoForm(parsedJSON);

            }
            function warn(message){
                
                //document.body.insertAdjacentHTML('beforeend', message);
            }
            `;

        /****************** INSERT FOOTNOTE ******************** */
        this.d['insertFootnoteHTML'] = `
            <label for='footLabel'>${this._language.get("footLabel")}</label><br  role="none">
            <input type="text" name="footLabel" id="footLabel" placeholder="${this._language.get("footLabel")}" required="true"/><br  role="none">
            <div class="spacing" role="none"></div>
            <label for='footText'>${this._language.get("footText")}</label><br  role="none">
            <input type="text" name="footText" id="footText" placeholder="${this._language.get("footText")}" required="true"/><br  role="none">
            `;

        /****************INSERT ANNOTATION ****************** */
        this.d['insertAnnotationHTMLPart1'] = `
            <label for="annotationType">${this._language.get("selectType")}</label><br  role="none">
        <select name='annotationType' id='annotationType' onchange="typeChange(this)"><br  role="none">
            <option value='textFrame'>${this._language.get("textFrameCheckbox")}</option>
            <option value='textBox'>${this._language.get("textBoxCheckbox")}</option>
            <option value='annotation'>${this._language.get("annotation")}</option>
        </select>
        <div class="spacing" role="none"></div>
         <label for="color" >${this._language.get("color")}</label><br  role="none">
        <select name='color' id='color'><br  role="none">
         <option value='red'>${this._language.get("colorRed")}</option>
         <option value='blue'>${this._language.get("colorBlue")}</option>
         <option value='brown'>${this._language.get("colorBrown")}</option>
         <option value='grey'>${this._language.get("colorGrey")}</option>
         <option value='black'>${this._language.get("colorBlack")}</option>
         <option value='green'>${this._language.get("colorGreen")}</option>
         <option value='yellow'>${this._language.get("colorYellow")}</option>
         <option value='orange'>${this._language.get("colorOrange")}</option>
         <option value='violet'>${this._language.get("colorViolet")}</option>
      </select>
      <div class="spacing" role="none"></div>
      <label for="titleOfBox">${this._language.get("titleOfTextbox")}</label><br  role="none">
      <input type="text" name="titleOfBox" id="titleOfBox" placeholder="${this._language.get("titleOfTextbox")}" `;
        this.d['insertAnnotationHTMLPart2'] = `/><br  role="none">
      <div class="spacing" role="none"></div>
      <label for="contentOfBox">${this._language.get("contentOfTextbox")}</label><br  role="none">
      <input type="text" name="contentOfBox" id="contentOfBox" placeholder="${this._language.get("contentOfTextbox")}" `;
        this.d['insertAnnotationHTMLPart3'] = `/>
            `;
        this.d['insertAnnotationSCRIPT'] = `
            function typeChange(){
                var selector = document.getElementById("annotationType");
                var titleBox = document.getElementById("titleOfBox");
                var colorSelector = document.getElementById("color");
                if(selector.value === "annotation"){
                  titleBox.disabled = true;
                  colorSelector.disabled = true;
                } else {
                  titleBox.disabled = false; 
                  colorSelector.disabled = false;
                }
            }
            `;

    }



}