"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author  Lucas Vogel
 */
const languages_1 = require("../languages");
class ProjectToolsFunctionSnippets {
    /**
     * Gets a snippet
     * @param snippetName identifier of the snippet
     * @returns snippet
     */
    get(snippetName) {
        return (this.d[snippetName]);
    }
    constructor() {
        this._language = new languages_1.default;
        this.d = [];
        /**************** NEW PROJECT ****************** */
        this.d['newProjectHTMLPart1'] = `
        <label for="folder">${this._language.get("selectFolder")}</label><br role="none">

        <select name="folder" id="folder" required="true" onchange="onFileSelectorChange()">
        <option value="" disabled="true">Select Folder</option>
        `;
        this.d['newProjectHTMLPart2'] = `
        </select>
        <br role="none">
        <div class="spacing" role="none"></div>
        <input type="checkbox" name="preface" id="preface" disabled="true">
        <label for="preface">${this._language.get("preface")}</label><br role="none">

        <div class="spacing" role="none"></div>
        <label for="chapters">${this._language.get("chapters")}</label><br role="none">
        <input type="number" name="chapters" id="chapters" min="1" step="1" required="true" placeholder="0" value="1" disabled="true"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="appendixChapters">${this._language.get("appendixChapters")}</label><br role="none">
        <input type="number" name="appendixChapters" id="appendixChapters" min="0" step="1" placeholder="0" value="0" disabled="true"><br role="none">

        <div class="spacing" role="none"></div>
        <label for="projectLanguage">${this._language.get("projectLanguage")}</label><br  role="none">
        <select name="language" id="language" disabled="true">
        <option value="en" selected>${this._language.get("en")}</option>
        <option value="de">${this._language.get("de")}</option>
        <option value="fr">${this._language.get("fr")}</option>
        </select><br  role="none">

        <div class="spacing" role="none"></div>
        <input type="checkbox" name="tableOfContents" id="tableOfContents" onchange="tableOfContentsCheckboxChange()" disabled="true">
        <label for="tableOfContents" >${this._language.get("tableOfContents")}</label><br  role="none">

        <div class="spacing" role="none"></div>
        <label for="tocDepth">${this._language.get("tocDepthExplanation")}</label><br  role="none">
        <input type="number" name="tocDepth" id="tocDepth" min="0" step="1" value="0" disabled="true"><br  role="none">

        <div class="spacing" role="none"></div>
        <label for="title">${this._language.get("title")}</label><br  role="none">
        <input type="text" name="title" id="title" required="true"  disabled="true"><br  role="none">

        <div class="spacing" role="none"></div>
        <label for="author">${this._language.get("author")}</label><br  role="none">
        <input type="text" name="author" id="author" required="true"   disabled="true"><br  role="none">

        <div class="spacing" role="none"></div>
        <label for="institution">${this._language.get("institution")}</label><br  role="none">
        <input type="text" name="institution" id="institution" required="true"  disabled="true"><br  role="none">

        <div class="spacing" role="none"></div>
        <label for="materialSource">${this._language.get("materialSource")}</label><br  role="none">
        <input type="text" name="materialSource" id="materialSource" required="true"  disabled="true"><br  role="none">

        <div class="spacing" role="none"></div>
        <label for="sourceAuthor">${this._language.get("sourceAuthor")}</label><br  role="none">
        <input type="text" name="sourceAuthor" id="sourceAuthor" required="true"  disabled="true"><br  role="none">

        `;
        this.d['newProjectSCRIPT'] = `

            function onFileSelectorChange(){
                var preface = document.getElementById("preface");
                var chapters = document.getElementById("chapters");
                var appendixChapters = document.getElementById("appendixChapters");
                var language = document.getElementById("language");
                var tableOfContents = document.getElementById("tableOfContents");

                var title = document.getElementById("title");
                var author = document.getElementById("author");
                var institution = document.getElementById("institution");
                var materialSource = document.getElementById("materialSource");
                var sourceAuthor = document.getElementById("sourceAuthor");
                console.log("change");
                var folderselector = document.getElementById("folder");
                console.log(folderselector.value);
                if(folderselector!==""){
                    preface.disabled = false;
                    chapters.disabled = false;
                    appendixChapters.disabled = false;
                    language.disabled = false;
                    tableOfContents.disabled= false;
                    

                    title.disabled = false;
                    author.disabled = false;
                    institution.disabled = false;
                    materialSource.disabled = false;
                    sourceAuthor.disabled = false;
                } else {
                    preface.disabled = true;
                    chapters.disabled = true;
                    appendixChapters.disabled = true;
                    language.disabled = true;
                    tableOfContents.disabled= true;

                    title.disabled = true;
                    author.disabled = true;
                    institution.disabled = true;
                    materialSource.disabled = true;
                    sourceAuthor.disabled = true;
                }
            }
            onFileSelectorChange();
            function tableOfContentsCheckboxChange () {
                var tableOfContentsCheckbox = document.getElementById("tableOfContents");
                var tocDepth = document.getElementById("tocDepth");
                if(tableOfContentsCheckbox.checked === true){
                    tocDepth.disabled = false;
                } else {
                    tocDepth.disabled = true;
                }
            }`;
    }
}
exports.default = ProjectToolsFunctionSnippets;
//# sourceMappingURL=projectToolsFunctionsSnippets.js.map