"use strict";
/**
 * @author  Lucas Vogel
 */
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
const path = require("path");
const fs = require("fs");
const languages_1 = require("../languages");
const settingsHelper_1 = require("./settingsHelper");
const helper_1 = require("./helper");
class ImageHelper {
    constructor(context) {
        this._language = new languages_1.default;
        this._settings = new settingsHelper_1.default;
        this._helper = new helper_1.default;
        this._context = context;
    }
    /**
     * Gets the name of the default picture folder
     * @returns String of the picture folder
     */
    getPictureFolderName() {
        return __awaiter(this, void 0, void 0, function* () {
            var folderName = yield this._settings.get("pictureFolderName");
            var folderString = folderName;
            if (folderString === "") {
                folderString = "pictures";
            }
            return folderString;
        });
    }
    /**
     * Adds a image description to a given file path
     * @param filePath file path of the file to write, without the file name
     * @param fileName name of the file
     * @param content content to add
     */
    addImageDescriptionToFile(fileBasePath, fileName, content) {
        var thisRelPath = path.join(fileBasePath, fileName);
        var thisPath = path.resolve(thisRelPath); //For cross Platform compatibility, makes absolute path from possibly relative one
        content = "\n" + content; //Adding a Line Break at the beginning
        var fd = fs.openSync(thisPath, 'a+'); //Open in "add"-Mode
        fs.write(fd, content, (error) => {
            if (error) {
                vscode.window.showErrorMessage(this._language.get('somethingWentWrongDuringInsertOfGraphic'));
                return;
            }
            else {
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
    getFileExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
    /**
     * Checks if the given string of a file name is a file extension of a picture
     * @param filename string of the file name
     * @returns true if the file is an image, otherwise false
     */
    isImage(filename) {
        var ext = this.getFileExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'jpeg':
            case 'svg':
                //etc
                return true;
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
    getAllPicturesInFolder(pathToFolder, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var folderPath = path.join(pathToFolder.toString(), folder);
                var allFilesArray = [];
                if (fs.existsSync(folderPath)) {
                    fs.readdir(folderPath, (err, files) => {
                        files.forEach(file => {
                            if (this.isImage(file) === true) {
                                var completePath = path.join(folderPath, file);
                                var relativePath = "." + path.sep + folder + path.sep + file; //generate the relative file path, path.sep gives the OS folder seperator
                                var newFileObject = { fileName: file, folderPath: folderPath, completePath: completePath, relativePath: relativePath, basePath: pathToFolder };
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
                }
                else {
                    vscode.window.showErrorMessage(this._language.get('noPictureFolderFound') + folderPath);
                    //If there is no picture folder
                }
            }));
        });
    }
    /**
     * Generates the HTML neccessary for the file selection in the sidebar.
     * @param files an array of files objects, as it is produced by the getAllPicturesInFolder function
     * @returns an HTML-String of the file options, like <option value='FILEPATH'>FILENAME</option>...
     */
    generateSelectImagesOptionsHTML(files) {
        var returnString = '';
        files.forEach(fileObject => {
            var markdownReadyRelativePath = fileObject.relativePath.replace(" ", "%20"); //Markdown cannot handle Spaces
            //var markdownReadyFileName = fileObject.fileName.replace(" ", "%20");
            fileObject.markdownReadyRelativePath = markdownReadyRelativePath;
            const onDiskPath = vscode.Uri.file(fileObject.completePath);
            // And get the special URI to use with the webview
            fileObject.vscodePath = onDiskPath.with({ scheme: 'vscode-resource' }).path; // For Preview
            var json = JSON.stringify(fileObject);
            var myEscapedJSONString = json.replace(/\\n/g, "\\n")
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
exports.default = ImageHelper;
//# sourceMappingURL=imageHelper.js.map