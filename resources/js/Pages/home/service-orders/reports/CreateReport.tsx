import * as React from 'react';
import { router } from '@inertiajs/react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
import { pdf } from '@react-pdf/renderer';
// Custom
import { useTheme } from '@/Context/ThemeContext';
import { api } from '@/Services/api';
import { ReportVisualization } from '@/Components/modules/service-orders/reports/creation/pdf-builder/ReportBuilder';
import { ReportDocument } from '@/Components/modules/service-orders/reports/creation/pdf-builder/ReportBuilder';
import { ReportBasicData } from '@/Components/modules/service-orders/reports/creation/forms/ReportBasicData';
import { ReportLogSelection } from '@/Components/modules/service-orders/reports/creation/log-selection/ReportLogSelectionTab';
import { ReportBasicInformationSchema } from '@/Components/modules/service-orders/reports/creation/schemas/ReportBasicInformationSchema';
// Types
import { InertiaProps, ReportCreationLog } from './types';

type FormData = yup.InferType<typeof ReportBasicInformationSchema>;

export default function CreateReport(props: InertiaProps) {

    const serviceOrderId = window.location.pathname.split("/")[3];
    const [step, setStep] = React.useState<number>(1);
    const [logs] = React.useState<ReportCreationLog[]>(props.logs);
    const [selectedLogs, setSelectedLogs] = React.useState<ReportCreationLog[]>([]);
    const [pending, setPending] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const { ThemeButton } = useTheme();

    const { register, handleSubmit, formState: { errors }, getValues, watch, reset } = useForm<FormData>({
        // @ts-ignore
        resolver: yupResolver(ReportBasicInformationSchema),
        defaultValues: {
            number: props.number,
            city: props.city,
            state: props.state
        }
    });

    watch(["name", "responsible", "client", "city", "state", "farm", "area", "date", "number", "dosage", "provider"]);

    async function onSubmit(form: FormData) {
        try {
            setPending(true);
            const blob = await pdf(
                <ReportDocument
                    data={{
                        responsible: getValues("responsible"),
                        client: getValues("client"),
                        name: getValues("name"),
                        city: getValues("city"),
                        state: getValues("state"),
                        farm: getValues("farm"),
                        area: getValues("area"),
                        date: getValues("date"),
                        number: getValues("number"),
                        dosage: getValues("dosage"),
                        provider: getValues("provider"),
                        logs: selectedLogs
                    }}
                />
            ).toBlob();

            const report_file = new File([blob], `${form.name}.pdf`, { type: 'application/pdf' });

            await api.post(`api/v1/actions/service-orders/${serviceOrderId}/report/create`, {
                service_order_id: serviceOrderId,
                name: form.name,
                file: report_file
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            enqueueSnackbar("Relatório criado com sucesso!", { variant: "success" });

            setTimeout(() => {
                router.get(`/home/service-orders`);
            }, 1000);

        } catch (e) {
            requestError(e);
        } finally {
            setPending(false);
        }
    }

    function requestError(e: any) {
        console.error(e, e.stack);
        setError(true);
        if (e.response.data.message != undefined) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
            enqueueSnackbar("Erro do Servidor", { variant: "error" });
        }
    }

    async function nextStep() {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            if (selectedLogs.length === 0) {
                enqueueSnackbar("Selecione pelo menos 1 log.", { variant: "error" });
                return;
            } else {
                let logs_are_filled = selectedLogs.reduce((aux, log: ReportCreationLog) => aux && log.extra_data.filled, true);
                if (!logs_are_filled) {
                    enqueueSnackbar("Preencha os dados adicionais dos logs selecionados.", { variant: "error" });
                    return;
                }
            }
            setStep(3);
        }
    }

    function nextStepError(errors: any) {
        const first_error = errors[Object.keys(errors)[0]].message;
        // enqueueSnackbar(first_error, { variant: "error" });
    }

    function stepActive(step_to_render: number) {
        if (step_to_render === step) {
            return "inline-flex items-center px-4 py-3 border border-green-700 rounded-lg bg-gray-50 dark:bg-gray-800";
        } else {
            return "inline-flex items-center px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800";
        }
    }

    function stepStatusIcon(step_to_render: number) {
        // Actual Step
        if (step_to_render === step) {
            return (
                <svg className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                </svg>
            )
            // Posterior Step
        } else if (step_to_render > step) {
            return (
                <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
            )
            // Previous Step
        } else if (step_to_render < step) {
            return (
                <svg className="w-4 h-4 mr-2 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
            )
        }
    }

    function onReset() {
        reset();
        setStep(1);
    }

    return (
        <div className='h-screen flex flex-col overflow-y-scroll bg-white shadow dark:bg-gray-900'>

            <header className="flex justify-between items-center border-b border-b-gray-200 dark:border-b-gray-700 mb-5 px-4 py-2.5">
                <div>
                    <span className='text-xl font-semibold text-gray-900 dark:text-white'>Criar Relatório</span>
                </div>
                <div className='flex items-center'>
                    <div className='mr-5'>
                        {ThemeButton()}
                    </div>
                    <button onClick={() => router.get("/home/service-orders")} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Voltar
                    </button>
                </div>
            </header>

            <div className="md:flex px-3">
                <ul className="flex flex-col space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                    <li id="pilot" className={stepActive(1)}>
                        {stepStatusIcon(1)}
                        Básico
                    </li>
                    <li id="client" className={stepActive(2)}>
                        {stepStatusIcon(2)}
                        Logs
                    </li>
                    <li onClick={handleSubmit(nextStep, nextStepError)} className='inline-flex items-center px-4 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white cursor-pointer'>
                        <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                            <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                        </svg>
                        {step < 3 ? "Avançar" : "Concluído"}
                    </li>
                </ul>
                <div className="p-3 h-full bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                    {step === 1 && <ReportBasicData register={register} attendant={props.attendant} pilot={props.pilot} client={props.client} errors={errors} />}
                    {step === 2 && <ReportLogSelection logs={logs} selectedLogs={selectedLogs} setSelectedLogs={setSelectedLogs} />}
                    {step === 3 &&
                        <div>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Confirmação</h3>
                            <span>Clique em Confirmar para concluir o procedimento ou em Resetar para recomeçar.</span>
                            <div className='mt-3'>
                                <button onClick={onReset} disabled={pending} className="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-green-800">
                                    Resetar
                                </button>
                                <ReportVisualization data={{
                                    responsible: getValues("responsible"),
                                    client: getValues("client"),
                                    name: getValues("name"),
                                    city: getValues("city"),
                                    state: getValues("state"),
                                    farm: getValues("farm"),
                                    area: getValues("area"),
                                    date: getValues("date"),
                                    number: getValues("number"),
                                    dosage: getValues("dosage"),
                                    provider: getValues("provider"),
                                    logs: selectedLogs
                                }} />
                                <button onClick={handleSubmit(onSubmit)} disabled={pending} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    {pending ? "Processando..." : "Salvar Relatório"}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )

}