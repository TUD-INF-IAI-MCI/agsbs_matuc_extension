export default class En {
    public d: any;

    constructor() {
        this.d = [];

        // Default folder name for this language. Don't add Spaces at start and end
        this.d["picuteFolderName"] = "pictures";
        this.d["yes"] = "Yes";
        this.d["no"] = "No";
        this.d["ok"] = "Ok";
        this.d["result"] = "Result";
        this.d["en"] = "English";
        this.d["de"] = "German";
        this.d["fr"] = "French";
        this.d["noActiveEditor"] = "No active editor";
        this.d["tooManyOpenEditors"] = "Too many open editors. Please just open one file and without a split view.";
        this.d["ActionErrorNotMarkdown"] =
            "The current File is not a Markdown file and the current Action cannot be executed. Please open a Markdown File.";
        this.d["error"] = "A error occurs";
        this.d["checkFile"] = "Check file ";

        // //main-navigation
        this.d["projectTitle"] = "Project";
        this.d["cloneExistingRepo"] = "Clone an existing repo";
        this.d["newProject"] = "Create new project";
        this.d["selectFolder"] = "Select Folder: (from the open workspace folders)";
        this.d["repoName"] = "Git repo name";
        this.d["clone"] = "Clone";
        this.d["editProject"] = "Edit project data";
        this.d["documentTitle"] = "Document";
        this.d["saveChanges"] = "Save changes";
        this.d["newFile"] = "create new file";
        this.d["undo"] = "Undo | ctrl+z";
        this.d["redo"] = "Redo | crtl+shift+z";
        this.d["preview"] = "Show html preview";
        this.d["generateFile"] = "Generate HTML";
        this.d["convertEntireProject"] = "Generate HTML for all project files";
        this.d["generate"] = "Generate";
        this.d["generateMaterial"] = "Generating of material is started. Be patient.";
        this.d["generatingSuccess"] = "Generating of material finished";
        this.d["conversionProfile"] = "conversion profile";
        this.d["blind"] = "blind";
        this.d["visuallyImpaired"] = "visually impaired";
        this.d["publishTitle"] = "Publish";
        this.d["checkProject"] = "Check entire project";
        this.d["commitChanges"] = "Upload changes";
        this.d["notInsideLecture"] = "This Document is not inside a lecture.";

        // //insert textboxes
        this.d["insertTextbox"] = "Add annotation/text box ";
        this.d["insertTextboxContent"] = "Content of annotation or title of textbox/textframe";
        this.d["textFrameCheckbox"] = "text frame";
        this.d["textBoxCheckbox"] = "text box";
        this.d["annotation"] = "Annotation of the transcriber";
        this.d["color"] = "Color";
        this.d["colorRed"] = "Red";
        this.d["colorBlue"] = "Blue";
        this.d["colorBrown"] = "Brown";
        this.d["colorGrey"] = "Grey";
        this.d["colorBlack"] = "Black";
        this.d["colorGreen"] = "Green";
        this.d["colorYellow"] = "Yellow";
        this.d["colorOrange"] = "Orange";
        this.d["colorViolet"] = "Violett";
        this.d["selectType"] = "Select type:";
        this.d["titleOfTextbox"] = "Title of the textbox/textframe";
        this.d["contentOfTextbox"] = "Content of the textbox/textframe or annotation";
        this.d["annotationNoTitleError"] =
            "there is no title or color for an annotation. These attributes will be ignored.";

        // //footer-panel
        this.d["emphasis"] = "Emphasis";
        this.d["edit"] = "Edit";
        this.d["bold"] = "Bold";
        this.d["italic"] = "Italic";
        this.d["strikethrough"] = "Strikethrough";
        this.d["underline"] = "Underline";
        this.d["subscript"] = "Subscript";
        this.d["superscript"] = "Superscript";
        this.d["headline"] = "Headline";
        this.d["headline1"] = "First level headline";
        this.d["headline2"] = "Second level headline";
        this.d["headline3"] = "Third level headline";
        this.d["headline4"] = "Fourth level headline";
        this.d["headline5"] = "Fifth level headline";
        this.d["headline6"] = "Sixth level headline";
        this.d["list"] = "List";
        this.d["orderedList"] = "Create ordered list";
        this.d["unorderedList"] = "Create unordered list";
        this.d["table"] = "Table";
        this.d["insertTable"] = "Insert table";
        this.d["importTableCsv"] = "Import table from csv";
        this.d["editTableLayout"] = "Edit the Table below";
        this.d["editTable"] = "Edit Table";
        this.d["deleteTable"] = "Delete Table";
        this.d["noTableFound"] = "No table found";
        this.d["noCursorFound"] = "Please place the cursor inside the document";
        this.d["errorTableFileNonExistant"] = "File of the table does not exist";
        this.d["parsingError"] = "Error parsing Table";
        this.d["tableInsertionPositionConflictWarning"] =
            "Warning: This content cannot be placed inside a table. Instead, it was appended after this table.";
        this.d["insert"] = "Insert";
        this.d["formula"] = "Insert formula";
        this.d["formulaInline"] = "Insert inline formula";
        this.d["insertLink"] = "Insert link";
        this.d["insertGraphic"] = "Insert graphic";
        this.d["insertFootnote"] = "Insert footnote";
        this.d["authorAnnotation"] = "Insert annotation";
        this.d["formatting"] = "Formatting";
        this.d["blockquote"] = "Create blockquote";
        this.d["code"] = "Format as code";
        this.d["separator"] = "Separator";
        this.d["horizontalRule"] = "Add horizontal rule";
        this.d["newPage"] = "Add new page";
        this.d["page"] = "Page";
        this.d["slide"] = "Slide";

        // //git
        this.d["gitUser"] = "Username  (ZIH-Login)";
        this.d["gitCloneSucess"] = "Repo was cloned successfully!";
        this.d["gitCloneInProgess"] = "Repo $repoName$ is cloning. Be patient.";
        this.d["gitCloneError"] =
            "An error occurs during the cloning. Check whether you load your private key or whether the git directory is existing. Find more information in the terminal";
        this.d["gitPushError"] = "During the push an error occurs. Find more information in the terminal";
        this.d["gitPushSuccess"] = "Git push was successful";
        this.d["userName"] = "Name";
        this.d["mailadresse"] = "E-mail address";
        this.d["noUserDataIsSet"] = "Es sind keine Mailadresse und Username in der git Config gespeichert.";
        this.d["SetUserDataInConfig"] =
            'The email address "$emailAddress$" and user name "$userName$" of the user settings were set in the local configuration.';
        this.d["repoNameContainsSpaces"] =
            "The repo contained spaces. If the clone did not successed. Please checkout the repo name and try it again";
        this.d["tableEditCommit"] = "Following table edited:";
        this.d["tableCreateCommit"] = "Following table inserted:";
        // //new-project
        this.d["noFolder"] = "No folder set";
        this.d["preface"] = "Add a preface to the document.";
        this.d["chapters"] = "Chapters";
        this.d["appendixChapters"] = "Appendix chapters";
        this.d["author"] = "Author";
        this.d["title"] = "Title";
        this.d["institution"] = "Institution";
        this.d["projectLanguage"] = "Language";
        this.d["tableOfContents"] = "Add a table of contents to the document.";
        this.d["tocDepthExplanation"] = "Depth of table of contents, only changeable if table of contents is set";
        this.d["materialSource"] = "Material source";
        this.d["missingGitServerPath"] = "Git server path is missing, you have to add one in the settings first.";
        this.d["somethingWentWrongDuringCreatingNewProject"] = "An unexpected matuc error occured";
        this.d["createdProjectSuccessfully"] = "Creation of project successfull.";

        // //edit metadata
        this.d["sourceAuthor"] = "Source author";
        this.d["semYear"] = "Semester of edit";
        this.d["workingGroup"] = "Working group";
        this.d["updateEditedData"] = "Update";
        this.d["toc_Depth"] = "Depth of table of content";
        this.d["updateSuccessfull"] = "The update was successfull.";

        // //commit-changes-dialog
        this.d["commitMessage"] = "Leave a few words about the changes you made...";
        this.d["commit"] = "Commit";
        this.d["commitChangesErrorDetail"] = "An error occurs during the commit. More information in the terminal";

        // //matuc
        this.d["matucNotInstalled"] =
            "Matuc is not installed. You have to install the latest Matuc version to use this feature.";
        this.d["noConfiguration"] = "No configuration, .lecture_meta_data.dcxml, in a directory exists in this project";
        this.d["unExpectedMatucError"] = "An unexpected matuc error occured";
        this.d["documentHasBeenSaved"] =
            "The current document has been saved, as it was neccessary for the execution of this action.";
        this.d["matucErrorDetails"] =
            "$message$ <br/> <strong> Check <br /> file: $path$ <br/> line: $line$ <br/>position: $position$ <br/> </strong>";

        // //editor functions

        this.d["headlineNumberTooSmall"] =
            "Headline cannot be changed or created because the given headline size is out of range. The maximum headline size is H1.";
        this.d["headlineNumberTooBig"] =
            "Headline cannot be changed or created because the given headline size is out of range. The minimum headline size is H6.";
        this.d["headlineInsertedWithGrade"] = "Headline was inserted with grade: H";
        this.d["importTableFromCsvError"] = "Failed to import table";
        this.d["writingCSVTableFileError"] = "A Error occured during the export and saving of the table to a CSV-File.";
        this.d["originalTableNotFound"] =
            "Original Table that has been edited could not be found. Instead, the table was inserted at the start of the current line.";
        this.d["hasBeenWritten"] = "has been written";
        this.d["filehasBeenWritten"] = "file has been written: ";

        //insert link dialog
        this.d["linkText"] = "Link text";
        this.d["linkTitle"] = "Link title (optional)";
        this.d["link"] = "URL";
        this.d["insertLinkSubmit"] = "Insert";

        // //insert table dialog
        this.d["tableHeadCheckbox"] = "Add a head to the table";
        this.d["tableType"] = "Table Type";
        this.d["simpleTable"] = "Simple Table";
        this.d["pipeTable"] = "Pipe Table";
        this.d["gridTable"] = "Grid Table";
        this.d["rows"] = "Rows";
        this.d["row"] = "Row";
        this.d["columns"] = "Columns";
        this.d["column"] = "Column";
        this.d["thereAreNoTableInFolder"] = "No tables found in folder.";
        this.d["selectTable"] = "...or select it from here";
        this.d["importTableError"] = "Error during table import";
        this.d["selectImageFile"] = "Select the Image here";
        this.d["altText"] = "Alt text";
        this.d["outsourceCheckbox"] = "outsource Description";
        this.d["thereAreNoPicturesInFolder"] = "No pictures found in folder: ";
        this.d["noPictureFolderFound"] = "No folder for pictures found, please add pictures to folder: ";
        this.d["or"] = "or";
        this.d["graphicsUri"] = "paste graphic's link here";
        this.d["graphicTitle"] = "Title for graphic";
        this.d["somethingWentWrongDuringInsertOfGraphic"] = "An unexpected matuc error occured";
        this.d["imagesMdHasBeenWritten"] = "has been written";
        this.d["selectPictureFromHere"] = "select from here:";

        // //insert footnote dialog
        this.d["footLabel"] = "Label for footnote";
        this.d["footText"] = "Text in footnote";
        this.d["footLabelError"] = "Invalid label";
        this.d["footLabelErrorDetail"] = "Label is already used. Please enter another label.";

        // //import csv dialog

        this.d["uriTable"] = "Insert table link here";
        // //mistkerl

        this.d["mistkerlDidNotFindAnyErrorAndSavedFile"] = "Saved.";
        this.d["mistkerlDidNotFindAnyError"] = "No errors have been detected.";
        this.d["abort"] = "Cancel";
        this.d["pagenumbering"] = "Pagenumbering";
        this.d["doYouWantToAutocorrect"] =
            "If you want to automatically correct the Pagenumbering check the following box. Otherwise you have to do it manually.";
        this.d["autocorrectPagenumberingCheckbox"] = "Autocorrect Pagenumbering";
        this.d["checkLine"] = "Check line: ";

        // Reading Files and Folders
        this.d["readingFileError"] = "An unexpected error occured reading the file.";
        this.d["importedFrom"] = "imported from";
        this.d["createFolderError"] = "Error creating folder.";
        this.d["linuxNotSupportedYet"] = "Linux is not supported yet.";
        this.d["noFileSelected"] = "No File Selected.";
        this.d["gitIsNotEnabled"] =
            "Git is not enabled. Go to Settings -> Extensions -> AGSBS and enable Git to use this function.";
        this.d["sidebarWelcome"] = "Welcome to AGSBS extension for Visual Studio Code!";
        this.d["versionNumber"] = "The version of AGSBS extension is $versionNumber$!";
        this.d["textWhatToDo"] = "Now you can start working. <br >" + "You can use the icon in task bar below";
        this.d["sendingError"] =
            "If you find a bug or have another issue please send a mail. " +
            '<a href="mailto:toAdd@mail.de">Send mail</a>';
        this.d["MatucIsInstalledWarning"] = "Matuc is NOT installed! Some features might not work.";
        this.d["osDocumentsFolderName"] = "Documents"; //The folder name of the documents folder in the userspace

        this.d["previewNotAvailableCheckWorspaceFolder"] =
            "The Preview is currently not available. Please check if the folder (the current file is in) is open as a workspace folder on the left.";

        //information message
        this.d["noEditorIsOpenCannotLoadDocument"] = "Cannot open a file, open/create a file";

        this.d["settings"] = "Settings";
        this.d["openSettings"] = "Open AGSBS Settings";

        this.d["undoBtnText"] = "Reset";
    }

    public get = (varname) => {
        const result = this.d[varname];
        if (result === undefined) {
            return varname;
        }
        return result;
    };
}
