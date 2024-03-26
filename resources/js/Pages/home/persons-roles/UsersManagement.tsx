import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateUser } from '@/Components/modules/persons-roles/persons/CreateUser';
import { EditUser } from '@/Components/modules/persons-roles/persons/EditUser';
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
import { InfoIcon } from '@/Components/shared/icons/InfoIcon';
// Types
import { UserRecord, UserSelected, PaginationOrderBy, PaginationLimit, PaginationFilter, GroupCounter } from './types/users';

const initialGroupCount = { active: 0, inative: 0, deleted: 0 };

const statusClassName: { [key: string]: string } = {
    active: "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
    inative: "bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300",
    disabled: "bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
}

export default function UsersManagement() {

    const [users, setUsers] = React.useState<UserRecord[]>([]);
    const [selections, setSelections] = React.useState<UserSelected[]>([]);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [totalRecords, setTotalRecords] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(1);
    const [limit, setLimit] = React.useState<PaginationLimit>("10");
    const [orderBy, setOrderBy] = React.useState<PaginationOrderBy>({ field: "id", order: "asc" });
    const [groupCount, setGroupCount] = React.useState<GroupCounter>(initialGroupCount);
    const [filter, setFilter] = React.useState<PaginationFilter>("active");
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
            const response = await api.get(`api/v1/modules/persons-roles/users?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
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

    function isRowDisabled(user_id: string) {
        if (user) {
            return String(user_id) === String(user.id);
        }
    }

    return (
        <HomeLayout>
            <div className='flex flex-col h-full'>

                <div className='flex items-center mb-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" />
                        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                    </svg>
                    <span className='ml-1 text-xl font-semibold text-gray-700 dark:text-white'>
                        Usuários
                    </span>
                </div>

                <div className='h-20 grid grid-cols-3 gap-x-3'>
                    <div onClick={() => setFilter('active')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Usuários Ativos</h4>
                            {filter === "active" && <div className="mt-1 w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Grupo Selecionado</div>}
                        </div>
                        <div>
                            <span className="text-xl text-black dark:text-white font-medium">{groupCount.active}</span>
                        </div>
                    </div>
                    <div onClick={() => setFilter('inative')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Usuários Inativos</h4>
                            {filter === "inative" && <div className="mt-1 w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Grupo Selecionado</div>}
                        </div>
                        <div>
                            <span className="text-xl text-black dark:text-white font-medium">{groupCount.inative}</span>
                        </div>
                    </div>
                    <div onClick={() => setFilter('disabled')} className="flex items-center px-3 justify-between rounded-xl bg-white dark:bg-gray-800 shadow cursor-pointer">
                        <div>
                            <h4 className="text-title-md text-lg font-bold text-black dark:text-white">Usuários Deletados</h4>
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
                                <CreateUser can_open={selections.length === 0 && Boolean(user?.modules.gpc.write)} setReload={setReload} />
                                <EditUser can_open={selections.length === 1 && Boolean(user?.modules.gpc.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.gpc.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/persons-roles/users/delete"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.gpc.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/users"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/usuarios" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"users"} data={users} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }, { id: "email", name: "email" }, { id: "role.name", name: "cargo" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar usuário por id, nome, email ou cargo" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            <input disabled onChange={onSelect} value="all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        </div>
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Nome' field='name' controllable={true} active={orderBy.field === "name"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='E-mail' field='email' controllable={true} active={orderBy.field === "email"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Cargo
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && users.length > 0 && users.map((user: UserRecord) =>
                                    <tr key={user.id} className="bg-white text-gray-800 dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="flex items-center">
                                                <input disabled={isRowDisabled(user.id)} checked={isRowSelected(user.id)} onChange={onSelect} value={user.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <span className={statusClassName[user.status.style_key]}>{user.status.name}</span>
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {user.name}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {user.role.name}
                                        </td>
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