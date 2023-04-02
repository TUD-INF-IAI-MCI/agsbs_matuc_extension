/**
 * @author  Lucas Vogel
 */

import * as vscode from "vscode";
import Language from "../languages";
import Helper from "./helper";
import { ProjectConfig } from "../types/types";

/**
 * A Helper for all the project tool functions
 */
export default class ProjectHelper {
    private _language: Language;
    private _helper: Helper;
    constructor() {
        this._language = new Language();
        this._helper = new Helper();
    }

    /**
     * gets all the open Workspace folders.
     * @returns object with all folders
     */
    public async getAllWorkspaceFolders() {
        const folders = vscode.workspace.workspaceFolders;
        return folders;
    }

    /**
     * Returns a HTML String of <option> Elements to be used in a form with all Workspace Folders.
     * The Values of the objects are specially escaped json-strings (see code) to the full path of the folders as well as extra information.
     * @returns HTML-String of <option> Elements of all Workspace Folders
     */
    public async getAllWorkspaceFoldersAsHTMLWithSpeciallyEscapedJSON() {
        const folders = vscode.workspace.workspaceFolders;
        let html = "";
        if (folders === null || folders === undefined || folders.length === 0) {
            console.log("error no folders open");
            return html; //returns empty string
        } else {
            console.log(folders);
            folders.forEach((folder) => {
                const escapedName = folder["name"].replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"); //For better reading
                const thisValues = {};
                thisValues["uri"] = folder.uri.fsPath;
                thisValues["scheme"] = folder.uri.scheme;
                thisValues["index"] = folder.index;
                let escapedValue = JSON.stringify(thisValues);
                escapedValue = escapedValue.replace("'", "\\\\`");
                //Escape ' as \\` because there is no clean way to escape a json string :(
                html += `<option value='${escapedValue}'>${escapedName}</option>`;
            });
            return html;
        }
    }

    /**
     * Converts specially escaped JSON back to normal JSON
     * @param json specially escaped json string
     * @returns JSON-Object
     */
    public convertSpeciallyEscapedJSONToObject(json: string) {
        const unescapedString = json.replace("\\\\`", "'");
        try {
            const result = JSON.parse(unescapedString);
            return result;
        } catch (e) {
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

    public getEditProjectHTMLForm(config: ProjectConfig, folder: string): string {
        const appendixPrefix = config.AppendixPrefix === 1 ? true : false;
        const author = config.Editor === "Unknown" ? "" : config.Editor;
        const sourceAuthor = config.SourceAuthor === "Unknown" ? "" : config.SourceAuthor;
        const institution = config.Institution === "Unknown" ? "" : config.Institution;
        const title = config.LectureTitle === "Unknown" ? "" : config.LectureTitle;
        const language = config.Language === "Unknown" ? "" : config.Language;
        const languageEN = language === "en" ? "selected='true'" : "";
        const languageDE = language === "de" ? "selected='true'" : "";
        const languageFR = language === "fr" ? "selected='true'" : "";
        const tocDepth = config.TocDepth;
        const source = config.Source === "Unknown" ? "" : config.Source;
        const semesterOfEdit = config.SemesterOfEdit === "Unknown" ? "" : config.SemesterOfEdit;
        const workingGroup = config.WorkingGroup === "Unknown" ? "" : config.WorkingGroup;
        const escapedPath = folder.replace("'", "\\\\`");
        return `
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
    }

    /**
     * Get the Form for the Conversion profile. This will possibly be legacy soon, because it is no longer needed in further Version of Matuc.
     * @returns Form HTML
     */
    public getConversionProfileHTML() {
        const form = `
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
