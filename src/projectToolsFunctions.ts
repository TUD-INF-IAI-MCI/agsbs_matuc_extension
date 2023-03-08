/**
 * @author  Lucas Vogel
 */
import * as vscode from "vscode";
import Helper from "./helper/helper";
import Language from "./languages";
import Sidebar from "./sidebar";
import Taskbar from "./taskbar";
import MatucCommands from "./matucCommands";
import ProjectHelper from "./helper/projectHelper";
import ProjectToolsFunctionSnippets from "./snippets/projectToolsFunctionsSnippets";
import SettingsHelper from "./helper/settingsHelper";
import GitCommands from "./gitCommands";
import { showNotification } from "./helper/notificationHelper";

/**
 * This Class contains all functions of the project tools bar in the Taskbar. Here all Buttons are registered.
 */
export default class ProjectToolsFunctions {
    private _helper: Helper;
    private _language: Language;
    private _sidebarCallback: Sidebar;
    private _taskbarCallback: Taskbar;
    private _matuc: MatucCommands;
    private _projectHelper: ProjectHelper;
    private _snippets: ProjectToolsFunctionSnippets;
    private _settings: SettingsHelper;
    private _git: GitCommands;

    constructor(taskbarCallback, sidebarCallback) {
        this._helper = new Helper();
        this._language = new Language();
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._matuc = new MatucCommands(sidebarCallback);
        this._projectHelper = new ProjectHelper();
        this._snippets = new ProjectToolsFunctionSnippets();
        this._settings = new SettingsHelper();
        this._git = new GitCommands();
        vscode.commands.registerCommand("agsbs.showGitView", () => {
            this.cloneRepo();
        });
        vscode.commands.registerCommand("agsbs.newProject", () => {
            this.createNewProject();
        });
    }

    /**
     * Registering all Buttons.
     */
    public setup = async () => {
        const gitIsEnabled = await this._settings.get("enableGitUseage");
        this._taskbarCallback.addProjectTool(
            "new_project.svg",
            this._language.get("newProject"),
            this.createNewProject,
            this._language.get("projectTitle"),
            "agsbs.newProject"
        );
        this._taskbarCallback.addProjectTool(
            "edit.svg",
            this._language.get("editProject"),
            this.editProjectData,
            this._language.get("projectTitle"),
            "agsbs.edit"
        );
        if (gitIsEnabled) {
            this._taskbarCallback.addProjectTool(
                "clone.svg",
                this._language.get("cloneExistingRepo"),
                this.cloneRepo,
                this._language.get("projectTitle"),
                "agsbs.clone"
            );
        }
        this._taskbarCallback.addProjectTool(
            "save.svg",
            this._language.get("saveChanges"),
            this.saveChanges,
            this._language.get("documentTitle")
        );
        this._taskbarCallback.addProjectTool(
            "new_file.svg",
            this._language.get("File"),
            this.createFile,
            this._language.get("documentTitle"),
            "agsbs.File"
        );
        this._taskbarCallback.addProjectTool(
            "undo.svg",
            this._language.get("undo"),
            this.undo,
            this._language.get("documentTitle")
        );
        this._taskbarCallback.addProjectTool(
            "redo.svg",
            this._language.get("redo"),
            this.redo,
            this._language.get("documentTitle")
        );
        this._taskbarCallback.addProjectTool(
            "preview.svg",
            this._language.get("preview"),
            this.showHTMLPreview,
            this._language.get("documentTitle"),
            "agsbs.preview"
        );
        this._taskbarCallback.addProjectTool(
            "generate.svg",
            this._language.get("generateFile"),
            this.generateHTML,
            this._language.get("documentTitle"),
            "agsbs.generateFile"
        );
        this._taskbarCallback.addProjectTool(
            "create_all.svg",
            this._language.get("convertEntireProject"),
            this.generateHTMLForAllProjects,
            this._language.get("documentTitle"),
            "agsbs.convertEntireProject"
        );
        this._taskbarCallback.addProjectTool(
            "check_all.svg",
            this._language.get("checkProject"),
            this.publish,
            this._language.get("publishTitle"),
            "agsbs.checkProject"
        );
        if (gitIsEnabled) {
            this._taskbarCallback.addProjectTool(
                "commit.svg",
                this._language.get("commitChanges"),
                this.commitChanges,
                this._language.get("publishTitle"),
                "agsbs.commitChanges"
            );
        }
    };

    /**
     * Lets you create a new Project
     */
    public createNewProject = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        const optionsHTML = await this._projectHelper.getAllWorkspaceFoldersAsHTMLWithSpeciallyEscapedJSON();
        let html = "";
        html += this._snippets.get("newProjectHTMLPart1") + optionsHTML + this._snippets.get("newProjectHTMLPart2");
        const script = this._snippets.get("newProjectSCRIPT");
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("newProject"),
            callback: this.createNewProjectSidebarCallback,
            buttonText: this._language.get("insert"),
            script
        });
    };

    /**
     * Callback for creating a new project
     */
    public createNewProjectSidebarCallback = async (params) => {
        const pathDataObject = this._projectHelper.convertSpeciallyEscapedJSONToObject(params.folder.value);
        const folderPath = pathDataObject.uri;
        const countOfChapters = params.chapters.value;
        let countOfAppendixChapters;
        if (params.appendixChapters.value === "") {
            countOfAppendixChapters = 0;
        } else {
            countOfAppendixChapters = params.appendixChapters.value;
        }
        const preface = params.preface.checked;
        const language = params.language.value;
        const tableOfContents = params.tableOfContents.checked;
        let tocDepth;
        if (tableOfContents) {
            tocDepth = params.tocDepth.value;
        } else {
            tocDepth = 0;
        }
        const title = params.title.value;
        const editor = params.author.value;
        const institution = params.institution.value;
        const source = params.materialSource.value;
        const sourceAuthor = params.sourceAuthor.value;
        try {
            let alternatePrefix, semYear, workingGroup;
            await this._matuc.newProject({
                countOfAppendixChapters,
                countOfChapters,
                preface,
                language,
                folderPath
            });
            await this._matuc.initMetaData({ folderPath });
            await this._matuc.updateMetaData({
                alternatePrefix,
                editor,
                institution,
                title,
                language,
                source,
                sourceAuthor,
                semYear,
                tocDepth,
                workingGroup,
                folderPath
            });
        } catch (e) {
            vscode.window.showErrorMessage(this._language.get("somethingWentWrongDuringCreatingNewProject"));
            console.log(e);
            return;
        }
        showNotification({ message: this._language.get("createdProjectSuccessfully") });
    };

    /**
     * Lets you edit the Metadata of the current project
     */
    public editProjectData = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        const currentEditor: vscode.TextEditor = await this._helper.getCurrentTextEditor();
        const folder: string = await this._helper.getFolderFromFilePath(currentEditor.document.uri.fsPath);
        const config = await this._matuc.showConfig(folder);
        const html = this._projectHelper.getEditProjectHTMLForm(config, folder);
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("editProject"),
            callback: this.editProjectDatasidebar,
            buttonText: this._language.get("updateEditedData")
        });
    };

    /**
     * Callback for editing the Metadata of the current project.
     */
    public editProjectDatasidebar = async (params) => {
        try {
            await this._matuc.updateMetaData({
                alternatePrefix: params.preface.checked,
                editor: params.author.value,
                institution: params.institution.value,
                title: params.title.value,
                language: params.language.value,
                source: params.materialSource.value,
                sourceAuthor: params.sourceAuthor.value,
                semYear: params.semYear.value,
                tocDepth: params.tocDepth.value,
                workingGroup: params.workingGroup.value,
                folderPath: params.folder.value.replace("\\\\`", "'")
            });
        } catch (e) {
            console.log(e);
            vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
            return;
        }
        showNotification({ message: this._language.get("updateSuccessfull") });
    };

    /**
     * Saves the changes made in the current file
     */
    public saveChanges = async () => {
        const currentEditor = await this._helper.getCurrentTextEditor();
        currentEditor.document.save();
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * creates a new file in the current Project
     */
    public createFile = async () => {
        await this._helper.focusDocument(); //Puts focus back to the text editor
        await vscode.commands.executeCommand("workbench.action.files.newUntitledFile");
        await vscode.commands.executeCommand("workbench.action.files.save");
    };

    /**
     * Undoes the last step.
     */
    public undo = async () => {
        await this._helper.focusDocument(); //Puts focus back to the text editor
        await vscode.commands.executeCommand("undo");
    };

    /**
     * Redoes the last step
     */
    public redo = async () => {
        await this._helper.focusDocument(); //Puts focus back to the text editor
        await vscode.commands.executeCommand("redo");
    };

    /**
     * shows a HTML Preview if available.
     */
    public showHTMLPreview = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
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
    };

    /**
     * Generates the HTML for the current File
     */
    public generateHTML = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        //
        // var isInLecture = await this._matuc.checkIfFileIsWithinLecture(filePath);
        // if (isInLecture === false) {
        //     vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
        //     return;
        // }
        const foundError = await this._matuc.checkAndSaveChanges();
        if (!foundError) {
            this._matuc.convertMaterial(true);
            this._helper.focusDocument(); //Puts focus back to the text editor
        } else {
            console.log("error in generateHTML line 233");
        }
    };

    /**
     * Generates HTML for all projects
     */
    public generateHTMLForAllProjects = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        const currentEditor = await this._helper.getCurrentTextEditor();
        const filePath = currentEditor.document.uri.fsPath;
        const isInLecture = await this._matuc.checkIfFileIsWithinLecture(filePath);
        if (isInLecture === false) {
            vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
            return;
        }
        await this._matuc.checkAndSaveChanges();
        await this._matuc.convertMaterial(false);
        // Puts focus back to the text editor
        this._helper.focusDocument();
    };

    /**
     * publishes the whole Project
     */
    public publish = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
        if (matucIsInstalled === false) {
            vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
            return;
        }
        const currentEditor = await this._helper.getCurrentTextEditor();
        const filePath = currentEditor.document.uri.fsPath;
        const isInLecture = await this._matuc.checkIfFileIsWithinLecture(filePath);
        if (isInLecture === false) {
            vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
            return;
        }
        const html = `
        ${this._language.get("doYouWantToAutocorrect")}<br role="none">
        <div class="spacing" role="none"></div>
        <div class="spacing" role="none"></div>
        <input name="autoCorrectPageNumbering" id="autoCorrectPageNumbering" type="checkbox"/>
        <label for="autoCorrectPageNumbering">${this._language.get("autocorrectPagenumberingCheckbox")}</label>
        `;
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("pagenumbering"),
            callback: this.publishsidebar,
            buttonText: this._language.get("generate")
        });
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * Checks the whole project
     */
    public publishsidebar = async (params) => {
        if (params.autoCorrectPageNumbering.checked) {
            await this._matuc.fixpnumInPlace();
        }
        const currentEditor = await this._helper.getCurrentTextEditor();
        this._matuc.checkEntireProject(currentEditor);
    };

    /**
     * Adds Form to sidebar to clone a project
     */
    public cloneRepo = async () => {
        const gitIsEnabled = await this._settings.get("enableGitUseage");
        if (!gitIsEnabled) {
            vscode.window.showErrorMessage(this._language.get("gitIsNotEnabled"));
            return;
        }
        const gitLoginName = await this._settings.get("gitLoginName");
        const gitUserName = await this._settings.get("gitUserName");
        const gitUserEmail = await this._settings.get("gitUserEmail");
        const html = `
        <label for="gitUser">${this._language.get("gitUser")}</label>
        <input id="gitLoginName" name="gitLoginName" type="text" required="true" value="${gitLoginName}">
        <div class="spacing" role="none"></div>
        <label for="repoName">${this._language.get("repoName")}</label>
        <input id="repoName" name="repoName" type="text" required="true">
        <label for="gitUserName">${this._language.get("userName")}</label>
        <input id="gitUserName" name="gitUserName" type="text" required="true" value="${gitUserName}">
        <label for="mailadresse">${this._language.get("mailadresse")}</label>
        <input id="mailadresse" name="mailadresse" type="text" required="true" value="${gitUserEmail}">
        `;
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("cloneExistingRepo"),
            callback: this.cloneReposidebar,
            buttonText: this._language.get("clone")
        });
    };

    /**
     * clones a project
     */
    public cloneReposidebar = async (params) => {
        const gitLoginName = params.gitLoginName.value;
        const repoName = params.repoName.value;
        const gitUserName = params.gitUserName.value;
        const gitUserEmail = params.mailadresse.value;
        const setGitUsername = await this._settings.get("gitUserName");
        const setGitMail = await this._settings.get("gitUserEmail");
        if (gitUserName !== setGitUsername) {
            this._settings.update("gitUserName", gitUserName);
        }

        if (gitUserEmail !== setGitMail) {
            this._settings.update("gitUserEmail", gitUserEmail);
        }
        this._git.clone(gitLoginName, repoName);
    };

    /**
     * Adds commt changes dialogue to the sidebar
     */
    public commitChanges = async () => {
        const gitIsEnabled = await this._settings.get("enableGitUseage");
        if (!gitIsEnabled) {
            vscode.window.showErrorMessage(this._language.get("gitIsNotEnabled"));
            return;
        }
        const html = `
        <label for="commitChanges">${this._language.get("commitChanges")}</label>
        <div class="spacing" role="none"></div>
        <input id="commitChanges" name="commitChanges" type="text" required="true" placeholder="${this._language.get(
            "commitMessage"
        )}">
        `;
        this._sidebarCallback.addToSidebar({
            html,
            headline: this._language.get("commitChanges"),
            callback: this.commitChangesSidebarCallback,
            buttonText: this._language.get("commit")
        });
    };

    /**
     * commits the changes, and pushes them.
     */
    public commitChangesSidebarCallback = async (params) => {
        const commitMessage = params.commitChanges.value;
        const currentTexteditor = await this._helper.getCurrentTextEditor();
        const projectFolder = await this._helper.getFolderFromFilePath(currentTexteditor.document.uri.fsPath);
        await this._git.addAll(projectFolder);
        const error = await this._git.commit(commitMessage, projectFolder);
        if (error.out.includes("Please tell me who you are")) {
            vscode.window.showErrorMessage(this._language.get("noUserDataIsSet"));
            const userName = await this._settings.get("gitUserName");
            const emailAddress = await this._settings.get("gitUserEmail");
            await this._git.setConfig(userName, emailAddress, projectFolder);
            let msg = this._language.get("SetUserDataInConfig");
            msg = msg.replace("$userName$", userName);
            msg = msg.replace("$emailAddress$", emailAddress);
            showNotification({ message: msg });
            await this._git.commit(commitMessage, projectFolder);
        }
        await this._git.push(projectFolder);
    };
}
