import * as vscode from 'vscode';
import Helper from './helper';
import Language from './languages';

export default class GitHelper {
    private _helper: Helper;
    private _language: Language;

    constructor() {
        this._helper = new Helper;
        this._language = new Language;

    }

    

}
