import * as vscode from 'vscode';
import Helper from './helper';
import Language from './languages';
import Sidebar from './sidebar';
import Taskbar from './taskbar';
import MatucCommands from './matucCommands';

export default class ProjectToolsFunctions {
    private _helper: Helper;
    private _language: Language;
    private _sidebarCallback: Sidebar;
    private _taskbarCallback: Taskbar;
    private _matuc:MatucCommands;

    constructor(taskbarCallback, sidebarCallback, context) {
        this._helper = new Helper;
        this._language = new Language;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._matuc = new MatucCommands;
    }

    public setup = async () => {
        this._taskbarCallback.addProjectTool("new_project.svg", this._language.get("newProject"), this.createNewProject, this._language.get("projectTitle"));
        this._taskbarCallback.addProjectTool("edit.svg", this._language.get("editProject"), this.editProjectData, this._language.get("projectTitle"));
        this._taskbarCallback.addProjectTool("save.svg", this._language.get("saveChanges"), this.saveChanges, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("new_file.svg", this._language.get("newFile"), this.createNewFile, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("undo.svg", this._language.get("undo"), this.undo, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("redo.svg", this._language.get("redo"), this.redo, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("preview.svg", this._language.get("preview"), this.showHTMLPreview, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("generate.svg", this._language.get("generateFile"), this.generateHTML, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("create_all.svg", this._language.get("convertEntireProject"), this.generateHTMLForAllProjects, this._language.get("documentTitle"));
        this._taskbarCallback.addProjectTool("check_all.svg", this._language.get("checkProject"), this.publish, this._language.get("publishTitle"));
    }

    /**
     * Lets you create a new Project
     */
    public createNewProject = async () => {
        var form = `
        
        `;
    }
    /**
     * Lets you edit the Metadata of the current project
     */
    public editProjectData = async () => {

    }
    /** 
     * Saves the changes made in the current file
     */
    public saveChanges = async () => {
        var currentEditor = await this._helper.getCurrentTextEditor();
        currentEditor.document.save();
    }
    /**
     * creates a new file in the current Project
     */
    public createNewFile = async () => {
    }
    /**
     * Undoes the last step.
     */
    public undo = async () => {
    }
    /**
     * Redoes the last step
     */
    public redo = async () => {
    }
    /**
     * shows a HTML Preview if available.
     */
    public showHTMLPreview = async () => {
    }
    /**
     * Generates the HTML for the current project
     */
    public generateHTML = async () => {
    }
    /**
     * Generates HTML for all Projects
     */
    public generateHTMLForAllProjects = async () => {
    }
    /**
     * publishes the whole Project
     */
    public publish = async () => {
    }
    
}