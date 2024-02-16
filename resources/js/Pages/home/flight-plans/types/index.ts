export interface FlightPlanRecord {
    id: string;
    name: string;
    coordinates: string;
    city: string;
    state: string;
    creator: string;
    configuration: string;
    file_path: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface FlightPlanSelected {
    id: string;
    name: string;
    coordinates: string;
    configuration: string;
    is_disabled: boolean;
}

export interface PaginationOrderBy {
    field: "id" | "name" | "user.name" | "city" | "state";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";
export type PaginationFilter = "active" | "disabled";
export type GroupCounter = { active: number, deleted: number };