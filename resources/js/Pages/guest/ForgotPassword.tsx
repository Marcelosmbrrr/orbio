import * as React from 'react';
import { Link, Head } from '@inertiajs/react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
// Custom
import { GuestLayout } from '@/Layouts/GuestLayout';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';
import { api } from '@/Services/api';
import { ChangePassword } from '@/Components/authentication/ChangePassword';

const schema = yup.object({
    email: yup.string().email('email inválido').required('informe o email'),
}).required();

type SendCodeFormData = yup.InferType<typeof schema>;

export default function ForgotPassword() {

    const entity: "admins" | "tenants" | "users" = React.useMemo(() => {
        const url = window.location.href.split('/');
        const entity = url[url.length - 1];
        if (entity === "users" || entity === "admins" || entity === "tenants") {
            return entity;
        }
        return "admins";
    }, []);

    const [codeSent, setCodeSent] = React.useState(false);
    const [timer, setTimer] = React.useState(0);
    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const button_text = pending ? <SpinnerIcon /> : (timer === 0 ? "Enviar" : timer);
    const button_disabled = timer > 0 || pending;

    const { register, handleSubmit, formState: { errors } } = useForm<SendCodeFormData>({
        resolver: yupResolver(schema)
    });

    async function onSubmit(form: SendCodeFormData) {
        try {
            setPending(true);
            await api.post("api/auth/reset-password/code?entity=" + entity, form);
            enqueueSnackbar("Sucesso! O código foi enviado para o seu e-mail.", { variant: "success" });
            setCodeSent(true);
            setTimer(60);
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
        setCodeSent(false);
    }


    React.useEffect(() => {
        let is_mounted = true;
        if (timer === 0) {
            return;
        }
        setTimeout(() => {
            if (is_mounted) {
                setTimer((previously) => previously - 1);
            }
        }, 1000);
        return () => {
            is_mounted = false;
        }
    }, [timer]);

    return (
        <GuestLayout>
            <Head title="Recuperar conta" />
            <section>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                    <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        ORBIO (alfa)
                    </div>
                    <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Alteração da senha
                        </h2>
                        <div className="mt-4 space-y-4 lg:mt-5 md:space-y-5">

                            <form id="send-code" className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">E-mail</label>
                                    <input type="email" {...register("email")} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder='Informe o seu e-mail' />
                                    <span className='text-red-500 text-sm'>{errors.email?.message}</span>
                                </div>
                                <button disabled={button_disabled} form='send-code' type="submit" className="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {button_text}
                                </button>
                            </form>

                            {codeSent &&
                                <ChangePassword entity={entity} />
                            }

                        </div>
                        <div className='mt-2'>
                            <Link href="/signin" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Acessar</Link>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    )
}