/**
 * @author Jens Voegler
 * @author Lucas Vogel
 * This Code was written under the supervision of Jens Voegler and ported to VSCode from Lucas Vogel with minimal changes.
 */
import * as vscode from 'vscode';
import Language from './languages';
import Helper from './helper/helper';
const osLocale = require('os-locale');
const path = require('path');
const exec = require('child_process').exec;

/**
 * This Class contains all Functions regarding matuc
 */
export default class MatucCommands {
	private _language: Language;
	private _helper: Helper;

	constructor() {
		this._language = new Language;
		this._helper = new Helper;
	}

	/**
	 * Check if Matuc is installed on the device.
	 * @returns true if installed, otherwise false.
	 */
	public async matucIsInstalled() {
		var result = await this.getMatucVersion();
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
	public async getMatucVersion() {
		var cmd = "";
		cmd += `matuc_js version`;
		return new Promise(function (resolve, reject) {
			try {
				exec(cmd, (error, stdout, stderr) => {
					if (error) {
						resolve(false);
					}
					if (stdout.includes("result") && stdout.includes("version")) {
						var fragment: JSON;
						try {
							fragment = JSON.parse(stdout);
						} catch (e) {
							resolve(false);
						}
						let result = fragment["result"]["version"];
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
	public imageDescription(desc: string, outsourced: boolean, currentPath: string, title: string, relPathToImg: string) {
		var cmd = "";
		if (desc.includes("\n")) {
			outsourced = true;
			desc = desc.replace(/\n/g, '\\n'); //TODO: Check if neccessary
		}
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

	/**
	 * Get what pagenumber has to be inserted at a specific point in a fole
	 * @param selection optional. the selection, only the start-line of the selection will be handled
	 * @param currentTextEditor optional. The TextEditor to work with.
	 */
	public async addPageNumber(selection?: vscode.Selection, currentTextEditor?: vscode.TextEditor) {
		if (currentTextEditor === undefined) {
			currentTextEditor = await this._helper.getCurrentTextEditor();
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
						} catch (e) {
							resolve(false);
						}
					}
					try {
						let fragment = JSON.parse(stdout);
						resolve(fragment.result.pagenumber);
					} catch (e) {
						resolve(false);
					}
				});
			} catch (e) {
				resolve(false);
			}
		});
	}


	/**
	 * Initializes a Metadata-File
	 * @param path path to the document where the Metadata applies
	 */
	public async initMetaData(path: string) {
		// see matuc-commands.js line 183
		return new Promise(function (resolve, reject) {
			exec('matuc conf init', { cwd: path }, (error, stdout, stderr) => {
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
	 * @param outputFormat aparently not used and not documented in the original matuc code of Atom.
	 * @param editor Author of the Project
	 * @param institution Institution where this is written
	 * @param title Title of the Project
	 * @param language Language the Project is written in
	 * @param source Material source that is used
	 * @param sourceAuthor Source Author that is used
	 * @param semYear Semester this the project is written
	 * @param tocDepth depth of the table of content
	 * @param workingGroup Working Group of the Author
	 * @param path Path to the Folder
	 */
	public async updateMetaData(alternatePrefix, outputFormat, editor: string, institution: string,
		title: string, language: string, source: string, sourceAuthor: string, semYear, tocDepth: number, workingGroup: string, path: string) {
		// multiple parameters are needed
		var cmd;
		cmd = 'matuc_js conf update ';
		cmd = alternatePrefix ? cmd + '-a ' : cmd;
		cmd = editor ? cmd + '-e "' + editor + '" ' : cmd;
		cmd = institution ? cmd + '-i "' + institution + '" ' : cmd;
		cmd = title ? cmd + '-l "' + title + '" ' : cmd;
		cmd = language ? cmd + '-L "' + language + '" ' : cmd;
		cmd = source ? cmd + '-s "' + source + '" ' : cmd;
		cmd = sourceAuthor ? cmd + '-A "' + sourceAuthor + '" ' : cmd;
		cmd = semYear ? cmd + '-S "' + semYear + '" ' : cmd;
		cmd = tocDepth ? cmd + '--toc-depth ' + tocDepth + ' ' : cmd;
		cmd = workingGroup ? cmd + '-w "' + workingGroup + '" ' : cmd;
		console.log("cmd update " + cmd);
		return new Promise(function (resolve, reject) {
			exec(cmd, { cwd: path }, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return reject(error);
				}
				resolve({ out: stdout, err: stderr });
			});
		});
	}

	/**
	* Checks all markdown files in the project folder invoking mistkerl and saves the currend opened file, executes `matuc_js mk`
	*/
	public async checkEntireProject(path: string, currentTextEditor?: vscode.TextEditor) {
		if (currentTextEditor === undefined) {
			currentTextEditor = await this._helper.getCurrentTextEditor();
		}
		var filepath = currentTextEditor.document.uri.fsPath;
		var folderpath = await this._helper.getFolderFromFilePath(filepath);
		var folderpathAbove = folderpath.substr(0, folderpath.lastIndexOf("/")); //Go one Folder above to the root oh the project
		var path = folderpathAbove;
		var cmd = `matuc_js mk \"${path}\"`;
		currentTextEditor.document.save();
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(cmd);
				console.error(`exec error: ${error}`);
				return;
			}
			var mistkerl = JSON.parse(stdout);
			if (typeof mistkerl.result === 'string') {
				vscode.window.showInformationMessage(this._language.get("mistkerlDidNotFindAnyError"));
			} else {
				vscode.window.showErrorMessage(mistkerl.result);
			}
		});
	}

	/**
	 * Checks if a File is within the lecture
	 * @param pathToFile absolute path to the file
	 */
	public async checkIfFileIsWithinLecture(pathToFile) {

		var cmd;
		cmd = `matuc_js iswithinlecture \"${pathToFile}\"`;
		console.log("cmd checkIfFileIsWithinLecture : " + cmd);
		var isWithinLecture;
		return new Promise(function (resolve, reject) {
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
					reject(error);
				}
				isWithinLecture = JSON.parse(stdout).result['is within a lecture'];
				resolve(isWithinLecture);
			});
		});
	}

	/**
	 * Loads and show config, .lecture_meta_data.dcxml, of project.
	 * @param path 
	 */
	public async showConfig(path: string) {
		var cmd;
		if (process.platform === 'win32') {
			cmd = `matuc_js conf show`;
		}
		if (process.platform === 'darwin') {
			cmd = 'matuc_js conf show ';
		}
		if (process.platform === 'linux') {
			vscode.window.showErrorMessage(this._language.get("linuxNotSupportedYet"));
			return false;
		}
		return new Promise(function (resolve, reject) {
			console.log("Execute");
			exec(cmd, { cwd: path }, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					vscode.window.showErrorMessage(this._language.get("unExpectedMatucError"));
					resolve(false);
				}
				var currentConfig = JSON.parse(stdout);
				resolve(currentConfig.result['Current settings']);
			});
		});
	}

	/**
	* Creates a new matuc project, executes `matuc_js new`
	* @param {int} countOfAppendixChapters The count of chapters in appendix
	* @param {int} countOfChapters The count of chapters
	* @param {boolean} preface Whether a preface shall be added
	* @param {string} language Sets the language for the matuc project
	* @param {string} path Sets the path where the project shall be stored
	*/
	public async newProject(countOfAppendixChapters: number, countOfChapters: number, preface: boolean, language: string, path: string) {
		var cmd = 'matuc new ';
		cmd = countOfAppendixChapters ? cmd + '-a ' + countOfAppendixChapters + ' ' : cmd;
		cmd = countOfChapters !== null ? cmd + '-c ' + countOfChapters + ' ' : cmd;
		cmd = preface === true ? cmd + '-p ' : cmd;
		cmd = language !== null ? cmd + '-l ' + language + ' ' : cmd;
		cmd = path !== null ? cmd + "\"" + path + "\"" : cmd + '.';
		console.log("command is  " + cmd);
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
		var env = Object.create(process.env);
		var lang = "de_De";
		osLocale().then(locale => {
			lang = locale;
		});
		env.LANG = `${lang}.UTF-8`; // form should be "de_DE.UTF-8";
		return env;
	}

	/**
	 * Converts a File 
	 * @param profile the given profile, "visually" for the visually impaied or "blind" for the blind
	 * @param currentTextEditor optional. The current Text editor to work with.
	 */
	public async convertFile(profile: string, currentTextEditor?: vscode.TextEditor) {
		if (currentTextEditor === undefined) {
			currentTextEditor = await this._helper.getCurrentTextEditor();
		}
		var path = currentTextEditor.document.uri.fsPath;
		if (await currentTextEditor.document.isDirty) {
			await currentTextEditor.document.save();
		}
		var cmd = `matuc_js conv "${path}"`;
		if (profile === 'visually') {
			cmd += ` -p vid`;
		}
		console.log("matuc conv command " + cmd);
		exec(cmd, { env: this.getOsLocale() }, (error, stdout, stderr) => {
			if (error) {
				let fragment = JSON.parse(stdout);
				let message = "";
				if (fragment.error.hasOwnProperty('line')) {
					message += "\n\n\n" + this._language.get("checkLine") + fragment.error.line;
				}
				if (fragment.error.hasOwnProperty('path')) {
					message += "\n\n" + this._language.get("checkFile") + " " + fragment.error.path;
				}
				vscode.window.showErrorMessage(this._language.get("unExpectedMatucError") + message);
				console.error(`exec error: ${error}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			//load generate HTML-file
			this.loadGeneratedHtml(path);
		});

	}
	// add quotes to path if necessary and loads generate Html afterthat
	loadGeneratedHtml(path) {
		let cmd = '';
		if (process.platform === 'win32') {
			cmd = `\"${path.replace("md", "html")}\"`;
		} else if (process.platform === 'darwin') {
			cmd = `open ./\"${path.replace("md", "html")}\"`;
		}
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.error(`load generate html`);
				console.error(`exec error: ${error}`);
				return;
			}
		});
	}


	/**
	* Checks and saves changes in the current opened file invoking mistkerl, executes `matuc_js mk`
	@param currentTextEditor optional. The Text Editor to work with.
	*/
	public async checkAndSaveChanges(currentTextEditor?: vscode.TextEditor) {

		if (currentTextEditor === undefined) {
			currentTextEditor = await this._helper.getCurrentTextEditor();
		}
		var path = currentTextEditor.document.uri.fsPath;
		if (await currentTextEditor.document.isDirty) {
			await currentTextEditor.document.save();
		}
		var cmd = `matuc_js mk \"${path}\" `;
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			var mistkerl = JSON.parse(stdout);
			if (typeof mistkerl.result === 'string') {
				vscode.window.showInformationMessage(this._language.get("mistkerlDidNotFindAnyErrorAndSavedFile"));
			} else {
				vscode.window.showErrorMessage(mistkerl.result);
			}
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
		});
	}

	/**
	 * Converts a whole project.
	 * @param profile the given profile, "visually" for the visually impaied or "blind" for the blind
	 * @param currentTextEditor optional. The current Text editor to work with.
	 */
	public async convertEntireProject(profile: string, currentTextEditor?: vscode.TextEditor) {
		if (currentTextEditor === undefined) {
			currentTextEditor = await this._helper.getCurrentTextEditor();
		}
		currentTextEditor.document.save();
		var path = currentTextEditor.document.uri.fsPath;
		var cmd;
		if (process.platform === 'win32') {
			cmd = 'matuc_js master';
			cmd += ` \"${path}\\..\"`;
		} else {
			// OS X and Linux
			cmd = `matuc_js master ${path}/..`;
		}
		if (profile === 'visually') {
			cmd += ` -p vid`;
		}
		console.log(cmd);
		exec(cmd, { env: this.getOsLocale(), cwd: path }, (error, stdout, stderr) => {
			if (error) {
				let fragment = JSON.parse(stdout);
				let message = "";
				if (fragment.error.message.startsWith("No configuration")) {
					message = this._language.get("noConfiguration");
				} else {
					message = fragment.error.message;
					if (fragment.error.hasOwnProperty('path')) {
						message += "\n\n\n" + this._language.get("checkFile") + " " + fragment.error.path;
					}
				}
				vscode.window.showErrorMessage(this._language.get("unExpectedMatucError") + message);
				console.error(`exec error: ${error}`);
				return;
			} else {
				this.loadGeneratedHtml(path);
			}
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
		});
		//open file
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
		var path = currentTextEditor.document.uri.fsPath;
		var cmd = `matuc_js fixpnums -i -f \"${path}\"`;
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

