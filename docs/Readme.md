# Kurzdoku AGSBS VSCode Extension

In dieser Anleitung werden kurz wichtige Konzepte erklärt, welche es ermöglichen, diese Extension zu erweitern. Da diese in kürzester Zeit entstehen musste, sind garantiert einige Rechtschreibfehler enthalten. Diese können gerne korrigiert werden.
- Der Author, Lucas Vogel. Bei schwerwiegenden Fragen beim Maintainer von AGSBS nach Lucas fragen.

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Diese Extension wurde mit TypeScript geschrieben, einem Superset von JavaScript. Diese Dateien können gut an der Dateiendung ```.ts``` erkannt werden. Da es sich um ein Superset handelt, kann die Extension auch in nativem JavaScript geschrieben werden, dennoch lohnt es sich sehr, die Features zu nutzen. Programmiert wird TypeScript am besten mit VSCode selber, da gerade für Extensions einerseits der TypeScript Kompiler schon installiert ist, zum anderen die Extension sehr gut einfach mit der Debugging-Funktion getestet und debuggt werden kann (z.B. Breakpoints setzen). 
Außerdem wird an einigen Stellen dieser Erweiterung stark auf bestimmte Features gesetzt, z. B. Optionals oder getypte Parameter.

Außerdem ist somit nativ die ganze Doku geschrieben worden, nämlich direkt über den Funktionen, welche durch Hovern über der Funktion angezeigt werden kann und daher keine extra gepflegte Doku notwendig ist. Vor allem ist es hilfreich, die *OUTLINE* - Funktion des Editors zu nutzen, welche in der linken Sidebar ganz unten zu finden ist. Dort sind alle Funktionen der aktuell offenen Datei zu finden.
Eine kurze Anleitung zu TypeScript gibt es hier: [Link zum Tutorial](https://www.typescriptlang.org/docs/tutorial.html) 


</div>


## Aufbau der Extension

Der Aufbau der Extension wird gut auf der [Webseite von VSCode](https://code.visualstudio.com/api/get-started/extension-anatomy "Link zum Aufbau einer Extension mit VSCode") erklärt.  

Prinzipiell ist der Entry Point unter ```src/extension.ts```, wessen Funktion ```activate``` aufgerufen wird wenn die Erweiterung initialisiert wird. Dies geschieht mit einem Trigger, der in der ```package.json``` unter dem Punkt ```activationEvents``` festgelegt wird. Dieser besagt in diesem Falle, dass die Erweiterung aktiv wird, wenn eine .md-Datei geöffnet wird.

Dadurch werden vor allem die beiden wichtigen Klassen ```taskbar.ts``` und ```sidebar.ts``` initialisiert. Das muss nicht bedeuten, dass diese sofort sichtbar sind, daher werden sie rein durch den Konstruktor nicht sofort angezeigt. Beide Klassen besitzen die Funktionen ```show()``` und ```hide()```, welche jeweils das entsprechende Panel anzeigt oder versteckt.  

Stattdessen wird in der ```extension.ts``` im Konstruktor ein Listener (```vscode.window.onDidChangeActiveTextEditor```) gesetzt, wobei bei jeder Änderung die Funktion ```_update``` ausgeführt wird, die überprüft, ob gerade eine Markdown-Datei geöffnet wurde.  
Falls eine Markdown-Datei geöffnet wurde, wird zunächst das Editorlayout mit ```this._helper.setEditorLayout``` umgestellt, danach die Sidebar und die Taskbar via ```show()``` angezeigt.

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Leider war es zum Zeitpunkt der Erstellung dieser Doku nicht möglich, zwei WebViews (was die Taskbar und Sidebar sind) gleichzeitig oder schnell hintereinander zu schließen. Dies resultierte in einem Crash von VSCode, der so schlimm war dass alle Ressourcen die mit VSCode verknüpft sind gelöscht und resettet werden mussten. Falls diese Funktion eingebaut werden soll, dann bitte selbst beim Testen mit großer Vorsicht.
</div>


### Das Framework

Da es standardmäßig in VSCode keine Unterstützung für Buttons oder Textoverlays / Boxen gibt, ist eine identische Umsetzung mit dem Atom-Plugin nicht möglich. Als Lösung wurde daher eine Taskbar und eine Sidebar eingeführt. Die Taskbar beinhaltet alle Buttons, aber aktuell auch **nur** Buttons. Alle anderen Dialoge werden in der Sidebar angezeigt, auch wenn es sich dabei nur um einen Hinweis handelt, der akzeptiert werden soll. 

Zu beiden Panelen gehören jeweils einige Dateien, die im Folgenden mit ihren Funktionen aufgeführt werden:

#### Sidebar
- ```src/sidebar.ts``` Die Hauptdatei für die Sidebar. Darin wird das Grundverhalten der Sidebar festgelegt, wie ```show()``` oder ```hide()```.
- ```style/sidebar.scss``` Die Haupt-Styledatei für die Sidebar. Dies wurde mit [Sass](https://sass-lang.com/)  geschrieben, um zukünftig mehr Funktionalität zu ermöglichen, falls gewünscht. 

#### Taskbar
Im Gegensatz zur Sidebar hat die Taskbar eine Menge mehr Dateien und Funktionen. Die drei wichtigsten Dateien zuerst:
- ```src/taskbar.ts``` Die Hauptdatei für die Taskbar. Darin wird das Grundverhalten der Taskbar festgelegt, wie ```show()``` oder ```hide()```.
- ```src/editorFunctions.ts``` Darin ist das Verhalten aller Bearbeitungsbuttons enthalten, von ```Bold``` bis zu ```Neue Seite einfügen```. Darin wurden diese auch gebündelt im Setup registriert. 
- ```src/projectToolsFunctions.ts``` Darin sind alle Projektwerkzeuge enthalten. Da sich hier **gegen** eine weitere Toolbar am oberen Rand der Datei entschieden wurde, sind diese Funktionen als zweite Leiste in der Taskbar enthalten. 
- ```style/taskbar.scss``` Aus dem gleichen Grund wie bei der Sidebar sind darin alle Styleinformationen in [Sass](https://sass-lang.com/) geschrieben.

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Mit der Erweiterung ```Live Sass Compiler``` für VSCode kann sehr einfach Sass geschrieben werden.
</div>



#### Weitere Wichtige Dateien und Ordner
Einige Dateien werden zum Teil an mehreren Stellen benötigt. Diese werden im Folgenden genauer erläutert:

##### Die allgemeine Helper-Datei und Helper-Ordner
Die in ```src/helper/helper.ts``` zu findende Datei beinhaltet alle Hilfefunktionen, die an mehreren Stellen oder allgemein benötigt werden. Das kann Textbearbeitung sein (z. B: Zeichen um die aktuelle Auswahl Wrappen oder Toggeln) oder auch feststellen, ob ein Ordnerpfad existiert. Diese Datei ist essentiell.
Dazu gibt es in dem Ordner ```src/helper``` noch viele weitere speziellere Helper, welche meist nur an einer Stelle benötigt werden. Diese Funktionen werden ausgelagert, um eine bessere Lesbarkeit in den eigentlichen Dokumenten zu ermöglichen.

##### Die Language-Datei und Languages-Ordner
Die Klasse ```Language```, welche sich in ```src/languages.ts``` befindet kümmert sich um die Mehrsprachigkeit der Erweiterung. So gibt es dazu in dem Ordner ```src/languages``` noch weitere Dateien, welche dann die Sprachinformationen beinhalten, wie z.B: ```en.ts```

**Anmerkung:**
Die Art, wie die Sprachinformationen gespeichert werden in der ```en.ts```-Datei ist nicht die sauberste Lösung, aber sie funktioniert. Trotzdem wäre es möglich, dies recht simpel umzustellen, indem die Funktion ```get()``` in der ```languages.ts```-Datei umgeschrieben wird.

##### Snippets und der Snippets-Ornder
Da die Taskbar und Sidebar beide WebViews sind, werden sie mit HTML-Code gefüttert. Es wurde sich damals für die bessere Lesbarkeit und Kompaktheit des Codes dazu entschieden, es direkt zu ermöglichen, Quellcode einzupflegen. Wenn nun aber der einzupflegende HTML-Code zu viel wird, kann er in Snippets-Dateien ausgelagert werden. So enthält z. B. die Datei ```src/editorFunctionsSnippets.ts``` nur eine Ansammlung von Snippets, welche auf Abruf zurückgegeben werden können, um eine bessere Lesbarkeit des restlichen Quellcodes zu ermöglichen. 

---

## Erstellen einer neuen Funktion für den Editor
Wenn nun eine neue Funktion mit Button hinzugefügt werden soll, ist folgende Anleitung als Hilfestellung gedacht. Bei Bedarf kann diese natürlich abgewandelt werden.

### Erstellen und registrieren eines Buttons

#### Command und Keybinding

Wenn eine in den nächsten Schritten erstellte Funktion als Command (mit F1 im Editor aufrufbar) oder direkt als Keyboard Shortcut aufgerufen werden können soll, muss dies leider in mehreren Schritten getan werden. Zunächst wird die ```package.json``` bearbeitet. Darin muss an zwei stellen Code hinzugefügt werden:


```typescript
....
"contributes": {
        "commands": [
            {
                "command": "agsbs.NewAGSBSCommandUniqueIdentifier",
                "title": "AGSBS: Description of what the command does"
            },
...
"keybindings": [
                {
                    "command": "agsbs.NewAGSBSCommandUniqueIdentifier",
                    "key": "ctrl+shift+X",
                    "mac": "cmd+shift+X",
                    "when": "editorLangId == markdown"
                }
...
```

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweise
- Der Identifier wird dringend benötigt, weil später dieser Command noch registriert werden muss. 
- Der Titel soll mit "AGSBS: " beginnen, weil dieser sonst nicht als AGSBS mit F1 gesucht werden kann
- Das ```"when": "editorLangId == markdown"``` kann und sollte so belassen werden.
- Bei den ```commands``` und dem ```keybindings``` muss der gleiche Identifier genutzt werden.
</div>

Der nächste Schritt des Keybindings wird automatisch ausgeführt, wenn man einen neuen Button hinzufügt, wie im nächsten Schritt beschrieben wird. Die Kurzfassung ist, dass es sich um einen optionalen Parameter von ```addButton``` und ```addProjectTool``` handelt, dem der Identifier übergeben wird. Dieser registriert dann mit dem Callback den Command. (iehe nächstes Beispiel)

#### Button hinzufügen

Je nachdem um welche Art der Funktion es sich handelt, wird nun zunächst die Datei ```editorFunctions.ts``` oder die Datei ```projectToolsFunctions.ts``` bearbeitet. Zunächst ist es wichtig, den Button an sich bei der Taskbar zu registrieren. Das geschieht in der Funktion ```setup()``` via eines Callbacks auf die Taskbar. Die Funktion ```addButton``` bzw. das Äquivalent ```addProjectTool``` besitzten viele Parameter, von denen vor allem der Callback wichtig ist. Dieser wird aufgerufen, wenn der Button vom Benutzer betätigt wurde. 

<div style="border:0px solid #34a503;border-left-width:3px;padding-left: 1rem;">

#### Beispiel

```typescript
    public setup = () => {
        //For a Editor Function in editorFunctions.ts:
        this._taskbarCallback.addButton("buttonLogo.svg", 
                                        this._language.get("TextOfTheButton"), 
                                        this.buttonCallback, 
                                        this._language.get("SectionTheButtonAppearsIn")
                                        "agsbs.NewAGSBSCommandUniqueIdentifier");

        //OR
        //For a Project Tool in projectToolsFunctions.ts:
        this._taskbarCallback.addProjectTool("buttonLogo.svg", 
                                        this._language.get("TextOfTheButton"), 
                                        this.buttonCallback, 
                                        this._language.get("SectionTheButtonAppearsIn"),
                                        "agsbs.NewAGSBSCommandUniqueIdentifier");
    }

    public buttonCallback = async () => {
        //Do Something...
    }
```
</div>

Der Ausdruck ```this._language.get("TextOfTheButton")``` wird verwendet, um Mehrsprachigkeit zu gewährleisten, Daten stehen in der languages/xx.ts (z.B. en.ts).

Die Section ist der Abschnitt, unter welchem Buttons gruppiert werden können. So zum Beispiel "Formatting" oder "List" oder alle Überschriften. Diese werden automatisch erstellt wenn benötigt. Wenn keine angegeben wird, wird der Button zu einer Default-Gruppe angefügt. 

der ```"agsbs.NewAGSBSCommandUniqueIdentifier"``` ist der Identifier, mit dem die Funktion in der ```package.json``` als Command registriert und mit einem Keyboard Shortcut verknüpft werden kann (siehe oben)

### Die Button-Callback-Funktion

<div style="border:0px solid darkred;border-left-width:3px;padding-left: 1rem;">

#### Wichtig

Wichtig bei der registrierten Callback Funktion ist, dass diese eine Arrow-Function ist, bestenfalls asynchron. Andere Typen werden nicht funktionieren.

Ein Beispiel dafür: 

#### Beispiel

```typescript
    public buttonCallbackAsyncArrowFunction = async () => {
        //Works great! Recommended!
    }
    public buttonCallbackArrowFunction = () => {
        //Works! But no await can be used because async is missing.
    }

    async function buttonCallbackNormalAsyncFunction (){
        //Does NOT work!
    }
    function buttonCallbackNormalFunction (){
        //Does NOT work!
    }
```
</div>

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Alle Funktionen außer die eigentlichen Callback-Funktionen sollten in eine Helper-Datei ausgelagert werden, um eine gute Lesbarkeit und Sauberkeit des Codes zu gewährleisten. Benötigte HTML-Snippets sollten wenn möglich (falls diese zu lang werden) in eine Snippets-Datei ausgelagert werden, wie z. B. in ```src/snippets/editorFunctionSnippets.ts``` oder ```src/snippets/projectToolsFunctionsSnippets.ts```. 
</div>

### Hinzufügen eines Sidebar-Formulars

Wenn nun die registrierte *ButtonCallbackFunction* ein Formular auf der Sidebar angezeigt werden soll, muss dieses via ```addToSidebar``` hinzugefügt werden. Diese Funktion hat sehr viele Parameter und einige Optionals. Daher soll die Funktion genauer betrachtet werden:

<div style="border:0px solid #34a503;border-left-width:3px;padding-left: 1rem;">

#### Beispiel

```typescript
    public buttonCallbackAsyncArrowFunction = async () => {
        this._sidebarCallback.addToSidebar(HTMLForm, 
        this._language.get("HeadlineForSidebarForm"), 
        this.buttonSidebarCallback, 
        this._language.get("SubmitButtonText"),
        "CSS-Code to extra style the Form as String",
        "Extra Javascript-Code for extra functionality as String"
        );
    }
```
</div>

Wichtig dabei ist der Callback aus der Sidebar. Dies wird dann auf eine zweite Funktion geleitet.

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Das Formular wird ohne Submit-Button und ohne ```<form>```-Tag geschrieben, nur der reine Inhalt des Formulars, wie z.B. ```<input>```-Felder.
Außerdem muss jedes Formularelement einen Namen besitzen, ansonsten werden diese ignoriert und beim Absenden nicht an den Sidebar Callback in den Parametern zurückgegeben.

Weiterhin ist es ratsam, zwischen die Form-Elemente ein ```<div class="spacing" role="none">``` einzufügen, da teilweise ein merkwürdiger Bug auftritt, dass aufgrund von nicht ausgeführten ```margin```-Regeln ein Element unsichtbar ein anders überdeckt.

#### Beispiel

```html
    <label for="exampleInput">${this._language.get("exampleLabeltext")}</label><br role="none">
    <input type="text" id="exampleInput" name="exampleInput"> <!-- NAME IS IMPORTANT!-->
    <div class="spacing" role="none"></div>
    <label ....
```
</div>

```${this._language.get("exampleLabeltext")}``` wird dabei im String ersetzt von JavaScript, wenn der String in ``-Zeichen steht.

<div style="border:0px solid #34a503;border-left-width:3px;padding-left: 1rem;">

#### Komplettes Beispiel:

In ```editorFunctions.ts```:
```typescript

    //First register the button
    public setup = () => {
        this._taskbarCallback.addButton("buttonLogo.svg", 
                                        this._language.get("TextOfTheButton"), 
                                        this.buttonCallback, 
                                        this._language.get("SectionTheButtonAppearsIn"),
                                        "agsbs.NewAGSBSCommandUniqueIdentifier");
    }
    //If the button was pressed, add form to sidebar
    public buttonCallback = async () => {
        var HTMLForm = this._snippets.get("buttonHTML");
        this._sidebarCallback.addToSidebar(HTMLForm, 
                                            this._language.get("HeadlineForSidebarForm"), 
                                            this.buttonSidebarCallback, 
                                            this._language.get("SubmitButtonText"),
                                            extraCss,
                                            extraScript );
    }

    //Sidebar Callback when Sidebar Form is submitted
    public buttonSidebarCallback = async (params) => { //PARAMS are the parameters of the form
        var exampleButtonValue = params.exampleButton.value;

        //Do something with it...

        this._helper.focusDocument(); //Puts focus back to the text editor

    }
```
</div>

Der Ausdruck ```this._snippets.get("buttonHTML");``` ist ein Beispiel, wie Snippets eingesetzt werden können und sollten.

Der Parameter ```params``` ist ein Objekt, welches alle Form-Elemente mit Namen und deren Eigenschaften beinhaltet. So wie man auch bei JavaScript, wenn man ein Element mit ```document.getElementById("id")``` selektieren und dann auf die Eigenschaften z.B. mit ```.value``` zugreifen kann, so ist das hier weitestgehend auch mit den Formelementen möglich, insbesondere bei Boolschen Variablen, Zahlen und Strings. Objekte werden nicht oder nur eingeschränkt weitergegeben, da aus der WebView mit Messages kommuniziert werden muss und somit aktuell dies nicht möglich ist.


<div style="border:0px solid darkred;border-left-width:3px;padding-left: 1rem;">

#### Wichtig
Es ist ratsam, nach der Ausführung der eigenen Funktion am Ende ```this._helper.focusDocument();``` aufzurufen. Dabei wird der Fokus wieder auf das Dokument gelegt, damit direkt weiter geschrieben werden kann.
</div>

---

## Ressourcen und wichtige Konzepte:

### Allgemein

Die wichtigste Ressource ist die [VSCode API](https://code.visualstudio.com/api/references/vscode-api). Darin werden alle Funktionen beschrieben. 
Falls dieser Funktionsumfang nicht reicht, gibt es noch die [Built-In Commands](https://code.visualstudio.com/api/references/commands), welche weitere Funktionalität ermöglichen, jedoch auch nicht optimal dokumentiert. Unter anderem können damit auch Keyboard Shortcuts ausgeführt werden, wie z.B:
```typeScript
vscode.commands.executeCommand('undo');
vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
```
Dieses Verhalten ist schlecht/ gar nicht dokumentiert. Die entsprechenden Commands findet man unter den *Preferences->Keyboard Shortcuts*, wo man mit Rechtsklick die Commands kopieren kann.

### CSS und Themes

Es wird angestrebt, die Themes von VSCode zu unterstützen, weil damit auch der High-Contrast-Mode unterstützt wird (bessere Barrierefreiheit). Die Dokumentation ist mehr fragwürdig dafür, unter [Theme Color](https://code.visualstudio.com/api/references/theme-color) zu finden. Da in der Doku zum Zeitpunkt der Erstellung dieses Dokuments dort nicht erklärt wurde, wie man dies nun in den CSS-Dateien verwendet, folgt nun ein Beispiel dafür:

<div style="border:0px solid #34a503;border-left-width:3px;padding-left: 1rem;">

#### Beispiel

Man benötigt die Farbvariable ```input.background```. Um dieses nun als Background zu verwenden, wird folgender Syntax genutzt:

```css
input {
    background-color: var(--vscode-input-background);
}
```
</div>

Man sieht hier, dass hier CSS-Variablen verwendet werden. Der Punkt wird durch einen ```-``` ersetzt und hinter ein ```--vscode-``` geschrieben.
Es wurde aber schon versucht, alle Haupt-Eingabefelder von Formularen einzurichten. Dies geschah in ```style/sidebar.scss```.

#### Debugging in der WebView
Leider können die Default-Developer-Tools nicht auf den Inhalt von WebViews zugreifen. Stattdessen gibt es spezielle Developer Tools dafür, die extra aktiviert werden müssen:
1. Aktivieren der Tastenkombination. Unter **Einstellungen -> Tastenkombinationen** bei dem Punkt *WebView Entwicklertools öffnen* eine Tastenkombination hinzufügen. (Befehl der Kombination: ```workbench.action.webview.openDeveloperTools```).
2. Wenn nun der Entwicklungshost geöffnet ist, eine Webview fokusieren und die entsprechende Tastenkombination drücken. 
Dabei wird dann für jede WebView ein neues Developer-Tools-Fenster geöffnet. Weitere Infos findet man unter: [Debugging in WebViews](https://code.visualstudio.com/api/extension-guides/webview#inspecting-and-debugging-webviews "Webseite von VSCode WebView API, zum Debuggen in WebViews").


## Bekannte Bugs und Probleme
Leider ist VSCode nicht perfekt (diese Extension auch nicht, aber daran kann gearbeitet werden ;-) ).
Folgende Bugs wurden in anderer Software gefunden, die hoffentlich später behoben werden. 

1. Visible Range: Aktuell springt der Editor beim Einfügen von Inhalten im Textdokument manchmal umher. Das liegt daran, dass beim erneuten Setzen des Editorlayouts das sichtbare Fenster springt. Dem wird entgegengewirkt, indem das Layout nur neu gesetzt wird, wenn die Toolbar oder die Sidebar geschlossen wurden.

2. Markdown Enhanced. Die Versuchung lag nahe, die Markdown-Enhanced-Preview Erweiterung zu nutzen, da diese Erweiterung weiterhin noch Formeln darstellen kann. Leider öffnet diese sich immer im Reiter der Sidebar (weil diese die ViewColumn ```Two``` hat). Außerdem stürzt es ab, wenn man nach dem öffnen der Enhanced Preview weiter den Text bearbeitet. Der entsprechende Code ist jedoch vorhanden und kann einfach wieder einkommentiert werden: in der Datei ```projectToolsFunction.ts``` in der Funktion ```showHTMLPreview```