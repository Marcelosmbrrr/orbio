import * as React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Components
import { ImageUpload } from '@/Components/shared/input/ImageUpload';
import { EditDroneSchema } from './schemas/EditDroneSchema';
import { api } from '@/Services/api';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';
import { ImageStoredSelection } from '@/Components/shared/forms-modal/ImageStoredSelection';

interface IProps {
    selection: ISelection;
    can_open: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

interface ISelection {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    record_number: string;
    serial_number: string;
    weight: string;
    image_url: string;
}

type FormData = yup.InferType<typeof EditDroneSchema>;

export const EditDrone = React.memo((props: IProps) => {

    const [open, setOpen] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(EditDroneSchema)
    });

    React.useEffect(() => {
        if (props.can_open) {
            setDefaultValues();
        }
    }, [props.can_open]);

    function setDefaultValues() {
        setValue('name', props.selection.name, { shouldValidate: true });
        setValue('manufacturer', props.selection.manufacturer, { shouldValidate: true });
        setValue('model', props.selection.model, { shouldValidate: true });
        setValue('record_number', props.selection.record_number, { shouldValidate: true });
        setValue('serial_number', props.selection.serial_number, { shouldValidate: true });
        setValue('weight', props.selection.weight, { shouldValidate: true });
        setValue('image', '', { shouldValidate: true });
    }

    async function onSubmit(form: FormData) {

        const _form = new FormData();
        _form.append("name", form.name);
        _form.append("manufacturer", form.manufacturer);
        _form.append("model", form.model);
        _form.append("record_number", form.record_number);
        _form.append("serial_number", form.serial_number);
        _form.append("weight", String(form.weight)); // @ts-ignore
        _form.append("image", form.image);
        _form.append('_method', 'PATCH');

        try {
            setPending(true);
            await api.post("api/v1/modules/drones/" + props.selection.id, _form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'json'
            });
            enqueueSnackbar("Drone atualizado com sucesso!", { variant: "success" });
            setTimeout(() => {
                setOpen(false);
                props.setReload((prev) => !prev);
            }, 500);
        } catch (e) {
            setPending(false);
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

    function onOpen() {
        setOpen(true);
        setPending(false);
    }

    function onClose() {
        setOpen(false);
    }

    if (!props.can_open) {
        return ""
    }

    return (
        <>
            <button onClick={onOpen} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m13.835 7.578-.005.007-7.137 7.137 2.139 2.138 7.143-7.142-2.14-2.14Zm-10.696 3.59 2.139 2.14 7.138-7.137.007-.005-2.141-2.141-7.143 7.143Zm1.433 4.261L2 12.852.051 18.684a1 1 0 0 0 1.265 1.264L7.147 18l-2.575-2.571Zm14.249-14.25a4.03 4.03 0 0 0-5.693 0L11.7 2.611 17.389 8.3l1.432-1.432a4.029 4.029 0 0 0 0-5.689Z" />
                </svg>
                <span>Editar</span>
            </button>

            {open &&
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">

                                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Editar Drone
                                    </h3>
                                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                        <div>
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                            <input type="text" {...register('name')} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome do drone" />
                                            <span className='text-red-500 text-sm'>{errors.name?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="manufacturer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fabricante</label>
                                            <input type="text" {...register('manufacturer')} id="manufacturer" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o fabricante do drone" />
                                            <span className='text-red-500 text-sm'>{errors.manufacturer?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Modelo</label>
                                            <input type="text" {...register('model')} id="model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o modelo do drone" />
                                            <span className='text-red-500 text-sm'>{errors.model?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="register" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registro</label>
                                            <input type="text" {...register('record_number')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o número do registro do drone" />
                                            <span className='text-red-500 text-sm'>{errors.record_number?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="serial" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Serial</label>
                                            <input type="text" {...register('serial_number')} id="serial" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o número serial do drone" />
                                            <span className='text-red-500 text-sm'>{errors.serial_number?.message}</span>
                                        </div>
                                        <div>
                                            <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Peso (kg)</label>
                                            <input type="text" {...register('weight')} id="weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o peso do drone" />
                                            <span className='text-red-500 text-sm'>{errors.weight?.message}</span>
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imagem{errors.image && <span className='text-red-500'>*</span>}</p>
                                            <div className='flex items-center'>
                                                <ImageUpload setValue={setValue} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <button onClick={onClose} type="submit" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Cancelar
                                        </button>
                                        <button disabled={pending} type="submit" className="focus:outline-none text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                                            {pending ? <SpinnerIcon /> : "Confirmar"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
});