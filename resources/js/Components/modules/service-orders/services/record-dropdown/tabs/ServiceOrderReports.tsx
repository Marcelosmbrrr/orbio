import * as React from 'react';
import { router } from '@inertiajs/react';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { ExportReport } from '../../../reports/export/ExportReport';
import { DeleteServiceOrderResource } from '../forms/DeleteServiceOrderResource';

interface IReport {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

interface IProps {
    id: string;
    reports: IReport[]
    can_manage_reports: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceOrderReports(props: IProps) {

    const { user } = useAuthentication();

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Relatórios</h3>
            <span>Lista de relatórios registrados na ordem de serviço. Eles são gerados após a realização de um ou mais planos de voo.</span>
            {!!props.can_manage_reports &&
                <div className='my-2'>
                    {!!user?.modules.gos.write &&
                        <button onClick={() => router.get("service-orders/" + props.id + "/report/create")} type="button" className="flex items-center w-fit focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                            </svg>
                            <span>Criar</span>
                        </button>
                    }
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
                                Descrição
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Criado em
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Exportar {props.can_manage_reports && "| Deletar"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.reports.length > 0 && props.reports.map((report: any) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {report.name}
                                </th>
                                <td className="px-6 py-4">
                                    Descrição
                                </td>
                                <td className="px-6 py-4">
                                    {report.created_at}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ExportReport report_id={report.id} report_name={report.name} />
                                    <DeleteServiceOrderResource can_open={props.can_manage_reports} title={"Confirmar remoção do relatório"} route={`api/v1/actions/service-orders/${props.id}/reports/${report.id}/delete`} setReload={props.setReload} />
                                </td>
                            </tr>
                        ))}
                        {props.reports.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum relatório encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )


}