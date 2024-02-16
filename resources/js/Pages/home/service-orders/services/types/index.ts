export interface ServiceOrderRecord {
    id: string;
    number: string;
    situation: { name: string, key: string, description: string };
    canceled: boolean;
    observation: string;
    users: { pilot: any, client: any, attendant: any };
    equipments: { drones: Array<any>, batteries: Array<any>, equipments: Array<any> };
    logs: Array<any>;
    incidents: Array<any>;
    reports: Array<any>;
    flight_plans: Array<any>;
    allowed_actions: {
        manage_status: boolean,
        manage_logs: boolean,
        manage_reports: boolean,
        manage_incidents: boolean
    },
    created_at: string;
    updated_at: string;
}

export interface ServiceOrderSelected {
    id: string;
    situation: { name: string, description: string };
}

export interface PaginationOrderBy {
    field: "id" | "name" | "number" | "creator.name" | "pilot.name" | "client.name" | "flight_plans_count" | "drones_count" | "batteries_count" | "equipments_count" | "incidents_count" | "logs";
    order: "asc" | "desc";
}

export type PaginationLimit = "10" | "25" | "50";
export type PaginationFilter = "created" | "approved" | "canceled" | "finished";
export type GroupCounter = { created: number, approved: number, canceled: number, finished: number };

export interface InertiaProps {
    initial_tab: string,
    selections: {
        pilot: {
            id: string,
            status: string,
            name: string,
            email: string,
            cpf: string,
            cnpj: string,
        }[];
        client: {
            id: string,
            status: string,
            name: string,
            email: string,
            cpf: string,
            cnpj: string,
        }[];
        flight_plans: {
            id: string,
            name: string,
            state: string,
            city: string,
            image_url: string,
        }[];
        drones: {
            id: string,
            name: string,
            model: string,
            manufacturer: string,
            serial_number: string,
            record_number: string,
            weight: string,
            image_url: string,
        }[];
        batteries: {
            id: string,
            name: string,
            model: string,
            manufacturer: string,
            serial_number: string,
            image_url: string,
        }[];
        equipments: {
            id: string,
            name: string,
            model: string,
            manufacturer: string,
            serial_number: string,
            image_url: string,
        }[];
    }
}