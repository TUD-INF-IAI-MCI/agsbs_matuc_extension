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
	}

	public async updateMetaData(alternatePrefix, outputFormat, editor, institution,
		title, language, source, sourceAuthor, semYear, tocDepth, workingGroup, path) {
		// multiple parameters are needed
		//
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
	public showConfig(path: string) {
		// see matuc-commands.js line 197
	}
}
