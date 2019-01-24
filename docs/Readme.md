# Kurzdoku AGSBS VSCode Extension

In dieser Anleitung werden kurz wichtige Konzepte erklärt, welche es ermöglichen, diese Extension zu erweitern. Da diese in kürzester Zeit entstehen musste, sind garantiert einige Rechtschreibfehler enthalten. Diese können gerne korrigiert werden.

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Diese Extension wurde mit TypeScript geschrieben, einem Superset von JavaScript. Diese Dateien können gut an der Dateiendung ```.ts``` erkannt werden. Da es sich um ein Superset handelt, kann die Extension auch in nativem JavaScript geschrieben werden, dennoch lohnt es sich sehr, die Features zu nutzen. Programmiert wird TypeScript am besten mit VSCode selber, da gerade für Extensions einerseits der TypeScript Kompiler schon installiert ist, zum anderen die Extension sehr gut einfach mit der Debugging-Funktion getestet und debuggt werden kann (z.B. Breakpoints setzen).
Eine kurze Anleitung gibt es hier: [Link zum Tutorial](https://www.typescriptlang.org/docs/tutorial.html) 


</div>

## 1. Aufbau der Extension.

der Aufbau der Extension wird gut auf der [Webseite von VSCode](https://code.visualstudio.com/api/get-started/extension-anatomy "Link zum Aufbau einer Extension mit VSCode") erklärt.  

Prinzipiell ist der Entry Point unter src/extension.ts, wessen Funktion ```activate``` aufgerufen wird wenn die Erweiterung initialisiert wird. Dies geschieht mit einem Trigger, der in der ```package.json``` unter dem Punkt ```activationEvents``` festgelegt wird. Dieser besagt in diesem Falle, dass die Erweiterung aktiv wird, wenn eine .md-Datei geöffnet wird.

Dadurch werden vor allem die beiden wichtigen Klassen ```taskbar.ts``` und ```sidebar.ts``` initialisiert. Das muss nicht bedeuten, dass diese sofort sichtbar sind, daher werden sie rein durch den Konstruktor nicht sofort angezeigt. Beide Klassen besitzen die Funktionen ```show()``` und ```hide()```, welche jeweils das entsprechende Panel anzeigt oder versteckt.  

Stattdessen wird in der ```extension.ts``` im Konstruktor ein Listener (```vscode.window.onDidChangeActiveTextEditor```) gesetzt, wobei bei jeder Änderung die Funktion ```_update``` ausgeführt wird, die überprüft, ob gerade eine Markdown-Datei geöffnet wurde.  
Falls eine Markdown-Datei geöffnet wurde, wird zunächst das Editorlayout mit ```this._helper.setEditorLayout``` umgestellt, danach die Sidebar und die Taskbar via ```show()``` angezeigt.

<div style="border:0px solid #f79502;border-left-width:3px;padding-left: 1rem;">

#### Hinweis
Leider war es zum Zeitpunkt der Erstellung dieser Doku nicht möglich, zwei WebViews (was die Taskbar und Sidebar sind) gleichzeitig oder schnell hintereinander zu schließen. Dies resultierte in einem Crash von VSCode der so schlimm war dass alle Ressourcen die mit VSCode verknüpft sind gelöscht und resettet werden mussten. Falls diese Funktion eingebaut werden soll, dann bitte selbst beim Testen mit großer Vorsicht.
</div>


### Das Framework

Da es standardmäßig in VSCode keine Unterstützung für Buttons oder Textoverlays / Boxen gibt, ist eine identische Umsetzung mit dem Atom-Plugin nicht möglich. Als Lösung wurde daher eine Taskbar und eine Sidebar eingeführt. Die Taskbar beinhaltet alle Buttons, aber aktuell auch **nur** Buttons. Alle anderen Dialoge werden in der Sidebar angezeigt, auch wenn es sich dabei nur um einen Hinweis handelt, der akzeptiert werden soll. 

Zu beiden Panelen gehören jeweils einige Dateien, die im Folgenden mit ihren Funktionen aufgeführt werden:

#### Sidebar
- ```src/sidebar.ts``` Die Hauptdatei für die Sidebar. Darin wird das Grundverhalten der Sidebar festgelegt, wie ```show()``` oder ```hide()```.
- ```style/sidebar.scss``` Die Haupt-Styledatei für die Sidebar. Dies wurde mit scss geschrieben, um zukünftig mehr Funktionalität zu ermöglichen, falls gewünscht. 

#### Taskbar
Im gegensatz zur Sidebar hat die Taskbar eine Menge mehr Dateien und Funktionen. Die drei wichtigesten Dateien zuerst:
- ```src/taskbar.ts``` Die Hauptdatei für die Taskbar. Darin wird das Grundverhalten der Taskbar festgelegt, wie ```show()``` oder ```hide()```.
- ```src/editorFunctions.ts``` Darin ist das Verhalten aller Bearbeitungsbuttons enthalten, von ```Bold``` bis zu ```Neue Seite einfügen```. Darin wurden diese auch gebündelt im Setup registriert. 
- ```src/projectToolsFunctions.ts``` Darin sind alle Projektwerkzeuge enthalten. Da sich hier **gegen** eine weitere Toolbar am oberen Rand der Datei entschieden wurde, sind diese Funktionen als zweite Leiste in der Taskbar enthalten. 
