import * as yup from "yup";

const schema = yup.object({
    name: yup.string().required('informe o nome'),
    manufacturer: yup.string().required('informe o fabricante'),
    model: yup.string().required('informe o modelo'),
    serial_number: yup.string().required('informe o número serial'),
    last_charge: yup.mixed().required('informe a data da última carga'),
    image: yup.mixed().default(null).optional(),
});

export { schema as CreateBatterySchema };
