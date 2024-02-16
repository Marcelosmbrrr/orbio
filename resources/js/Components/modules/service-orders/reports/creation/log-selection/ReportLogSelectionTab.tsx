import * as React from 'react';
// custom
import { SelectedLogData } from '../forms/SelectedLogData';
// Types
import { ReportCreationLog } from '@/Pages/home/service-orders/reports/types';

interface IProps {
    logs: ReportCreationLog[];
    selectedLogs: ReportCreationLog[];
    setSelectedLogs: React.Dispatch<React.SetStateAction<ReportCreationLog[]>>;
}

export function ReportLogSelection(props: IProps) {

    function onLogSelect(selected_log: ReportCreationLog) {
        const clone = JSON.parse(JSON.stringify(props.selectedLogs));
        clone.push(selected_log);
        props.setSelectedLogs(clone);
    }

    function onLogRemove(removed_log: ReportCreationLog) {
        const clone = JSON.parse(JSON.stringify(props.selectedLogs));
        const find_record_index = props.selectedLogs.findIndex((selection) => Number(selection.id) === Number(removed_log.id));
        clone.splice(find_record_index, 1);
        props.setSelectedLogs(clone);
    }

    function isLogSelected(log_id: string): boolean {
        const find_record_index = props.selectedLogs.findIndex((selection) => Number(selection.id) === Number(log_id));
        return Boolean(find_record_index + 1); // Boolean(index + 1) or Boolean(-1 + 1)
    }

    function selectedLogStatus(log: ReportCreationLog) {

        const selected_log = props.selectedLogs.find((selection) => Number(selection.id) === Number(log.id));

        if (!selected_log) {
            return null;
        }

        if (selected_log.extra_data.filled) {
            return (
                <div className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-r dark:bg-green-900 dark:text-green-300">Dados Preenchidos</div>
            )
        } else {
            return (
                <div className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-r dark:bg-red-900 dark:text-red-300">Dados não preenchidos</div>
            )
        }

    }

    return (
        <>
            <div>
                <span className="text-md text-gray-800 dark:text-white">Selecione os logs que serão utilizados no relatório e adicione os dados coletados na realização do plano de voo.</span>
            </div>
            <div className="flex justify-auto flex-wrap gap-5 text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 mt-5">
                {props.logs.map((log) =>

                    <div className="grow md:max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" key={log.id}>
                        <div>
                            <img className="rounded-t-lg h-full w-full" src={log.image_url} alt="" />
                        </div>
                        <div className="p-3">
                            <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{log.name}</h5>
                            <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">Arquivo: {log.filename}</p>
                            <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">Coordenadas: {log.coordinates} ({log.state}, {log.city})</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div>
                                {isLogSelected(log.id) && <div className="mb-1 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-r dark:bg-green-900 dark:text-green-300">Selecionado</div>}
                                {selectedLogStatus(log)}
                            </div>
                            <div className='mr-2'>
                                {!isLogSelected(log.id) && <button onClick={() => onLogSelect(log)} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Selecionar</button>}
                                {isLogSelected(log.id) &&
                                    <>
                                        <button onClick={() => onLogRemove(log)} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 me-2">Remover</button>
                                        <SelectedLogData logId={log.id} selectedLogs={props.selectedLogs} setSelectedLogs={props.setSelectedLogs} />
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                )}
                {props.logs.length == 0 &&
                    <span className='text-sm dark:text-gray-400'>Nenhum log foi encontrado.</span>
                }
            </div>
        </>
    )
}