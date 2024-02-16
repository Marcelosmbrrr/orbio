import * as React from 'react';
// Custom
import { useAuthentication } from '@/Context/AuthenticationContext';
import { api } from '@/Services/api';
import { Paginator } from '@/Components/shared/table/Paginator';
import { CreateIncident } from '../../../incidents/creation-edition/CreateIncident';
import { EditIncident } from '../../../incidents/creation-edition/EditIncident';
import { ReloadIcon } from '@/Components/shared/icons/ReloadIcon';

interface IItem {
    id: string;
    date: string;
    type: string;
    description: string;
}

interface IProps {
    getValues: Function;
    setValue: Function;
    edit: boolean;
    serviceOrderId: string;
}

type Limit = "10" | "25" | "50";

export const IncidentManagement = React.memo((props: IProps) => {

    const [selections, setSelections] = React.useState<IItem[]>([]);
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState<boolean>(false);
    const [list, setList] = React.useState<IItem[]>([]);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [totalRecords, setTotalRecords] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(1);
    const [search, setSearch] = React.useState<string>("");
    const [limit, setLimit] = React.useState<Limit>("10");
    const [reload, setReload] = React.useState<boolean>(false);
    const { user } = useAuthentication();

    React.useEffect(() => {
        setList([]);
        setPending(true);
        fetchData();
    }, [limit, page, reload]);

    async function fetchData() {
        try {
            const args = "page=" + page + "&limit=" + limit;
            const response = await api.get(`api/v1/actions/service-orders/${props.serviceOrderId}/incidents?${args}`);
            setError(false);
            setList(response.data.incidents);
            setTotalRecords(response.data.paginator.total_records);
            setTotalPages(response.data.paginator.total_pages);
        } catch (e: any) {
            console.error(e, e.stack);
            setError(true);
        } finally {
            setPending(false);
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
        const record = list.filter((item) => Number(item.id) === Number(selected_record_id))[0];
        const record_data = {
            id: record.id,
            date: record.date,
            type: record.type,
            description: record.description
        }

        const clone = JSON.parse(JSON.stringify(selections));
        clone.push(record_data);
        setSelections(clone);
    }

    function isRowSelected(record_id: string): boolean {
        const find_record_index = selections.findIndex((selection) => Number(selection.id) === Number(record_id));
        return Boolean(find_record_index + 1); // Boolean(index + 1) or Boolean(-1 + 1)
    }

    function renderList() {
        return list.map((item: IItem) =>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex items-center">
                        <input checked={isRowSelected(item.id)} onChange={onSelect} value={item.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </th>
                <td className="px-6 py-4">
                    {item.type}
                </td>
                <td className="px-6 py-4">
                    {item.date}
                </td>
                <td className="px-6 py-4">
                    {item.description}
                </td>
            </tr>
        );
    }

    function onSearch(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            setReload(!reload);
        }
    }

    return (
        <div className="h-full relative pt-5">
            <div className="flex flex-col gap-2">

                <div className="w-full">
                    <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Incidentes</h3>
                    <span>Lista de incidentes registrados na ordem de serviço.</span>
                </div>

                <div className='flex'>
                    <CreateIncident can_open={selections.length === 0 && Boolean(user?.modules.gos.write)} setReload={setReload} />
                    <EditIncident can_open={selections.length === 1 && Boolean(user?.modules.gos.write)} selection={selections[0]} setReload={setReload} />
                    <button onClick={() => setReload(!reload)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <ReloadIcon />
                    </button>
                </div>

                <div className="w-full flex">
                    <input value={search} onKeyDown={onSearch} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Procurar cliente" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tipo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Data
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Descrição
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!pending && !error && renderList()}

                        {!pending && list.length === 0 && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
        </div>
    )
});