import * as React from 'react';
import { useSnackbar } from 'notistack';
import JSZip from 'jszip';
// Custom
import { HomeLayout } from '@/Layouts/HomeLayout';
import { DeleteModuleRecord } from '@/Components/shared/forms-modal/DeleteModuleRecord';
import { RevertModuleRecordDeletion } from '@/Components/shared/forms-modal/RevertModuleRecordDeletion';
import { api } from '@/Services/api';
import { Paginator } from '@/Components/shared/table/Paginator';
import { CreateFlightPlan } from '@/Components/modules/flight-plans/CreateFlightPlan';
import { EditFlightPlan } from '@/Components/modules/flight-plans/EditFlightPlan';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';
import { SelectLimit } from '@/Components/shared/table/SelectLimit';
import { SelectOrderBy } from '@/Components/shared/table/SelectOrderBy';
import { MapIcon } from '@/Components/shared/icons/MapIcon';
import { DownloadIcon } from '@/Components/shared/icons/DownloadIcon';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { FieldOrder } from '@/Components/shared/table/FieldOrder';
import { SearchBar } from '@/Components/shared/input/SearchBar';
import { ExportTableData } from '@/Components/shared/table/ExportTableData';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';
import { InfoIcon } from '@/Components/shared/icons/InfoIcon';
// Types
import { FlightPlanRecord, FlightPlanSelected, PaginationOrderBy, PaginationFilter, PaginationLimit, GroupCounter } from './types';

const initialGroupCount = { active: 0, deleted: 0 };

export default function FlightPlans() {

    const [plans, setPlans] = React.useState<FlightPlanRecord[]>([]);
    const [selections, setSelections] = React.useState<FlightPlanSelected[]>([]);
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
        setPlans([]);
        setSelections([]);
        fetchData();
    }, [orderBy, filter, limit, search, page, reload]);

    async function fetchData() {
        try {
            setPending(true);
            const response = await api.get(`api/v1/modules/flight-plans?limit=${limit}&order=${orderBy.field + ',' + orderBy.order}&filter=${filter}&page=${page}&search=${search}`);
            setPlans(response.data.plans);
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
        const record = plans.filter((selection) => Number(selection.id) === Number(selected_record_id))[0];
        const record_data = {
            id: record.id,
            name: record.name,
            coordinates: record.coordinates,
            configuration: record.configuration,
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

    async function exportFile(flight_plan_id: string) {
        try {
            const response = await api.get(`api/v1/actions/flight-plans/${flight_plan_id}/export`);

            const single_file: string[] = response.data.single;
            const multi_files: string[] = response.data.multi;
            const filename = Object.keys(single_file)[0];

            const zip = new JSZip();

            const sfolder = zip.folder('single');
            for (let filename in single_file) {
                sfolder?.file(`${filename}.txt`, single_file[filename]);
            }

            const mfolder = zip.folder('multi');
            for (let filename in multi_files) {
                mfolder?.file(`${filename}.txt`, multi_files[filename]);
            }

            // create zip and export it
            zip.generateAsync({ type: "blob" }).then(function (content) {
                const url = window.URL.createObjectURL(content);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `plano_${filename}.zip`);
                document.body.appendChild(link);
                link.click();
            });

        } catch (e) {
            requestError(e);
        }
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
                            <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                        </svg>
                        <span className='text-xl font-semibold text-gray-700 dark:text-white'>Gerenciamento de Planos de Voo</span>
                    </div>
                    <div className='flex justify-start flex-wrap gap-1'>
                        <div onClick={() => setFilter('active')} className={setCardStyle("active")}>
                            <MapIcon />
                            <span className='ml-2'>Ativos: {groupCount.active}</span>
                        </div>
                        <div onClick={() => setFilter('disabled')} className={setCardStyle("disabled")}>
                            <MapIcon />
                            <span className='ml-2'>Deletados: {groupCount.deleted}</span>
                        </div>
                    </div>
                </div>

                <div className='grow p-5 rounded bg-white dark:bg-gray-800 shadow'>

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <div className="inline-flex rounded-md shadow-sm">
                                <CreateFlightPlan can_open={Boolean(user?.modules.gpv.write)} />
                                <EditFlightPlan can_open={selections.length === 1 && Boolean(user?.modules.gpv.write)} selection={selections[0]} setReload={setReload} />
                                {filter != "disabled" && <DeleteModuleRecord can_open={selections.length > 0 && Boolean(user?.modules.gpv.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/modules/flight-plans"} type={"soft"} setReload={setReload} />}
                                {filter === "disabled" && <RevertModuleRecordDeletion can_open={selections.length > 0 && Boolean(user?.modules.gpv.write)} selections={selections.map((selection) => selection.id)} route={"api/v1/actions/revert-deletion/flight_plans"} setReload={setReload} />}
                                <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <ReloadIcon />
                                </button>
                                <a href="https://orbio.gitbook.io/orbio-docs/guia-de-usuario/gerenciamento-de-recursos/planos-de-voo" target='_blank' className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <InfoIcon />
                                </a>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <ExportTableData name={"flight_plans"} data={plans} />
                                <SelectLimit default={limit.toString()} options={[{ id: "10", name: "10" }, { id: "25", name: "25" }, { id: "50", name: "50" }]} setLimit={setLimit} />
                                <SelectOrderBy default='id' options={[{ id: "id", name: "id" }, { id: "name", name: "name" }]} setOrderBy={setOrderBy} />
                            </div>
                        </div>
                        <div className="w-full">
                            <SearchBar setSearch={setSearch} placeholder="Procurar plano de voo por id, nome, cidade ou estado" />
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto shadow-md sm:rounded-lg">
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
                                        <FieldOrder label='Estado' field='state' controllable={true} active={orderBy.field === "state"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-left px-6 py-3">
                                        <FieldOrder label='Cidade' field='city' controllable={true} active={orderBy.field === "city"} setOrderBy={setOrderBy} />
                                    </th>
                                    <th scope="col" className="text-right px-6 py-3">
                                        Visualizar | Abrir | Exportar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pending && plans.length > 0 && plans.map((plan) =>
                                    <tr className="bg-white text-gray-800 dark:text-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={plan.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input checked={isRowSelected(plan.id)} onChange={onSelect} value={plan.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </th>
                                        <td className="text-left px-6 py-4">
                                            {plan.name}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {plan.state}
                                        </td>
                                        <td className="text-left px-6 py-4">
                                            {plan.city}
                                        </td>
                                        <td className="flex justify-end p-1">
                                            <button>
                                                <ShowImage can_open={plan.image_url != "none"} title={"Visualização do Plano"} image_url={plan.image_url} />
                                            </button>
                                            <button onClick={() => window.open(`${window.location.origin}/home/map/${plan.id}`, '_blank')} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-full text-sm p-2 text-center inline-flex items-center">
                                                <MapIcon />
                                            </button>
                                            <button onClick={() => exportFile(plan.id)} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-full text-sm p-2 text-center inline-flex items-center">
                                                <DownloadIcon />
                                            </button>
                                        </td>
                                    </tr>
                                )}

                                {!pending && plans.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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