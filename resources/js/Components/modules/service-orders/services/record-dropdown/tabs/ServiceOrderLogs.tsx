import * as React from 'react';
import { Link } from '@inertiajs/react';
import { useSnackbar } from 'notistack';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';
import { DownloadIcon } from '@/Components/shared/icons/DownloadIcon';
import { api } from '@/Services/api';
import { DeleteServiceOrderResource } from '../forms/DeleteServiceOrderResource';

interface ILog {
    id: string;
    name: string;
    date: string;
    state: string;
    city: string;
    log_url: string;
    image_url: string;
    created_at: string;
}

interface IProps {
    id: string;
    logs: ILog[],
    can_manage_logs: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceOrderLogs(props: IProps) {

    const { user } = useAuthentication();
    const { enqueueSnackbar } = useSnackbar();

    async function exportLog(log_id: string, log_name: string) {
        try {
            const response = await api.get(`api/v1/actions/service-orders/${props.id}/logs/${log_id}/export`);
            const blob = new Blob([response.data.contents], { type: 'application/vnd.google-earth.kml+xml' });
            // Create link to download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', log_name + ".kml");
            document.body.appendChild(link);
            link.click();
        } catch (e: any) {
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

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Logs</h3>
            <span>Lista de planos de logs vinculados a essa ordem de serviço.</span>
            {props.can_manage_logs &&
                <div className='my-2'>
                    <Link href={"service-orders/" + props.id + "/log/create"} className="flex items-center w-fit focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                        </svg>
                        <span>Criar</span>
                    </Link>
                </div>
            }
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Data
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cidade
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Exportar | Visualizar | Deletar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.logs.length > 0 && props.logs.map((log: ILog) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={log.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {log.name}
                                </th>
                                <td className="px-6 py-4">
                                    {log.date}
                                </td>
                                <td className="px-6 py-4">
                                    {log.city}
                                </td>
                                <td className="px-6 py-4">
                                    {log.state}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => exportLog(log.id, log.name)} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-full text-sm p-2 text-center inline-flex items-center">
                                        <DownloadIcon />
                                    </button>
                                    <ShowImage can_open={true} title={"Visualização do Plano"} image_url={log.image_url} />
                                    <DeleteServiceOrderResource can_open={props.can_manage_logs} title={"Confirmar remoção do log"} route={`api/v1/actions/service-orders/${props.id}/logs/${log.id}/delete`} setReload={props.setReload} />
                                </td>
                            </tr>
                        ))}
                        {props.logs.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={5} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum log encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )


}