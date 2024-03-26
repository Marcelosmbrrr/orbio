import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateDrone } from '@/Components/modules/equipments/drones/CreateDrone';
import { EditDrone } from '@/Components/modules/equipments/drones/EditDrone';
import { DeleteModuleRecord } from '@/Components/shared/forms-modal/DeleteModuleRecord';
import { RevertModuleRecordDeletion } from '@/Components/shared/forms-modal/RevertModuleRecordDeletion';
import { Paginator } from '@/Components/shared/table/Paginator';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';
import { SelectLimit } from '@/Components/shared/table/SelectLimit';
import { SelectOrderBy } from '@/Components/shared/table/SelectOrderBy';
import { DroneIcon } from '@/Components/shared/icons/DroneIcon';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { FieldOrder } from '@/Components/shared/table/FieldOrder';
import { SearchBar } from '@/Components/shared/input/SearchBar';
import { ExportTableData } from '@/Components/shared/table/ExportTableData';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';
import { InfoIcon } from '@/Components/shared/icons/InfoIcon';
// Types
import { DroneRecord, DroneSelected, PaginationOrderBy, PaginationFilter, PaginationLimit, GroupCounter } from './types';

const initialGroupCount = { active: 0, deleted: 0 };

export default function Drones() {

    const [drones, setDrones] = React.useState<DroneRecord[]>([]);
    const [selections, setSelections] = React.useState<DroneSelected[]>([]);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [totalRecords, setTotalRecords] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(1);
    const [limit, setLimit] = React.useState<PaginationLimit>("10");
    const [orderBy, setOrderBy] = React.useState<PaginationOrderBy>({ field: "id", order: "asc" });
    const [filter, setFilter] = React.useState<PaginationFilter>("active");
    const [groupCount, setGroupCount] = React.useState<GroupCounter>(initialGroupCount);
    const [search, setSearch] = React.useState<string>("");
    const [pending, setPending] = React.useState<boolean>(false);
    const [reload, setReload] = React.useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthentication();

    React.useEffect(() => {
        setDrones([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/drones?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setDrones(response.data.drones);
            setGroupCount(response.data.group_counter);
            setTotalRecords(response.data.paginator.total_records);
            setTotalPages(response.data.paginator.total_pages);
        } catch (e) {
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

    function onSelect(e: any) {
        const selected_record_id = e.target.value;

        // Remove selected record if already exists 
        const find_record_index = selections.findIndex((selection) => Number(selection.id) === Number(selected_record_id));
        if (Boolean(find_record_index + 1)) {
            const clone = JSON.parse(JSON.stringify(selections));
            clone.splice(find_record_index, 1);
            setSelections(clone);
            return;
        }

        // Push selected record if not exists
        const record = drones.filter((selection) => Number(selection.id) === Number(selected_record_id))[0];
        const record_data = {
            id: record.id,
            name: record.name,
            manufacturer: record.manufacturer,
            model: record.model,
            record_number: record.record_number,
            serial_number: record.serial_number,
            weight: record.weight,
            image_url: record.image_url,
            is_disabled: Boolean(record.deleted_at)
        }

        const clone = JSON.parse(JSON.stringify(selections));
        clone.push(record_data);
        setSelections(clone);
    }

    function isRowSelected(record_id: string): boolean {
        const find_record_index = selections.findIndex((selection) => Number(selection.id) === Number(record_id));
        return Boolean(find_record_index + 1); // Boolean(index + 1) or Boolean(-1 + 1)
    }

    function setCardStyle(actual_filter: string) {
        if (actual_filter === filter) {
            return "flex items-center max-w-xs text-sm px-5 py-4 text-white bg-green-600 rounded-md active dark:bg-green-600 shadow cursor-pointer";
        } else {
            return 'flex items-center max-w-xs text-sm px-5 py-4 text-gray-400 dark:text-gray-600 bg-white rounded-md active dark:bg-gray-800 shadow cursor-pointer';
        }
    }

    return (
        <HomeLayout>
            <div className='flex flex-col h-full'>

                <div className="py-5 flex justify-between items-end flex-wrap gap-y-5 lg:gap-0 mb-2">
                    <div className='flex items-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mr-2 text-green-700">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                        <span className='text-xl font-semibold text-gray-700 dark:text-white'>Drones</span>
                    </div>
                    <div className='flex justify-start flex-wrap gap-1'>
                        <div onClick={() => setFilter('active')} className={setCardStyle("active")}>
                            <DroneIcon />
                            <span className='ml-2'>Ativas: {groupCount.active}</span>
                        </div>
                        <div onClick={() => setFilter('disabled')} className={setCardStyle("disabled")}>
                            <DroneIcon />
                            <span className='ml-2'>Deletadas: {groupCount.deleted}</span>
                        </div>
                    </div>
                </div>

                <div className='grow py-5 rounded'>

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <div className="inline-flex rounded-md shadow-sm">
                                <CreateDrone can_open={selections.length === 0 && Boolean(user?.modules.ge.write)} setReload={setReload} />
                                <EditDrone can_open={selections.length === 1 && Boolean(user?.modules.ge.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.ge.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/drones/disable"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.ge.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/drones"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/equipamentos" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"drones"} data={drones} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar drone por id, nome, fabricante, etc" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            <input disabled onChange={onSelect} id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        </div>
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Nome' field='name' controllable={true} active={orderBy.field === "name"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Fabricante' field='manufacturer' controllable={true} active={orderBy.field === "manufacturer"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Modelo' field='model' controllable={true} active={orderBy.field === "model"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Registro' field='record_number' controllable={true} active={orderBy.field === "record_number"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Serial' field='serial_number' controllable={true} active={orderBy.field === "serial_number"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Peso (kg)' field='weight' controllable={true} active={orderBy.field === "weight"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Visualizar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && drones.length > 0 && drones.map((drone) =>
                                    <tr key={drone.id} className="bg-white text-gray-800 dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input checked={isRowSelected(drone.id)} onChange={onSelect} value={drone.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {drone.name}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {drone.manufacturer}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {drone.model}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {drone.record_number}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {drone.serial_number}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {drone.weight}
                                        </td>
                                        <th scope="row" className="flex justify-end px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <ShowImage can_open={drone.image_url != "none"} title={"Visualização do Drone"} image_url={drone.image_url} />
                                        </th>
                                    </tr>
                                )}

                                {!pending && drones.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={9} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                        <div className="flex items-center justify-center">
                                            Nenhum registro encontrado.
                                        </div>
                                    </td>
                                </tr>
                                }

                                {pending && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={9} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                        <div className="flex items-center justify-center">
                                            Carregando...
                                        </div>
                                    </td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                </div>

                <nav className="flex justify-between items-start md:items-center space-y-0 mt-2">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Registros encontrados:
                        <span className="mx-1 font-semibold text-gray-900 dark:text-white">{totalRecords}</span>
                        - Páginas:
                        <span className="mx-1 font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                    </span>
                    <Paginator current_page={page} pages={totalPages} setPage={setPage} />
                </nav>

            </div>
        </HomeLayout>
    )
}