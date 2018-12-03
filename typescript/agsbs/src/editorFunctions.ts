//import * as vscode from 'vscode'
import Helper from './helper';
import Language from './languages';
import Sidebar from './sidebar';
import Taskbar from './taskbar';
import ImageHelper from './imageHelper';
import MatucCommands from './matucCommands';

export default class EditorFunctions {
    private _helper: Helper;
    private _imageHelper: ImageHelper;
    private _sidebarCallback: Sidebar;
    private _taskbarCallback: Taskbar;
    private _language: Language;
    private _matucCommands: MatucCommands;

    constructor(taskbarCallback, sidebarCallback, context) {
        this._helper = new Helper;
        this._imageHelper = new ImageHelper;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new Language;
        this._matucCommands = new MatucCommands;
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
    }
    /**
     * Inserts an Image
     */
    public insertImage = async () => {
        var thisPicturesFolderName = await this._imageHelper.getPictureFolderName();
        var thisPath = await this._helper.getCurrentDocumentFolderPath();
        var thisPicturesArray = await this._imageHelper.getAllPicturesInFolder(thisPath, thisPicturesFolderName);
        var allPicturesHTMLString = await this._imageHelper.generateSelectImagesOptionsHTML(thisPicturesArray);
        //console.log(allPicturesHTMLString);
        var testForm = `
        <input type='checkbox' id='outsourceCheckbox' name='outsourceCheckbox'>
        <label for='outsourceCheckbox'>${this._language.get("outsourceCheckbox")}</label><br>
    
        <label for='selectPicture'>${this._language.get("selectPictureFromHere")}</label><br>
        <select name='selectPicture'>
        <option selected="true" disabled="disabled" value=''>${this._language.get("selectImageFile")}</option> 
        ${allPicturesHTMLString}
        </select><br>
        
        <label for='altText'>${this._language.get("altText")}</label><br>
        <input type='text' id='altText' name='altText'><br>

        <label for='graphicTitle'>${this._language.get("graphicTitle")}</label><br>
        <input type='text' id='graphicTitle' name='graphicTitle'><br>
        `;
        
        this._sidebarCallback.addToSidebar(testForm, this._language.get("insertGraphic"), this.insertImageSidebarCallback, this._language.get("insert"));
    }

    /**
     * The Callback for inserting an image from the sidebar, inserts the image
     * @param params parameters given by the callback about the html-elements of the html-form
     */
    public insertImageSidebarCallback = async (params) => {
        var altText = "";
        var pictureTitle = "";
        var pictureSelector = JSON.parse(params.selectPicture.value);

        altText += params.altText.value;
        pictureTitle += params.graphicTitle.value;

        var pictureSource = "";
        pictureSource += pictureSelector.markdownReadyRelativePath;
        //stringToInsert = '![' + altText + '](' + pictureSource + ')'; //TODO: Delete

        console.log(altText, false, pictureSelector.basePath, pictureTitle, pictureSelector.markdownReadyRelativePath);
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
        console.log(result);
        if (result.hasOwnProperty("external")) {
            console.log("IT HAS");
            var fileName = await this._imageHelper.getPictureFolderName();
            fileName += ".md";
            console.log(pictureSelector.basePath, fileName, result["external"].verbatim);
            this._imageHelper.addImageDescriptionToFile(pictureSelector.basePath, fileName, result["external"].verbatim); 
            //typescript does not like .external, so this workaround is used.
        }
    }

    /**
     * Adds a panel to the sidebar to add a link
     */
    public insertLink = () => {
        var testForm = `
        <label for='url'>${this._language.get("link")}</label><br>
        <input type='text' id='url' name='url' required><br>
        <label for='linkText'>${this._language.get("linkText")}</label><br>
        <input type='text' id='linkText' name='linkText'><br>
        <label for='linkTitle'>${this._language.get("linkTitle")}</label><br>
        <input type='text' id='linkTitle' name='linkTitle'>
        `;
        this._sidebarCallback.addToSidebar(testForm, this._language.get("insertLink"), this.insertLinkSidebarCallback, this._language.get("insertLinkSubmit"));
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
        this._taskbarCallback.showHTML();
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