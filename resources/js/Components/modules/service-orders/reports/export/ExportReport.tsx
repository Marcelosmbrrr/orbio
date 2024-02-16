import * as React from 'react';
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { DownloadIcon } from '@/Components/shared/icons/DownloadIcon';

interface IProps {
    report_id: string;
    report_name: string;
}

export function ExportReport(props: IProps) {

    const { enqueueSnackbar } = useSnackbar();

    async function download() {
        try {
            const response = await api.get(`api/v1/actions/service-orders/${props.report_id}/report/export`, {
                headers: {
                    'Content-type': 'application/json'
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${props.report_name}.pdf`);
            document.body.appendChild(link);
            link.click();
            enqueueSnackbar("Relatório exportado com sucesso!", { variant: "success" });
        } catch (e: any) {
            requestError(e);
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

    return (
        <button onClick={download} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-full text-sm p-2 text-center inline-flex items-center mr-2">
            <DownloadIcon />
        </button>
    )
}