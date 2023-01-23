/**
 * @author  Lucas Vogel
 */

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import Language from "../languages";
import SettingsHelper from "./settingsHelper";
import Helper from "./helper";

export default class ImageHelper {
    private _language: Language;
    private _settings: SettingsHelper;
    private _helper: Helper;
    private _context: vscode.ExtensionContext;
    constructor(context) {
        this._language = new Language();
        this._settings = new SettingsHelper();
        this._helper = new Helper();
        this._context = context;
    }

    /**
     * Gets the name of the default picture folder
     * @returns String of the picture folder
     */
    public async getPictureFolderName() {
        const folderName: any = await this._settings.get("pictureFolderName");
        let folderString: string = folderName;
        if (folderString === "") {
            folderString = "pictures";
        }
        return folderString;
    }

    /**
     * Adds a image description to a given file path
     * @param filePath file path of the file to write, without the file name
     * @param fileName name of the file
     * @param content content to add
     */
    public addImageDescriptionToFile(fileBasePath: string, fileName: string, content: string) {
        const thisRelPath = path.join(fileBasePath, fileName);
        const thisPath = path.resolve(thisRelPath); //For cross Platform compatibility, makes absolute path from possibly relative one
        content = "\n" + content; //Adding a Line Break at the beginning
        const fd = fs.openSync(thisPath, "a+"); //Open in "add"-Mode
        fs.write(fd, content, (error) => {
            if (error) {
                vscode.window.showErrorMessage(this._language.get("somethingWentWrongDuringInsertOfGraphic"));
                return;
            } else {
                vscode.window.showInformationMessage(fileName + " " + this._language.get("imagesMdHasBeenWritten"));
                fs.closeSync(fd);
            }
        });
    }

    /**
     * Gets the extension of a given file, like 'pic.jpg' returns 'jpg'
     * @param filename string of the file name
     * @returns the string of the file extension
     */
    public getFileExtension(filename: string) {
        const parts = filename.split(".");
        return parts[parts.length - 1];
    }

    /**
     * Checks if the given string of a file name is a file extension of a picture
     * @param filename string of the file name
     * @returns true if the file is an image, otherwise false
     */
    public isImage(filename: string) {
        const ext = this.getFileExtension(filename);
        //filename without e
        const fname = filename.split(".")[0];
        // avoid that formulas eqnXXX.svg are listed
        if (!fname.startsWith("eqn")) {
            switch (ext.toLowerCase()) {
                case "jpg":
                case "gif":
                case "bmp":
                case "png":
                case "jpeg":
                case "svg":
                    //etc
                    return true;
            }
        }
        return false;
    }

    /**
     * Gets all pictures in a folder relative to the currently open file
     * @param path path to the folder
     * @param folder the name of the folder, for example 'pictures'
     * @returns Array of objects of files. The objects have the structure
     * {fileName:'pic.jpg', folderPath:'/Users/.../dir/bilder', completePath:'/Users/.../dir/bilder/pic.jpg', relativePath:'./bilder/pic.jpg', basePath:'/Users/.../dir'}
     */
    public async getAllPicturesInFolder(pathToFolder: any, folder: string) {
        return new Promise(async (resolve, reject) => {
            const folderPath = path.join(pathToFolder.toString(), folder);
            const allFilesArray = [];
            if (fs.existsSync(folderPath)) {
                fs.readdir(folderPath, (err, files) => {
                    files.forEach((file) => {
                        if (this.isImage(file)) {
                            const completePath = path.join(folderPath, file);
                            const relativePath = "." + path.sep + folder + path.sep + file; //generate the relative file path, path.sep gives the OS folder seperator
                            const newFileObject = {
                                fileName: file,
                                folderPath: folderPath,
                                completePath: completePath,
                                relativePath: relativePath,
                                basePath: pathToFolder
                            };
                            allFilesArray.push(newFileObject);
                        }
                    });
                    if (err) {
                        vscode.window.showErrorMessage(this._language.get("error"));
                    }
                    if (allFilesArray.length === 0) {
                        vscode.window.showErrorMessage(this._language.get("thereAreNoPicturesInFolder") + folderPath);
                    }
                    resolve(allFilesArray);
                });
            } else {
                vscode.window.showErrorMessage(this._language.get("noPictureFolderFound") + folderPath);
                //If there is no picture folder
            }
        });
    }

    /**
     * Generates the HTML neccessary for the file selection in the sidebar.
     * @param files an array of files objects, as it is produced by the getAllPicturesInFolder function
     * @returns an HTML-String of the file options, like <option value='FILEPATH'>FILENAME</option>...
     */
    public generateSelectImagesOptionsHTML(files: any) {
        let returnString = "";
        files.forEach((fileObject) => {
            const markdownReadyRelativePath = fileObject.relativePath.replace(" ", "%20"); //Markdown cannot handle Spaces
            //var markdownReadyFileName = fileObject.fileName.replace(" ", "%20");
            fileObject.markdownReadyRelativePath = markdownReadyRelativePath;
            const onDiskPath = vscode.Uri.file(fileObject.completePath);
            // And get the special URI to use with the webview
            fileObject.vscodePath = onDiskPath.with({ scheme: "vscode-resource" }).path; // For Preview
            const json = JSON.stringify(fileObject);
            const myEscapedJSONString = json
                .replace(/\\n/g, "\\n")
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f"); //replacing all special characters to savely inject the json into the value. This might not do anything, not sure. But it works.
            returnString += `<option value='${myEscapedJSONString}'>${fileObject.fileName}</option>`;
            //adding extra attributes that will later be transfered to the params-object, so it can be used later
        });
        return returnString;
    }
}
