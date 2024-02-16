import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateRole } from '@/Components/modules/persons-roles/roles/CreateRole';
import { EditRole } from '@/Components/modules/persons-roles/roles/EditRole';
import { DeleteModuleRecord } from '@/Components/shared/forms-modal/DeleteModuleRecord';
import { RevertModuleRecordDeletion } from '@/Components/shared/forms-modal/RevertModuleRecordDeletion';
import { Paginator } from '@/Components/shared/table/Paginator';
import { SelectLimit } from '@/Components/shared/table/SelectLimit';
import { SelectOrderBy } from '@/Components/shared/table/SelectOrderBy';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { FieldOrder } from '@/Components/shared/table/FieldOrder';
import { SearchBar } from '@/Components/shared/input/SearchBar';
import { ExportTableData } from '@/Components/shared/table/ExportTableData';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';
import { TagIcon } from '@/Components/shared/icons/TagIcon';
import { InfoIcon } from '@/Components/shared/icons/InfoIcon';
// Types
import { RoleSelected, RoleRecord, PaginationOrderBy, PaginationLimit, PaginationFilter, GroupCounter } from './types/roles';

const initialGroupCount = { active: 0, inative: 0, deleted: 0 };

export default function RolesManagement() {

    const [roles, setRoles] = React.useState<RoleRecord[]>([]);
    const [selections, setSelections] = React.useState<RoleSelected[]>([]);
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
        setRoles([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/persons-roles/roles?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setRoles(response.data.roles);
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
        const record = roles.filter((selection) => Number(selection.id) === Number(selected_record_id))[0];
        const record_data = {
            id: record.id,
            name: record.name,
            modules: record.modules,
            profile_data: record.profile_data,
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

    function onFilterChange(filter: PaginationFilter) {
        setFilter(filter);
        setReload(!reload);
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
                        <svg className="w-7 h-7 mr-2 text-green-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                            <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                        </svg>
                        <span className='text-xl font-semibold text-gray-700 dark:text-white'>Gerenciamento de Cargos</span>
                    </div>
                    <div className='flex justify-start flex-wrap gap-1'>
                        <div onClick={() => setFilter('active')} className={setCardStyle("active")}>
                            <TagIcon />
                            <span className='ml-2'>Ativos: {groupCount.active}</span>
                        </div>
                        <div onClick={() => setFilter('disabled')} className={setCardStyle("disabled")}>
                            <TagIcon />
                            <span className='ml-2'>Deletados: {groupCount.deleted}</span>
                        </div>
                    </div>
                </div>

                <div className='grow p-5 rounded bg-white dark:bg-gray-800 shadow'>

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <div className="inline-flex rounded-md shadow-sm">
                                <CreateRole can_open={selections.length === 0 && Boolean(user?.modules.gpc.write)} setReload={setReload} />
                                <EditRole can_open={selections.length === 1 && Boolean(user?.modules.gpc.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.gpc.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/roles/disable"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.gpc.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/roles"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/cargos" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"roles"} data={roles} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar cargo por id ou nome" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Nome' field='name' controllable={true} active={orderBy.field === "name"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Administração
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Planos de Voo
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Ordens de Serviço
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Equipamentos
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && roles.length > 0 && roles.map((role) =>
                                    <tr key={role.id} className="bg-white text-gray-800 dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {["1", "2", "3", "4"].includes(role.id) &&
                                                <div className="flex items-center">
                                                    <input checked={isRowSelected(role.id)} onChange={onSelect} value={role.id} id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                </div>
                                            }
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {role.name}
                                        </td>
                                        {/* Admin */}
                                        <td className="px-6 py-4 dark:text-white">
                                            <div className="flex justify-start">
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[0].read} disabled id="administration-read" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="administration-read" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Ler</label>
                                                </div>
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[0].write} disabled id="administration-write" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="administration-write" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Escrever</label>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Flight Plans */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-start">
                                                <div className="flex items-center mr-4 ">
                                                    <input checked={role.modules[1].read} disabled id="flight_plans-read" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="flight_plans-read" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Ler</label>
                                                </div>
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[1].write} disabled id="flight_plans-write" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="flight_plans-write" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Escrever</label>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Service Orders */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-start">
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[2].read} disabled id="service_orders-read" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="service_orders-read" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Ler</label>
                                                </div>
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[2].write} disabled id="service_orders-wirte" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="service_orders-wirte" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Escrever</label>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Equipments */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-start">
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[3].read} disabled id="equipments-read" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="equipments-read" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Ler</label>
                                                </div>
                                                <div className="flex items-center mr-4">
                                                    <input checked={role.modules[3].write} disabled id="equipments-write" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="equipments-write" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Escrever</label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {!pending && roles.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                        <div className="flex items-center justify-center">
                                            Nenhum registro encontrado.
                                        </div>
                                    </td>
                                </tr>
                                }

                                {pending && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap dark:text-white">
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