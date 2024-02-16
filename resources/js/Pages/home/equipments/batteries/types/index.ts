export interface BatteryRecord {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    serial_number: string;
    last_charge: number;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface BatterySelected {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    serial_number: string;
    last_charge: string;
    image_url: string;
    is_disabled: boolean;
}

export interface PaginationOrderBy {
    field: "id" | "name" | "manufacturer" | "model" | "serial_number" | "last_charge" | "weight";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";
export type PaginationFilter = "active" | "disabled";
export type GroupCounter = { active: number, deleted: number };