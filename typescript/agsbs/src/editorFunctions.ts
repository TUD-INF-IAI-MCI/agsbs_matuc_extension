//import * as vscode from 'vscode'
import Helper from './helper'

export default class EditorFunctions {
    private _helper:Helper;
    private _sidebarCallback;
    private _taskbarCallback;
    //private _context:vscode.ExtensionContext;
    constructor(taskbarCallback,sidebarCallback, context) {
        this._helper = new Helper;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        
        
        //this._context= context;
    }
    public setup =()=>{
        this._taskbarCallback.addButton("clone.svg","Bold",this.bold);
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