import * as React from 'react';
import { Link } from '@inertiajs/react';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { DeleteServiceOrderResource } from '../forms/DeleteServiceOrderResource';
import { CreateIncident } from '../../../incidents/creation-edition/CreateIncident';
import { EditIncident } from '../../../incidents/creation-edition/EditIncident';

interface IIncident {
    id: string;
    type: string;
    description: string;
    date: string;
    created_at: string;
}

interface IProps {
    id: string;
    incidents: IIncident[];
    can_manage_incidents: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceOrderIncidents(props: IProps) {

    const { user } = useAuthentication();

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Incidentes</h3>
            <span>Lista de incidentes registrados na ordem de serviço.</span>
            {!!props.can_manage_incidents &&
                <div className='my-2'>
                    <CreateIncident can_open={true} setReload={props.setReload} />
                </div>
            }
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Tipo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Descrição
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Data
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Editar | Deletar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.incidents.length > 0 && props.incidents.map((incident: IIncident) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={incident.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {incident.type}
                                </th>
                                <td className="px-6 py-4">
                                    {incident.description}
                                </td>
                                <td className="px-6 py-4">
                                    {incident.date}
                                </td>
                                <td className="flex items-center justify-end px-6 py-4 text-right">
                                    <EditIncident can_open={true} selection={{ id: incident.id, type: incident.type, date: incident.date, description: incident.description }} setReload={props.setReload} />
                                    <DeleteServiceOrderResource can_open={props.can_manage_incidents} title={"Confirmar remoção do incidente"} route={`api/v1/actions/service-orders/${props.id}/pilots/${incident.id}/delete`} setReload={props.setReload} />
                                </td>
                            </tr>
                        ))}
                        {props.incidents.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum incidente encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )


}