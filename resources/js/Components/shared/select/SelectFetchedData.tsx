import * as React from 'react';
import { api } from '@/Services/api';

interface IOption {
    id: string;
    name: string;
}

interface IProps {
    label: string;
    id: string;
    default: string;
    fetchFrom: string;
    setValue: Function;
}

export function SelectFetchedData(props: IProps) {

    const [options, setOptions] = React.useState<IOption[]>([]);
    const [selected, setSelected] = React.useState<string>(props.default);
    const [pending, setPending] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await api.get(props.fetchFrom);
            setOptions(response.data);
        } catch (e) {
            requestError(e);
        } finally {
            setPending(false);
        }
    }

    function requestError(e: any) {
        console.error(e, e.stack);
    }

    function onChange(e: any) {
        setSelected(e.target.value);
        props.setValue(props.id, String(e.target.value));
    }

    return (
        <div>
            <label htmlFor={props.id} className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">{props.label}</label>
            <select onChange={onChange} value={selected} id={props.id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                <option value="none" disabled>Selecionar</option>
                {!pending && options.length > 0 && options.map((option: IOption) =>
                    <option key={option.id} value={option.id}>{option.name}</option>
                )}
            </select>
        </div>
    )
}