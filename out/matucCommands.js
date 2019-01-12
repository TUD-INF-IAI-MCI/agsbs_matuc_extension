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
// import * as path from 'path';
// import * as fs from 'fs';
const languages_1 = require("./languages");
const helper_1 = require("./helper");
const path = require('path');
const exec = require('child_process').exec;
class MatucCommands {
    constructor() {
        this._language = new languages_1.default;
        this._helper = new helper_1.default;
    }
    /**
     * Check if Matuc is installed on the device.
     * @returns true if installed, otherwise false.
     */
    matucIsInstalled() {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield this.getMatucVersion();
            if (result !== false) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    /**
     * Get the installed Version of Matuc.
     * @returns version of Matuc if installed, otherwise false.
     */
    getMatucVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            var cmd = "";
            cmd += `matuc_js version`;
            return new Promise(function (resolve, reject) {
                try {
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            resolve(false);
                        }
                        if (stdout.includes("result") && stdout.includes("version")) {
                            var fragment;
                            try {
                                fragment = JSON.parse(stdout);
                            }
                            catch (e) {
                                resolve(false);
                            }
                            let result = fragment["result"]["version"];
                            if (result !== undefined && result !== null) {
                                resolve(result);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    });
                }
                catch (e) {
                    resolve(false);
                }
            });
        });
    }
    /**
     * Generats an image description using matuc.
     * @param desc Description of the image
     * @param outsourced Boolean, if the description is outsourced or nor
     * @param currentPath the current working directory, is used to determine the current working directory (cwd)
     * @param title title of the image, is used in the outsourced matuc picture description file
     * @param relPathToImg path to the image in a relative form
     */
    imageDescription(desc, outsourced, currentPath, title, relPathToImg) {
        var cmd = "";
        if (desc.includes("\n")) {
            outsourced = true;
            desc = desc.replace(/\n/g, '\\n'); //TODO: Check if neccessary
        }
        //var pathToImg = relPath;
        //var currentPath = currentPath;		
        cmd += `matuc_js imgdsc -d \"${desc}\" `;
        cmd = outsourced ? cmd + '-o ' : cmd;
        cmd = title ? cmd + '-t "' + title + '" ' : cmd;
        cmd += `${relPathToImg}`;
        console.log(cmd);
        return new Promise(function (resolve, reject) {
            exec(cmd, { cwd: currentPath }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    let fragment = JSON.parse(stdout);
                    reject(fragment.error + "\n" + fragment.usage);
                }
                let fragment = JSON.parse(stdout);
                resolve(fragment.result);
            });
        });
    }
    addPageNumber(selection, currentTextEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this._helper.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this._helper.getWordsSelection(currentTextEditor);
            }
            var line = selection.start.line;
            var thisPath = currentTextEditor.document.uri.path;
            var cmd = `matuc_js addpnum -f ${thisPath} ${line}`;
            return new Promise(function (resolve, reject) {
                try {
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            try {
                                let fragment = JSON.parse(stdout);
                                reject(fragment.error + "\n" + fragment.usage);
                            }
                            catch (e) {
                                resolve(false);
                            }
                        }
                        try {
                            let fragment = JSON.parse(stdout);
                            resolve(fragment.result.pagenumber);
                        }
                        catch (e) {
                            resolve(false);
                        }
                    });
                }
                catch (e) {
                    resolve(false);
                }
            });
        });
    }
    /**
     * Depending on convertAll a single will be converted of or the the whole project.
     * @param path
     * @param convertAll
     */
    convertHtml(path, convertAll) {
        return __awaiter(this, void 0, void 0, function* () {
            // see matuc-commands.js line 283
            // and matuc-commands.js line 349
        });
    }
    initMetaData(path) {
        return __awaiter(this, void 0, void 0, function* () {
            // see matuc-commands.js line 183
        });
    }
    updateMetaData(alternatePrefix, outputFormat, editor, institution, title, language, source, sourceAuthor, semYear, tocDepth, workingGroup, path) {
        return __awaiter(this, void 0, void 0, function* () {
            // multiple parameters are needed
            //
        });
    }
    /**
    * Checks all markdown files in the project folder invoking mistkerl and saves the currend opened file, executes `matuc_js mk`
    */
    checkEntireProject(path) {
        return __awaiter(this, void 0, void 0, function* () {
            // see matuc-commands.js line 256
        });
    }
    /**
     * Loads and show config, .lecture_meta_data.dcxml, of project.
     * @param path
     */
    showConfig(path) {
        // see matuc-commands.js line 197
    }
}
exports.default = MatucCommands;
//# sourceMappingURL=matucCommands.js.map