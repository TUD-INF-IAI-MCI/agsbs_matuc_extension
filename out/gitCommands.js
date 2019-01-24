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
const settingsHelper_1 = require("./settingsHelper");
const path = require("path");
const exec = require('child_process').exec;
class GitCommands {
    constructor() {
        this._helper = new helper_1.default;
        this._language = new languages_1.default;
        this._settings = new settingsHelper_1.default;
    }
    clone(user, repoName) {
        return __awaiter(this, void 0, void 0, function* () {
            var gitLocalPath = yield this._settings.get("gitLocalPath");
            var gitServerPath = yield this._settings.get("gitServerPath");
            if (gitServerPath.endsWith("/")) {
                gitServerPath = gitServerPath.substring(0, gitServerPath.length - 1);
                this._settings.update("gitServerPath", gitServerPath); //If Path in Settings ends with a /
            }
            if (gitServerPath === "") {
                vscode.window.showErrorMessage(this._language.get("missingGitServerPath"));
                return;
            }
            var gitCmd = `git clone ssh://${user}@${gitServerPath}/${repoName}`;
            console.log("gitCmd " + gitCmd);
            if (!(yield this._helper.folderExists(gitLocalPath))) {
                this._helper.mkDir(gitLocalPath);
            }
            exec(gitCmd, { cwd: gitLocalPath }, (error, stdout, stderr) => {
                if (error) {
                    console.warn(`exec error: ${error}`);
                    vscode.window.showErrorMessage(this._language.get("gitCloneError"));
                }
                else {
                    vscode.window.showInformationMessage(this._language.get("gitCloneSucess"));
                    var newFolderName = path.join(gitLocalPath, repoName);
                    this._helper.addWorkspaceFolder(newFolderName);
                }
            });
        });
    }
    /**
    * Executes `git pull`.
    */
    pull(path) {
        return __awaiter(this, void 0, void 0, function* () {
            exec('git pull', { cwd: path }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });
    }
    /**
    * Executes `git add -A`.
    */
    addAll(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                exec('git add -A', { cwd: path }, (error, stdout, stderr) => {
                    if (error) {
                        console.error("path " + path);
                        console.error(`exec error: ${error}`);
                        reject(error);
                    }
                    resolve({ out: stdout, err: stderr });
                });
            });
        });
    }
    /**
    * Executes `git commit -am "message"`.
    * @param {string} message The commit message.
    * @param {string} path The path of the local git repository.
    */
    commit(message, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                exec(`git commit -am "${message}"`, { cwd: path }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        vscode.window.showErrorMessage(this._language.get("commitChangesErrorDetail"));
                        console.log(error);
                        return reject(error);
                    }
                    resolve({ out: stdout, err: stderr });
                });
            });
        });
    }
    /**
    * Executes `git push`.
    */
    push(path) {
        return __awaiter(this, void 0, void 0, function* () {
            exec('git push origin', { cwd: path }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });
    }
}
exports.default = GitCommands;
//# sourceMappingURL=gitCommands.js.map