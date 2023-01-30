/**
 * @author Jens Voegler
 * @author Lucas Vogel
 * This code was created by Jens Voegler and ported to VSCode by Lucas Vogel.
 */
import * as vscode from "vscode";
import Helper from "./helper/helper";
import Language from "./languages";
import SettingsHelper from "./helper/settingsHelper";
import * as path from "path";
import { getMaxListeners, removeAllListeners } from "cluster";
import { ClientRequest } from "http";
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;

export default class GitCommands {
    private _helper: Helper;
    private _language: Language;
    private _settings: SettingsHelper;

    constructor() {
        this._helper = new Helper();
        this._language = new Language();
        this._settings = new SettingsHelper();
    }

    /**
     * Clones a Repo
     * @param user ZIH-Username as a String
     * @param repoName Name of the repo
     */
    public async clone(user, repoName) {
        var gitLocalPath: any = await this._settings.get("gitLocalPath");
        var gitServerPath: any = await this._settings.get("gitServerPath");
        var usesHttpsOrSshForGit = await this._settings.get("usesHttpsOrSshForGit");
        if (gitServerPath.endsWith("/")) {
            gitServerPath = gitServerPath.substring(0, gitServerPath.length - 1);
            this._settings.update("gitServerPath", gitServerPath); //If Path in Settings ends with a /
        }
        if (gitServerPath === "") {
            vscode.window.showErrorMessage(this._language.get("missingGitServerPath"));
            return;
        }
        // for using matShare
        if (repoName.startsWith("https://elvis.inf.tu-dresden.de/matshare/")) {
            gitServerPath = repoName;
        } else {
            gitServerPath = `${usesHttpsOrSshForGit}://${user}@${gitServerPath}/${repoName}`;
        }
        if (!(await this._helper.folderExists(gitLocalPath))) {
            this._helper.mkDir(gitLocalPath);
        }
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Klonen (hardcoded) ",
                cancellable: true
            },
            (progress, token) => {
                return this.gitClone(progress, token, gitServerPath, gitLocalPath, repoName);
            }
        );
    }

    /**
     * @param progress
     * @param token
     * @param gitServerPath like ssh://USER@URL
     * @param gitLocalPath
     */
    public gitClone(
        progress: vscode.Progress<{ message?: string; increment?: number }>,
        token: vscode.CancellationToken,
        gitServerPath: string,
        gitLocalPath: string,
        repoName: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (token.isCancellationRequested) {
                return;
            }
            console.log("try to execute command:");
            console.log(`\t git clone ${gitServerPath}`);
            let lastStderr;
            let gitCloneProcess = spawn("git", ["clone", gitServerPath, "--progress"], {
                cwd: gitLocalPath,
                shell: true
            });
            gitCloneProcess.stderr.on("data", (data) => {
                lastStderr = data.toString();
                progress.report({ message: lastStderr });
            });
            gitCloneProcess.on("close", (code) => {
                if (code === 0) {
                    vscode.window.showInformationMessage(this._language.get("gitCloneSucess"));
                    if (repoName.includes("/")) {
                        var arr = repoName.split("/");
                        repoName = arr[arr.length - 1];
                    }
                    var newFolderName = path.join(gitLocalPath, repoName);
                    this._helper.addWorkspaceFolder(newFolderName);
                    this.track(newFolderName);
                    resolve();
                }
                if (code === 128) {
                    console.log("clone error");
                    vscode.window.showErrorMessage(this._language.get("gitCloneError") + " " + lastStderr);
                    reject();
                }
            });
            gitCloneProcess.stdout.on("data", (data) => {});

            token.onCancellationRequested((_) => gitCloneProcess.kill());
        });
    }

    // async end

    /**
     * Track git repo
     * @param path
     */
    public async track(path) {
        exec("git branch -u origin/master", { cwd: path }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec git track error: ${error}`);
                return;
            }
            return;
        });
    }

    /**
     * Executes `git pull`.
     */
    public async pull(path) {
        exec("git pull", { cwd: path }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }

    /**
     * Executes `git add -A`.
     */
    public async addAll(path) {
        return new Promise(function (resolve, reject) {
            exec("git add -A", { cwd: path }, (error, stdout, stderr) => {
                if (error) {
                    console.error("path " + path);
                    console.error(`exec error: ${error}`);
                    reject(error);
                }
                resolve({ out: stdout, err: stderr });
            });
        });
    }

    /**
     * Executes `git commit -am "message"`.
     * @param {string} message The commit message.
     * @param {string} path The path of the local git repository.
     */
    public async commit(message, path) {
        var promThis = this;
        return new Promise(function (resolve, reject) {
            exec(`git commit -am "${message}"`, { cwd: path }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    vscode.window.showErrorMessage(promThis._language.get("commitChangesErrorDetail"));
                    resolve({ out: error.message });
                }
                resolve({ out: stdout, err: stderr });
            });
        });
    }

    /**
     * Executes `git push`.
     */
    public async push(path) {
        exec("git push origin", { cwd: path }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                vscode.window.showErrorMessage(this._language.get("gitPushError"));
                return;
            }
            vscode.window.showInformationMessage(this._language.get("gitPushSuccess"));
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }

    public async setConfig(userName: string, eMail: string, path) {
        var gitConfig: any = await this.getConfig(path);
        if (!gitConfig.includes("user.email") || !gitConfig.includes("user.name")) {
            var command = `git config --local user.email \"${eMail}\" && `;
            command += `git config --local user.name  \"${userName}\"`;
            return new Promise(function (resolve, reject) {
                exec(command, { cwd: path }, (error, stdout, stderr) => {
                    if (error) {
                        console.log("Error setting git config -l --local \n \t" + error);
                        reject(error);
                    }
                    resolve(stdout);
                });
            });
        }
    }

    public async getConfig(path) {
        return new Promise(function (resolve, reject) {
            exec("git config -l --local", { cwd: path }, (error, stdout, stderr) => {
                if (error) {
                    console.log("Error during git config -l --local \n \t" + error);
                    reject(error);
                }
                resolve(String(stdout));
            });
        });
    }
}
