import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { HomeLayout } from '@/Layouts/HomeLayout';
import { CreateServiceOrder } from '@/Components/modules/service-orders/services/creation-management/CreateServiceOrder';
import { ServiceOrderStatusControl } from '@/Components/modules/service-orders/services/record-dropdown/forms/ServiceOrderStatusControl';
import { ExportTableData } from '@/Components/shared/table/ExportTableData';
import { SelectLimit } from '@/Components/shared/table/SelectLimit';
import { SelectOrderBy } from '@/Components/shared/table/SelectOrderBy';
import { Paginator } from '@/Components/shared/table/Paginator';
import { ServiceOrderIcon } from '@/Components/shared/icons/ServiceOrderIcon';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { FieldOrder } from '@/Components/shared/table/FieldOrder';
import { SearchBar } from '@/Components/shared/input/SearchBar';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';
import { ServiceOrderRecordDropdown } from '@/Components/modules/service-orders/services/record-dropdown/ServiceOrderRecordDropdown';
import { ArrowDownIcon } from '@/Components/shared/icons/ArrowDownIcon';
import { InfoIcon } from '@/Components/shared/icons/InfoIcon';
// Types
import { ServiceOrderRecord, ServiceOrderSelected, PaginationOrderBy, PaginationLimit, PaginationFilter, GroupCounter } from './types';

const initialGroupCount = { created: 0, approved: 0, canceled: 0, finished: 0 };

const situationClassName: { [key: string]: string } = {
    created: "bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
    canceled: "bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300",
    finished: "bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
}

export default function ServiceOrders() {

    const [orders, setOrders] = React.useState<ServiceOrderRecord[]>([]);
    const [selections, setSelections] = React.useState<ServiceOrderSelected[]>([]);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [totalRecords, setTotalRecords] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(1);
    const [limit, setLimit] = React.useState<PaginationLimit>("10");
    const [orderBy, setOrderBy] = React.useState<PaginationOrderBy>({ field: "id", order: "asc" });
    const [filter, setFilter] = React.useState<PaginationFilter>("created");
    const [groupCount, setGroupCount] = React.useState<GroupCounter>(initialGroupCount);
    const [search, setSearch] = React.useState<string>("");
    const [pending, setPending] = React.useState<boolean>(false);
    const [reload, setReload] = React.useState<boolean>(false);
    const [openRecord, setOpenRecord] = React.useState<string>("0");
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthentication();

    React.useEffect(() => {
        setOrders([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/service-orders?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setOrders(response.data.services);
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

    function setCardStyle(actual_filter: string) {
        if (actual_filter === filter) {
            return "flex items-center max-w-xs text-sm px-5 py-4 text-white bg-green-600 rounded-md active dark:bg-green-600 shadow cursor-pointer";
        } else {
            return 'flex items-center max-w-xs text-sm px-5 py-4 text-gray-400 dark:text-gray-600 bg-white rounded-md active dark:bg-gray-800 shadow cursor-pointer';
        }
    }

    function onOpenRecord(record_id: string) {
        if (record_id === openRecord) {
            setOpenRecord("0");
            return;
        }
        setOpenRecord(record_id);
    }

    function renderSOSituation(order: ServiceOrderRecord) {
        if (filter === "created") {
            return (
                <td className="text-left px-6 py-4">
                    <span className={situationClassName[order.situation.key]}>
                        {order.situation.name}
                    </span>
                </td>
            )
        } else {
            return (
                <td className="flex flex-col space-y-2 px-6 py-4">
                    <div className='flex items-center'>
                        <span className={situationClassName[order.situation.key]}>
                            {order.situation.name}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <svg className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
                            <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                        </svg>
                        {order.users.attendant && <span>{order.users.attendant.name}</span>}
                    </div>
                </td>
            )
        }
    }

    return (
        <HomeLayout>
            <div className='flex flex-col h-full'>

                <div className="py-5 flex justify-between items-end flex-wrap gap-y-5 lg:gap-0 mb-2">
                    <div className='flex items-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mr-2 text-green-700">
                            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                        <span className='text-xl font-semibold text-gray-700 dark:text-white'>Gerenciamento de Ordens de Serviço</span>
                    </div>
                    <div className='flex justify-start flex-wrap gap-1'>
                        <div onClick={() => setFilter('created')} className={setCardStyle("created")}>
                            <ServiceOrderIcon />
                            <span className='ml-2'>Abertas: {groupCount.created}</span>
                        </div>
                        <div onClick={() => setFilter('approved')} className={setCardStyle("approved")}>
                            <ServiceOrderIcon />
                            <span className='ml-2'>Em atendimento: {groupCount.approved}</span>
                        </div>
                        <div onClick={() => setFilter('canceled')} className={setCardStyle("canceled")}>
                            <ServiceOrderIcon />
                            <span className='ml-2'>Canceladas: {groupCount.canceled}</span>
                        </div>
                        <div onClick={() => setFilter('finished')} className={setCardStyle("finished")}>
                            <ServiceOrderIcon />
                            <span className='ml-2'>Finalizadas: {groupCount.finished}</span>
                        </div>
                    </div>
                </div>

                <div className='grow p-5 rounded bg-white dark:bg-gray-800 shadow'>

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <div className="flex rounded-md shadow-sm">
                                <CreateServiceOrder can_open={filter === "created" && selections.length === 0 && Boolean(Number(user?.role.id) === 2)} />
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/ordens-de-servico" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="flex rounded-md shadow-sm">
                                <ExportTableData name={"service_orders"} data={orders} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "number", name: "nome" }, { id: "created_at", name: "abertura" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar ordem de serviço por id ou nome" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    {user?.role.id == "3" && ["created", "approved"].includes(filter) &&
                                        <th scope="col" className="text-left px-6 py-3">
                                            Controle
                                        </th>
                                    }
                                    <th scope="col" className="text-left px-6 py-3">
                                        Status {filter != "created" && "/ Atendente"}
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Nome' field='name' controllable={true} active={orderBy.field === "name"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Piloto / Cliente
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        Abertura
                                    </th>
                                    <th scope="col" className="text-right px-6 py-3">
                                        Informações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && orders.length > 0 && orders.map((order) =>
                                    <>
                                        <tr className="bg-white text-gray-800 dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={order.id}>
                                            {order.allowed_actions.manage_status &&
                                                <td className="text-left px-6 py-4">
                                                    <ServiceOrderStatusControl service_order_id={order.id} service_order_status={order.situation.key} setReload={setReload} />
                                                </td>
                                            }
                                            {renderSOSituation(order)}
                                            <td className="text-left px-6 py-4">
                                                {order.number.toUpperCase()}
                                            </td>
                                            <td className="flex flex-col space-y-2 px-6 py-4">
                                                <div className='flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
                                                        <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                                    </svg>
                                                    <span>{order.users.pilot ? order.users.pilot.name : "Sem Piloto"}</span>
                                                </div>
                                                <div className='flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
                                                        <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                                    </svg>
                                                    <span>{order.users.client ? order.users.client.name : "Sem Cliente"}</span>
                                                </div>
                                            </td>
                                            <td className="text-left px-6 py-4">
                                                {order.created_at}
                                            </td>
                                            <td className="text-right px-6 py-4">
                                                <button onClick={() => onOpenRecord(order.id)} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-full text-sm p-2 text-center inline-flex items-center mr-2">
                                                    <ArrowDownIcon />
                                                </button>
                                            </td>
                                        </tr>

                                        {openRecord === order.id &&
                                            <tr className="border-0" key={order.id}>
                                                <td colSpan={8} className="whitespace-nowrap dark:text-white">
                                                    <ServiceOrderRecordDropdown order={order} setReload={setReload} />
                                                </td>
                                            </tr>
                                        }
                                    </>
                                )}

                                {!pending && orders.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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

        </HomeLayout>
    )
}