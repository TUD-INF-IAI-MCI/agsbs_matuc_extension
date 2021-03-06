"use strict";
/**
 * @author  Lucas Vogel
 */
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
const languages_1 = require("../languages");
const helper_1 = require("./helper");
/**
 * A Helper for all the project tool functions
 */
class ProjectHelper {
    constructor() {
        this._language = new languages_1.default;
        this._helper = new helper_1.default;
    }
    /**
     * gets all the open Workspace folders.
     * @returns object with all folders
     */
    getAllWorkspaceFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            var folders = yield vscode.workspace.workspaceFolders;
            return folders;
        });
    }
    /**
     * Returns a HTML String of <option> Elements to be used in a form with all Workspace Folders.
     * The Values of the objects are specially escaped json-strings (see code) to the full path of the folders as well as extra information.
     * @returns HTML-String of <option> Elements of all Workspace Folders
     */
    getAllWorkspaceFoldersAsHTMLWithSpeciallyEscapedJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            var folders = yield vscode.workspace.workspaceFolders;
            var html = "";
            if (folders === null || folders === undefined || folders.length === 0) {
                console.log("error no folders open");
                return html; //returns empty string
            }
            else {
                console.log(folders);
                folders.forEach(folder => {
                    var escapedName = folder["name"].replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"); //For better reading 
                    var thisValues = {};
                    thisValues["uri"] = folder.uri.fsPath;
                    thisValues["scheme"] = folder.uri.scheme;
                    thisValues["index"] = folder.index;
                    var escapedValue = JSON.stringify(thisValues);
                    escapedValue = escapedValue.replace("'", "\\\\`");
                    //Escape ' as \\` because there is no clean way to escape a json string :(
                    html += `<option value='${escapedValue}'>${escapedName}</option>`;
                });
                return (html);
            }
        });
    }
    /**
     * Converts specially escaped JSON back to normal JSON
     * @param json specially escaped json string
     * @returns JSON-Object
     */
    convertSpeciallyEscapedJSONToObject(json) {
        var unescapedString = json.replace("\\\\`", "'");
        try {
            var result = JSON.parse(unescapedString);
            return result;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    /**
     * Returns the Form for Editing the Project Metadata.
     * Because there are a lot of prefilled Input Fields, this cannot be outsourced as a snippet.
     * @param config an config-Object with all the information to insert into the form.
     * @param folder a passthrough of the folder to edit the metadata of. This is made to make it easier to work in the Sidebar Callback. The Information is passed as a hidden input field.
     * @returns the HTML-Form
     */
    getEditProjectHTMLForm(config, folder) {
        var appendixPrefix = config.AppendixPrefix === 1 ? true : false;
        var author = config.Editor === "Unknown" ? "" : config.Editor;
        var sourceAuthor = config.SourceAuthor === "Unknown" ? "" : config.SourceAuthor;
        var institution = config.Institution === "Unknown" ? "" : config.Institution;
        var title = config.LectureTitle === "Unknown" ? "" : config.LectureTitle;
        var language = config.Language === "Unknown" ? "" : config.Language;
        var languageEN = language === "en" ? "selected='true'" : "";
        var languageDE = language === "de" ? "selected='true'" : "";
        var languageFR = language === "fr" ? "selected='true'" : "";
        var tocDepth = config.TocDepth;
        var source = config.Source === "Unknown" ? "" : config.Source;
        var semesterOfEdit = config.SemesterOfEdit === "Unknown" ? "" : config.SemesterOfEdit;
        var workingGroup = config.WorkingGroup === "Unknown" ? "" : config.WorkingGroup;
        var escapedPath = folder.replace("'", "\\\\`");
        var form = `
        <input type="checkbox" name="preface" id="preface" checked="${appendixPrefix}">
        <label for="preface">${this._language.get("preface")}</label><br role="none">

        <div class="spacing" role="none"></div>
        <label for="author">${this._language.get("author")}</label><br role="none">
        <input type="text" name="author" id="author" placeholder="${author}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="sourceAuthor">${this._language.get("sourceAuthor")}</label><br role="none">
        <input type="text" name="sourceAuthor" id="sourceAuthor" placeholder="${sourceAuthor}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="institution">${this._language.get("institution")}</label><br role="none">
        <input type="text" name="institution" id="institution" placeholder="${institution}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="title">${this._language.get("title")}</label><br role="none">
        <input type="text" name="title" id="title" placeholder="${title}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="projectLanguage">${this._language.get("projectLanguage")}</label><br role="none">
        <select name="language" id="language">
        <option value="en" ${languageEN}>${this._language.get("en")}</option>
        <option value="de" ${languageDE}>${this._language.get("de")}</option>
        <option value="fr" ${languageFR}>${this._language.get("fr")}</option>
        </select><br role="none">

        <div class="spacing" role="none"></div>
        <label for="tocDepth">${this._language.get("toc_Depth")}</label><br role="none">
        <input type="number" name="tocDepth" id="tocDepth" min="1" step="1" placeholder="0" value="${tocDepth}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="materialSource">${this._language.get("materialSource")}</label><br role="none">
        <input type="text" name="materialSource" id="materialSource" value="${source}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="semYear">${this._language.get("semYear")}</label><br role="none">
        <input type="text" name="semYear" id="semYear" placeholder="${semesterOfEdit}"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="workingGroup">${this._language.get("workingGroup")}</label><br role="none">
        <input type="text" name="workingGroup" id="workingGroup" placeholder="${workingGroup}"><br role="none">

        <input type="hidden" value ='${escapedPath}' name="folder" id="folder" role="none">
        `;
        return (form);
    }
    /**
     * Get the Form for the Conversion profile. This will possibly be legacy soon, because it is no longer needed in further Version of Matuc.
     * @returns Form HTML
     */
    getConversionProfileHTML() {
        var form = `
            <div class="spacing" role="none"></div>
            <label for="conversionProfile">${this._language.get("conversionProfile")}</label><br role="none">
            <select name="conversionProfile" id="conversionProfile" required="true">
                <option value="blind">${this._language.get("blind")}</option>
                <option value="visually">${this._language.get("visuallyImpaired")}</option>
            </select>
        `;
        return form;
    }
}
exports.default = ProjectHelper;
//# sourceMappingURL=projectHelper.js.map