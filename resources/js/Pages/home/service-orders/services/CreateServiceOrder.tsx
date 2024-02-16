import * as React from 'react';
import { router } from '@inertiajs/react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Custom
import { api } from '@/Services/api';
import { ServiceOrderManagementSchema } from '@/Components/modules/service-orders/services/creation-management/schemas/ServiceOrderManagementSchema';
import { PilotSelection } from '@/Components/modules/service-orders/services/creation-management/resource-selection/PilotSelection';
import { ClientSelection } from '@/Components/modules/service-orders/services/creation-management/resource-selection/ClientSelection';
import { DroneSelection } from '@/Components/modules/service-orders/services/creation-management/resource-selection/DroneSelection';
import { BatterySelection } from '@/Components/modules/service-orders/services/creation-management/resource-selection/BatterySelection';
import { EquipmentSelection } from '@/Components/modules/service-orders/services/creation-management/resource-selection/EquipmentSelection';
import { FlightPlanSelection } from '@/Components/modules/service-orders/services/creation-management/resource-selection/FlightPlanSelection';
import { ShowImage } from '@/Components/shared/forms-modal/ShowImage';
import { useTheme } from '@/Context/ThemeContext';

type FormData = yup.InferType<typeof ServiceOrderManagementSchema>;

const steps = ["pilot", "client", "flight_plans", "drones", "batteries", "equipments"];

export default function CreateServiceOrder() {

    const { ThemeButton } = useTheme();
    const [pending, setPending] = React.useState<boolean>(false);
    const [step, setStep] = React.useState<number>(1);
    const { enqueueSnackbar } = useSnackbar();

    const { handleSubmit, setValue, getValues, watch, reset } = useForm<FormData>({
        resolver: yupResolver(ServiceOrderManagementSchema),
        defaultValues: {
            pilot: [],
            client: [],
            flight_plans: [],
            drones: [],
            batteries: [],
            equipments: [],
        }
    });

    watch(["pilot", "client", "flight_plans", "drones", "batteries", "equipments"]);

    async function onSubmit(form: FormData) {

        let data: { [key: string]: string[] } = {} as any;
        for (let step of steps) {
            data[step] = form[step as keyof typeof form].map((item: any) => item.id);
        }

        try {
            setPending(true);
            await api.post("api/v1/modules/service-orders", data);
            enqueueSnackbar("Ordem de serviço criada com sucesso!", { variant: "success" });
            setTimeout(() => {
                router.get("/home/service-orders");
            }, 500);
        } catch (e) {
            requestError(e);
        } finally {
            setPending(false);
        }
    }

    function onSubmitError(errors: any) {
        const first_error = errors[Object.keys(errors)[0]].message;
        enqueueSnackbar(first_error, { variant: "error" });
    }

    function requestError(e: any) {
        console.error(e, e.stack);
        if (e.response.data.message != undefined) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
            enqueueSnackbar("Erro do Servidor", { variant: "error" });
        }
    }

    function nextStep() {

        if (step === 1 && getValues("pilot").length > 1) {
            enqueueSnackbar("O piloto já foi selecionado.", { variant: "error" });
            return;
        }

        if (step === 2 && getValues("client").length > 1) {
            enqueueSnackbar("O cliente já foi selecionado.", { variant: "error" });
            return;
        }

        // validate step
        if (step === 3 && getValues("flight_plans").length === 0) {
            enqueueSnackbar("Selecione pelo menos um item.", { variant: "error" });
            return;
        }
        // next step
        if (step <= 6) {
            setStep(step + 1);
        }
    }

    function onReset() {
        reset();
        setStep(1);
    }

    const stepTable = React.useMemo(() => {

        if (step == 1) {
            return <PilotSelection setValue={setValue} getValues={getValues} edit={false} />
        } else if (step == 2) {
            return <ClientSelection setValue={setValue} getValues={getValues} edit={false} />
        } else if (step == 3) {
            return <FlightPlanSelection setValue={setValue} getValues={getValues} edit={false} />
        } else if (step == 4) {
            return <DroneSelection setValue={setValue} getValues={getValues} edit={false} />
        } else if (step == 5) {
            return <BatterySelection setValue={setValue} getValues={getValues} edit={false} />
        } else if (step == 6) {
            return <EquipmentSelection setValue={setValue} getValues={getValues} edit={false} />
        } else if (step == 7) {

            return (
                <div className='pt-3'>
                    <button onClick={onReset} disabled={pending} className="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-green-800">
                        Resetar
                    </button>
                    <button onClick={handleSubmit(onSubmit, onSubmitError)} disabled={pending || step != 7} className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        {pending ? "Processando..." : "Salvar Ordem de Serviço"}
                    </button>
                    <div className='my-5'>
                        <h3 className="text-md font-bold text-gray-600 dark:text-white mb-1">Piloto</h3>
                        <span>Lista de pilotos selecionados.</span>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        E-mail
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        CPF
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getValues("pilot").length > 0 && getValues("pilot").map((item: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.status}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.cpf}
                                        </td>
                                    </tr>
                                ))}

                                {getValues("pilot").length === 0 &&
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan={4} className='px-6 py-4 whitespace-nowrap dark:text-white'>
                                            Nenhum piloto selecionado.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <h3 className="text-md font-bold text-gray-600 dark:text-white mb-1">Cliente</h3>
                        <span>Lista de clientes selecionados.</span>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        E-mail
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        CNPJ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getValues("client").length > 0 && getValues("client").map((item: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.status}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.cnpj}
                                        </td>
                                    </tr>
                                ))}

                                {getValues("client").length === 0 &&
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan={4} className='px-6 py-4 whitespace-nowrap dark:text-white'>
                                            Nenhum cliente selecionado.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <h3 className="text-md font-bold text-gray-600 dark:text-white mb-1">Planos de Voo</h3>
                        <span>Lista de planos de voo selecionados.</span>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        Cidade
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Visualizar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getValues("flight_plans").length > 0 && getValues("flight_plans").map((item: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.state}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.city}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ShowImage can_open={true} title={"Visualização do Plano de Voo"} image_url={item.image_url} />
                                        </td>
                                    </tr>
                                ))}

                                {getValues("flight_plans").length === 0 &&
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan={4} className='px-6 py-4 whitespace-nowrap dark:text-white'>
                                            Nenhum plano de voo selecionado.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <h3 className="text-md font-bold text-gray-600 dark:text-white mb-1">Drones</h3>
                        <span>Lista de drones selecionados.</span>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Modelo
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Número Serial
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Número de Registro
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Peso (kg)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Visualizar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getValues("drones").length > 0 && getValues("drones").map((item: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.model}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.serial_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.record_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.weight}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ShowImage can_open={true} title={"Visualização do Drone"} image_url={item.image_url} />
                                        </td>
                                    </tr>
                                ))}

                                {getValues("drones").length === 0 &&
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan={4} className='px-6 py-4 whitespace-nowrap dark:text-white'>
                                            Nenhum drone selecionado.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <h3 className="text-md font-bold text-gray-600 dark:text-white mb-1">Baterias</h3>
                        <span>Lista de baterias selecionadas.</span>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Modelo
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Número Serial
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Visualizar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getValues("batteries").length > 0 && getValues("batteries").map((item: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.model}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.serial_number}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ShowImage can_open={true} title={"Visualização da Bateria"} image_url={item.image_url} />
                                        </td>
                                    </tr>
                                ))}

                                {getValues("batteries").length === 0 &&
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan={4} className='px-6 py-4 whitespace-nowrap dark:text-white'>
                                            Nenhuma bateria selecionada.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <h3 className="text-md font-bold text-gray-600 dark:text-white mb-1">Equipamentos</h3>
                        <span>Lista de equipamentos selecionados.</span>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Modelo
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Número Serial
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Número de Registro
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Visualizar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getValues("equipments").length > 0 && getValues("equipments").map((item: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.model}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.serial_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.record_number}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ShowImage can_open={true} title={"Visualização do Equipamento"} image_url={item.image_url} />
                                        </td>
                                    </tr>
                                ))}

                                {getValues("equipments").length === 0 &&
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan={5} className='px-6 py-4 whitespace-nowrap dark:text-white'>
                                            Nenhum equipamento selecionado.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }, [step, pending]);

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

    return (
        <div className='h-screen flex flex-col overflow-y-scroll bg-white shadow dark:bg-gray-900'>

            <header className="flex justify-between items-center border-b border-b-gray-200 dark:border-b-gray-700 mb-5 px-4 py-2.5">
                <div>
                    <span className='text-xl font-semibold text-gray-900 dark:text-white'>Criar Ordem de Serviço</span>
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
                        Piloto
                    </li>
                    <li id="client" className={stepActive(2)}>
                        {stepStatusIcon(2)}
                        Cliente
                    </li>
                    <li id="flight_plans" className={stepActive(3)}>
                        {stepStatusIcon(3)}
                        Planos *
                    </li>
                    <li id="drones" className={stepActive(4)}>
                        {stepStatusIcon(4)}
                        Drones
                    </li>
                    <li id="batteries" className={stepActive(5)}>
                        {stepStatusIcon(5)}
                        Baterias
                    </li>
                    <li id="equipments" className={stepActive(6)}>
                        {stepStatusIcon(6)}
                        Equipamentos
                    </li>
                    <li onClick={nextStep} className='inline-flex items-center px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white cursor-pointer'>
                        <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                            <path d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z" />
                        </svg>
                        Avançar Etapa
                    </li>
                </ul>
                <div className="px-3 h-full bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                    {stepTable}
                </div>
            </div>

        </div>
    )

}