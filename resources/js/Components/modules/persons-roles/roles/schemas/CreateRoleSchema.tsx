import * as yup from "yup";

const schema = yup.object({
    name: yup.string().min(3, 'deve ter no mínimo 3 letras').max(100).required('informe o nome'),
    modules: yup.object({
        administration: yup.object({
            id: yup.string().default("1"),
            read: yup.boolean().default(false),
            write: yup.boolean().default(false)
        }),
        flight_plans: yup.object({
            id: yup.string().default("2"),
            read: yup.boolean().default(false),
            write: yup.boolean().default(false)
        }),
        logs: yup.object({
            id: yup.string().default("3"),
            read: yup.boolean().default(false),
            write: yup.boolean().default(false)
        }),
        service_orders: yup.object({
            id: yup.string().default("4"),
            read: yup.boolean().default(false),
            write: yup.boolean().default(false)
        }),
        equipments: yup.object({
            id: yup.string().default("5"),
            read: yup.boolean().default(false),
            write: yup.boolean().default(false)
        })
    }),
    profile_data: yup.object({
        cnpj: yup.boolean().default(false),
        anac_license: yup.boolean().default(false),
        company_name: yup.boolean().default(false),
        trading_name: yup.boolean().default(false),
    })
}).required();

export { schema as CreateRoleSchema };