/**
 * @author  Lucas Vogel
 */
import * as vscode from 'vscode';
import En from './languages/en';
import DE from './languages/de';

export default class Language {
    private language: string;
    private languageClass: any;
    constructor() {
        this.language = this.getVscodeLanguage();
        this._loadLanguageFile(this.language);
    }

    /**
     * @returns the current Language of the editor.
     */
    private getVscodeLanguage(): string {
        return vscode.env.language;
    }

    /**
     * Loads the Language File.
     * @param language Language to be used.
     */
    private _loadLanguageFile = async (language) => {
        //console.log("Language: " + language);
        switch (language) {
            case "en":
                this.languageClass = new En();
                break;
            case "de":
                this.languageClass = new DE();
                break;
            default:
                this.languageClass = new En();
                break;
        }
    }


    /**
     * Returns the translated String of the identifier
     * @param name string of the identifier.
     */
    public get = (name) => {
        return this.languageClass.get(name);
    }

}