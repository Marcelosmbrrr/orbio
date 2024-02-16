import * as React from 'react';

interface IOption {
    id: string;
    name: string;
}

interface IProps {
    label: string;
    id: string;
    default: string;
    options: IOption[];
    onChange: Function;
}

export function Select(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);
    const [options, setOptions] = React.useState<IOption[]>(props.options);
    const [selected, setSelected] = React.useState<string>(props.default);

    function handleSelection(e: any) {
        setSelected(e.target.id);
    }

    function optionClassName(option_id: string) {
        return selected === option_id ? "bg-gray-100 dark:bg-gray-600" : "";
    }

    return (
        <>
            <button onClick={() => setOpen((prev) => !prev)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600" type="button">
                Por Página: {selected} <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {open &&
                <div className="absolute top-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                        {props.options.map((option: IOption) =>
                            <li className={optionClassName(option.id)} key={option.id}>
                                <button onClick={handleSelection} type="button" id={option.id} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{option.name}</button>
                            </li>
                        )}
                    </ul>
                </div>
            }
        </>

    )

}