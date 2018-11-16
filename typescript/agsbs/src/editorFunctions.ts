//import * as vscode from 'vscode'
import Helper from './helper'
import Language from './languages'

export default class EditorFunctions {
    private _helper:Helper;
    private _sidebarCallback:any;
    private _taskbarCallback:any;
    private _language:Language;
    constructor(taskbarCallback,sidebarCallback, context) {
        this._helper = new Helper;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._language = new Language;
    }
    public setup =()=>{
        this._taskbarCallback.addButton("clone.svg",this._language.get("bold"),this.bold,this._language.get("emphasis"));
        this._taskbarCallback.addButton("h.svg",this._language.get("italic"),this.italic,this._language.get("emphasis"));
    }

    public bold = async ()=>{
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"**","**");
        
    }
    public italic = async ()=>{
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"*","*");
    }
    public strikethrough= async ()=>{
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"~~","~~");
    }
}