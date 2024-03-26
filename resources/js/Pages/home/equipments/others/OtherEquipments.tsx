import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateEquipment } from '@/Components/modules/equipments/equipments/CreateEquipment';
import { EditEquipment } from '@/Components/modules/equipments/equipments/EditEquipment';
import { DeleteModuleRecord } from '@/Components/shared/forms-modal/DeleteModuleRecord';
import { RevertModuleRecordDeletion } from '@/Components/shared/forms-modal/RevertModuleRecordDeletion';
import { api } from '@/Services/api';
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
import { EquipmentRecord, EquipmentSelected, PaginationOrderBy, PaginationFilter, PaginationLimit, GroupCounter } from './types';

const initialGroupCount = { active: 0, deleted: 0 };

export default function OtherEquipments() {

    const [equipments, setEquipments] = React.useState<EquipmentRecord[]>([]);
    const [selections, setSelections] = React.useState<EquipmentSelected[]>([]);
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
        setEquipments([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/equipments?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setEquipments(response.data.equipments);
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
        const record = equipments.filter((selection) => Number(selection.id) === Number(selected_record_id))[0];
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

    return (
        <HomeLayout>
            <div className='flex flex-col h-full'>

                <div className='flex items-center mb-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                        <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
                        <path fillRule="evenodd" d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                    <span className='ml-1 text-xl font-semibold text-gray-700 dark:text-white'>
                        Equipamentos
                    </span>
                </div>

                <div className='h-20 grid grid-cols-2 gap-x-3'>
                    <div onClick={() => setFilter('active')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Equipamentos Disponíveis</h4>
                            {filter === "active" && <div className="mt-1 w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Grupo Selecionado</div>}
                        </div>
                        <div>
                            <span className="text-xl text-black dark:text-white font-medium">{groupCount.active}</span>
                        </div>
                    </div>
                    <div onClick={() => setFilter('disabled')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Equipamentos Deletados</h4>
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
                                <CreateEquipment can_open={selections.length === 0 && Boolean(user?.modules.ge.write)} setReload={setReload} />
                                <EditEquipment can_open={selections.length === 1 && Boolean(user?.modules.ge.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.ge.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/equipments/disable"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.ge.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/equipments"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/equipamentos" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"equipments"} data={equipments} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar equipamento por id, nome, fabricante, etc" />
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
                                {!pending && equipments.length > 0 && equipments.map((equipment) =>
                                    <tr key={equipment.id} className="bg-white text-gray-800 dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input checked={isRowSelected(equipment.id)} onChange={onSelect} value={equipment.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {equipment.name}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {equipment.manufacturer}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {equipment.model}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {equipment.record_number}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {equipment.serial_number}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {equipment.weight}
                                        </td>
                                        <th scope="row" className="flex justify-end px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <ShowImage can_open={equipment.image_url != "none"} title={"Visualização do Equipmento"} image_url={equipment.image_url} />
                                        </th>
                                    </tr>
                                )}

                                {!pending && equipments.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
            </div>
        </HomeLayout>
    )
}