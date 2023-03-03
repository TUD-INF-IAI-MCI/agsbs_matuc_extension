/**
 * @author  Lucas Vogel
 */
import Language from "../languages";

export default class EditorFunctionSnippets {
    private _language: Language;
    private d: any;

    /**
     * Gets a snippet
     * @param snippetName identifier of the snippet
     * @returns snippet
     */
    public get(snippetName: string) {
        return this.d[snippetName];
    }

    constructor() {
        this._language = new Language();
        this.d = [];

        /****************INSERT LINK ****************** */
        this.d["insertLinkForm"] = `<label for='url'>${this._language.get("link")}</label><br  role="none">
                      <input type='text' id='url' name='url' required><br  role="none" onkeyup="valueChanged()" onchange="valueChanged()">
                      <div class="spacing" role="none"></div>
                      <label for='linkText'>${this._language.get("linkText")}</label><br  role="none">
                      <input type='text' id='linkText' name='linkText' onkeyup="valueChanged()" onchange="valueChanged()" ><br  role="none">
                      <div class="spacing" role="none"></div>
                      <label for='linkTitle'>${this._language.get("linkTitle")}</label><br  role="none">
                      <input type='text' id='linkTitle' name='linkTitle' onkeyup="valueChanged()" onchange="valueChanged()">
                      <div class="spacing" role="none"></div>
                      <fieldset id="fieldset" name="preview"><legend>${this._language.get(
                          "preview"
                      )}</legend><a id="link" href="" title="" target="_blank"></a></fieldset>
                      `;

        /****************INSERT IMAGE ****************** */
        this.d["insertImageFormPart1"] = `<input type='checkbox' id='outsourceCheckbox' name='outsourceCheckbox'>
                                    <label for='outsourceCheckbox'>${this._language.get(
                                        "outsourceCheckbox"
                                    )}</label><br role="none">
                                    <div class="spacing" role="none"></div>
                                    <label for='selectPicture'>${this._language.get(
                                        "selectPictureFromHere"
                                    )}</label><br role="none">
                                        <select name='selectPicture' id="selectPicture" onchange="selectionChanged()">
                                        <option selected="true" disabled="disabled" value=''>${this._language.get(
                                            "selectImageFile"
                                        )}</option> `;
        this.d["insertImageFormPart2"] = `</select><br  role="none">
                                        <div class="spacing" role="none"></div>
                                        <label for='altText'>${this._language.get("altText")}</label><br role="none">
                                        <input type='text' id='altText' name='altText' onkeyup="selectionChanged()" onchange="selectionChanged()"><br role="none">
                                        <div class="spacing" role="none"></div>
                                        <label for='graphicTitle'>${this._language.get(
                                            "graphicTitle"
                                        )}</label><br role="none">
                                        <input type='text' id='graphicTitle' name='graphicTitle'><br role="none"> 
                                        <div class="spacing" role="none"></div>
                                        <fieldset id="fieldset" name="preview"><legend>${this._language.get(
                                            "preview"
                                        )}</legend><img id="image" src="" alt="" onerror="onImgError()"></fieldset>
                                        `;
        this.d["insertImageScript"] = `
                                        function selectionChanged(){
                                            var selector = document.getElementById("selectPicture");
                                            var altText = document.getElementById("altText");
                                            var image = document.getElementById("image");
                                            var value = selector.value;
                                            if(value!==""){
                                                try{
                                                var json = JSON.parse(value);
                                                } catch(e){
                                                    console.log(e);
                                                }
                                                image.src = "vscode-resource:"+ json.vscodePath;
                                                var errorMessage = document.getElementById('errorMessage');
                                                if(errorMessage !== undefined && errorMessage !== null){
                                                    errorMessage.parentNode.removeChild(errorMessage);
                                                }
                                            }
                                            image.alt = altText.value;
                                        }
                                        function onImgError(){
                                            var selector = document.getElementById("selectPicture");
                                            if(selector.value == ""){
                                                return;
                                            }
                                            console.log("IMAGE ERROR");
                                            var fieldset = document.getElementById("fieldset");
                                                    var errorMessage = '<span id="errorMessage">${this._language.get(
                                                        "previewNotAvailableCheckWorspaceFolder"
                                                    )}</span>';
                                                    fieldset.insertAdjacentHTML('beforeend', errorMessage);
        } `;
        /****************** INSERT FOOTNOTE ******************** */
        this.d["insertFootnoteHTML"] = `
            <label for='footLabel'>${this._language.get("footLabel")}</label><br  role="none">
            <input type="text" name="footLabel" id="footLabel" placeholder="${this._language.get(
                "footLabel"
            )}" required="true"/><br  role="none">
            <div class="spacing" role="none"></div>
            <label for='footText'>${this._language.get("footText")}</label><br  role="none">
            <input type="text" name="footText" id="footText" placeholder="${this._language.get(
                "footText"
            )}" required="true"/><br  role="none">
            `;

        /****************INSERT ANNOTATION ****************** */
        this.d["insertAnnotationHTMLPart1"] = `
            <label for="annotationType">${this._language.get("selectType")}</label><br  role="none">
        <select name='annotationType' id='annotationType' onchange="typeChange(this)"><br  role="none">
            <option value='textFrame'>${this._language.get("textFrameCheckbox")}</option>
            <option value='textBox'>${this._language.get("textBoxCheckbox")}</option>
            <option value='annotation'>${this._language.get("annotation")}</option>
        </select>
        <div class="spacing" role="none"></div>
         <label for="color" >${this._language.get("color")}</label><br  role="none">
        <select name='color' id='color'><br  role="none">
         <option value='red'>${this._language.get("colorRed")}</option>
         <option value='blue'>${this._language.get("colorBlue")}</option>
         <option value='brown'>${this._language.get("colorBrown")}</option>
         <option value='grey'>${this._language.get("colorGrey")}</option>
         <option value='black'>${this._language.get("colorBlack")}</option>
         <option value='green'>${this._language.get("colorGreen")}</option>
         <option value='yellow'>${this._language.get("colorYellow")}</option>
         <option value='orange'>${this._language.get("colorOrange")}</option>
         <option value='violet'>${this._language.get("colorViolet")}</option>
      </select>
      <div class="spacing" role="none"></div>
      <label for="titleOfBox">${this._language.get("titleOfTextbox")}</label><br  role="none">
      <input type="text" name="titleOfBox" id="titleOfBox" placeholder="${this._language.get("titleOfTextbox")}" `;
        this.d["insertAnnotationHTMLPart2"] = `/><br  role="none">
      <div class="spacing" role="none"></div>
      <label for="contentOfBox">${this._language.get("contentOfTextbox")}</label><br  role="none">
      <input type="text" name="contentOfBox" id="contentOfBox" placeholder="${this._language.get(
          "contentOfTextbox"
      )}" `;
        this.d["insertAnnotationHTMLPart3"] = `/>
            `;
        this.d["insertAnnotationSCRIPT"] = `
            function typeChange(){
                var selector = document.getElementById("annotationType");
                var titleBox = document.getElementById("titleOfBox");
                var colorSelector = document.getElementById("color");
                if(selector.value === "annotation"){
                  titleBox.disabled = true;
                  colorSelector.disabled = true;
                } else {
                  titleBox.disabled = false; 
                  colorSelector.disabled = false;
                }
            }
            `;
    }
}
