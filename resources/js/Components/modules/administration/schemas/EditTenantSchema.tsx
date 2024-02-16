import * as yup from "yup";

const schema = yup.object({
    name: yup.string().min(3, 'deve ter no mínimo 3 letras').max(100).required('informe o nome'),
    email: yup.string().email('email inválido').required('informe o email')
}).required();

export { schema as EditTenantSchema };