export interface DroneRecord {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    record_number: string;
    serial_number: string;
    weight: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface DroneSelected {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    record_number: string;
    serial_number: string;
    weight: string;
    image_url: string;
    is_disabled: boolean;
}

export interface PaginationOrderBy {
    field: "id" | "name" | "manufacturer" | "model" | "record_number" | "serial_number" | "weight";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";
export type PaginationFilter = "active" | "disabled";
export type GroupCounter = { active: number, deleted: number };