export interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: { id: string, name: string };
    status: { value: string, title: string, style_key: string };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface UserSelected {
    id: string;
    name: string;
    email: string;
    role: string;
    is_disabled: boolean;
}

export interface PaginationOrderBy {
    field: "id" | "name" | "email" | "role.name" | "status";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";
export type PaginationFilter = "active" | "inative" | "disabled";
export type GroupCounter = { active: number, inative: number, deleted: number };