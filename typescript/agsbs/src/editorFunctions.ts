//import * as vscode from 'vscode'
import Helper from './helper';
import Language from './languages';
import Sidebar from './sidebar';

export default class EditorFunctions {
    private _helper:Helper;
    private _sidebarCallback:Sidebar;
    private _taskbarCallback:any;
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

        this._taskbarCallback.addButton("h6.svg", this._language.get("test"), this.sidebarButton, this._language.get("test"));
        
        
    }
    public sidebarButton = ()=>{
        var testForm = "<input name='test1'>";
        this._sidebarCallback.addToSidebar(testForm,this.sidebarCallbackTest,"GO!");
    }
    public sidebarCallbackTest = async (params) =>{
        console.log(params);
        this.bold();
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