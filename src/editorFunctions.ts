//import * as vscode from 'vscode'
import * as vscode from 'vscode';
import Helper from './helper';
import Language from './languages';
import Sidebar from './sidebar';
import Taskbar from './taskbar';
import ImageHelper from './imageHelper';
import MatucCommands from './matucCommands';
import EditorFunctionSnippets from './editorFunctionsSnippets';
import TableHelper from './tableHelper';
import * as Papa from 'papaparse';

export default class EditorFunctions {
    private _helper: Helper;
    private _imageHelper: ImageHelper;
    private _sidebarCallback: Sidebar;
    private _taskbarCallback: Taskbar;
    private _language: Language;
    private _matucCommands: MatucCommands;
    private _snippets: EditorFunctionSnippets;
    private _tableHelper: TableHelper;

    constructor(taskbarCallback, sidebarCallback, context) {
        this._helper = new Helper;
        this._imageHelper = new ImageHelper;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new Language;
        this._matucCommands = new MatucCommands;
        this._snippets = new EditorFunctionSnippets;
        this._tableHelper = new TableHelper;
    }

    /**
     * Setup of the Editor Functions. Here taskbar-buttons can be added.
     */
    public setup = () => {
        this._taskbarCallback.addButton("bold.svg", this._language.get("bold"), this.bold, this._language.get("emphasis"));
        this._taskbarCallback.addButton("italic.svg", this._language.get("italic"), this.italic, this._language.get("emphasis"));
        this._taskbarCallback.addButton("strikethrough.svg", this._language.get("strikethrough"), this.strikethrough, this._language.get("emphasis"));

        this._taskbarCallback.addButton("link.svg", this._language.get("insertLink"), this.insertLink, this._language.get("insert"));
        this._taskbarCallback.addButton('image.svg', this._language.get('insertGraphic'), this.insertImage, this._language.get('insert'));
        this._taskbarCallback.addButton('table.svg', this._language.get('insertTable'), this.insertTable, this._language.get('insert'));
        this._taskbarCallback.addButton('import_table_csv.svg', this._language.get('importTableCsv'), this.insertCSVTable, this._language.get('insert'));

    }
    /**
     * Insert a Table from a CSV-File
     */
    public insertCSVTable = async () => {
        var thisPath = await this._helper.getCurrentDocumentFolderPath();
        var results = await this._tableHelper.getAllTablesInFolder(thisPath);
        var selectionTablesHTML = this._tableHelper.generateSelectTableOptionsHTML(results);
        //<input type="text" name="uriTable" placeholder="${this._language.get("uriTable")}"><br><br>
        var form = `
        
        <select name='selectTable'>
        <option selected="true" disabled="disabled" value=''>${this._language.get("selectTable")}</option>
        ${selectionTablesHTML}
        </select>
        `;
        this._sidebarCallback.addToSidebar(form, this._language.get("importTableCsv"), this.insertCSVTableSidebarCallback, this._language.get("insert"));
    }

    /** 
     * Callback for insert a table from a CSV-File
     */
    public insertCSVTableSidebarCallback = async (params) => {
        var urlData = params.selectTable.value;
        var url:any;
        if(urlData===""){
            console.log("No File Selected");
            return false;
            
        } else {
            try{
            url = JSON.parse(urlData);
            } catch (e){
                vscode.window.showErrorMessage(this._language.get("importTableFromCsvError"));
                console.log(e);
                return false;
            }
        }
        var content:any = await this._helper.getContentOfFile(url.completePath); 
        content = content.replace(/\ +$/, "");
        content = content.replace(/\n+$/, "");//removes trailing spaces and line breaks
        var result = await Papa.parse(content);
        var extraText = this._language.get("importedFrom")+ " " + url.relativePath;
        var table = this._tableHelper.generateTable(false,result.data,"",extraText);
        var insertPosition:any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if(insertPosition === false){
        this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            var thisCurrentEditor = await this._helper.getCurrentTextEditor();
            var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(table,thisCurrentEditor,newEndPosition);
        }
    }


    /**
     * Insert Table Button Function
     */
    public insertTable = async () => {
        var form = this._snippets.get('insertTableHTML');
        var script = this._snippets.get('insertTableSCRIPT');
        var style = this._snippets.get('insertTableSTYLE');
        this._sidebarCallback.addToSidebar(form, this._language.get("insertTable"), this.insertTableSidebarCallback, this._language.get("insert"),style,script);

    }

    /**
     * Insert Table SidebarCallback Function
     */
    public insertTableSidebarCallback = async (params) => {
        var hasHeader = params.tableHeadCheckbox.checked;
        var tableType = params.tableType.value;
        var rowsNumber = params.rows.value;
        var columns = params.columns.value;
        var rawdata = params.tableJSON.value;
        var data;
        try {
           data  = JSON.parse(rawdata);
        } catch (e) {
            console.log(e);
            return;
        }
        var table = this._tableHelper.generateTable(hasHeader,data,tableType);
        var insertPosition:any = await this._tableHelper.getIfSelectionIsInTableAndReturnSelection();
        if(insertPosition === false){
        this._helper.insertStringAtStartOfLineOrLinebreak(table);
        } else {
            var thisCurrentEditor = await this._helper.getCurrentTextEditor();
            var newEndPosition = new vscode.Selection(insertPosition.end, insertPosition.end);
            this._helper.insertStringAtStartOfLineOrLinebreak(table,thisCurrentEditor,newEndPosition);
        }

    }   


    /**
     * Inserts an Image
     */
    public insertImage = async () => {
        var thisPicturesFolderName = await this._imageHelper.getPictureFolderName();
        var thisPath = await this._helper.getCurrentDocumentFolderPath();
        var thisPicturesArray = await this._imageHelper.getAllPicturesInFolder(thisPath, thisPicturesFolderName);
        var allPicturesHTMLString = await this._imageHelper.generateSelectImagesOptionsHTML(thisPicturesArray);
        var form = this._snippets.get('insertImageFormPart1') + allPicturesHTMLString + this._snippets.get('insertImageFormPart2');
        this._sidebarCallback.addToSidebar(form, this._language.get("insertGraphic"), this.insertImageSidebarCallback, this._language.get("insert"));
    }

    /**
     * The Callback for inserting an image from the sidebar, inserts the image
     * @param params parameters given by the callback about the html-elements of the html-form
     */
    public insertImageSidebarCallback = async (params) => {

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
        var result = await this._matucCommands.imageDescription(
                                                altText, 
                                                params.outsourceCheckbox.checked, 
                                                pictureSelector.basePath, 
                                                pictureTitle, 
                                                pictureSelector.markdownReadyRelativePath);

        //TODO: Insert only if the selection is at the start of the line, otherwise do a linebreak first
        //TODO: Handle Alternative direct Path 

        await this._helper.insertStringAtStartOfSelection(result['internal'].verbatim); 
        //typescript does not like .internal, so this workaround is used.
        if (result.hasOwnProperty("external")) { // if the description is outsourced, the returning JSON has a 'external' property
            var fileName = await this._imageHelper.getPictureFolderName();
            fileName += ".md";
            this._imageHelper.addImageDescriptionToFile(pictureSelector.basePath, fileName, result["external"].verbatim); 
            //typescript does not like .external, so this workaround is used.
        }
    }

    /**
     * Adds a panel to the sidebar to add a link
     */
    public insertLink = () => {
        var form = this._snippets.get("insertLinkForm");
        this._sidebarCallback.addToSidebar(form, this._language.get("insertLink"), this.insertLinkSidebarCallback, this._language.get("insertLinkSubmit"));
    }

    /**
     * gets called when the 'insert Link'-Button is pressed
     */
    public insertLinkSidebarCallback = async (params) => {
        var stringToInsert: string;
        if (params.linkTitle.value !== "") {
            stringToInsert = `[${params.linkText.value}](${params.url.value} "${params.linkTitle.value}") `;
        } else {
            stringToInsert = `[${params.linkText.value}](${params.url.value}) `;
        }
        await this._helper.insertStringAtStartOfSelection(stringToInsert);
    }
    /**
     * Makes the current text bold.
     */
    public bold = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("**", "**");
        this._helper.focusDocument(); //Puts focus back to the text editor
        
    }

    /**
     * Makes the current text italic.
     */
    public italic = async () => {
        await this._helper.toggleCharactersAtStartAndEnd( "*", "*");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

    /**
     * Makes the current text strikethrough.
     */
    public strikethrough = async () => {
        await this._helper.toggleCharactersAtStartAndEnd("~~", "~~");
        this._helper.focusDocument(); //Puts focus back to the text editor
    }


}