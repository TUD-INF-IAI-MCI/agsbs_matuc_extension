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
    public imageDescription(desc:string, outsourced:boolean, currentPath:string, title:string, relPathToImg:string){
        var cmd = "";
		if(desc.includes("\n")){
			outsourced = true;
			desc = desc.replace(/\n/g,'\\n'); //TODO: Check if neccessary
		}

		//var pathToImg = relPath;
		//var currentPath = currentPath;		
		cmd += `matuc_js imgdsc -d \"${desc}\" `;
		cmd = outsourced ? cmd + '-o ': cmd;
		cmd = title ? cmd + '-t "' + title + '" ' : cmd;
		cmd += `${relPathToImg}`;


		console.log(cmd);
		return new Promise(function (resolve, reject) {
			exec(cmd, {cwd: currentPath}, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					let fragment = JSON.parse(stdout);
					return reject(fragment.error +"\n" +fragment.usage);
				}
				let fragment = JSON.parse(stdout);
				resolve(fragment.result);
			});
        });
        
    }
    }