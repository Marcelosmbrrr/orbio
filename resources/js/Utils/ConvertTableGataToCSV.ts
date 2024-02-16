export function convertTableDataToCSV(name: string, data: any[]) {

    let formattedData: any[] = [];
    let headers: string[] = [];

    if (name == "users") {
        formattedData = usersTableData(data);
        headers = ["id", "nome", "email", "cargo", "status", "criado em", "atualizado em", "deletado em"];
    } else if (name == "roles") {
        formattedData = rolesTableData(data);
        headers = ["id", "nome", "criado em", "atualizado em", "deletado em"];
    } else if (name === "service_orders") {
        formattedData = serviceOrdersTableData(data);
        headers = ["id", "nome", "criador", "piloto", "cliente", "planos de voo", "drones", "baterias", "equipamentos", "incidentes", "criado em", "atualizado em", "deletado em"];
    } else if (name === "flight_plans") {
        formattedData = flightPlansTableData(data);
        headers = ["id", "nome", "criador", "estado", "cidade", "criado em", "atualizado em", "deletado em"];
    } else if (name === "drones") {
        formattedData = dronesTableData(data);
        headers = ["id", "nome", "fabricante", "número de registro", "serial", "modelo", "peso", "criado em", "atualizado em", "deletado em"];
    } else if (name === "batteries") {
        formattedData = batteriesTableData(data);
        headers = ["id", "nome", "fabricante", "serial", "modelo", "última carga", "criado em", "atualizado em", "deletado em"];
    } else if (name === "equipments") {
        formattedData = equipmentsTableData(data);
        headers = ["id", "nome", "fabricante", "número de registro", "serial", "modelo", "peso", "criado em", "atualizado em", "deletado em"];
    } else if (name === "logs") {
        formattedData = logsTableData(data);
        headers = ["id", "nome", "status", "arquivo", "timestamp", "criado em", "atualizado em", "deletado em"];
    }

    let content = '';
    for (let i = 0; i < headers.length; i++) {
        content += headers[i] + ";";
    }

    for (let row = 0; row < formattedData.length; row++) {
        content += "\n";
        for (let col = 0; col < headers.length; col++) {
            const keys = Object.keys(formattedData[row]);
            const value = formattedData[row][keys[col]];
            content += value + ";";
        }
    }

    var blob = new Blob([content],
        { type: "text/plain;charset=utf-8" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name + ".csv";
    a.click();

}

function usersTableData(data: any[]) {
    return data.map((user: any) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            status: user.status.value,
            created_at: user.created_at,
            updated_at: user.updated_at,
            deleted_at: user.deleted_at
        }
    });
}

function rolesTableData(data: any[]) {
    return data.map((role: any) => {
        return {
            id: role.id,
            name: role.name,
            created_at: role.created_at,
            updated_at: role.updated_at,
            deleted_at: role.deleted_at
        }
    });
}

function flightPlansTableData(data: any[]) {
    return data.map((flight_plan: any) => {
        return {
            id: flight_plan.id,
            name: flight_plan.name,
            creator: flight_plan.creator,
            state: flight_plan.state,
            city: flight_plan.city,
            created_at: flight_plan.created_at,
            updated_at: flight_plan.updated_at,
            deleted_at: flight_plan.deleted_at
        }
    });
}

function logsTableData(data: any[]) {
    return data.map((log: any) => {
        return {
            id: log.id,
            name: log.name,
            status: log.status.title,
            filename: log.filename,
            timestamp: log.timestamp,
            created_at: log.created_at,
            updated_at: log.updated_at,
            deleted_at: log.deleted_at
        }
    });
}

function serviceOrdersTableData(data: any[]) {
    return data.map((order: any) => {
        return {
            id: order.id,
            name: order.number,
            creator: order.creator,
            pilot: order.pilot.name,
            client: order.client.name,
            flight_plans: order.flight_plans.length,
            drones: order.drones.length,
            batteries: order.batteries.length,
            equipments: order.equipments.length,
            incidents: order.incidents,
            created_at: order.created_at,
            updated_at: order.updated_at,
            deleted_at: order.deleted_at
        }
    });
}

function dronesTableData(data: any[]) {
    return data.map((drone: any) => {
        return {
            id: drone.id,
            name: drone.name,
            manufacturer: drone.manufacturer,
            record_number: drone.record_number,
            serial_number: drone.serial_number,
            model: drone.model,
            weight: drone.weight,
            created_at: drone.created_at,
            updated_at: drone.updated_at,
            deleted_at: drone.deleted_at
        }
    });
}

function batteriesTableData(data: any[]) {
    return data.map((battery: any) => {
        return {
            id: battery.id,
            name: battery.name,
            manufacturer: battery.manufacturer,
            serial_number: battery.serial_number,
            model: battery.model,
            last_charge: battery.last_charge,
            created_at: battery.created_at,
            updated_at: battery.updated_at,
            deleted_at: battery.deleted_at
        }
    });
}

function equipmentsTableData(data: any[]) {
    return data.map((equipment: any) => {
        return {
            id: equipment.id,
            name: equipment.name,
            manufacturer: equipment.manufacturer,
            record_number: equipment.record_number,
            serial_number: equipment.serial_number,
            model: equipment.model,
            weight: equipment.weight,
            created_at: equipment.created_at,
            updated_at: equipment.updated_at,
            deleted_at: equipment.deleted_at
        }
    });
}