import * as React from 'react';
import { Link, Head } from '@inertiajs/react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
//  Custom
import { GuestLayout } from '@/Layouts/GuestLayout';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { SpinnerIcon } from '@/Components/shared/icons/SpinnerIcon';

const schema = yup.object({
    login: yup.string().required('informe o login'),
    password: yup.string().required('informe a senha'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function SignIn() {

    const [entity, setEntity] = React.useState<"admins" | "tenants" | "users">("admins");
    const [pending, setPending] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { signInAdmin, signInUser, signInTenant } = useAuthentication();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    async function onSubmit(form: FormData) {
        try {
            setPending(true);

            if (entity === "tenants") {
                await signInTenant(form);
            } else if (entity === "admins") {
                await signInAdmin(form);
            } else {
                await signInUser(form);
            }

        } catch (e) {
            requestError(e);
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
        <GuestLayout>
            <Head title="Acessar" />
            <section>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">

                    <div className="flex items-center text-2xl mb-5 font-semibold text-gray-900 dark:text-white">
                        ORBIO (alfa)
                    </div>

                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Entrar
                            </h1>

                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input type="radio" onClick={() => setEntity('admins')} checked={entity === "admins"} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                                        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Admin</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input type="radio" onClick={() => setEntity('tenants')} checked={entity === "tenants"} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                                        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Gerente</label>
                                    </div>
                                </li>
                                <li className="w-full dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input type="radio" onClick={() => setEntity('users')} checked={entity === "users"} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Usuário</label>
                                    </div>
                                </li>
                            </ul>

                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="login" className="block mb-2 text-sm font-medium text-gray-900">{entity === "users" ? "ID da Conta (12 dígitos)" : "E-mail"}</label>
                                    <input type="text" {...register("login")} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder={entity === "users" ? "" : "Informe o seu e-mail"} />
                                    <span className='text-red-500 text-sm'>{errors.login?.message}</span>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Senha</label>
                                    <input type="password" {...register("password")} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder='Informe a sua senha' />
                                    <span className='text-red-500 text-sm'>{errors.password?.message}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500">Lembrar</label>
                                        </div>
                                    </div>
                                    <Link href={"/forgot-password/" + entity} className="text-sm font-medium text-blue-600 hover:underline">Esqueceu sua senha?</Link>
                                </div>
                                <button type="submit" className="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {pending ? <SpinnerIcon /> : "Acessar"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>
        </GuestLayout>
    );

}