export interface EditorLayout {
    orientation?: number;
    groups?: Array<EditorLayout>;
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
