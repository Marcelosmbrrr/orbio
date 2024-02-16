import * as yup from "yup";

const schema = yup.object({
    logs: yup.array(yup.mixed()).required('importe no mínimo 1 log')
}).required();

export { schema as CreateLogSchema };