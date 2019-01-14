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
const helper_1 = require("./helper");
const languages_1 = require("./languages");
const matucCommands_1 = require("./matucCommands");
class ProjectToolsFunctions {
    constructor(taskbarCallback, sidebarCallback, context) {
        this.setup = () => __awaiter(this, void 0, void 0, function* () {
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
        });
        /**
         * Lets you create a new Project
         */
        this.createNewProject = () => __awaiter(this, void 0, void 0, function* () {
            var form = `
        
        `;
        });
        /**
         * Lets you edit the Metadata of the current project
         */
        this.editProjectData = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * Saves the changes made in the current file
         */
        this.saveChanges = () => __awaiter(this, void 0, void 0, function* () {
            var currentEditor = yield this._helper.getCurrentTextEditor();
            currentEditor.document.save();
        });
        /**
         * creates a new file in the current Project
         */
        this.createNewFile = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * Undoes the last step.
         */
        this.undo = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * Redoes the last step
         */
        this.redo = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * shows a HTML Preview if available.
         */
        this.showHTMLPreview = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * Generates the HTML for the current project
         */
        this.generateHTML = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * Generates HTML for all Projects
         */
        this.generateHTMLForAllProjects = () => __awaiter(this, void 0, void 0, function* () {
        });
        /**
         * publishes the whole Project
         */
        this.publish = () => __awaiter(this, void 0, void 0, function* () {
        });
        this._helper = new helper_1.default;
        this._language = new languages_1.default;
        this._sidebarCallback = sidebarCallback;
        this._taskbarCallback = taskbarCallback;
        this._matuc = new matucCommands_1.default;
    }
}
exports.default = ProjectToolsFunctions;
//# sourceMappingURL=projectToolsFunctions.js.map