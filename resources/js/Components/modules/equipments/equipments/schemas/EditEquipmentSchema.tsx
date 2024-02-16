import * as yup from "yup";

const schema = yup.object({
    name: yup.string().min(3, 'deve ter no mínimo 3 letras').max(100).required('informe o nome'),
    manufacturer: yup.string().required('informe o fabricante'),
    model: yup.string().required('informe o modelo'),
    record_number: yup.string().required('informe o número do registro'),
    serial_number: yup.string().required('informe o número serial'),
    weight: yup.string().matches(/^(?:0\.\d+|[1-9]\d*(?:\.\d+)?)$/,'peso inválido').required('informe o peso'),
    image: yup.mixed().default(null)
}).required();

export { schema as EditEquipmentSchema };