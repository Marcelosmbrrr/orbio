interface Module {
    id: string;
    read: boolean;
    write: boolean;
}

interface RoleUserData {
    anac_license: boolean;
    cpf: boolean;
    cnpj: boolean;
    company_name: boolean;
    trading_name: boolean;
}

export interface RoleSelected {
    id: string;
    name: string;
    modules: Module[];
    profile_data: RoleUserData;
    is_disabled: boolean;
}

export interface RoleRecord {
    id: string;
    name: string;
    modules: Module[];
    profile_data: Object;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PaginationOrderBy {
    field: "id" | "name";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";
export type PaginationFilter = "active" | "disabled";
export type GroupCounter = { active: number, deleted: number };