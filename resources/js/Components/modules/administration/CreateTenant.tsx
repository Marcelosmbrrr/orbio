import * as React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Custom
import { CreateTenantSchema } from './schemas/CreateTenantSchema';
import { api } from '@/Services/api';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';

interface IProps {
    can_open: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = yup.InferType<typeof CreateTenantSchema>;

export const CreateTenant = React.memo((props: IProps) => {

    const [open, setOpen] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: yupResolver(CreateTenantSchema),
        defaultValues: {
            name: "",
            email: ""
        }
    });

    async function onSubmit(form: FormData) {
        try {
            setPending(true);
            await api.post("api/v1/modules/administration/tenants", form);
            enqueueSnackbar("Gerente criado com sucesso!", { variant: "success" });
            setTimeout(() => {
                setOpen(false);
                props.setReload((prev) => !prev);
            }, 500);
        } catch (e) {
            setPending(false);
            requestError(e);
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

    function onOpen() {
        setOpen(true);
        setPending(false);
        reset();
    }

    function onClose() {
        setOpen(false);
    }

    if (!props.can_open) {
        return ""
    }

    return (
        <>
            <button onClick={onOpen} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                </svg>
                <span>Criar</span>
            </button>

            {open &&
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Criar Gerente
                                    </h3>
                                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                        <div>
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                            <input type="text" {...register("name")} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome do gerente" />
                                            <span className='text-red-500 text-sm'>{errors.name?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                                            <input type="email" {...register("email")} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o email do gerente" />
                                            <span className='text-red-500 text-sm'>{errors.email?.message}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <button onClick={onClose} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Cancelar
                                        </button>
                                        <button disabled={pending} type="submit" className="focus:outline-none text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                                            {pending ? <SpinnerIcon /> : "Confirmar"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )


});