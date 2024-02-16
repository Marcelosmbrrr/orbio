// Logs 

export interface LogRecord {
    id: string;
    name: string;
    log_url: string;
    image_url: string;
    filename: string;
    coordinates: string;
    city: string;
    state: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface LogSelected {
    id: string;
    name: string;
    is_disabled: boolean;
}

export interface PaginationOrderBy {
    field: "id" | "name" | "file" | "timestamp" | "filename" | "state" | "city";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";

// Log creation

export interface LogCreationImage {
    filename: string;
    dataURL: string | null;
}

export interface LogUploaded {
    processing: { pending: boolean, ok: boolean, message: string, to_save: boolean };
    filename: string;
    coordinates?: string;
    state: string;
    city: string;
    contents: string;
    imageDataURL?: string;
}

export interface LogCreationProcessing {
    pending: boolean;
    error: boolean;
    message: string;
    tab_classname: string;
}