import * as yup from "yup";

const schema = yup.object({
    responsible: yup.string().not([""], "Selecione uma opção"),
    client: yup.string().not([""], "Selecione uma opção"),
    name: yup.string().required('Informe o nome'),
    state: yup.string().required('Informe o estado'),
    city: yup.string().required('Informe a cidade'),
    farm: yup.string().required('Informe o nome da fazenda'),
    area: yup.string().required('Informe a área'),
    date: yup.string().required('Informe a data da aplicação'),
    number: yup.string().required('Informe o número da aplicação'),
    dosage: yup.string().required('Informe a dosagem'),
    provider: yup.string().required('Informe o nome do fornecedor')
});

export { schema as ReportBasicInformationSchema };