"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helper_1 = require("./helper");
const languages_1 = require("./languages");
const matucCommands_1 = require("./matucCommands");
const projectHelper_1 = require("./projectHelper");
const projectToolsFunctionsSnippets_1 = require("./projectToolsFunctionsSnippets");
const settingsHelper_1 = require("./settingsHelper");
const gitCommands_1 = require("./gitCommands");
class ProjectToolsFunctions {
    constructor(taskbarCallback, sidebarCallback, context) {
        this.setup = () => __awaiter(this, void 0, void 0, function* () {
            var gitIsEnabled = yield this._settings.get("enableGitUseage");
            this._taskbarCallback.addProjectTool("new_project.svg", this._language.get("newProject"), this.createNewProject, this._language.get("projectTitle"));
            this._taskbarCallback.addProjectTool("edit.svg", this._language.get("editProject"), this.editProjectData, this._language.get("projectTitle"));
            if (gitIsEnabled === true) {
                this._taskbarCallback.addProjectTool("clone.svg", this._language.get("cloneExistingRepo"), this.cloneRepo, this._language.get("projectTitle"));
            }
            this._taskbarCallback.addProjectTool("save.svg", this._language.get("saveChanges"), this.saveChanges, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("new_file.svg", this._language.get("newFile"), this.createNewFile, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("undo.svg", this._language.get("undo"), this.undo, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("redo.svg", this._language.get("redo"), this.redo, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("preview.svg", this._language.get("preview"), this.showHTMLPreview, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("generate.svg", this._language.get("generateFile"), this.generateHTML, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("create_all.svg", this._language.get("convertEntireProject"), this.generateHTMLForAllProjects, this._language.get("documentTitle"));
            this._taskbarCallback.addProjectTool("check_all.svg", this._language.get("checkProject"), this.publish, this._language.get("publishTitle"));
            if (gitIsEnabled === true) {
                this._taskbarCallback.addProjectTool("commit.svg", this._language.get("commitChanges"), this.commitChanges, this._language.get("publishTitle"));
            }
        });
        /**
         * Lets you create a new Project
         */
        this.createNewProject = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var optionsHTML = yield this._projectHelper.getAllWorkspaceFoldersAsHTMLWithSpeciallyEscapedJSON();
            //updateWorkspaceFolders
            var form = '';
            form += this._snippets.get("newProjectHTMLPart1");
            form += optionsHTML;
            form += this._snippets.get("newProjectHTMLPart2");
            var script = this._snippets.get("newProjectSCRIPT");
            this._sidebarCallback.addToSidebar(form, this._language.get("newProject"), this.createNewProjectSidebarCallback, this._language.get("insert"), "", script);
        });
        /**
         * Callback for creating a new project
         */
        this.createNewProjectSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            //console.log(params);
            var path, chapterCount, appendixChapterCount, preface, projectLanguage, tableOfContents, title, editor, institution, sourceMaterial, sourceAuthor, depthOfTableOfContents;
            var pathDataObject = this._projectHelper.convertSpeciallyEscapedJSONToObject(params.folder.value);
            path = pathDataObject.uri;
            chapterCount = params.chapters.value;
            if (params.appendixChapters.value === '') {
                appendixChapterCount = 0;
            }
            else {
                appendixChapterCount = params.appendixChapters.value;
            }
            preface = params.preface.checked;
            projectLanguage = params.language.value;
            tableOfContents = params.tableOfContents.checked;
            if (tableOfContents) {
                depthOfTableOfContents = params.tocDepth.value;
            }
            else {
                depthOfTableOfContents = 0;
            }
            title = params.title.value;
            editor = params.author.value;
            institution = params.institution.value;
            sourceMaterial = params.materialSource.value;
            sourceAuthor = params.sourceAuthor.value;
            try {
                let alternatePrefix, outputFormat, semYear, workingGroup;
                yield this._matuc.newProject(appendixChapterCount, chapterCount, preface, projectLanguage, path);
                yield this._matuc.initMetaData(path);
                yield this._matuc.updateMetaData(alternatePrefix, outputFormat, editor, institution, title, projectLanguage, sourceMaterial, sourceAuthor, semYear, depthOfTableOfContents, workingGroup, path);
            }
            catch (e) {
                vscode.window.showErrorMessage(this._language.get("somethingWentWrongDuringCreatingNewProject"));
                console.log(e);
                return;
            }
            vscode.window.showInformationMessage(this._language.get("createdProjectSuccessfully"));
        });
        /**
         * Lets you edit the Metadata of the current project
         */
        this.editProjectData = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var currentEditor = yield this._helper.getCurrentTextEditor();
            var folder = yield this._helper.getFolderFromFilePath(currentEditor.document.uri.fsPath);
            var config = yield this._matuc.showConfig(folder);
            console.log(config, folder);
            if (config === false) {
                vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
                return;
            }
            var form = this._projectHelper.getEditProjectHTMLForm(config, folder);
            this._sidebarCallback.addToSidebar(form, this._language.get("editProject"), this.editProjectDataSidebarCallback, this._language.get("updateEditedData"));
        });
        /**
         * Callback for editing the Metadata of the current project.
         */
        this.editProjectDataSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
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
            var thisPath = params.folder.value;
            thisPath = thisPath.replace("\\\\`", "'");
            try {
                yield this._matuc.updateMetaData(alternatePrefix, null, editor, institution, title, projectLanguage, source, sourceAuthor, semYear, tocDepth, workingGroup, thisPath);
            }
            catch (e) {
                console.log(e);
                vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
                return;
            }
            vscode.window.showInformationMessage(this._language.get("updateSuccessfull"));
        });
        /**
         * Saves the changes made in the current file
         */
        this.saveChanges = () => __awaiter(this, void 0, void 0, function* () {
            var currentEditor = yield this._helper.getCurrentTextEditor();
            currentEditor.document.save();
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * creates a new file in the current Project
         */
        this.createNewFile = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.focusDocument(); //Puts focus back to the text editor
            yield vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
            yield vscode.commands.executeCommand('workbench.action.files.save');
        });
        /**
         * Undoes the last step.
         */
        this.undo = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.focusDocument(); //Puts focus back to the text editor
            yield vscode.commands.executeCommand('undo');
        });
        /**
         * Redoes the last step
         */
        this.redo = () => __awaiter(this, void 0, void 0, function* () {
            yield this._helper.focusDocument(); //Puts focus back to the text editor
            yield vscode.commands.executeCommand('redo');
        });
        /**
         * shows a HTML Preview if available.
         */
        this.showHTMLPreview = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            yield this._helper.focusDocument(); //Puts focus back to the text editor
            // try{
            //     vscode.commands.executeCommand("markdown-preview-enhanced.openPreview");
            //     return;
            // } catch(e){
            //     console.log(e);
            // } // no Markdown enhanced because it ALLWAYS opens to the right. Bad :(
            vscode.commands.executeCommand("markdown.showPreview");
        });
        /**
         * Generates the HTML for the current File
         */
        this.generateHTML = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var currentEditor = yield this._helper.getCurrentTextEditor();
            var filePath = currentEditor.document.uri.fsPath;
            var isInLecture = yield this._matuc.checkIfFileIsWithinLecture(filePath);
            if (isInLecture === false) {
                vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
                return;
            }
            var form = this._projectHelper.getConversionProfileHTML();
            //TODO: autoselect last selection
            this._sidebarCallback.addToSidebar(form, this._language.get("generateFile"), this.generateHTMLSidebarCallback, this._language.get("generate"));
        });
        /**
         * Callback for generating the HTML for the current File
         */
        this.generateHTMLSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var profile = params.conversionProfile.value;
            yield this._matuc.checkAndSaveChanges();
            yield this._matuc.convertFile(profile);
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * Generates HTML for all projects
         */
        this.generateHTMLForAllProjects = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var currentEditor = yield this._helper.getCurrentTextEditor();
            var filePath = currentEditor.document.uri.fsPath;
            var isInLecture = yield this._matuc.checkIfFileIsWithinLecture(filePath);
            if (isInLecture === false) {
                vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
                return;
            }
            var form = this._projectHelper.getConversionProfileHTML();
            //TODO: autoselect last selection
            this._sidebarCallback.addToSidebar(form, this._language.get("convertEntireProject"), this.generateHTMLForAllProjectsSidebarCallback, this._language.get("generate"));
        });
        /**
         * Callback for generating the HTML for all projects
         */
        this.generateHTMLForAllProjectsSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var profile = params.conversionProfile.value;
            yield this._matuc.checkAndSaveChanges();
            yield this._matuc.convertEntireProject(profile);
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        /**
         * publishes the whole Project
         */
        this.publish = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            if (matucIsInstalled === false) {
                vscode.window.showErrorMessage(this._language.get("matucNotInstalled"));
                return;
            }
            var currentEditor = yield this._helper.getCurrentTextEditor();
            var filePath = currentEditor.document.uri.fsPath;
            var isInLecture = yield this._matuc.checkIfFileIsWithinLecture(filePath);
            if (isInLecture === false) {
                vscode.window.showErrorMessage(this._language.get("notInsideLecture"));
                return;
            }
            var form = `
        ${this._language.get("doYouWantToAutocorrect")}<br role="none">
        <div class="spacing" role="none"></div>
        <div class="spacing" role="none"></div>
        <input name="autoCorrectPageNumbering" id="autoCorrectPageNumbering" type="checkbox"/>
        <label for="autoCorrectPageNumbering">${this._language.get("autocorrectPagenumberingCheckbox")}</label>
        `;
            this._sidebarCallback.addToSidebar(form, this._language.get("pagenumbering"), this.publishSidebarCallback, this._language.get("generate"));
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        this.publishSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            if (params.autoCorrectPageNumbering.checked === true) {
                yield this._matuc.fixpnumInPlace();
            }
            var currentEditor = yield this._helper.getCurrentTextEditor();
            var filePath = currentEditor.document.uri.fsPath;
            this._matuc.checkEntireProject(filePath);
        });
        this.cloneRepo = () => __awaiter(this, void 0, void 0, function* () {
            var gitIsEnabled = yield this._settings.get("enableGitUseage");
            if (gitIsEnabled === false) {
                vscode.window.showErrorMessage(this._language.get("gitIsNotEnabled"));
                return;
            }
            var form = `
        <label for="gitUser">${this._language.get("gitUser")}</label>
        <input id="gitUser" name="gitUser" type="text" required="true">
        <div class="spacing" role="none"></div>
        <label for="repoName">${this._language.get("repoName")}</label>
        <input id="repoName" name="repoName" type="text" required="true">
        `;
            this._sidebarCallback.addToSidebar(form, this._language.get("cloneExistingRepo"), this.cloneRepoSidebarCallback, this._language.get("clone"));
        });
        this.cloneRepoSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var userName = params.gitUser.value;
            var repoName = params.repoName.value;
            this._git.clone(userName, repoName);
        });
        this.commitChanges = () => __awaiter(this, void 0, void 0, function* () {
            var gitIsEnabled = yield this._settings.get("enableGitUseage");
            if (gitIsEnabled === false) {
                vscode.window.showErrorMessage(this._language.get("gitIsNotEnabled"));
                return;
            }
            var form = `
        <label for="commitChanges">${this._language.get("commitChanges")}</label>
        <div class="spacing" role="none"></div>
        <input id="commitChanges" name="commitChanges" type="text" required="true" placeholder="${this._language.get("commitMessage")}">
        `;
            this._sidebarCallback.addToSidebar(form, this._language.get("commitChanges"), this.commitChangesSidebarCallback, this._language.get("commit"));
        });
        this.commitChangesSidebarCallback = (params) => __awaiter(this, void 0, void 0, function* () {
            var commitMessage = params.commitChanges.value;
            var currentTexteditor = yield this._helper.getCurrentTextEditor();
            var projectFolder = this._helper.getFolderFromFilePath(currentTexteditor.document.uri.fsPath);
            yield this._git.addAll(projectFolder);
            yield this._git.commit(commitMessage, projectFolder);
            yield this._git.push(projectFolder);
        });
        this._helper = new helper_1.default;
        this._language = new languages_1.default;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._matuc = new matucCommands_1.default;
        this._projectHelper = new projectHelper_1.default;
        this._snippets = new projectToolsFunctionsSnippets_1.default;
        this._settings = new settingsHelper_1.default;
        this._git = new gitCommands_1.default;
    }
}
exports.default = ProjectToolsFunctions;
//# sourceMappingURL=projectToolsFunctions.js.map