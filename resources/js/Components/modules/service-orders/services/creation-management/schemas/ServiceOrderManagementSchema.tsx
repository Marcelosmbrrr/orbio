import * as yup from "yup";

const schema = yup.object({
    pilot: yup.array(yup.object({
        id: yup.string(),
        status: yup.string(),
        name: yup.string(),
        email: yup.string(),
        cpf: yup.string(),
        cnpj: yup.string(),
    })).default([]).max(1, "O piloto já foi selecionado"),
    client: yup.array(yup.object({
        id: yup.string(),
        status: yup.string(),
        name: yup.string(),
        email: yup.string(),
        cpf: yup.string(),
        cnpj: yup.string(),
    })).default([]).max(1, "O cliente já foi selecionado"),
    flight_plans: yup.array(yup.object({
        id: yup.string(),
        name: yup.string(),
        state: yup.string(),
        city: yup.string(),
        image_url: yup.string(),
    })).default([]).min(1, "Selecione ao menos um plano de voo"),
    drones: yup.array(yup.object({
        id: yup.string(),
        name: yup.string(),
        model: yup.string(),
        manufacturer: yup.string(),
        serial_number: yup.string(),
        record_number: yup.string(),
        weight: yup.string(),
        image_url: yup.string(),
    })).default([]),
    batteries: yup.array(yup.object({
        id: yup.string(),
        name: yup.string(),
        model: yup.string(),
        manufacturer: yup.string(),
        serial_number: yup.string(),
        image_url: yup.string(),
    })).default([]),
    equipments: yup.array(yup.object({
        id: yup.string(),
        name: yup.string(),
        model: yup.string(),
        manufacturer: yup.string(),
        serial_number: yup.string(),
        image_url: yup.string(),
    })).default([]),
}).required();

export { schema as ServiceOrderManagementSchema };