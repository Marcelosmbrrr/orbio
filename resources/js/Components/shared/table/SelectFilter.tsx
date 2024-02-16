import * as React from 'react';

interface IOption {
    id: string;
    name: string;
}

interface IProps {
    default: string;
    options: IOption[];
    setFilter: React.Dispatch<React.SetStateAction<string>>
}

export function SelectFilter(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<string>(props.default);
    const [selectedName, setSelectedName] = React.useState<string>("");

    React.useEffect(() => {
        const default_op = props.options.filter((op) => op.id === props.default)[0];
        setSelectedName(default_op.name.toLowerCase());
    }, []);

    function handleSelection(e: any) {
        if (e.target.id != selected) {
            setSelected(e.target.id);
            props.setFilter(e.target.id);
        }
        setSelectedName(e.target.innerText.toLowerCase());
        setOpen(false);
    }

    function optionClassName(option_id: string) {
        return selected === option_id ? "bg-gray-100 dark:bg-gray-600" : "";
    }

    return (
        <>
            <button onClick={() => setOpen((prev) => !prev)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-green-700 focus:ring-green-700 focus:text-green-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white" type="button">
                Filtrar por: {selectedName} <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {open &&
                <div className="absolute top-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
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