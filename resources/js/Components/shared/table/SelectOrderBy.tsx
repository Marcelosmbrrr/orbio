import * as React from 'react';

interface IOption {
    id: string;
    name: string;
}

interface IProps {
    default: string;
    options: IOption[];
    setOrderBy: React.Dispatch<React.SetStateAction<any>>
}

export function SelectOrderBy(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<string>(props.default);
    const [selectedName, setSelectedName] = React.useState<string>("id");

    function handleSelection(e: any) {
        if (e.target.id != selected) {
            setSelected(e.target.id);
            props.setOrderBy({ field: e.target.id, order: "asc" });
        }
        setSelectedName(e.target.innerText.toLowerCase());
        setOpen(false);
    }

    function optionClassName(option_id: string) {
        return selected === option_id ? "bg-gray-100 dark:bg-gray-600" : "";
    }

    return (
        <div className='relative'>
            <button onClick={() => setOpen((prev) => !prev)} className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button">
                Ordenar por: {selectedName} <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {open &&
                <div className="absolute top-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {props.options.map((option: IOption) =>
                            <li className={optionClassName(option.id)} key={option.id}>
                                <button onClick={handleSelection} type="button" id={option.id} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{option.name}</button>
                            </li>
                        )}
                    </ul>
                </div>
            }
        </div>
    )

}