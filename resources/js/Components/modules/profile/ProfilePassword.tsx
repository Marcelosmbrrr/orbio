import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Custom
import { api } from "@/Services/api";
import { SpinnerIcon } from "@/Components/shared/icons/SpinnerIcon";

const schema = yup.object({
    actual_password: yup.string().required('informe a senha atual'),
    password: yup.string().required('informe a nova senha'),
    password_confirmation: yup.string().required('digite a confirmação da senha').oneOf([yup.ref('password')], 'Senhas são incompatíveis')
}).required();

type FormData = yup.InferType<typeof schema>;

export function ProfilePassword() {

    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    async function onSubmit(form: FormData) {
        try {
            setPending(true);
            await api.patch("api/v1/modules/profile/password/update", form);
            enqueueSnackbar("Senha atualizada com sucesso!", { variant: "success" });
            reset();
        } catch (e: any) {
            requestError(e);
        } finally {
            setPending(false);
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
        <form className="flex flex-col gap-8 py-8" onSubmit={handleSubmit(onSubmit)}>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className="text-2xl text-gray-800 dark:text-white">Alteração da Senha</h1>
                </div>
                <div className='flex gap-1'>
                    <button type="submit" disabled={pending} className="focus:outline-none text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                        {pending ? <SpinnerIcon /> : "Confirmar"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha atual</label>
                        <input type="password" {...register('actual_password')} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a senha atual" />
                        <span className='text-red-500 text-sm'>{errors.actual_password?.message}</span>
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nova senha</label>
                        <input type="password" {...register('password')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a nova senha" />
                        <span className='text-red-500 text-sm'>{errors.password?.message}</span>
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmação da nova senha</label>
                        <input type="password" {...register('password_confirmation')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Confirme a nova senha" />
                        <span className='text-red-500 text-sm'>{errors.password_confirmation?.message}</span>
                    </div>
                </div>
            </div>
        </form>
    )
}