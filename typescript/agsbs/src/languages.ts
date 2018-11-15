import * as vscode from 'vscode'
import en from './languages/en'

export default class Language {
    private language:string; 
    private languageClass:any;
    constructor(){
        this.language = this.getVscodeLanguage();
        this._loadLanguageFile(this.language);
    }
    private getVscodeLanguage ():string{
        return vscode.env.language;
    }
    private async _loadLanguageFile(language){
        console.log(language);
        switch(language){
            case "en":
                this.languageClass =  new en();
                break;
            default:
            this.languageClass =  new en();
            break;
        }
        
    }
    public get(name){
        this.languageClass.get(name)
    }
    
}