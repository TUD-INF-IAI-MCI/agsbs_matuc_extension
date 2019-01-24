import * as vscode from 'vscode';
import Helper from './helper';
import Language from './languages';
import * as os from 'os';
import * as path from 'path';

export default class SettingsHelper {
    private _helper: Helper;
    private _language: Language;

    constructor() {
        this._helper = new Helper;
        this._language = new Language;

    }

    public async setup(){
        var gitLocalPath = await this.get("gitLocalPath");
        if(gitLocalPath === ""){
            this.setAutoGitLocalPath();
        }
        // console.log(await this.get("gitLocalPath"));

        //var folders = await vscode.workspace.workspaceFolders;
        //console.log(folders);
        //agsbs.update(settingsIdentifier,value,true);

    }

    public async get(settingIdentifier:string){
        var result = await vscode.workspace.getConfiguration('agsbs').get(settingIdentifier);
        return(result);
    }

    public async update(settingsIdentifier:string,value:any){
        
        var agsbs = await vscode.workspace.getConfiguration('agsbs');
        agsbs.update(settingsIdentifier,value,true);
    }
    

    public async setAutoGitLocalPath(){
        var homedir:string =os.homedir();
            var gitLocalPathIdentifier="gitLocalPath";
            var agsbsFolderName = "AGSBS_Git";
            var agsbsFolderPath:string = homedir;
            var homeDocumentsEnglish = homedir + path.sep + "Documents";
            var homeDocumentsEnglishExists = await this._helper.folderExists(homeDocumentsEnglish);
            if(homeDocumentsEnglishExists===true){
                agsbsFolderPath = homeDocumentsEnglish + path.sep + agsbsFolderName;
                if(await this._helper.folderExists(agsbsFolderPath) === false){
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier,agsbsFolderPath);
                return;
            }
            var homeDocumentsGermanFolder = homedir + path.sep + "Dokumente";
            var homeDocumentsGermanFolderExists = await this._helper.folderExists(homeDocumentsGermanFolder);
            if(homeDocumentsGermanFolderExists === true){
                agsbsFolderPath = homeDocumentsGermanFolder +path.sep + agsbsFolderName;
                if(await this._helper.folderExists(agsbsFolderPath) === false){
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier,agsbsFolderPath);
                return;
            }
            var homeDocumentsLanguageFolder = homedir + path.sep + this._language.get("osDocumentsFolderName");
            var homeDocumentsLanguageFolderExists = await this._helper.folderExists(homeDocumentsLanguageFolder);
            if(homeDocumentsLanguageFolderExists === true){
                agsbsFolderPath = homeDocumentsLanguageFolder +path.sep + agsbsFolderName;
                if(await this._helper.folderExists(agsbsFolderPath) === false){
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier,agsbsFolderPath);
                return;
            }
            var homeFolder = homedir + path.sep;

                agsbsFolderPath = homeFolder +path.sep + agsbsFolderName;
                if(await this._helper.folderExists(agsbsFolderPath) === false){
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier,agsbsFolderPath);
                return;
            
            
        }

}
