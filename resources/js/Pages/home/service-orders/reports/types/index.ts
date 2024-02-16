export interface InertiaProps {
    id: string;
    number: string;
    city: string;
    state: string;
    creator: string;
    pilot: string;
    client: string;
    attendant: string;
    logs: ReportCreationLog[];
}

export interface ReportCreationLog {
    id: string;
    name: string;
    state: string;
    city: string;
    image_url: string;
    filename: string;
    timestamp: string;
    coordinates: string;
    extra_data: {
        filled: boolean;
        temperature: {
            initial: string;
            final: string;
        };
        humidity: {
            initial: string;
            final: string;
        };
        wind_speed: {
            initial: string;
            final: string;
        };
    };
}