import * as React from 'react';
import { Link } from '@inertiajs/react';
import { useAuthentication } from '@/Context/AuthenticationContext';

interface IUser {
    id: string;
    status: { value: string, title: string, style_key: string };
    name: string;
}

interface IProps {
    id: string;
    pilot: IUser;
    client: IUser;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceOrderUsers(props: IProps) {

    const { user } = useAuthentication();

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Piloto</h3>
            <span>Lista de pilotos vinculados a essa ordem de serviço.</span>
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.pilot ?
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {props.pilot.name}
                                </th>
                                <td className="px-6 py-4">
                                    {props.pilot.status.title}
                                </td>
                            </tr>
                            :
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum piloto encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Cliente</h3>
            <span>Lista de clientes vinculados a essa ordem de serviço.</span>
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.client ?
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {props.client.name}
                                </th>
                                <td className="px-6 py-4">
                                    {props.client.status.title}
                                </td>
                            </tr>
                            :
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum cliente encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )


}