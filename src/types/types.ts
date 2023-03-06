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
