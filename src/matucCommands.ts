import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';
import Language from './languages';
import Helper from './helper';
const path = require('path');

const exec = require('child_process').exec;


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
	public async matucIsInstalled () {
		var result = await this.getMatucVersion();
		if(result !== false){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Get the installed Version of Matuc.
	 * @returns version of Matuc if installed, otherwise false.
	 */
	public async getMatucVersion (){
		var cmd = "";
		cmd += `matuc_js version`;
		
		return new Promise(function (resolve, reject) {
			try{
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					resolve(false);
				}
				if(stdout.includes("result") && stdout.includes("version")){
					var fragment:JSON;
					try {
						fragment = JSON.parse(stdout);
					} catch (e){
						resolve(false);
					}
					let result = fragment["result"]["version"];
					if(result !== undefined && result !== null){
						resolve(result);
					}
				} else {
					resolve(false);
				}
			});
		} catch (e){
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
			desc = desc.replace(/\n/g,'\\n'); //TODO: Check if neccessary
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

	public async addPageNumber (selection?:vscode.Selection,currentTextEditor?:vscode.TextEditor){
		
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
						try{
						let fragment = JSON.parse(stdout);
						reject(fragment.error + "\n" + fragment.usage);
						} catch(e){
							resolve(false);
						}
					}
					try{
					let fragment = JSON.parse(stdout);
					resolve(fragment.result.pagenumber);
					} catch(e){
						resolve(false);
					}
				});
			} catch (e){
				resolve(false);
			}
		});
	}

	/**
	 * Depending on convertAll a single will be converted of or the the whole project. 
	 * @param path 
	 * @param convertAll
	 */
	public async convertHtml(path: string, convertAll: boolean) {
		// see matuc-commands.js line 283
		// and matuc-commands.js line 349
	}

	public async initMetaData(path: string) {
		// see matuc-commands.js line 183
		return new Promise(function (resolve, reject) {
			exec('matuc conf init', {cwd: path}, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return reject(error);
				}
				resolve({out: stdout, err: stderr});
				// console.log(`stdout: ${stdout}`);
				// console.log(`stderr: ${stderr}`);
			});
		});
	}

	public async updateMetaData(alternatePrefix, outputFormat, editor:string, institution:string,
		title:string, language:string, source:string, sourceAuthor:string, semYear, tocDepth:number, workingGroup, path) {
		// multiple parameters are needed
		//
		var cmd;
		cmd = 'matuc_js conf update ';
		cmd = alternatePrefix ? cmd + '-a ' : cmd;
		cmd = editor ? cmd + '-e "' + editor + '" ' : cmd;
		cmd = institution ? cmd + '-i "' + institution + '" ' : cmd;
		cmd = title ? cmd + '-l "' + title + '" ' : cmd;
		cmd = language ? cmd + '-L "' + language + '" ' : cmd;
		cmd = source  ? cmd + '-s "' + source + '" ' : cmd;
		cmd = sourceAuthor  ? cmd + '-A "' + sourceAuthor + '" ' : cmd;
		cmd = semYear ? cmd + '-S "' + semYear + '" ' : cmd;
		cmd = tocDepth  ? cmd + '--toc-depth ' + tocDepth + ' ' : cmd;
		cmd = workingGroup ? cmd + '-w "' + workingGroup + '" ' : cmd;
		console.log("cmd update " + cmd);
		return new Promise(function (resolve, reject) {
			exec(cmd, {cwd: path}, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return reject(error);
				}
				resolve({out: stdout, err: stderr});
			});
		});
	}

	/**
	* Checks all markdown files in the project folder invoking mistkerl and saves the currend opened file, executes `matuc_js mk`
	*/
	public async checkEntireProject(path: string) {
		// see matuc-commands.js line 256
	}


	/**
	 * Loads and show config, .lecture_meta_data.dcxml, of project.
	 * @param path 
	 */
	public async showConfig(path:string) {
		var cmd;
		if(process.platform === 'win32'){
				cmd = `matuc_js conf show`;
		}
		if(process.platform === 'darwin'){
			cmd = 'matuc_js conf show ';
		}
		if(process.platform === 'linux'){
			vscode.window.showErrorMessage(this._language.get("linuxNotSupportedYet"));
			return false;
		}
		//var cmd = 'matuc_js conf show';
		return new Promise(function (resolve, reject) {
			console.log("Execute");
			exec(cmd, {cwd: path}, (error, stdout, stderr) => {
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
	public async newProject(countOfAppendixChapters, countOfChapters, preface, language, path) {

		var cmd = 'matuc new ';
		cmd = countOfAppendixChapters ? cmd + '-a ' + countOfAppendixChapters + ' ' : cmd;
		cmd = countOfChapters !== null ? cmd + '-c ' + countOfChapters + ' ' : cmd;
		cmd = preface === true ? cmd + '-p ' : cmd;
		cmd = language !== null ? cmd + '-l ' + language + ' ' : cmd;
		cmd = path !== null ? cmd + "\"" + path + "\"" : cmd + '.';
		console.log("command is  " +cmd);
		return new Promise(function (resolve, reject) {
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return reject(error);
				}
				resolve({out: stdout, err: stderr});
				// console.log(`stdout: ${stdout}`);
				// console.log(`stderr: ${stderr}`);
			});
		});
	}
}
