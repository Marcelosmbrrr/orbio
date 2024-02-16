import * as React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { CreateEditIncidentSchema } from '../schemas/CreateEditIncidentSchema';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';

interface IProps {
    can_open: boolean;
    selection: { id: string; type: string; description: string, date: string };
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = yup.InferType<typeof CreateEditIncidentSchema>;

export const EditIncident = React.memo((props: IProps) => {

    const [open, setOpen] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const service_order_id = window.location.href.split("/")[5];

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
        resolver: yupResolver(CreateEditIncidentSchema)
    });

    async function onSubmit(form: FormData) {
        try {
            setPending(true);
            await api.patch("api/v1/actions/service-orders/" + service_order_id + "/incidents/" + props.selection.id, form);
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
        reset();
        setValue("date", props.selection.date);
        setValue("type", props.selection.type);
        setValue("description", props.selection.description);
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
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m13.835 7.578-.005.007-7.137 7.137 2.139 2.138 7.143-7.142-2.14-2.14Zm-10.696 3.59 2.139 2.14 7.138-7.137.007-.005-2.141-2.141-7.143 7.143Zm1.433 4.261L2 12.852.051 18.684a1 1 0 0 0 1.265 1.264L7.147 18l-2.575-2.571Zm14.249-14.25a4.03 4.03 0 0 0-5.693 0L11.7 2.611 17.389 8.3l1.432-1.432a4.029 4.029 0 0 0 0-5.689Z" />
                </svg>
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
                                        Editar Incidente
                                    </h3>
                                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <form id="incident-edition" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                        <div>
                                            <label htmlFor="type" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo</label>
                                            <input type="text" {...register("type")} id="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o tipo" />
                                            <span className='text-red-500 text-sm'>{errors.type?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="date" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data</label>
                                            <input type="date" {...register('date')} id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                            <span className='text-red-500 text-sm'>{errors.date?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                                            <textarea {...register("description")} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a descrição"></textarea>
                                            <span className='text-red-500 text-sm'>{errors.description?.message}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <button onClick={onClose} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Cancelar
                                        </button>
                                        <button form="incident-edition" type='submit' disabled={pending} className="focus:outline-none text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
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