import * as React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';

interface IFormController {
    cpf: number;
    cnpj: number;
    anac_license: number;
    company_name: number;
    trading_name: number;
}

const schema = yup.object({
    basic: yup.object({
        name: yup.string().min(3, 'deve ter no mínimo 3 letras').max(100).required('informe o nome'),
        email: yup.string().email('email inválido').required('informe o email')
    }),
    documents: yup.object({
        anac_license: yup.string().matches(/^\d{5}$/, 'licença inválida').min(5, 'licença inválida').max(5, 'licença inválida').notRequired(),
        cpf: yup.string().matches(/^\d{11}$/, 'digite apenas números').min(11, 'cpf inválido').max(11, 'cpf inválido').notRequired(),
        cnpj: yup.string().matches(/^\d{14}$/, 'digite apenas números').min(14, 'cnpj inválido').max(14, 'cnpj inválido').notRequired(),
        company_name: yup.string().notRequired(),
        trading_name: yup.string().notRequired(),
    }),
    address: yup.object({
        city: yup.string().notRequired(),
        state: yup.string().notRequired(),
        zip_code: yup.string().matches(/^\d{8}$/, 'cep inválido').notRequired(),
        neighborhood: yup.string().notRequired(),
        street_name: yup.string().notRequired(),
        number: yup.number().notRequired(),
    }),
    contact: yup.object({
        ddd: yup.string().matches(/^\d{2}$/, 'DDD inválido').notRequired(),
        telephone: yup.string().matches(/^\d{9}$/, 'número inválido').notRequired(),
    }),
}).required();

type FormData = yup.InferType<typeof schema>;

export function ProfileData() {

    const [formController, setFormController] = React.useState<IFormController>();
    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    React.useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get("api/v1/modules/profile");
            setFormController(JSON.parse(response.data.profile_data));
            setProfileValues(response.data);
        } catch (e) {
            requestError(e);
        } finally {
            setPending(false);
        }
    }

    function setProfileValues(data: any) {
        setValue('basic.name', data.name);
        setValue('basic.email', data.email);
        setValue('documents.anac_license', data.documents.anac_license);
        setValue('documents.cpf', data.documents.cpf);
        setValue('documents.cnpj', data.documents.cnpj);
        setValue('documents.company_name', data.documents.company_name);
        setValue('documents.trading_name', data.documents.trading_name);
        setValue('address.city', data.address.city);
        setValue('address.state', data.address.state);
        setValue('address.neighborhood', data.address.neighborhood);
        setValue('address.street_name', data.address.street_name);
        setValue('address.number', data.address.number);
        setValue('address.zip_code', data.address.zip_code);
        setValue('contact.ddd', data.contact.ddd);
        setValue('contact.telephone', data.contact.telephone);
    }

    async function onSubmit(form: FormData) {
        try {
            setPending(true);
            await api.patch("api/v1/modules/profile/update", form);
            enqueueSnackbar("Perfil atualizado com sucesso!", { variant: "success" });
        } catch (e: any) {
            requestError(e);
        } finally {
            setPending(false);
        }
    }

    function requestError(e: any) {
        console.error(e, e.stack);
        if (e.response.data.message != undefined) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
            enqueueSnackbar("Erro do Servidor", { variant: "error" });
        }
    }

    async function onSearchAddressByCep() {
        const cep = getValues('address.zip_code');

        if (cep?.length != 8) {
            return;
        }

        try {
            const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
            setValue('address.state', response.data.uf);
            setValue('address.city', response.data.localidade);
            setValue('address.neighborhood', response.data.bairro);
            setValue('address.street_name', response.data.logradouro);
        } catch (e: any) {
            console.error(e, e.stack);
        }
    }

    return (
        <form className="flex flex-col gap-8 py-8" onSubmit={handleSubmit(onSubmit)}>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className="text-2xl text-gray-800 dark:text-white">Meus Dados</h1>
                </div>
                <div className='flex gap-1'>
                    <div onClick={() => fetchData()} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none cursor-pointer bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Recarregar
                    </div>
                    <button type="submit" className="focus:outline-none text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                        {pending ? <SpinnerIcon /> : "Confirmar"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input readOnly disabled={pending} type="text" {...register('basic.name')} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe seu nome" />
                        <span className='text-red-500 text-sm'>{errors.basic?.name?.message}</span>
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input readOnly disabled={pending} type="text" {...register('basic.email')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe seu e-mail" />
                        <span className='text-red-500 text-sm'>{errors.basic?.email?.message}</span>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-2xl text-gray-800 dark:text-white">Documentos</h1>
            </div>
            <div className="flex flex-col">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                        <input disabled={pending} type="text" {...register('documents.cpf')} id="cpf" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite apenas números" />
                        <span className='text-red-500 text-sm'>{errors.documents?.cpf?.message}</span>
                    </div>

                    {!!formController?.cnpj &&
                        <div>
                            <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CNPJ</label>
                            <input disabled={pending} type="text" id="cnpj" {...register('documents.cnpj')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite apenas números" />
                            <span className='text-red-500 text-sm'>{errors.documents?.cnpj?.message}</span>
                        </div>
                    }

                    {!!formController?.company_name &&
                        <div>
                            <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome Fantasia</label>
                            <input disabled={pending} type="text" id="company" {...register('documents.company_name')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe seu nome fantasia" />
                            <span className='text-red-500 text-sm'>{errors.documents?.company_name?.message}</span>
                        </div>
                    }

                    {!!formController?.trading_name &&
                        <div>
                            <label htmlFor="trading_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razão Social</label>
                            <input disabled={pending} type="text" id="trading_name" {...register('documents.trading_name')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe sua razão social" />
                            <span className='text-red-500 text-sm'>{errors.documents?.trading_name?.message}</span>
                        </div>
                    }

                    {!!formController?.anac_license &&
                        <div>
                            <label htmlFor="anac_license" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Licença Anac</label>
                            <input disabled={pending} type="text" id="anac_license" {...register('documents.anac_license')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite apenas números" />
                            <span className='text-red-500 text-sm'>{errors.documents?.anac_license?.message}</span>
                        </div>
                    }

                </div>
            </div>
            <div>
                <h1 className="text-2xl text-gray-800 dark:text-white">Endereço</h1>
            </div>
            <div className="flex flex-col">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="zip" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CEP</label>
                        <div className="relative ">
                            <div className="absolute inset-y-0 left-0 flex items-center px-3 cursor-pointer rounded-l-lg" onClick={onSearchAddressByCep}>
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input disabled={pending} {...register('address.zip_code')} type="text" id="zip" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite apenas números" />
                            <span className='text-red-500 text-sm'>{errors.address?.zip_code?.message}</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UF</label>
                        <input disabled={pending} type="text" readOnly id="state" {...register('address.state')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
                        <input disabled={pending} type="text" readOnly id="city" {...register('address.city')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="neighborhood" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bairro</label>
                        <input disabled={pending} type="text" readOnly id="neighborhood" {...register('address.neighborhood')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="street_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome da Rua</label>
                        <input disabled={pending} type="text" readOnly id="street_name" {...register('address.street_name')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número</label>
                        <input disabled={pending} type="text" id="number" {...register('address.number')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o número" />
                        <span className='text-red-500 text-sm'>{errors.address?.number?.message}</span>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-2xl text-gray-800 dark:text-white">Contato</h1>
            </div>
            <div className="flex flex-col">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="ddd" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DDD</label>
                        <input disabled={pending} type="text" id="ddd" {...register('contact.ddd')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Informe o código de área' />
                        <span className='text-red-500 text-sm'>{errors.contact?.ddd?.message}</span>
                    </div>
                    <div>
                        <label htmlFor="telephone1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
                        <input disabled={pending} type="text" id="telephone1" {...register('contact.telephone')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Digite apenas números' />
                        <span className='text-red-500 text-sm'>{errors.contact?.telephone?.message}</span>
                    </div>
                </div>
            </div>
        </form>
    )
}