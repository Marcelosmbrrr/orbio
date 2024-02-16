import * as React from 'react';
import { Link } from '@inertiajs/react';
import JSZip from 'jszip';
import { useSnackbar } from 'notistack';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';
import { DownloadIcon } from '@/Components/shared/icons/DownloadIcon';
import { api } from '@/Services/api';

interface IFlightPlan {
    id: string;
    name: string;
    state: string;
    city: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface IProps {
    id: string;
    flight_plans: IFlightPlan[],
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceOrderFlightPlans(props: IProps) {

    const { user } = useAuthentication();
    const { enqueueSnackbar } = useSnackbar();

    async function exportFlightPlan(flight_plan_id: string) {
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

    function requestError(e: any) {
        console.error(e, e.stack);
        if (e.response.data.message != undefined) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
            enqueueSnackbar("Erro do Servidor", { variant: "error" });
        }
    }

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Planos de voo</h3>
            <span>Lista de planos de voo vinculados a essa ordem de serviço. É obrigatório que exista pelo menos um plano vinculado.</span>
            <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cidade
                            </th>
                            <th scope="col" className="px-6 py-3 text-right">
                                Exportar | Visualizar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.flight_plans.length > 0 && props.flight_plans.map((flight_plan: IFlightPlan) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={flight_plan.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {flight_plan.name}
                                </th>
                                <td className="px-6 py-4">
                                    {flight_plan.state}
                                </td>
                                <td className="px-6 py-4">
                                    {flight_plan.city}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button>
                                        <ShowImage can_open={true} title={"Visualização do Plano"} image_url={flight_plan.image_url} />
                                    </button>
                                    <button onClick={() => exportFlightPlan(flight_plan.id)} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-full text-sm p-2 text-center inline-flex items-center">
                                        <DownloadIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {props.flight_plans.length === 0 &&
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" colSpan={4} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Nenhum plano de voo encontrado
                                </th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )


}