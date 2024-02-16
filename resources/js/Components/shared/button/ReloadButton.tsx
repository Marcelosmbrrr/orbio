import { ReloadIcon } from "../icons/ReloadIcon";

interface IProps {
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ReloadButton({ setReload }: IProps) {

    function onReload() {
        setReload((prev) => !prev);
    }

    return (
        <button onClick={onReload} type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-white bg-white border-y border-l border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-green-700 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-green-500">
            <ReloadIcon />
        </button>
    )
}