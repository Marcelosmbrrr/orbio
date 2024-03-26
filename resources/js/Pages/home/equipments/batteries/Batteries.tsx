import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateBattery } from '@/Components/modules/equipments/batteries/CreateBattery';
import { EditBattery } from '@/Components/modules/equipments/batteries/EditBattery';
import { DeleteModuleRecord } from '@/Components/shared/forms-modal/DeleteModuleRecord';
import { RevertModuleRecordDeletion } from '@/Components/shared/forms-modal/RevertModuleRecordDeletion';
import { Paginator } from '@/Components/shared/table/Paginator';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';
import { SelectLimit } from '@/Components/shared/table/SelectLimit';
import { SelectOrderBy } from '@/Components/shared/table/SelectOrderBy';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { FieldOrder } from '@/Components/shared/table/FieldOrder';
import { SearchBar } from '@/Components/shared/input/SearchBar';
import { ExportTableData } from '@/Components/shared/table/ExportTableData';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';
import { InfoIcon } from '@/Components/shared/icons/InfoIcon';
// Types
import { BatteryRecord, BatterySelected, PaginationOrderBy, PaginationFilter, PaginationLimit, GroupCounter } from './types';

const initialGroupCount = { active: 0, deleted: 0 };

export default function Batteries() {

    const [batteries, setBatteries] = React.useState<BatteryRecord[]>([]);
    const [selections, setSelections] = React.useState<BatterySelected[]>([]);
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
        setBatteries([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/batteries?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setBatteries(response.data.batteries);
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
        const record = batteries.filter((selection) => Number(selection.id) === Number(selected_record_id))[0];
        const record_data = {
            id: record.id,
            name: record.name,
            manufacturer: record.manufacturer,
            model: record.model,
            serial_number: record.serial_number,
            image_url: record.image_url,
            last_charge: record.last_charge,
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

    return (
        <HomeLayout>
            <div className='flex flex-col h-full'>

                <div className='flex items-center mb-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fill-rule="evenodd" d="M3.75 6.75a3 3 0 00-3 3v6a3 3 0 003 3h15a3 3 0 003-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 00-3-3h-15zm15 1.5a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5h15zM4.5 9.75a.75.75 0 00-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75H4.5z" clipRule="evenodd" />
                    </svg>
                    <span className='ml-1 text-xl font-semibold text-gray-700 dark:text-white'>
                        Baterias
                    </span>
                </div>

                <div className='h-20 grid grid-cols-2 gap-x-3'>
                    <div onClick={() => setFilter('active')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Baterias Disponíveis</h4>
                            {filter === "active" && <div className="mt-1 w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Grupo Selecionado</div>}
                        </div>
                        <div>
                            <span className="text-xl text-black dark:text-white font-medium">{groupCount.active}</span>
                        </div>
                    </div>
                    <div onClick={() => setFilter('disabled')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Baterias Deletadas</h4>
                            {filter === "disabled" && <div className="mt-1 w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Grupo Selecionado</div>}
                        </div>
                        <div>
                            <span className="text-xl text-black dark:text-white font-medium">{groupCount.deleted}</span>
                        </div>
                    </div>
                </div>

                <div className='grow py-5 rounded'>

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <div className="inline-flex rounded-md shadow-sm">
                                <CreateBattery can_open={selections.length === 0 && Boolean(user?.modules.ge.write)} setReload={setReload} />
                                <EditBattery can_open={selections.length === 1 && Boolean(user?.modules.ge.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.ge.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/batteries/disable"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.ge.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/batteries"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/equipamentos" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"batteries"} data={batteries} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar bateria por id, nome, fabricante, etc" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            <input disabled id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
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
                                        <FieldOrder label='Serial' field='serial_number' controllable={true} active={orderBy.field === "serial_number"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Última carga' field='last_charge' controllable={true} active={orderBy.field === "last_charge"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Visualizar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && batteries.length > 0 && batteries.map((battery) =>
                                    <tr key={battery.id} className="bg-white dark:text-white text-gray-800 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input checked={isRowSelected(battery.id)} onChange={onSelect} value={battery.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {battery.name}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {battery.manufacturer}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {battery.model}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {battery.serial_number}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {battery.last_charge}
                                        </td>
                                        <th scope="row" className="flex justify-end px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <ShowImage can_open={battery.image_url != "none"} title={"Visualização da Bateria"} image_url={battery.image_url} />
                                        </th>
                                    </tr>
                                )}

                                {!pending && batteries.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                        <div className="flex items-center justify-center">
                                            Nenhum registro encontrado.
                                        </div>
                                    </td>
                                </tr>
                                }

                                {pending && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
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
        </HomeLayout >
    )
}