import * as React from 'react';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { convertTableDataToCSV } from '@/Utils/ConvertTableGataToCSV';
import { useSnackbar } from 'notistack';

interface IProps {
    name: string;
    data: any[];
}

export function ExportTableData({ name, data }: IProps) {

    const { enqueueSnackbar } = useSnackbar();

    function exportCSV() {

        if (data.length === 0) {
            enqueueSnackbar("Nenhum registro para exportar.", { variant: "error" });
            return;
        }

        convertTableDataToCSV(name, data);
    }

    return (
        <div className='relative'>
            <button onClick={exportCSV} className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button">
                <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 5V.13a2.96 2.96 0 0 0-1.293.749L2.879 3.707A2.96 2.96 0 0 0 2.13 5H7Z" />
                    <path d="M19 7h-1.072A.989.989 0 0 0 18 6.639V2a1.97 1.97 0 0 0-1.933-2H9v5a2 2 0 0 1-2 2H1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 18 18h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Zm-9 1.828.961.02a1 1 0 0 1-.042 2l-.946-.02a.337.337 0 0 0-.339.3.317.317 0 0 0 .283.344l.537.059a2.543 2.543 0 0 1 1.887 1.1 2.207 2.207 0 0 1 .174 1.941A2.151 2.151 0 0 1 10.235 16H9.108a1 1 0 0 1 0-2h1.127a.936.936 0 0 0 .389-.047.439.439 0 0 0 .027-.251.62.62 0 0 0-.413-.18l-.537-.059a2.306 2.306 0 0 1-2.059-2.5A2.374 2.374 0 0 1 10 8.828Zm-8 4.525v-1.706A2.65 2.65 0 0 1 4.647 9h1.018a1 1 0 0 1 0 2H4.647a.647.647 0 0 0-.647.647v1.706a.647.647 0 0 0 .647.647h1.018a1 1 0 0 1 0 2H4.647A2.65 2.65 0 0 1 2 13.353Zm15.951-3.043-1.557 4.773a1 1 0 0 1-.951.689h-.011a1 1 0 0 1-.946-.71l-1.443-4.772a1 1 0 0 1 1.914-.58l.522 1.727.57-1.747a1 1 0 1 1 1.9.62h.002Z" />
                </svg>
                <span>Exportar</span>
            </button>
        </div>
    )
}