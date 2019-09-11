/**
 * @author Jens Voegler
 * @author Lucas Vogel
 * This code was created by Jens Voegler and ported to VSCode by Lucas Vogel.
 */
import * as vscode from 'vscode';
import Helper from './helper/helper';
import Language from './languages';
import SettingsHelper from './helper/settingsHelper';
import * as path from 'path';
import { getMaxListeners } from 'cluster';
const exec = require('child_process').exec;

export default class GitCommands {
	private _helper: Helper;
	private _language: Language;
	private _settings: SettingsHelper;

	constructor() {
		this._helper = new Helper;
		this._language = new Language;
		this._settings = new SettingsHelper;
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
		var gitCmd = `git clone ${usesHttpsOrSshForGit}://${user}@${gitServerPath}/${repoName}`;
		console.log("gitCmd " + gitCmd);
		if (!await this._helper.folderExists(gitLocalPath)) {
			this._helper.mkDir(gitLocalPath);
		}
		exec(gitCmd, { cwd: gitLocalPath }, (error, stdout, stderr) => {
			if (error) {
				console.warn(`exec error: ${error}`);
				vscode.window.showErrorMessage(this._language.get("gitCloneError"));
			} else {
				vscode.window.showInformationMessage(this._language.get("gitCloneSucess"));
				var newFolderName = path.join(gitLocalPath, repoName);
				this._helper.addWorkspaceFolder(newFolderName);
			}
		});
	}

	/**
	* Executes `git pull`.
	*/
	public async pull(path) {
		exec('git pull', { cwd: path }, (error, stdout, stderr) => {
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
			exec('git add -A', { cwd: path }, (error, stdout, stderr) => {
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
		exec('git push origin', { cwd: path }, (error, stdout, stderr) => {
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
		var gitConfig = await this.getConfig(path);
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
		exec('git config -l --local', { cwd: path }, (error, stdout, stderr) => {
			if (error) {
				console.log("Error during git config -l --local \n \t" + error);
				reject(error);
			}
			resolve(stdout);
		});

	}
}
