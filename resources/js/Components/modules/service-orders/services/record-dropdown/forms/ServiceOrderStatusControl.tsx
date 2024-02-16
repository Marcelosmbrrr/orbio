import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';

interface IProps {
    service_order_id: string;
    service_order_status: string;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

type Operation = "approved" | "finished" | "canceled";

export function ServiceOrderStatusControl(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);
    const [operation, setOperation] = React.useState<Operation>();
    const [observation, setObservation] = React.useState<string>("");
    const [pending, setPending] = React.useState<boolean>(false);
    const { user } = useAuthentication();
    const { enqueueSnackbar } = useSnackbar();

    function onOpen(op: Operation) {
        setOperation(op);
        setOpen(true);
    }

    function onClose() {
        setObservation("");
        setOpen(false);
    }

    function onChangeObservation(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setObservation(e.target.value);
    }


    async function onSubmit() {

        if (user?.role.id != "3") {
            enqueueSnackbar("Ação não autorizada", { variant: "error" });
            return;
        }

        if (operation === "canceled" && observation.length < 10) {
            enqueueSnackbar("A justificativa é obrigatória", { variant: "error" });
            return;
        }

        try {
            setPending(true);
            const response = await api.patch(`api/v1/actions/service-orders/${props.service_order_id}/change-status`, {
                status: operation,
                observation
            });
            enqueueSnackbar(response.data.message, { variant: "success" });
            setTimeout(() => {
                props.setReload((prev) => !prev);
            }, 500);
        } catch (e: any) {
            requestError(e);
        }
    }

    function requestError(e: any) {
        console.error(e, e.stack);
        setPending(false);
        if (e.response.data.message != undefined) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
            enqueueSnackbar("Erro do Servidor", { variant: "error" });
        }
    }

    function renderActions() {

        if (props.service_order_status === "created") {
            return (
                <div className='flex'>
                    <button onClick={() => onOpen("approved")} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 16">
                            <path d="M0 .984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L1.506.139A1 1 0 0 0 0 .984Z" />
                        </svg>
                        <span>Atender</span>
                    </button>
                    <button onClick={() => onOpen("canceled")} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                        </svg>
                        <span>Cancelar</span>
                    </button>
                </div>
            )
        } else if (props.service_order_status === "approved") {
            return (
                <div className='flex'>
                    <button onClick={() => onOpen("finished")} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Finalizar
                    </button>
                    <button onClick={() => onOpen("canceled")} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                        </svg>
                        <span>Cancelar</span>
                    </button>
                </div>
            )
        } else {
            return "Cancelado";
        }

    }

    function setTitle() {
        if (operation === "approved") {
            return "Aprovar Ordem de Serviço";
        } else if (operation === "finished") {
            return "Finalizar Ordem de Serviço";
        } else {
            return "Cancelar Ordem de Serviço";
        }
    }

    function setContent() {
        if (operation === "approved") {
            return (
                <p className="mb-4 text-gray-500 dark:text-gray-300">
                    Após a aprovação da ordem de serviço, ela será inicializada.
                </p>
            )
        } else if (operation === "finished") {
            return (
                <>
                    <p className="mb-4 text-gray-500 dark:text-gray-300">
                        Após finalizada a ordem de serviço, não será possível realizar mais nenhuma alteração.
                    </p>
                    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <textarea onChange={onChangeObservation} rows={3} className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Escreva a observação (opcional)"></textarea>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <p className="mb-4 text-gray-500 dark:text-gray-300">
                        Após cancelada a ordem de serviço, não será possível realizar mais nenhuma alteração.
                    </p>
                    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label htmlFor="comment" className="sr-only">Justificativa</label>
                            <textarea onChange={onChangeObservation} rows={3} className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Escreva a observação (obrigatório)"></textarea>
                        </div>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            {renderActions()}
            {open &&
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
                    {/* modal */}
                    <div className="flex min-h-full items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {setTitle()}
                                    </h3>
                                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <div>
                                    <div className='px-2'>
                                        {setContent()}
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <button onClick={onClose} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Cancelar
                                        </button>
                                        <button onClick={onSubmit} disabled={pending} className="focus:outline-none text-white bg-green-800 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                                            {pending ? <SpinnerIcon /> : "Confirmar"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    )




}