import * as React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// Custom
import { ReportLogMeteorologicalDataSchema } from '../schemas/ReportLogMeteorologicalDataSchema';
// Types
import { ReportCreationLog } from '@/Pages/home/service-orders/reports/types';

interface IProps {
    logId: string;
    selectedLogs: ReportCreationLog[];
    setSelectedLogs: React.Dispatch<React.SetStateAction<ReportCreationLog[]>>;
}

type FormData = yup.InferType<typeof ReportLogMeteorologicalDataSchema>;

export function SelectedLogData(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(ReportLogMeteorologicalDataSchema)
    });

    function onOpen() {
        setOpen(true);
    }

    function onClose() {
        setOpen(false);
    }

    function onSubmit(form: FormData) {
        let data = JSON.parse(JSON.stringify(form));
        data.filled = true;
        const find_record_index = props.selectedLogs.findIndex((selection: ReportCreationLog) => Number(selection.id) === Number(props.logId));
        if (Boolean(find_record_index + 1)) {
            const clone = JSON.parse(JSON.stringify(props.selectedLogs));
            clone[find_record_index].extra_data = data;
            props.setSelectedLogs(clone);
        }
        setOpen(false);
    }

    return (
        <>
            <button onClick={onOpen} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Adicionar Dados
            </button>

            {open &&
                <div className="relative z-50">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Dados do Log
                                    </h3>
                                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Temperatura (Cº)</label>
                                        <div className='grid grid-cols-2 gap-1'>
                                            <div>
                                                <input type="text" {...register("temperature.initial")} id="initial_temperature" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Temperatura inicial" />
                                                <span className='text-red-500 text-sm'>{errors.temperature?.initial?.message}</span>
                                            </div>
                                            <div>
                                                <input type="text" {...register("temperature.final")} id="final_temperature" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Temperatura final" />
                                                <span className='text-red-500 text-sm'>{errors.temperature?.final?.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Umidade</label>
                                        <div className='grid grid-cols-2 gap-1'>
                                            <div>
                                                <input type="text" {...register("humidity.initial")} id="initial_humidity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Umidade inicial" />
                                                <span className='text-red-500 text-sm'>{errors.humidity?.initial?.message}</span>
                                            </div>
                                            <div>
                                                <input type="text" {...register("humidity.final")} id="final_humidity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Umidade final" />
                                                <span className='text-red-500 text-sm'>{errors.humidity?.final?.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Velocidade do vento (Km/h)</label>
                                        <div className='grid grid-cols-2 gap-1'>
                                            <div>
                                                <input type="text" {...register("wind_speed.initial")} id="initial_wind_speed" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Velocidade do vento inicial" />
                                                <span className='text-red-500 text-sm'>{errors.wind_speed?.initial?.message}</span>
                                            </div>
                                            <div>
                                                <input type="text" {...register("wind_speed.final")} id="final_wind_speed" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Velocidade do vento final" />
                                                <span className='text-red-500 text-sm'>{errors.wind_speed?.final?.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <button onClick={onClose} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Cancelar
                                        </button>
                                        <button onClick={handleSubmit(onSubmit)} className="focus:outline-none text-white bg-green-800 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )

}