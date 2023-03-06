export interface EditorLayout {
    orientation?: number;
    groups?: EditorLayout[];
    size?: number;
}
export interface TableSelection {
    data: {
        hasHeader: boolean;
        tableType: string;
        data: JSON;
    };
    file: string;
}
export interface File {
    fileName: string;
    folderPath: string;
    completePath: string;
    relativePath: string;
}

export interface ProjectConfig {
    AppendixPrefix: number;
    Editor: string;
    SourceAuthor: string;
    Institution: string;
    LectureTitle: string;
    Language: string;
    TocDepth: number;
    Source: string;
    SemesterOfEdit: string;
    WorkingGroup: string;
}
