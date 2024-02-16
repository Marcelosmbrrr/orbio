import * as React from 'react';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';

interface IDrone {
    id: string;
    name: string;
    model: string;
    weight: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface IBattery {
    id: string;
    name: string;
    model: string;
    last_charge: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface IEquipment {
    id: string;
    name: string;
    model: string;
    weight: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface IProps {
    id: string;
    drones: IDrone[];
    batteries: IBattery[];
    equipments: IEquipment[];
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceOrderEquipments(props: IProps) {

    const { user } = useAuthentication();

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Drones</h3>
            <span>Lista de drones vinculados a essa ordem de serviço.</span>
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Modelo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Peso
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Visualizar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.drones.length > 0 && props.drones.map((drone: IDrone) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={drone.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {drone.name}
                                </th>
                                <td className="px-6 py-4">
                                    {drone.model}
                                </td>
                                <td className="px-6 py-4">
                                    {drone.weight}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ShowImage can_open={true} title={"Visualização do Drone"} image_url={drone.image_url} />
                                </td>
                            </tr>
                        ))}
                        {props.drones.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum drone encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Baterias</h3>
            <span>Lista de baterias vinculadas a essa ordem de serviço.</span>
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Modelo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Última carga
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Visualizar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.batteries.length > 0 && props.batteries.map((battery: IBattery) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={battery.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {battery.name}
                                </th>
                                <td className="px-6 py-4">
                                    {battery.model}
                                </td>
                                <td className="px-6 py-4">
                                    {battery.last_charge}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ShowImage can_open={true} title={"Visualização da Bateria"} image_url={battery.image_url} />
                                </td>
                            </tr>
                        ))}
                        {props.batteries.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhuma bateria encontrada
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Equipamentos</h3>
            <span>Lista de equipamentos vinculados a essa ordem de serviço.</span>
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Modelo
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Visualizar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.equipments.length > 0 && props.equipments.map((equipment: IEquipment) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={equipment.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {equipment.name}
                                </th>
                                <td className="px-6 py-4">
                                    {equipment.model}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ShowImage can_open={true} title={"Visualização do Equipamento"} image_url={equipment.image_url} />
                                </td>
                            </tr>
                        ))}
                        {props.equipments.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum equipamento encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )


}