export default class En {
    public d: any;

    constructor() {
        this.d = [];

        // Default folder name for this language. Don't add Spaces at start and end
        this.d["picuteFolderName"] = "Bilder";
        this.d["yes"] = "Ja";
        this.d["no"] = "Nein";
        this.d["ok"] = "Ok";
        this.d["result"] = "Resultat";
        this.d["en"] = "Englisch";
        this.d["de"] = "Deutsch";
        this.d["fr"] = "Französisch";
        this.d["noActiveEditor"] = "Kein aktiver Editor";
        this.d["tooManyOpenEditors"] = "Zu viele offenen Editoren. Bitte öffnen Sie nur einen Editor ohne Split View.";
        this.d["ActionErrorNotMarkdown"] =
            "Die aktuelle Datei ist keine Markdown-Datei und die aktuelle Aktion kann nicht ausgeführt werden. Bitte eine Markdown-Datei öffnen.";
        this.d["error"] = "Ein Fehler ist aufgetreten.";
        this.d["checkFile"] = "Kontrolliere Datei ";

        // //main-navigation
        this.d["projectTitle"] = "Projekt";
        this.d["cloneExistingRepo"] = "Ein existierendes Repo klonen";
        this.d["newProject"] = "Neues Projet erstellen";
        this.d["selectFolder"] = "Ordner auswählen: (aus den offenen Worspace-Ordnern)";
        this.d["repoName"] = "Name des Git-Repos";
        this.d["clone"] = "Klonen";
        this.d["editProject"] = "Projektdaten bearbeiten";
        this.d["documentTitle"] = "Dokument";
        this.d["saveChanges"] = "Änderungen speichern";
        this.d["newFile"] = "Neue Datei erstellen";
        this.d["undo"] = "Rückgängig | ctrl+z";
        this.d["redo"] = "Wiederherstellen | crtl+shift+z";
        this.d["preview"] = "HTML-Vorschau anzeigen";
        this.d["generateFile"] = "HTML generieren";
        this.d["convertEntireProject"] = "Generiere HTML für alle Projektdokumente";
        this.d["generate"] = "Generieren";
        this.d["generateMaterial"] = "Generierung von Materialien ist gestartet. Bitte warten";
        this.d["generatingSuccess"] = "Generierung von Materialien wurde beendet.";
        this.d["conversionProfile"] = "Konvertierungprofil";
        this.d["blind"] = "Blind";
        this.d["visuallyImpaired"] = "Sehbehindert";
        this.d["publishTitle"] = "Veröffentlichen";
        this.d["checkProject"] = "Kontrolliere das gesamte Projekt";
        this.d["commitChanges"] = "Änderungen hochladen";
        this.d["notInsideLecture"] = "Dieses Dokument ist nicht Teil eines Projektes.";

        // //insert textboxes
        this.d["insertTextbox"] = "Annotation/Textbox einfügen ";
        this.d["insertTextboxContent"] = "Inhalt der Anmerkung oder Titel der Textbox/Textrahmen";
        this.d["textFrameCheckbox"] = "Textrahmen";
        this.d["textBoxCheckbox"] = "Textbox";
        this.d["annotation"] = "Anmerkung des Bearbeiters";
        this.d["color"] = "Farbe";
        this.d["colorRed"] = "Rot";
        this.d["colorBlue"] = "Blau";
        this.d["colorBrown"] = "Braun";
        this.d["colorGrey"] = "Grau";
        this.d["colorBlack"] = "Schwarz";
        this.d["colorGreen"] = "Grün";
        this.d["colorYellow"] = "Gelb";
        this.d["colorOrange"] = "Orange";
        this.d["colorViolet"] = "Violet";
        this.d["selectType"] = "Typ auswählen:";
        this.d["titleOfTextbox"] = "Titel der Textbox/Textrahmen";
        this.d["contentOfTextbox"] = "Inhalt der Textbox/Textrahmen";
        this.d["annotationNoTitleError"] =
            "Es ist kein Titel oder Farbe für die Anmerkung angegeben worden. Diese Attribute werden ignorriert.";

        // //footer-panel
        this.d["emphasis"] = "Betonung";
        this.d["edit"] = "Bearbeiten";
        this.d["bold"] = "Fett";
        this.d["italic"] = "Kursiv";
        this.d["strikethrough"] = "Durchgestrichen";
        this.d["headline"] = "Überschrift";
        this.d["headline1"] = "Überschrift Ebene 1";
        this.d["headline2"] = "Überschrift Ebene 2";
        this.d["headline3"] = "Überschrift Ebene 3";
        this.d["headline4"] = "Überschrift Ebene 4";
        this.d["headline5"] = "Überschrift Ebene 5";
        this.d["headline6"] = "Überschrift Ebene 6";
        this.d["list"] = "Liste";
        this.d["orderedList"] = "Erzeuge nummerierte Liste";
        this.d["unorderedList"] = "Erzeuge einfache Liste";
        this.d["table"] = "Tabelle";
        this.d["insertTable"] = "Einfügen einer Tabelle";
        this.d["importTableCsv"] = "Importiere Tabelle aus einer CSV-Datei";
        this.d["editTableLayout"] = "Folgende Tabelle bearbeiten";
        this.d["editTable"] = "Tabelle bearbeiten";
        this.d["deleteTable"] = "Tabelle löschen";
        this.d["noTableFound"] = "Keine Tabelle gefunden";
        this.d["noCursorFound"] = "Bitte Cursor im Dokument platzieren";
        this.d["errorTableFileNonExistant"] = "Datei der Tabelle existiert nicht";
        this.d["parsingError"] = "Fehler beim Parsen der Tabelle.";
        this.d["tableInsertionPositionConflictWarning"] =
            "Warnung: Dieser Inhalt kann nicht innerhalb einer Tabelle platziert werden. Stattdessen wurde es nach der aktuellen Tabelle eingefügt.";
        this.d["insert"] = "Einfügen";
        this.d["formula"] = "Formel einfügen";
        this.d["formulaInline"] = "Einfügen einer Inline-Formel";
        this.d["insertLink"] = "Link einfügen";
        this.d["insertGraphic"] = "Bild einfügen";
        this.d["insertFootnote"] = "Fußnote einfügen";
        this.d["authorAnnotation"] = "Anmerkung einfügen";
        this.d["formatting"] = "Formatierungen";
        this.d["blockquote"] = "Als Zitat formatieren";
        this.d["code"] = "Formatiere als Quellcode";
        this.d["separator"] = "Separator";
        this.d["horizontalRule"] = "Füge horizontale Linie ein";
        this.d["newPage"] = "Neue Seite einfügen";
        this.d["page"] = "Seite";
        this.d["slide"] = "Folie";

        // //git
        this.d["gitUser"] = "Nutzername  (ZIH-Login)";
        this.d["gitCloneSucess"] = "Repo wurde erfolgreich geklont!";
        this.d["gitCloneInProgess"] = "Das Repo $repoName$ wird gerade geklont. Haben Sie etwas Geduld";
        this.d["gitCloneError"] =
            "Während des Klonen ist ein Fehler aufgetreten. Überprüfen Sie, ob sie ihren privaten Schlüssel geladen haben oder der Ordner bereits existiert. Mehr Informationen finden Sie auf der Konsole.";
        this.d["gitPushError"] =
            "Während des Push auf den Server ist ein Fehler aufgetreten. Mehr Informationen finden Sie im Terminal";
        this.d["gitPushSuccess"] = "Der Git-Push auf den Server war erfolgreich";
        this.d["userName"] = "Name";
        this.d["mailadresse"] = "E-Mailadresse";
        this.d["noUserDataIsSet"] = "Es sind keine Mailadresse und Username in der git Config gespeichert.";
        this.d["SetUserDataInConfig"] =
            'Es wurde die E-Mailadresse "$emailAddress$" und der Username "$userName$"  aus den Einstellung der Erweiterung in die lokale Konfiguration geschrieben.';
        this.d["repoNameContainsSpaces"] =
            "Der Reponame enthielt Leerzeichen. Sollte das Klonen nicht erfolgreich gewesen sein. Überprüfen Sie den Reponamen und starten Sie das Klonen erneut!";
        this.d["tableEditCommit"] = "Tabelle bearbeitet";
        this.d["tableCreateCommit"] = "Tabelle erstellt";
        // //new-project
        this.d["noFolder"] = "Kein Ordner ausgewählt";
        this.d["preface"] = "Vorwort einfügen";
        this.d["chapters"] = "Kapitel";
        this.d["appendixChapters"] = "Kapitel im Anhang";
        this.d["author"] = "Author";
        this.d["title"] = "Titel";
        this.d["institution"] = "Institution";
        this.d["projectLanguage"] = "Sprache";
        this.d["tableOfContents"] = "Inhaltsverzeichnis hinzufügen zum Dokument";
        this.d["tocDepthExplanation"] =
            "Tiefe des Inhaltsverzeichnisses, nur änderbar wenn es ein Inhaltsverzeichnis gibt";
        this.d["materialSource"] = "Materialquelle";
        this.d["missingGitServerPath"] =
            "Git Server Pfad fehlt, dieser muss erst in den Einstellungen festgelegt werden.";
        this.d["somethingWentWrongDuringCreatingNewProject"] = "Ein unerwarteter Matuc-Fehler ist aufgetreten.";
        this.d["createdProjectSuccessfully"] = "Projekterstellung erfolgreich.";

        // //edit metadata
        this.d["sourceAuthor"] = "Quell-Author";
        this.d["semYear"] = "Semester der Bearbeitung";
        this.d["workingGroup"] = "Arbeitsgruppe";
        this.d["updateEditedData"] = "Update";
        this.d["toc_Depth"] = "Tiefe des Inhaltsverziechnisses";
        this.d["updateSuccessfull"] = "Das Update war erfolgreich.";

        // //commit-changes-dialog
        this.d["commitMessage"] =
            "Beschreiben Sie mit wenigen Worten was Sie geändert, ergänzt oder hinzugefügt haben...";
        this.d["commit"] = "Commit";
        this.d["commitChangesErrorDetail"] =
            "Ein Fehler trat während des Commits auf. Mehr Informationen finden Sie in der Ausgabe?";

        // //matuc
        this.d["matucNotInstalled"] =
            "Matuc ist nicht installiert. Sie müssen Matuc in der neuesten Version installieren um dieses Feature nutzen zu können.";
        this.d["noConfiguration"] = "Konfigurationsdatei, .lecture_meta_data.dcxml, fehlt im Projekt";
        this.d["unExpectedMatucError"] = "Ein unerwarteter Matuc-Fehler trat auf";
        this.d["documentHasBeenSaved"] =
            "Das aktuelle Dokument wurde gespeichert, weil es für die aktuelle Aktion benötigt wurde.";
        this.d["matucErrorDetails"] =
            "$message$ <br/> <strong>Überprüfen Sie die <br/>Datei: $path$ <br/> Zeile: $line$<strong> <br/> Position: $position$ <br/> </strong>";

        // //editor functions

        this.d["headlineNumberTooSmall"] =
            "Keine Überschrift möglich, da die gegebene Überschriftengröße außerhalb des möglichen Bereiches liegt. Die größte Überschriftengröße ist H1.";
        this.d["headlineNumberTooBig"] =
            "Keine Überschrift möglich, da die gegebene Überschriftengröße außerhalb des möglichen Bereiches liegt. Die kleinste Überschriftengröße ist H6.";
        this.d["headlineInsertedWithGrade"] = "Überschrift wurde eingefügt mit Größe : H";
        this.d["importTableFromCsvError"] = "Fehler beim Importieren der Tabelle.";
        this.d["writingCSVTableFileError"] =
            "Ein Fehler ist aufgetreten beim exportieren und speichern in eine CSV-Tabelle.";
        this.d["originalTableNotFound"] =
            "Die Originaltablelle, die bearbeitet wurde konnte nicht gefunden werden. Stattdessen wurde die Tabelle in der aktuellen Zeile eingefügt.";
        this.d["hasBeenWritten"] = "wurde geschrieben";
        this.d["filehasBeenWritten"] = "Datei wurde gespeichert: ";

        //insert link dialog
        this.d["linkText"] = "Link Text";
        this.d["linkTitle"] = "Link Titel (optional)";
        this.d["link"] = "URL";
        this.d["insertLinkSubmit"] = "Einfügen";

        // //insert table dialog
        this.d["tableHeadCheckbox"] = "Tabellenkopfzeile einfügen";
        this.d["tableType"] = "Tabellentyp";
        this.d["simpleTable"] = "Simple Tabelle";
        this.d["pipeTable"] = "Pipe Tabelle";
        this.d["gridTable"] = "Raster Tabelle";
        this.d["rows"] = "Reihen";
        this.d["row"] = "Reihe";
        this.d["columns"] = "Spalten";
        this.d["column"] = "Spalte";
        this.d["thereAreNoTableInFolder"] = "Es wurden keine Tabellen in dem Ordner gefunden.";
        this.d["selectTable"] = "... oder wähle hier eine aus";
        this.d["importTableError"] = "Fehler während des Tabellenimports";
        this.d["selectImageFile"] = "Bild hier auswählen:";
        this.d["altText"] = "Alternativtext";
        this.d["outsourceCheckbox"] = "Beschreibung auslagern";
        this.d["thereAreNoPicturesInFolder"] = "Keine Bilder in dem Ordner gefunden: ";
        this.d["noPictureFolderFound"] = "Kein Bilderordner gefunden, bitte Bilder zu folgendem Ordner hinzufügen: ";
        this.d["or"] = "oder";
        this.d["graphicsUri"] = "Grafiklink hier einfügen:";
        this.d["graphicTitle"] = "Titel für Bild";
        this.d["somethingWentWrongDuringInsertOfGraphic"] =
            "Ein unerwarteter Fehler ist aufgetreten beim Einfügen des Bildes";
        this.d["imagesMdHasBeenWritten"] = "wurde geschrieben";
        this.d["selectPictureFromHere"] = "Bitte Auswählen:";

        // //insert footnote dialog
        this.d["footLabel"] = "Label für die Fußnote";
        this.d["footText"] = "Text in der Fußnote";
        this.d["footLabelError"] = "Ungültiges Label";
        this.d["footLabelErrorDetail"] = "Label wurde bereits genutzt. Bitte ein anderes Label verweden.";

        // //import csv dialog

        this.d["uriTable"] = "Tabellenlink hier einfügen";
        // //mistkerl

        this.d["mistkerlDidNotFindAnyErrorAndSavedFile"] = "Gespeichert.";
        this.d["mistkerlDidNotFindAnyError"] = "Es wurden keine Fehler gefunden.";
        this.d["abort"] = "Abbrechen";
        this.d["pagenumbering"] = "Seitennummerierung";
        this.d["doYouWantToAutocorrect"] =
            "Wenn die Seitennummerierung automatisch korrigiert werden soll, muss folgende Checkbox ausgewählt werden. Wenn nicht müssen die Seitennummern manuell korrigiert werden.";
        this.d["autocorrectPagenumberingCheckbox"] = "Seitennummerierung automatisch korrigieren";
        this.d["checkLine"] = "Zeile überprüfen: ";

        // Reading Files and Folders
        this.d["readingFileError"] = "Ein unerwarteter Fehler ist aufgetreten beim Lesen der Datei.";
        this.d["importedFrom"] = "importiert von";
        this.d["createFolderError"] = "Es ist ein Fehler beim erstellen des Ordners augetreten.";
        this.d["linuxNotSupportedYet"] = "Linux wird leider noch nicht unterstützt.";
        this.d["noFileSelected"] = "Keine Datei ausgewählt.";
        this.d["gitIsNotEnabled"] =
            "Git ist nicht aktiviert. Zu den Einstellungen -> Erweiterungen -> AGSBS und Git aktivieren um diese Funktion zu nutzen.";
        this.d["sidebarWelcome"] = "Wilkommen in der AGSBS Erweiterung für Visual Studio Code!";
        this.d["versionNumber"] = "Die Version der AGSBS Extension ist $versionNumber$!";
        this.d["textWhatToDo"] =
            "Sie können mit der Bearbeitung der Dateien beginnen. <br >" +
            "Hierfür können Sie  die Icons in der unteren Taskleiste verwenden";
        this.d["sendingError"] =
            "Wenn Sie einen Fehler finden, melden Sie Ihn bitte an per <br > Mail an " +
            '<a href="mailto:toAdd@mail.de">Fehler per E-Mail melden </a>';
        this.d["MatucIsInstalledWarning"] =
            "Matuc ist NICHT installiert! Manche Funktionen werden nicht verfügbar sein.";
        this.d["osDocumentsFolderName"] = "Dokumente"; //The folder name of the documents folder in the userspace
        this.d["preview"] = "Vorschau";

        this.d["previewNotAvailableCheckWorspaceFolder"] =
            "Die Vorschau ist aktuell nicht verfügbar. Bitte überprüfen Sie, ob der Ordner, in dem sich die aktuelle Datei befindet, als Workspace-Ordner geöffnet ist (auf der linken Seite des Editors).";

        //information message
        this.d["noEditorIsOpenCannotLoadDocument"] =
            "Es konnte keine Datei geladen werden, öffne/oder legen Sie eine neue Datei an";

        this.d["settings"] = "Einstellungen";
        this.d["openSettings"] = "AGSBS Einstellungen öffnen";

        this.d["undoBtnText"] = "Zurücksetzen";
    }

    public get = (varname) => {
        const result = this.d[varname];
        if (result === undefined) {
            return varname;
        }
        return result;
    };
}
