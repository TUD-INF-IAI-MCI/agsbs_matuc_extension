import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';
import Language from './languages';
const exec = require('child_process').exec;


export default class MatucCommands {

	private _language: Language;
	constructor() {
		this._language = new Language;
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
			desc = desc.replace(/\n/g, '\\n');
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
					return reject(fragment.error + "\n" + fragment.usage);
				}
				let fragment = JSON.parse(stdout);
				resolve(fragment.result);
			});
		});
	}

	/**
	 * Depending on convertAll a single will be converted of or the the whole project. 
	 * @param path 
	 * @param convertAll
	 */
	public convertHtml(path: string, convertAll: boolean) {
		// see matuc-commands.js line 283
		// and matuc-commands.js line 349
	}

	public initMetaData(path: string) {
		// see matuc-commands.js line 183
	}

	public updateMetaData(alternatePrefix, outputFormat, editor, institution,
		title, language, source, sourceAuthor, semYear, tocDepth, workingGroup, path) {
		// multiple parameters are needed
		//
	}

	/**
	* Checks all markdown files in the project folder invoking mistkerl and saves the currend opened file, executes `matuc_js mk`
	*/
	public checkEntireProject(path: String) {
		// see matuc-commands.js line 256
	}


	/**
	 * Loads and show config, .lecture_meta_data.dcxml, of project.
	 * @param path 
	 */
	public showConfig(path: String) {
		// see matuc-commands.js line 197
	}
}
