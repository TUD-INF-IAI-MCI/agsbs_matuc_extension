

export default class En {
 
        public d:any;

    constructor() {
		this.d=[];

		// Default folder name for this language. Don't add Spaces at start and end
		this.d['picuteFolderName'] = 'pictures';

        this.d['yes'] =  'Yes';
		this.d['no'] =  'No';
		this.d['ok'] = 'Ok';

		this.d['en'] = 'English';
		this.d['de'] = 'German';
		this.d['fr'] = 'French';

		this.d['noOpenEditors'] = 'No open Editors.';
		this.d['tooManyOpenEditors'] = 'Too many open editors. Please just open one file and without a split view.';
		this.d['ActionErrorNotMarkdown'] = 'The current File is not a Markdown file and the current Action cannot be executed. Please open a Markdown File.';

		// this.d['SelectedWrongFileErrorDetail'] =  'Please select a .md or .html file.';
		// this.d['changesFromEditProjectDialogSaved'] =  'Your changes has been saved.';
		 this.d['error'] =  'A error occurs';
		// this.d['wrongMatucVersion'] =  "You have to install the latest Matuc version. Latest version is ${version}.";
		// this.d['checkFile'] =  'Check file ';
		// this.d['begin'] =  "Begin";
		// this.d['end'] =  "End";
		// this.d['errorMessage'] =  'Error message is:';
		// this.d['addContentHere'] =  "Add AND FORMAT CONTENT HERE";
		// //temporary warnings
		// this.d['noGitSupportJet'] =  'Git is not supported';
		// this.d['noGitSupportJetDetail'] =  'We are working on it, please try again later';

		// //main-navigation
		 this.d['projectTitle'] =  'Project';
		// this.d['cloneExistingRepo'] =  "Clone an existing repo";
		 this.d['newProject'] =  'Create new project';
		 this.d['selectFolder'] = 'Select Folder: (from the open workspace folders)';
		// this.d['repoName'] =  "Git repo name";
		// this.d['clone'] =  "Clone";
		 this.d['editProject'] =  'Edit project data';
		 this.d['documentTitle'] =  'Document';
		 this.d['saveChanges'] =  'Save changes';
		 this.d['newFile'] =  'create new file';
		 this.d['undo'] =  'Undo | ctrl+z';
		 this.d['redo'] =  'Redo | crtl+shift+z';
		 this.d['preview'] =  'Show html preview';
		 this.d['generateFile'] =  'Generate HTML';
		 this.d['convertEntireProject'] =  'Generate HTML for all project files';
		// this.d['conversionProfile'] =  'conversion profile';
		// this.d['blind'] =  'blind';
		// this.d['visuallyImpaired'] =  'visually impaired';
		 this.d['publishTitle'] =  'Publish';
		 this.d['checkProject'] =  'Check entire project';
		// this.d['commitChanges'] =  'Upload changes';
		// this.d['languageTitle'] =  'Language';
		// this.d['english'] =  'Englisch';
		// this.d['german'] =  'German';

		// //insert textboxes
		 this.d['insertTextbox'] =  "Add annotation/text box ";
		 this.d['insertTextboxContent'] =  "Content of annotation or title of textbox/textframe";

		// this.d['textboxContentPlaceholder'] =  "Only required for annotation of the transcriber";
		this.d['textFrameCheckbox'] =  "text frame";
		this.d['textBoxCheckbox'] = "text box";
		//this.d['textBox'] =  "text frame";
		// this.d['textFrame'] =  "text box";
		 this.d['annotation'] =  "Annotation of the transcriber";
		 this.d['color'] =  "Color";
		this.d['colorRed'] =  "Red";
		this.d['colorBlue'] =  "Blue";
		this.d['colorBrown'] =  "Brown";
		this.d['colorGrey'] =  "Grey";
		this.d['colorBlack'] =  "Black";
		this.d['colorGreen'] =  "Green";
		this.d['colorYellow'] =  "Yellow";
		this.d['colorOrange'] =  "Orange";
		this.d['colorViolet'] =  "Violett";

		this.d['selectType'] = "Select type:";
		this.d['titleOfTextbox'] = "Title of the textbox/textframe";
		this.d['contentOfTextbox'] = "Content of the textbox/textframe or annotation";
		// this.d['allColors'] =  "colorRed, colorBlack, colorGreen, colorYellow, colorOrange, colorBlue, colorBrown, colorGrey, colorViolet";
		this.d['annotationNoTitleError'] ="there is no title or color for an annotation. These attributes will be ignored.";

		// //footer-panel
		 this.d['emphasis'] =  'Emphasis';
		 
		 this.d['edit'] = "Edit";

		 this.d['bold'] =  'Bold';
		 this.d['italic'] =  'Italic';
		 this.d['strikethrough'] =  'Strikethrough';
		 this.d['headline'] =  'Headline';
		this.d['headline1'] =  'First level headline';
		this.d['headline2'] =  'Second level headline';
		this.d['headline3'] =  'Third level headline';
		this.d['headline4'] =  'Fourth level headline';
		this.d['headline5'] =  'Fifth level headline';
		this.d['headline6'] =  'Sixth level headline';
		this.d['list'] =  'List';
		this.d['orderedList'] =  'Create ordered list';
		this.d['unorderedList'] =  'Create unordered list';
		this.d['table'] =  'Table';
		this.d['insertTable'] =  'Insert table';
		this.d['importTableCsv'] =  'Import table from csv';
		this.d['editTableLayout'] = "Edit the Table below";

		this.d['editTable'] = "Edit Table";
		this.d['noTableFound'] = "No table found";
		this.d['errorTableFileNonExistant'] ="File of the table does not exist";
		this.d['parsingError'] = "Error parsing Table";

		this.d['tableInsertionPositionConflictWarning'] = "Warning: This content cannot be placed inside a table. Instead, it was appended after this table.";
		this.d['insert'] =  'Insert';
		this.d['formula'] =  'Insert formula';
		this.d['formulaInline'] =  'Insert inline formula';
		this.d['insertLink'] =  'Insert link';
		this.d['insertGraphic'] = 'Insert graphic';
		this.d['insertFootnote'] = 'Insert footnote';
		this.d['authorAnnotation'] =  'Insert annotation';
		this.d['formatting'] =  'Formatting';
		this.d['blockquote'] =  'Create blockquote';
		this.d['code'] =  'Format as code';
		this.d['separator'] =  'Separator';
		this.d['horizontalRule'] =  'Add horizontal rule';
		this.d['newPage'] =  'Add new page';
		this.d['page'] =  'Page';
		this.d['slide'] =  'Slide';

		// //dialog
		// this.d['close'] =  'close';
		// this.d['submit'] =  'Submit';
		// //git
		// this.d['gitUser'] =  'Username  (ZIH-Login)';
		// this.d['gitPassword'] =  'Password';
		// this.d['gitCloneSucess'] =  "Repo was cloned successfully!";
		// this.d['gitCloneError'] =  "An error occurs during the cloning. Check whether you load your private key.";
		// //new-project
		// this.d['useGit'] =  'Use a given git repository';
		// this.d['directory'] =  'Directory';
		 this.d['noFolder'] =  'No folder set';
		 this.d['preface'] =  'Add a preface to the document.';
		 this.d['chapters'] =  'Chapters';
		 this.d['appendixChapters'] =  'Appendix chapters';
		 this.d['author'] =  'Author';
		 this.d['title'] =  'Title';
		// this.d['source'] =  'Source';
		 this.d['institution'] =  'Institution';
		 this.d['projectLanguage'] =  'Language';
		 this.d['tableOfContents'] =  'Add a table of contents to the document.';
		 //this.d['tocDepth'] =  'Depth';
		 this.d['tocDepthExplanation'] =  'Depth of table of contents, only changeable if table of contents is set';
		 this.d['materialSource'] =  'Material source';
		// this.d['create'] =  'Create';
		// this.d['newProjectDialogMissingGitValue'] =  'Missing git value';
		// this.d['newProjectDialogMissingGitValueSource'] =  'Please enter your git path or dismiss adding a git repository.';
		// this.d['newProjectDialogMissingGitValueUsername'] =  'Please enter your git username or dismiss adding a git repository.';
		// this.d['newProjectDialogMissingGitValuePassword'] =  'Please enter your git password or dismiss adding a git repository.';
		// this.d['newProjectDialogNoPath'] =  'No path is set';
		// this.d['newProjectDialogNoPathDetail'] =  'Please choose a path where you want to save your new project.';
		// this.d['newProjectDialogNoChapters'] =  'No Chapters Set';
		// this.d['newProjectDialogNoChaptersDetail'] =  'There is no way to create a project with 0 chapters.';
		// this.d['newProjectDialogMissingMetadataValue'] =  'Missing Metadata';
		// this.d['newProjectDialogMissingMetadataValueTitle'] =  'Please enter the name of your project.';
		// this.d['newProjectDialogMissingMetadataValueAuthor'] =  'Please enter your name, your nickname or the name of someone else.';
		// this.d['newProjectDialogMissingMetadataValueInstitution'] =  'Please enter the name of your Institution (i.e. university, company, mom).';
		 this.d['somethingWentWrongDuringCreatingNewProject'] =  'An unexpected matuc error occured';
		 this.d['createdProjectSuccessfully'] ="Creation of project successfull.";

		// //edit metadata
		// this.d['edit'] = 'Save';
		// this.d['alternatePrefix'] =  'Use "A" as prefix to appendix chapter numbering and turn the extra heading "appendix" (or translated equivalent) off';
		// this.d['outputFormat'] =  'Output format';
		// this.d['appendixPrefix'] =  'Appendix Prefix';
		 this.d['sourceAuthor'] =  'Source author';
		 this.d['semYear'] =  'Semester of edit';
		 this.d['workingGroup'] =  'Working group';
		 this.d['updateEditedData'] = 'Update';
		 this.d['toc_Depth'] =  'Depth of table of content';
		 this.d['updateSuccessfull'] = 'The update was successfull.';
		// this.d['SelectedWrongFileError'] =  'File does not belong to your project';
		// this.d['somethingWentWrongDuringSavingProjectMetadata'] =  'An unexpected matuc error occured';

		// //commit-changes-dialog
		// this.d['commitMessage'] =  'Leave a few words about the changes you made...';
		// this.d['commit'] =  'Commit';
		// this.d['commitChangesSuccess'] =  'Your changes have been committed successfully.';
		// this.d['commitChangesError'] =  'Your changes could not have been committed.';
		// this.d['commitChangesErrorDetail'] =  'Maybe the file is stored in a wrong directory?\n';
		// this.d['userWantsToCommitChanges'] =  'Do you want to commit your changes now?';

		// //view functions
		// this.d['noMdWarningPreview'] =  'No markdown file';
		// this.d['noMdDetailPreview'] =  'Please open a markdown file (*.md) to preview.';

		// //matuc
		this.d['matucNotInstalled'] = "Matuc is not installed. You have to install the latest Matuc version to use this feature.";
		// this.d['noMdWarningGenerate'] =  'No markdown file';
		// this.d['noMdDetailGenerate'] =  'Please select a markdown file (*.md) to generate a html file.';
		// this.d['noConfiguration'] =  "No configuration, .lecture_meta_data.dcxml, in a directory exists in this project";
		this.d['unExpectedMatucError'] =  'An unexpected matuc error occured';
		this.d['documentHasBeenSaved'] = 'The current document has been saved, as it was neccessary for the execution of this action.';

		// //editor functions
		// this.d['headlineError'] =  'No headline possible';
		// this.d['headlineErrorDetail'] =  'Only a fully selected line can be declared as headline.';
		this.d["headlineNumberTooSmall"] = "Headline cannot be changed or created because the given headline size is out of range. The maximum headline size is H1.";
		this.d["headlineNumberTooBig"] = "Headline cannot be changed or created because the given headline size is out of range. The minimum headline size is H6.";
		this.d["headlineInsertedWithGrade"] = "Headline was inserted with grade: H";
		// this.d['blockquoteError'] =  'No blockquote possible';
		// this.d['blockquoteErrorDetail'] =  'Only a fully selected line can be declared as blockquote.';
		// this.d['addHorizontalRuleError'] =  'No horizontal rule possible';
		// this.d['addHorizontalRuleErrorDetail'] =  'Text can not be set as horizontal rule.';
		// this.d['addListError'] =  'No list possible';
		// this.d['addListErrorDetail'] =  'Only fully selected lines can be set as list items.';
		 this.d['importTableFromCsvError'] =  'Failed to import table';
		this.d['writingCSVTableFileError'] = 'A Error occured during the export and saving of the table to a CSV-File.';
		this.d['originalTableNotFound'] = "Original Table that has been edited could not be found. Instead, the table was inserted at the start of the current line.";
		this.d['hasBeenWritten'] =  'has been written';
		this.d['filehasBeenWritten'] = "file has been written: ";

		
		// this.d['importTableFromCsvErrorDetail'] =  'Can not replace text by table from CSV.';
		// this.d['AddPageNumberError'] =  'Error during the generation of the page number. Matuc-Message is';

		 //insert link dialog
		 this.d['linkText'] =  'Link text';
		 this.d['linkTitle'] =  'Link title (optional)';
		 this.d['link'] =  'URL';
		 this.d['insertLinkSubmit'] =  'Insert';

		// //insert table dialog
		this.d['tableHeadCheckbox'] =  'Add a head to the table';
		 this.d['tableType'] =  'Table Type';
		 this.d['simpleTable'] =  "Simple Table";
		 //this.d['multilineTable'] =  "Multiline Table";
		 this.d['pipeTable'] =  "Pipe Table";
		 this.d['gridTable'] =  "Grid Table";
		 this.d['rows'] =  'Rows';
		 this.d['row'] =  'Row';
		 this.d['columns'] =  'Columns';
		 this.d['column'] =  'Column';
		// this.d['head'] =  'Head';
		// this.d['field'] =  'Field';
		// this.d['toFastError'] =  'You are too fast, Dude';
		// this.d['toFastErrorDetails'] =  'Please, do not treat the table this hard.';
		// this.d['selectTableType'] =  'Table type';
		// this.d['ErrorNoTable'] =  'No tables found!';
		 this.d['thereAreNoTableInFolder'] =  'No tables found in folder.';
		// this.d['addTableToFolder'] =  'Save csv tables in folder ';
		 this.d['selectTable'] =  '...or select it from here';
		this.d['importTableError'] =  "Error during table import";
		// this.d['importTableErrorText'] =  "Check the csv table";
		// //insert graphic dialog
		 this.d['selectImageFile'] =  'Select the Image here';
		// this.d['selectMdFile'] =  'Open .md file';
		// this.d['selectPicture'] =  'Found picture';
		 this.d['altText'] =  'Alt text';
		 this.d['outsourceCheckbox'] =  'outsource Description';
		// this.d['graphicFile'] =  'Pick a file';
		 this.d['thereAreNoPicturesInFolder'] =  "No pictures found in folder: ";
		// this.d['thereAreNoCsvFileInFolder'] =  "No csv-file found in folder or the file names contain spaces.";
		// this.d['addPictureToFolder'] =  "Save pictures in folder ";
		// this.d['addCsvFileToFolder'] =  "Save csvlfile in folder ";
		// this.d['ErrorNoPicture'] =  "Not pictures found!";
		this.d['noPictureFolderFound'] = "No folder for pictures found, please add pictures to folder: ";
		// this.d['ErrorNoCsvFile'] =  "Not csv files found!";
		 this.d['or'] =  'or';
		 this.d['graphicsUri'] =  'paste graphic\'s link here';
		 this.d['graphicTitle'] =  'Title for graphic';
		 this.d['somethingWentWrongDuringInsertOfGraphic'] =  'An unexpected matuc error occured';
		 this.d['imagesMdHasBeenWritten'] =  'has been written';
		 this.d['selectPictureFromHere'] =  'select from here:';

		// //insert footnote dialog
		 this.d['footLabel'] =  'Label for footnote';
		 this.d['footText'] =  'Text in footnote';
		 this.d['footLabelError'] =  'Invalid label';
		 this.d['footLabelErrorDetail'] =  'Label is already used. Please enter another label.';

		// //import csv dialog
		// this.d['import'] =  'Import';
		this.d['uriTable'] =  'Insert table link here';
		// //mistkerl
		// this.d['mistkerlFoundGlobalError'] =  'A global error in your markdown occured.';
		// this.d['mistkerlDidNotFindAnyErrorAndSavedFile'] =  'Saved.';
		// this.d['mistkerlDidNotFindAnyError'] =  'No errors have been detected.';
		// this.d['mistkerlFoundErrorInFile'] =  'There are errors in ';
		// this.d['line'] =  'Line ';

		// //dialog warningPagenumbering
		// this.d['warningPagenumbering'] =  "Warning";
		// this.d['correct'] =  "Correct";
		 this.d['abort'] =  "Cancel";
		// this.d['textAutoCorrection'] =  "Press <strong>Correct</strong>if the page number\n should be corrected <strong>automatically</strong>.\n Press Abort for a manually correction!";

		// this.d['checkLine'] =  'Check line: ';
		
		// Reading Files and Folders
		this.d['readingFileError'] =  'An unexpected error occured reading the file.';
		this.d['importedFrom'] ='imported from';
		this.d['createFolderError'] ="Error creating folder.";
		this.d['linuxNotSupportedYet'] ="Linux is not supported yet.";
    }

    public get = (varname)=>{
		var result = this.d[varname];
		if(result === undefined){
			return varname;
		}
        return result;
    }

}
