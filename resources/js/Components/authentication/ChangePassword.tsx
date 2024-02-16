import * as React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { router } from '@inertiajs/react';
// Custom
import { useSnackbar } from 'notistack';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';
import { api } from '@/Services/api';

const schema = yup.object({
    code: yup.string().required('informe o código recebido'),
    password: yup.string().required('informe a nova senha'),
    password_confirmation: yup.string().required('digite a confirmação da senha').oneOf([yup.ref('password')], 'Senhas são incompatíveis')
}).required();

type ChangePasswordFormData = yup.InferType<typeof schema>;

export function ChangePassword(props: { entity: "admins" | "tenants" | "users" }) {

    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const button_text = pending ? <SpinnerIcon /> : "Enviar";

    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(schema)
    });

    async function onSubmit(form: ChangePasswordFormData) {
        try {
            setPending(true);
            await api.patch("api/auth/reset-password?entity=" + props.entity, form);
            enqueueSnackbar("Sucesso! A senha foi alterada.", { variant: "success" });
            setTimeout(() => {
                router.get("/signin");
            }, 2000);
        } catch (e) {
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
        <form id="change-password" className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900">Código</label>
                <input type="text" {...register("code")} id="code" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" />
                <span className='text-red-500 text-sm'>{errors.code?.message}</span>
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Nova senha</label>
                <input type="password" {...register("password")} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" />
                <span className='text-red-500 text-sm'>{errors.password?.message}</span>
            </div>
            <div>
                <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900">Confirmação da senha</label>
                <input type="password" {...register("password_confirmation")} id="password_confirmation" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" />
                <span className='text-red-500 text-sm'>{errors.password_confirmation?.message}</span>
            </div>
            <button disabled={pending} form='change-password' type="submit" className="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                {button_text}
            </button>
        </form>
    )

}