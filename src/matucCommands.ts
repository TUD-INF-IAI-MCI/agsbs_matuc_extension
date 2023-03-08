/**
 * @author Jens Voegler
 * @author Lucas Vogel
 * This Code was written under the supervision of Jens Voegler and ported to VSCode from Lucas Vogel with minimal changes.
 */
import * as vscode from "vscode";
import Language from "./languages";
import Helper from "./helper/helper";
import { exec, spawn } from "child_process";
import Sidebar from "./sidebar";
import osLocale = require("os-locale");
import path = require("path");
import { showNotification } from "./helper/notificationHelper";
import { ProjectConfig } from "./types/types";

/**
 * This Class contains all Functions regarding matuc
 */
export default class MatucCommands {
    private _language: Language;
    private _helper: Helper;
    private _sidebarCallback: Sidebar;

    constructor(sidebarCallback) {
        this._language = new Language();
        this._helper = new Helper();
        this._sidebarCallback = sidebarCallback;
    }

    /**
     * Check if Matuc is installed on the device.
     * @returns true if installed, otherwise false.
     */
    public async matucIsInstalled() {
        const result = await this.getMatucVersion();
        if (result !== false) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the installed Version of Matuc.
     * @returns version of Matuc if installed, otherwise false.
     */
    public async getMatucVersion(): Promise<string | false> {
        const cmd = "`matuc_js version`";
        return new Promise(function (resolve) {
            try {
                exec(cmd, (error, stdout) => {
                    if (error) {
                        resolve(false);
                    }
                    if (stdout.includes("result") && stdout.includes("version")) {
                        let fragment: JSON;
                        try {
                            fragment = JSON.parse(stdout);
                        } catch (e) {
                            resolve(false);
                        }
                        const result = fragment["result"]["version"];
                        if (result !== undefined && result !== null) {
                            resolve(result);
                        }
                    } else {
                        resolve(false);
                    }
                });
            } catch (e) {
                resolve(false);
            }
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
    public imageDescription(
        desc: string,
        outsourced: boolean,
        currentPath: string,
        title: string,
        relPathToImg: string
    ) {
        let cmd = "";
        if (desc.includes("\n") || desc.includes('"')) {
            outsourced = true;
            desc = desc.replace(/\n/g, "\\n"); //TODO: Check if neccessary
            desc = desc.replace(/\"/g, '\\"'); // demask quotes
        }

        cmd += `matuc_js imgdsc -d \"${desc}\" `;
        cmd = outsourced ? cmd + "-o " : cmd;
        cmd = title ? cmd + '-t "' + title.trim() + '" ' : cmd;
        cmd += `${relPathToImg}`;
        console.log(cmd);
        return new Promise(function (resolve, reject) {
            exec(cmd, { cwd: currentPath }, (error, stdout) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    const fragment = JSON.parse(stdout);
                    reject(fragment.error + "\n" + fragment.usage);
                }
                const fragment = JSON.parse(stdout);
                resolve(fragment.result);
            });
        });
    }

    /**
     * Get what pagenumber has to be inserted at a specific point in a fole
     * @param selection optional. the selection, only the start-line of the selection will be handled
     * @param currentTextEditor optional. The TextEditor to work with.
     */
    public async addPageNumber(selection?: vscode.Selection, currentTextEditor?: vscode.TextEditor): Promise<string> {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        const line = selection.start.line;
        const thisPath = currentTextEditor.document.uri.fsPath;
        const cmd = `matuc_js addpnum -f "${thisPath}" ${line}`;
        return new Promise(function (resolve, reject) {
            try {
                exec(cmd, (error, stdout) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        try {
                            const fragment = JSON.parse(stdout);
                            reject(fragment.error + "\n" + fragment.usage);
                        } catch (e) {
                            resolve("");
                        }
                    }
                    try {
                        const fragment = JSON.parse(stdout);
                        resolve(fragment.result.pagenumber);
                    } catch (e) {
                        resolve("");
                    }
                });
            } catch (e) {
                resolve("");
            }
        });
    }

    /**
     * Initializes a Metadata-File
     * @param docpath path to the document where the Metadata applies
     */
    public async initMetaData({ folderPath }: { folderPath: string }) {
        // see matuc-commands.js line 183
        return new Promise(function (resolve, reject) {
            exec("matuc conf init", { cwd: folderPath }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return reject(error);
                }
                resolve({ out: stdout, err: stderr });
            });
        });
    }

    /**
     * Updates the Metadata
     * @param alternatePrefix if the Checkbox "Appendix Prefix" is checked. the type is not clear but most propably a boolean.
     * @param editor Author of the Project
     * @param institution Institution where this is written
     * @param title Title of the Project
     * @param language Language the Project is written in
     * @param source Material source that is used
     * @param sourceAuthor Source Author that is used
     * @param semYear Semester this the project is written
     * @param tocDepth depth of the table of content
     * @param workingGroup Working Group of the Author
     * @param folderPath Path to the Folder
     */
    public async updateMetaData({
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
    }: {
        alternatePrefix: boolean;
        editor?: string;
        institution: string;
        title: string;
        language: string;
        source: string;
        sourceAuthor: string;
        semYear: string;
        tocDepth: number;
        workingGroup: string;
        folderPath: string;
    }) {
        // multiple parameters are needed
        let cmd = "matuc_js conf update";

        if (alternatePrefix) cmd += " -a";
        if (editor) cmd += ` -e "${editor}"`;
        if (institution) cmd += ` -i "${institution}"`;
        if (title) cmd += ` -l "${title}"`;
        if (language) cmd += ` -L "${language}"`;
        if (source) cmd += ` -s "${source}"`;
        if (sourceAuthor) cmd += ` -A "${sourceAuthor}"`;
        if (semYear) cmd += ` -S "${semYear}"`;
        if (tocDepth) cmd += ` --toc-depth ${tocDepth}`;
        if (workingGroup) cmd += ` -w "${workingGroup}"`;
        console.log("cmd update " + cmd);
        return new Promise(function (resolve, reject) {
            exec(cmd, { cwd: folderPath }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return reject(error);
                }
                resolve({ out: stdout, err: stderr });
            });
        });
    }

    /**
     * Checks all markdown files in the project folder invoking mistkerl and saves the current opened file, executes `matuc_js mk`
     */
    public async checkEntireProject(currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        const filepath = currentTextEditor.document.uri.fsPath;
        const cmd = `matuc_js mk \"${filepath}\"`;
        currentTextEditor.document.save();
        exec(cmd, (error, stdout) => {
            if (error) {
                console.log(cmd);
                console.error(`exec error: ${error}`);
                return;
            }
            const mistkerl = JSON.parse(stdout);
            if (typeof mistkerl.result === "string") {
                showNotification({ message: this._language.get("mistkerlDidNotFindAnyError") });
            } else {
                this._helper.ShowMkErrorMessage(mistkerl.result);
            }
        });
    }

    /**
     * Checks if a File is within the lecture
     * @param pathToFile absolute path to the file
     */
    public async checkIfFileIsWithinLecture(pathToFile: string) {
        const cmd = `matuc_js iswithinlecture \"${pathToFile}\"`;
        console.log("cmd checkIfFileIsWithinLecture : " + cmd);
        let isWithinLecture;
        return new Promise(function (resolve, reject) {
            exec(cmd, (error, stdout) => {
                if (error) {
                    vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
                    reject(error);
                }
                isWithinLecture = JSON.parse(stdout).result["is within a lecture"];
                resolve(isWithinLecture);
            });
        });
    }

    /**
     * Loads and show config, .lecture_meta_data.dcxml, of project.
     * @param filePath
     */
    public async showConfig(filePath: string): Promise<ProjectConfig> {
        let cmd;
        if (process.platform === "win32") {
            cmd = `matuc_js conf show`;
        }
        if (process.platform === "darwin") {
            cmd = "matuc_js conf show ";
        }
        if (process.platform === "linux") {
            vscode.window.showErrorMessage(this._language.get("linuxNotSupportedYet"));
            vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
        }
        return new Promise(function (resolve, reject) {
            console.log("Execute");
            exec(cmd, { cwd: filePath }, (error, stdout) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
                }
                const currentConfig = JSON.parse(stdout);
                // check why Aktuelle Einstellungen is default also for english data
                if (currentConfig.result.hasOwnProperty("Aktuelle Einstellungen")) {
                    resolve(currentConfig.result["Aktuelle Einstellungen"]);
                } else if (currentConfig.result.hasOwnProperty("Current settings")) {
                    resolve(currentConfig.result["Current settings"]);
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * Creates a new matuc project, executes `matuc_js new`
     * @param {int} countOfAppendixChapters The count of chapters in appendix
     * @param {int} countOfChapters The count of chapters
     * @param {boolean} preface Whether a preface shall be added
     * @param {string} language Sets the language for the matuc project
     * @param {string} projectPath Sets the path where the project shall be stored
     */
    public async newProject({
        countOfAppendixChapters,
        countOfChapters,
        preface,
        language,
        folderPath
    }: {
        countOfAppendixChapters: number;
        countOfChapters: number;
        preface: boolean;
        language: string;
        folderPath: string;
    }) {
        let cmd = `matuc new ${folderPath !== null ? `"${folderPath}"` : "."}`;

        if (countOfAppendixChapters) cmd += ` -a ${countOfAppendixChapters}`;
        if (countOfChapters !== null) cmd += ` -c ${countOfChapters}`;
        if (preface) cmd += " -p";
        if (language !== null) cmd += ` -l ${language}`;

        return new Promise(function (resolve, reject) {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return reject(error);
                }
                resolve({ out: stdout, err: stderr });
            });
        });
    }

    /**
     * Generates and returns a os locale
     * @returns the OS-Locale string
     */
    getOsLocale() {
        const env = Object.create(process.env);
        let lang = "de_De";
        osLocale().then((locale) => {
            lang = locale;
        });
        env.LANG = `${lang}.UTF-8`; // form should be "de_DE.UTF-8";
        return env;
    }
    /**
     * Converts a single file or all file with a project
     * @param isOnlyFile if true only a file is convert, if false all markdown file will converted
     */
    public async convertMaterial(isOnlyFile: boolean) {
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const filePath = currentTextEditor.document.uri.fsPath;
        let parameter;
        if (await currentTextEditor.document.isDirty) {
            await currentTextEditor.document.save();
        }
        if (isOnlyFile) {
            parameter = filePath;
        } else {
            // path is needed
            parameter = path.dirname(path.dirname(filePath));
        }
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: this._language.get("generateMaterial"),
                cancellable: true
            },
            async (progress, token) => {
                await this.executeConversion(progress, token, parameter);
                this.loadGeneratedHtml(filePath);
            }
        );
    }

    public executeConversion(
        progress: vscode.Progress<{ message?: string; increment?: number }>,
        token: vscode.CancellationToken,
        parameter: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const matucProcess = spawn("matuc_js", ["conv", parameter]);
            matucProcess.stderr.on("data", (data) => {
                console.log("stderr " + data.toString());
                vscode.window.showErrorMessage("Fehler");
            });
            matucProcess.stdout.on("data", (data) => {
                console.log("stdout " + data.toString());

                const parsedData = JSON.parse(data.toString());
                if (typeof parsedData.result === "string") {
                    showNotification({ message: this._language.get("mistkerlDidNotFindAnyError") });
                } else {
                    if (parsedData.hasOwnProperty("error")) {
                        this._sidebarCallback.addToSidebar({
                            html: this._helper.FormatMatucErrorMessage(parsedData.error),
                            headline: this._language.get("error")
                        });
                        reject();
                    } else {
                        if (parsedData.hasOwnProperty("result")) {
                            this._sidebarCallback.addToSidebar({
                                html: parsedData.error,
                                headline: this._language.get("error")
                            });
                            reject();
                        }
                    }
                }
            });
            matucProcess.on("close", (code) => {
                if (code === 0) {
                    showNotification({ message: this._language.get("generatingSuccess") });
                    resolve();
                }
            });
            token.onCancellationRequested(() => matucProcess.kill());
        });
    }

    // add quotes to path if necessary and loads generate Html afterthat
    public loadGeneratedHtml(filePath) {
        let cmd = "";
        if (process.platform === "win32") {
            cmd = `\"${filePath.replace("md", "html")}\"`;
        } else if (process.platform === "darwin") {
            cmd = `open ./\"${filePath.replace("md", "html")}\"`;
        }
        exec(cmd, (error) => {
            if (error) {
                console.error(`load generate html`);
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }

    /**
	* Checks and saves changes in the current opened file invoking mistkerl, executes `matuc_js mk`
	If an error occur false is returned otherwise true for no error.
	@param currentTextEditor optional. The Text Editor to work with.
	*/
    public async checkAndSaveChanges(currentTextEditor?: vscode.TextEditor) {
        let noErrorFound = false;
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        const filePath = currentTextEditor.document.uri.fsPath;
        if (await currentTextEditor.document.isDirty) {
            await currentTextEditor.document.save();
        }
        const cmd = `matuc_js mk \"${filePath}\" `;
        await exec(cmd, (error, stdout) => {
            if (error) {
                console.error(`exec error: ${error}`);
                noErrorFound = false;
            }
            const mistkerl = JSON.parse(stdout);
            if (typeof mistkerl.result === "string") {
                showNotification({ message: this._language.get("mistkerlDidNotFindAnyError") });
                noErrorFound = true;
            } else {
                this._helper.ShowMkErrorMessage(mistkerl.result);
                noErrorFound = false;
            }
        });
        return noErrorFound;
    }

    /**
     * Fixes the page numbering of a given file
     * @param currentTextEditor optional. Current Text Editor to work with.
     */
    public async fixpnumInPlace(currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        currentTextEditor.document.save();
        const path = currentTextEditor.document.uri.fsPath;
        const cmd = `matuc_js fixpnums -i -f \"${path}\"`;
        return new Promise(function (resolve, reject) {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                resolve({ out: "fixpnums inplace", err: stderr });
            });
        });
    }
}
