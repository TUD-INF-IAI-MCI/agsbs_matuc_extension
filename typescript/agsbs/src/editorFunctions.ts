//import * as vscode from 'vscode'
import Helper from './helper';
import Language from './languages';
import Sidebar from './sidebar';
import Taskbar from './taskbar';

export default class EditorFunctions {
    private _helper:Helper;
    private _sidebarCallback:Sidebar;
    private _taskbarCallback:Taskbar;
    private _language:Language;
    
    constructor(taskbarCallback,sidebarCallback, context) {
        this._helper = new Helper;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new Language;
    }

    /**
     * Setup of the Editor Functions. Here taskbar-buttons can be added.
     */
    public setup =()=>{
        this._taskbarCallback.addButton("clone.svg", this._language.get("bold"), this.bold, this._language.get("emphasis"));
        this._taskbarCallback.addButton("h.svg", this._language.get("italic"), this.italic, this._language.get("emphasis"));

        this._taskbarCallback.addButton("h6.svg", this._language.get("insertLink"), this.insertLink, this._language.get("test"));
        
        
    }

    /**
     * Adds a panel to the sidebar to add a link
     */
    public insertLink = ()=>{
        var testForm = `
        <label for='url'>${this._language.get("link")}</label><br>
        <input type='text' id='url' name='url'><br>
        <label for='linkText'>${this._language.get("linkText")}</label><br>
        <input type='text' id='linkText' name='linkText'><br>
        <label for='linkTitle'>${this._language.get("linkTitle")}</label><br>
        <input type='text' id='linkTitle' name='linkTitle'>
        `;
        this._sidebarCallback.addToSidebar(testForm,this._language.get("insertLink"),this.insertLinkSidebarCallback,this._language.get("insertLinkDialog"));
    }

    /**
     * gets called when the 'insert Link'-Button is pressed
     */
    public insertLinkSidebarCallback = async (params) =>{
        var stringToInsert:string;
        if(params.linkTitle.value !== ""){
            stringToInsert = `[${params.linkText.value}](${params.url.value} "${params.linkTitle.value}") `;
        } else {
            stringToInsert = `[${params.linkText.value}](${params.url.value}) `;
        }
         var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.insertStringAtStartOfSelection(currentTextEditor,selection,stringToInsert);
    }
    /**
     * Makes the current text bold.
     */
    public bold = async ()=>{
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"**","**");
        
    }

    /**
     * Makes the current text italic.
     */
    public italic = async ()=>{
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"*","*");
    }

    /**
     * Makes the current text strikethrough.
     */
    public strikethrough= async ()=>{
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"~~","~~");
    }
}