import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateTenant } from '@/Components/modules/administration/CreateTenant';
import { EditTenant } from '@/Components/modules/administration/EditTenant';
import { DeleteModuleRecord } from '@/Components/shared/forms-modal/DeleteModuleRecord';
import { RevertModuleRecordDeletion } from '@/Components/shared/forms-modal/RevertModuleRecordDeletion';
import { Paginator } from '@/Components/shared/table/Paginator';
import { SelectLimit } from '@/Components/shared/table/SelectLimit';
import { SelectOrderBy } from '@/Components/shared/table/SelectOrderBy';
import { UsersIcon } from '@/Components/shared/icons/UsersIcon';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { SearchBar } from '@/Components/shared/input/SearchBar';
import { ExportTableData } from '@/Components/shared/table/ExportTableData';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';
// Types
import { UserRecord, UserSelected, PaginationOrderBy, PaginationLimit, PaginationFilter, GroupCounter } from './types';

const statusClassname: { [key: string]: string } = {
    active: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    inative: "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2",
    disabled: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
}

const initialGroupCount = { active: 0, inative: 0, deleted: 0 };

export default function AdminManagement() {

    const [users, setUsers] = React.useState<UserRecord[]>([]);
    const [selections, setSelections] = React.useState<UserSelected[]>([]);
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
        setUsers([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/administration/tenants?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setUsers(response.data.users);
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
        const record = users.filter((selection) => Number(selection.id) === Number(selected_record_id))[0];
        const record_data = {
            id: record.id,
            name: record.name,
            email: record.email,
            role: record.role.id,
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2 text-green-700">
                            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                            <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                        </svg>
                        <span className='text-2xl font-semibold text-gray-700 dark:text-white'>Gerentes</span>
                    </div>
                    <div className='flex justify-start flex-wrap gap-1'>
                        <div onClick={() => setFilter('active')} className={setCardStyle("active")}>
                            <UsersIcon />
                            <span className='ml-2'>Ativos: {groupCount.active}</span>
                        </div>
                        <div onClick={() => setFilter('inative')} className={setCardStyle("inative")}>
                            <UsersIcon />
                            <span className='ml-2'>Inativos: {groupCount.inative}</span>
                        </div>
                        <div onClick={() => setFilter('disabled')} className={setCardStyle("disabled")}>
                            <UsersIcon />
                            <span className='ml-2'>Deletados: {groupCount.deleted}</span>
                        </div>
                    </div>
                </div>

                <div className='grow py-5 rounded'>

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <div className="inline-flex rounded-md shadow-sm">
                                <CreateTenant can_open={selections.length === 0 && Boolean(user?.modules.gadmin.write)} setReload={setReload} />
                                <EditTenant can_open={selections.length === 1 && Boolean(user?.modules.gadmin.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.gadmin.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/administration/users/delete"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.gadmin.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/tenants"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"users"} data={users} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }, { id: "email", name: "email" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar gerente por id, nome, email ou cargo" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            <input disabled onChange={onSelect} value="all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        </div>
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Nome
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && users.length > 0 && users.map((user: UserRecord) =>
                                    <tr key={user.id} className="bg-white dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input checked={isRowSelected(user.id)} onChange={onSelect} value={user.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {user.name}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {user.email}
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center text-gray-900 dark:text-white">
                                                <div className={statusClassname[user.status.style_key]}></div> {user.status.title}
                                            </div>
                                        </th>
                                    </tr>
                                )}

                                {!pending && users.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                        <div className="flex items-center justify-center">
                                            Nenhum registro encontrado.
                                        </div>
                                    </td>
                                </tr>
                                }

                                {pending && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap dark:text-white">
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

                <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2">
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