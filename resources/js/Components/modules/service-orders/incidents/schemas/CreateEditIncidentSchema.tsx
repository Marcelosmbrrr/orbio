import * as yup from "yup";

const schema = yup.object({
    type: yup.string().min(3, 'deve ter no mínimo 3 letras').max(100).required('informe o tipo'),
    description: yup.string().min(3, 'deve ter no mínimo 3 letras').max(255).required('informe a descrição'),
    date: yup.mixed().required('informe a data do incidente'),
}).required();

export { schema as CreateEditIncidentSchema };