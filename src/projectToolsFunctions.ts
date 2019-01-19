import * as vscode from 'vscode';
import Helper from './helper';
import Language from './languages';
import Sidebar from './sidebar';
import Taskbar from './taskbar';
import MatucCommands from './matucCommands';
import ProjectHelper from './projectHelper';
import ProjectToolsFunctionSnippets from './projectToolsFunctionsSnippets';
import * as path from 'path';

export default class ProjectToolsFunctions {
    private _helper: Helper;
    private _language: Language;
    private _sidebarCallback: Sidebar;
    private _taskbarCallback: Taskbar;
    private _matuc: MatucCommands;
    private _projectHelper: ProjectHelper;
    private _snippets: ProjectToolsFunctionSnippets;

    constructor(taskbarCallback, sidebarCallback, context) {
        this._helper = new Helper;
        this._language = new Language;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._matuc = new MatucCommands;
        this._projectHelper = new ProjectHelper;
        this._snippets = new ProjectToolsFunctionSnippets;
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
        var matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        var optionsHTML = await this._projectHelper.getAllWorkspaceFoldersAsHTMLWithSpeciallyEscapedJSON();
        //updateWorkspaceFolders
        var form = '';
        form += this._snippets.get("newProjectHTMLPart1");
        form += optionsHTML;
        form += this._snippets.get("newProjectHTMLPart2");
        var script = this._snippets.get("newProjectSCRIPT");
        this._sidebarCallback.addToSidebar(form, this._language.get("newProject"), this.createNewProjectSidebarCallback, this._language.get("insert"), "", script);
    }
    /**
     * Callback for creating a new project
     */
    public createNewProjectSidebarCallback = async (params) => {
        //console.log(params);
        var path, chapterCount, appendixChapterCount, preface, projectLanguage, tableOfContents, title, editor, institution, sourceMaterial, sourceAuthor, depthOfTableOfContents;
        var pathDataObject = this._projectHelper.convertSpeciallyEscapedJSONToObject(params.folder.value);
        path = pathDataObject.uri;
        chapterCount = params.chapters.value;
        if (params.appendixChapters.value === '') {
            appendixChapterCount = 0;
        } else {
            appendixChapterCount = params.appendixChapters.value;
        }
        preface = params.preface.checked;
        projectLanguage = params.language.value;
        tableOfContents = params.tableOfContents.checked;
        if (tableOfContents) {
            depthOfTableOfContents = params.tocDepth.value;
        } else {
            depthOfTableOfContents = 0;
        }
        title = params.title.value;
        editor = params.author.value;
        institution = params.institution.value;
        sourceMaterial = params.materialSource.value;
        sourceAuthor = params.sourceAuthor.value;
        try {
            let alternatePrefix, outputFormat, semYear, workingGroup;
            await this._matuc.newProject(appendixChapterCount, chapterCount, preface, projectLanguage, path);
            await this._matuc.initMetaData(path);
            await this._matuc.updateMetaData(alternatePrefix, outputFormat, editor, institution, title, projectLanguage, sourceMaterial, sourceAuthor, semYear, depthOfTableOfContents, workingGroup, path);
        } catch (e) {
            vscode.window.showErrorMessage(this._language.get("somethingWentWrongDuringCreatingNewProject"));
            console.log(e);
            return;
        }
        vscode.window.showInformationMessage(this._language.get("createdProjectSuccessfully"));


    }
    /**
     * Lets you edit the Metadata of the current project
     */
    public editProjectData = async () => {
        var matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        var currentEditor: vscode.TextEditor = await this._helper.getCurrentTextEditor();
        var folder: string = await this._helper.getFolderFromFilePath(currentEditor.document.uri.fsPath);
        var config: any = await this._matuc.showConfig(folder);
        console.log(config,folder);
        if (config === false) {
            vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
            return;
        }
        var form:string = this._projectHelper.getEditProjectHTMLForm(config,folder);
        this._sidebarCallback.addToSidebar(form, this._language.get("editProject"), this.editProjectDataSidebarCallback, this._language.get("updateEditedData"));


    }

    /**
     * Callback for editing the Metadata of the current project.
     */
    public editProjectDataSidebarCallback = async (params) => {
        const alternatePrefix = params.preface.checked;
			const editor = params.author.value;
			const institution = params.institution.value;
			const title = params.title.value;
			const projectLanguage = params.language.value;
			const source = params.materialSource.value;
			const sourceAuthor = params.sourceAuthor.value;
			const semYear = params.semYear.value;
			const tocDepth = params.tocDepth.value;
            const workingGroup = params.workingGroup.value;
            var thisPath:string  = params.folder.value;
            thisPath = thisPath.replace("\\\\`","'");
            try {
			await this._matuc.updateMetaData(alternatePrefix, null, editor, institution,
                    title, projectLanguage, source, sourceAuthor, semYear, tocDepth, workingGroup, thisPath);
            } catch (e){
                console.log(e);
                vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
                return;
            } 
            vscode.window.showInformationMessage(this._language.get("updateSuccessfull"));
    }


    /** 
     * Saves the changes made in the current file
     */
    public saveChanges = async () => {
        var currentEditor = await this._helper.getCurrentTextEditor();
        currentEditor.document.save();
        this._helper.focusDocument(); //Puts focus back to the text editor
    }
    /**
     * creates a new file in the current Project
     */
    public createNewFile = async () => {
        await this._helper.focusDocument(); //Puts focus back to the text editor
        await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
        await vscode.commands.executeCommand('workbench.action.files.save');
        
    }
    /**
     * Undoes the last step.
     */
    public undo = async () => {
        await this._helper.focusDocument(); //Puts focus back to the text editor
        await vscode.commands.executeCommand('undo');
    }
    /**
     * Redoes the last step
     */
    public redo = async () => {
        await this._helper.focusDocument(); //Puts focus back to the text editor
        await vscode.commands.executeCommand('redo');
    }
    /**
     * shows a HTML Preview if available.
     */
    public showHTMLPreview = async () => {
        var matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        await this._helper.focusDocument(); //Puts focus back to the text editor
        // try{
        //     vscode.commands.executeCommand("markdown-preview-enhanced.openPreview");
        //     return;
        // } catch(e){
        //     console.log(e);
        // } // no Markdown enhanced because it ALLWAYS opens to the right. Bad :(
        vscode.commands.executeCommand("markdown.showPreview");
    }
    /**
     * Generates the HTML for the current project
     */
    public generateHTML = async () => {
        var matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        var currentEditor = await this._helper.getCurrentTextEditor();
        var filePath = currentEditor.document.uri.fsPath;
        var isInLecture = await this._matuc.checkIfFileIsWithinLecture(filePath);
        if(isInLecture === false){
            vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
            return;
        }

        var form = `
            <div class="spacing" role="none"></div>
            <label for="conversionProfile">${this._language.get("conversionProfile")}</label><br role="none">
            <select name="conversionProfile" id="conversionProfile" required="true">
                <option value="blind">${this._language.get("blind")}</option>
                <option value="visually">${this._language.get("visuallyImpaired")}</option>
            </select>
        `;
        //TODO: autoselect last selection
        this._sidebarCallback.addToSidebar(form, this._language.get("generateFile"), this.generateHTMLSidebarCallback, this._language.get("generate"));
    }

    public generateHTMLSidebarCallback = async (params) => {
        var profile = params.conversionProfile.value;
        await this._matuc.checkAndSaveChanges();
        await this._matuc.convertFile(profile);
        this._helper.focusDocument(); //Puts focus back to the text editor
    }
    /**
     * Generates HTML for all Projects
     */
    public generateHTMLForAllProjects = async () => {
        var matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    }
    /**
     * publishes the whole Project
     */
    public publish = async () => {
        var matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

}