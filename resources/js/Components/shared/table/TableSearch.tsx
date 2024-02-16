import * as React from 'react';

interface IOption {
    id: string;
    text: string;
}

interface ISearch {
    field: string;
    value: string;
}

interface IProps {
    options: IOption[];
    default: ISearch;
    resource: string;
    onSearch: (param: ISearch) => void;
}

const initialPlaceholder = "Selecione o campo procurado";

export function TableSearch(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>(props.default.value);
    const [field, setField] = React.useState<string>(props.default.field);
    const [placeholder, setPlaceholder] = React.useState<string>(initialPlaceholder);

    function handleSelection(e: any) {
        setField(e.target.id);

        if (e.target.id === "none") {
            setPlaceholder(initialPlaceholder);
            setValue("");
        } else {
            let text = "Procurar " + props.resource + " por " + e.target.innerText.toLowerCase();
            setPlaceholder(text);
        }

        setOpen(false);
    }

    function onSubmit() {
        if (field != "none") {
            props.onSearch({ field, value });
            setValue("");
            setOpen(false);
        }
    }

    function optionClassName(option_id: string) {
        return field === option_id ? "bg-gray-100 dark:bg-gray-600" : "";
    }

    return (
        <>
            <button onClick={() => setOpen((prev) => !prev)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600" type="button">
                Procurar por <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {open &&
                <div className="absolute top-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                        <li>
                            <button onClick={handleSelection} type="button" id="none" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Nenhum</button>
                        </li>
                        {props.options.map((option: IOption) =>
                            <li className={optionClassName(option.id)} key={option.id}>
                                <button onClick={handleSelection} type="button" id={option.id} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{option.text}</button>
                            </li>
                        )}
                    </ul>
                </div>
            }
            <div className="relative w-full">
                <input disabled={field === "none"} value={value} onChange={(e) => setValue(e.target.value)} type="search" placeholder={placeholder} className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" />
                <button disabled={field === "none"} onClick={onSubmit} className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </button>
            </div>
        </>
    )

}