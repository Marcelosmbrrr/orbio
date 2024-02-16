import * as React from 'react';
import { router } from '@inertiajs/react';
import { useSnackbar } from 'notistack';
import { api } from '@/Services/api';
import { useTheme } from '@/Context/ThemeContext';
import { Link } from '@inertiajs/react';
// Components
import { SuccessIcon } from '@/Components/shared/icons/SuccessIcon';
import { ErrorIcon } from '@/Components/shared/icons/ErrorIcon';
import { SpinnerIcon } from '@/Components/shared/icons/small/SpinnerIcon';
// Types
import { LogUploaded, LogCreationProcessing } from './types';

export interface ILog {
    processing: { pending: boolean, ok: boolean, message: string, to_save: boolean };
    filename: string;
    coordinates?: string;
    state: string;
    city: string;
    contents: string;
    imageDataURL?: string;
}

const initialProcessing = {
    pending: true,
    error: false,
    message: "",
    tab_classname: ""
}

export default function CreateLog() {

    const { ThemeButton } = useTheme();

    const [pending, setPending] = React.useState<boolean>(false);
    const [initialFiles, setInitialFiles] = React.useState<any[]>([]);
    const [processedFiles, setProcessedFiles] = React.useState<LogUploaded[]>([]);
    const [step, setStep] = React.useState<number>(1); // initial - verification - image - save
    const { enqueueSnackbar } = useSnackbar();
    const service_order_id = window.location.href.split("/")[5];

    async function onSubmit() {

        const logs_without_image = processedFiles.filter((log: ILog) => !log.imageDataURL);
        if (logs_without_image.length > 0) {
            enqueueSnackbar("Todos os logs devem ter uma imagem.", { variant: "error" });
            return;
        }

        try {
            const payload = processedFiles.map((log: ILog) => {
                return {
                    filename: log.filename,
                    coordinates: log.coordinates,
                    state: log.state,
                    city: log.city,
                    contents: log.contents,
                    imageDataURL: log.imageDataURL,
                }
            });
            const response = await api.post(`api/v1/actions/service-orders/${service_order_id}/logs`, payload);
            enqueueSnackbar(response.data.message, { variant: "success" });
            setTimeout(() => {
                router.get("/home/service-orders");
            }, 1000);
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

    // ======== STEPS PROCESSING ========== //

    async function onLogUpload(e: any) {
        const files = Array.from(e.currentTarget.files);
        const formData = new FormData();
        files.forEach((file: any) => {
            formData.append("files[]", file);
        });
        setInitialFiles(files);
    }

    async function initialFilesValidation() {
        try {
            const response = await api.post('api/v1/actions/service-orders/logs/upload/processing', { data: initialFiles }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProcessedFiles(response.data);
        } catch (e: any) {
            requestError(e);
        }
    }

    const stepProcessingStatus: LogCreationProcessing = React.useMemo(() => {
        if (step != 1) {

            // If there are logs with status pending
            const pending_processing = processedFiles.filter((log: ILog) => log.processing.pending).length > 0;
            if (pending_processing) {
                return initialProcessing;
            }

            let failed_logs = processedFiles.filter((log: ILog) => log.processing.ok === false);
            let message = "";
            let tab_classname = "font-bold text-green-700 dark:text-green-700";

            if (failed_logs.length > 0) {
                message = "Alguns logs falharam e serão removidos. Verifique os erros abaixo.";
                tab_classname = "font-bold text-red-700 dark:text-red-700";
            }

            return {
                pending: false,
                error: failed_logs.length > 0,
                message,
                tab_classname,
            };
        }
        return initialProcessing;
    }, [processedFiles]);

    function renderFileValidation(log: ILog): React.ReactNode {

        let step_processing = null;

        if (log.processing.pending) {
            step_processing = <SpinnerIcon />;
        } else {
            step_processing = (
                <div className='flex items-center gap-2 py-3'>
                    <span className='text-md'>{log.processing.message}</span>
                    {log.processing.ok ?
                        <div className='text-green-600'>
                            <SuccessIcon />
                        </div>
                        :
                        <div className='text-red-500'>
                            <ErrorIcon />
                        </div>
                    }
                </div>
            )
        }

        return step_processing;

    }

    function renderFileImageCapture(log: ILog, index: number): React.ReactNode {

        let step_processing = null;

        if (log.processing.pending) {
            step_processing = (
                <div>
                    <button onClick={() => onGenerateImage(log, index)} className="py-2.5 px-5 mr-2 mb-1 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Gerar Imagem
                    </button>
                    <div className="w-[450px] mx-auto">
                        <div id="modal-content" style={{ height: "100%" }}>
                            <iframe
                                id={"log-iframe-" + index}
                                className="w-full aspect-video"
                                onLoad={(e) => {
                                    if (e.target instanceof HTMLIFrameElement) {
                                        e.target.contentWindow?.postMessage(
                                            { type: 'log-image-generation-draw-request', log: log },
                                            `${window.location.origin}`
                                        );
                                    }
                                }}
                                src={`${window.location.origin}/home/log-image-generation`}
                                style={{ width: "100%", height: "100%" }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            );
        } else if (!log.processing.pending && log.processing.ok && log.imageDataURL) {
            step_processing = (
                <div className="w-[450px] mx-auto">
                    <img src={log.imageDataURL} width={'100%'} height={'100%'} alt="Log Image" />
                </div>
            );
        } else if (!log.processing.pending && !log.processing.ok) {
            step_processing = (
                <div className='flex items-center gap-2'>
                    <span className='text-sm'>Log não processado.</span>
                    <ErrorIcon />
                </div>
            )
        }

        return step_processing;

    }

    function currentStepAction() {
        if (step === 1) {
            return (
                <li onClick={() => startNextStep(2)} className='inline-flex items-center px-4 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white cursor-pointer'>
                    <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                    </svg>
                    Avançar
                </li>
            )
        } else if (step === 2) {
            return (
                <li onClick={() => startNextStep(3)} className='inline-flex items-center px-4 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white cursor-pointer'>
                    <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                    </svg>
                    Avançar
                </li>
            )
        } else if (step === 3) {
            return (
                <li onClick={() => startNextStep(4)} className='inline-flex items-center px-4 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white cursor-pointer'>
                    <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                    </svg>
                    Avançar
                </li>
            )
        } else {
            return (
                <li className='inline-flex items-center px-4 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white cursor-pointer'>
                    <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                    </svg>
                    Finalizado
                </li>
            )
        }
    }

    function onGenerateImage(log: ILog, index: number) {
        const iframe = document.getElementById('log-iframe-' + index);
        if (iframe && iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'log-image-generation-request', log: log }, window.location.origin);
        }
    }

    // Listen for a response from the image generation process
    window.addEventListener("message", (event) => {
        if (event.origin === window.location.origin) {
            if (event.data.type === 'log-image-generation-response') {
                setProcessedFiles((processedFiles) => processedFiles.map((log: ILog) => {
                    if (log.filename.split(".")[0] === event.data.image.filename.split(".")[0]) {
                        if (!log.imageDataURL) {
                            return {
                                ...log,
                                processing: {
                                    to_save: true,
                                    pending: false,
                                    ok: true,
                                    message: "Imagem gerada com sucesso!"
                                },
                                imageDataURL: event.data.image.dataURL
                            }
                        }
                    }
                    return log;
                }));
            }
        }
    }, false);

    function startNextStep(to: number) {

        // From 1 to 2
        if (step === 1) {
            if (initialFiles.length === 0) {
                enqueueSnackbar("Nenhum arquivo selecionado.", { variant: "error" });
            } else {
                setStep(2);
                initialFilesValidation();
            }
            return;
        }

        // From 2 to 3
        if (step === 2) {

            const total_valid_logs = processedFiles.filter((log: ILog) => log.processing.to_save).length;
            if (total_valid_logs === 0) {
                enqueueSnackbar("Nenhum log válido encontrado.", { variant: "error" });
                return;
            }

            setStep(3);
            // Get only valid logs and change pending to true
            const valid_logs = processedFiles
                .filter((log: ILog) => log.processing.to_save)
                .map((log: ILog) => {
                    return {
                        ...log,
                        processing: {
                            to_save: true,
                            pending: true,
                            ok: false,
                            message: ""
                        }
                    }
                });

            setProcessedFiles(valid_logs);

        }

        if (step === 3) {
            if (stepProcessingStatus.error || stepProcessingStatus.pending) {
                enqueueSnackbar(stepProcessingStatus.message, { variant: "error" });
                return;
            }
            setStep(to);
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

    function stepActive(step_to_render: number) {
        if (step_to_render === step) {
            return "inline-flex items-center px-4 py-3 border border-green-700 rounded-lg bg-gray-50 dark:bg-gray-800";
        } else {
            return "inline-flex items-center px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800";
        }
    }

    function onReset() {
        setStep(1);
        setProcessedFiles([]);
    }

    return (
        <div className='h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-scroll'>

            <header className="flex justify-between items-center border-b border-b-gray-200 dark:border-b-gray-700 mb-5 px-4 py-2.5">
                <div>
                    <span className='text-xl font-semibold text-gray-900 dark:text-white'>Upload de Logs</span>
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
                        Upload
                    </li>
                    <li id="client" className={stepActive(2)}>
                        {stepStatusIcon(2)}
                        Verificação
                    </li>
                    <li id="flight_plans" className={stepActive(3)}>
                        {stepStatusIcon(3)}
                        Imagens
                    </li>
                    {currentStepAction()}
                </ul>

                <div className="py-1 px-3 h-full text-medium text-gray-500 dark:text-gray-400 rounded-lg w-full">

                    {step === 1 &&
                        <div>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Seleção dos arquivos</h3>
                            <p>Procure na sua máquina os logs com extensão .tlog.kmz.</p>
                            <p>Arquivos selecionados: {initialFiles.length}</p>
                            <div className='mt-3'>
                                <label className='w-fit flex items-center py-2.5 px-5 text-sm font-medium cursor-pointer text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'>
                                    <svg className="w-4 h-4 text-gray-700 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2Z" />
                                    </svg>
                                    Procurar
                                    <input disabled={step != 1} id='input' type="file" multiple onChange={onLogUpload} className="hidden" accept='.tlog.kmz' />
                                </label>
                            </div>
                        </div>
                    }

                    {step >= 2 && step <= 3 &&
                        <ul>
                            {processedFiles.map((log: ILog, index: number) => (
                                <li className="p-2 border-y border-y-gray-200 dark:border-y-gray-700" key={index}>
                                    <div className="flex items-center">
                                        <div className="flex-1 min-w-0 ml-2">
                                            <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                                Arquivo: {log.filename}
                                            </p>
                                            {log.coordinates &&
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    Coordenadas: {log.coordinates} ({log.state}, {log.city})
                                                </p>
                                            }
                                        </div>
                                        <div className="flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            {step === 2 ? renderFileValidation(log) : renderFileImageCapture(log, index)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }

                    {step === 4 &&
                        <div>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Confirmação</h3>
                            <span>Clique em Confirmar para concluir o procedimento ou em Resetar para recomeçar.</span>
                            <div className='mt-3'>
                                <button onClick={onReset} className="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-green-800">
                                    Resetar
                                </button>
                                <button onClick={onSubmit} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    {pending ? "Processando..." : "Confirmar"}
                                </button>
                            </div>
                        </div>
                    }

                </div>
            </div >
        </div>
    )
}