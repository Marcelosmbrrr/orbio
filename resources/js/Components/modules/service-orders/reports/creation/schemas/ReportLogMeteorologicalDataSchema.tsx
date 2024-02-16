import * as yup from "yup";

const schema = yup.object({
    temperature: yup.object({
        initial: yup.string().required('Informe a temperatura inicial'),
        final: yup.string().required('Informe a temperatura final')
    }),
    humidity: yup.object({
        initial: yup.string().required('Informe a umidade inicial'),
        final: yup.string().required('Informe a umidade final')
    }),
    wind_speed: yup.object({
        initial: yup.string().required('Informe a velocidade do vento inicial'),
        final: yup.string().required('Informe a velocidade do vento final')
    })
}).required();

export { schema as ReportLogMeteorologicalDataSchema };