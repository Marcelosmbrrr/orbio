import * as yup from "yup";

const schema = yup.object({
    name: yup.string().required('selecione a data inicial')
}).required();

export { schema as EditFlightPlanSchema };