import * as React from 'react';
import { usePage, Link } from '@inertiajs/react'
// Custom
import { useTheme } from '@/Context/ThemeContext';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { ToolIcon } from '../icons/ToolIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { ServiceOrderIcon } from '../icons/ServiceOrderIcon';
import { ExitIcon } from '../icons/ExitIcon';
import { GearIcon } from '../icons/GearIcon';
import { UserIcon } from '../icons/UserIcon';

interface ITabs {
    admin: boolean;
    equipments: boolean;
}

export function HeaderMobile() {

    const [openMenu, setOpenMenu] = React.useState<boolean>(false);
    const [tab, setTab] = React.useState<ITabs>({ admin: false, equipments: false });
    const { ThemeButton } = useTheme();
    const { user, signOut } = useAuthentication();
    const { url } = usePage();

    function handleOpen() {
        setOpenMenu((prev) => !prev);
    }

    function optionStyle(path: string[]) {
        return path.includes(url) ?
            'w-full flex items-center gap-5 h-12 rounded-md bg-gray-200 dark:bg-gray-800 cursor-pointer transition-all' :
            'w-full flex items-center gap-5 h-12 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all';
    }

    function subOptionStyle(path: string[]) {
        return path.includes(url) ?
            'px-2 w-full flex items-center gap-5 h-12 bg-gray-200 dark:bg-gray-800 cursor-pointer transition-all' :
            'px-2 w-full flex items-center gap-5 h-12 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all';
    }

    function optionIconStyle(path: string[]) {
        return path.includes(url) ?
            'p-1.5 mx-2 rounded-md shadow-md bg-white dark:bg-slate-700 text-green-600 dark:text-green-600' :
            'p-1.5 mx-2 rounded-md shadow-md bg-white dark:bg-slate-700 text-gray-500 dark:text-white';
    }

    return (
        <>
            <header className="w-full xl:hidden bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="w-full flex flex-wrap justify-between items-center">

                    {/* Left */}
                    <div className='flex gap-2'>
                        <div className="flex items-center cursor-pointer" onClick={handleOpen}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-stone-900 dark:text-white hover:text-green-600 dark:hover:text-green-600">
                                <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm15-.75A.75.75 0 0118 9v10.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V9a.75.75 0 01.75-.75zm-15 5.25a.75.75 0 01.75-.75h9.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex items-center">
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">ORBIO (alfa)</span>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center lg:order-2">
                        <div className='flex items-center mr-3'>
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> <span className='text-gray-800 dark:text-white'>{user?.name}</span>
                        </div>
                        <div>
                            {ThemeButton()}
                        </div>
                    </div>

                </div>
            </header>

            {openMenu &&
                <div className="fixed top-0 left-0 w-screen h-screen z-50 py-1 pl-1 bg-gray-950 bg-opacity-75">
                    <div className='w-60 h-full flex flex-col gap-2 rounded p-2 bg-white dark:bg-gray-900'>
                        <div onClick={handleOpen} className="w-full flex items-center gap-5 h-10 rounded-md cursor-pointer transition-all">
                            <div className="px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-stone-900 dark:text-white hover:text-green-600 dark:hover:text-green-600">
                                    <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm14.47 3.97a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06L18 10.81V21a.75.75 0 01-1.5 0V10.81l-2.47 2.47a.75.75 0 11-1.06-1.06l3.75-3.75zM2.25 9A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm0 4.5a.75.75 0 01.75-.75h5.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div
                            className="w-full flex items-center gap-5 h-12 border-y border-y-gray-200 dark:border-y-gray-800">
                            <span className="text-md font-semibold dark:text-white">Módulos</span>
                        </div>

                        {!!user?.modules.gadmin.read &&
                            <Link href="administration" className={optionStyle(['/home/administration'])}>
                                <div className={optionIconStyle(['/home/administration'])}>
                                    <DashboardIcon />
                                </div>
                                <div>
                                    <span className="text-md font-semibold dark:text-white">Administração</span>
                                </div>
                            </Link>
                        }

                        {!!user?.modules.gpc.read &&
                            <>
                                <div onClick={() => setTab({ ...tab, admin: !tab.admin })} className={optionStyle(['/home/users', '/home/roles'])}>
                                    <div className={optionIconStyle(['/home/users', '/home/roles'])}>
                                        <GearIcon />
                                    </div>
                                    <div className='flex items-center'>
                                        <span className="text-md font-semibold dark:text-white mr-1">Usuários e Cargos</span>
                                        <ArrowDownIcon />
                                    </div>
                                </div>
                                {tab.admin &&
                                    <div className='rounded-lg border border-gray-200 dark:border-gray-800'>
                                        <Link href="users" className={"rounded-t-md " + subOptionStyle(['/home/users'])}>
                                            <div>
                                                <span className="text-md font-semibold dark:text-white">Usuários</span>
                                            </div>
                                        </Link>
                                        <div className={"rounded-b-md px-2 w-full flex items-center gap-5 h-12 transition-all"}>
                                            <div>
                                                <span className="text-md font-semibold text-gray-200 dark:text-gray-800">Cargos</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                        }

                        {!!user?.modules.gos.read &&
                            <Link href="service-orders" className={optionStyle(['/home/service-orders'])}>
                                <div className={optionIconStyle(['/home/service-orders'])}>
                                    <ServiceOrderIcon />
                                </div>
                                <div>
                                    <span className="text-md font-semibold dark:text-white">Ordens de Serviço</span>
                                </div>
                            </Link>
                        }

                        {!!user?.modules.gpv.read &&
                            <Link href="flight-plans" className={optionStyle(['/home/flight-plans'])}>
                                <div className={optionIconStyle(['/home/flight-plans'])}>
                                    <ServiceOrderIcon />
                                </div>
                                <div>
                                    <span className="text-md font-semibold dark:text-white">Planos de Voo</span>
                                </div>
                            </Link>
                        }

                        {!!user?.modules.ge.read &&
                            <>
                                <div onClick={() => setTab({ ...tab, equipments: !tab.equipments })} className={optionStyle(['/home/drones', '/home/batteries', '/home/equipments'])}>
                                    <div className={optionIconStyle(['/home/drones', '/home/batteries', '/home/equipments'])}>
                                        <ToolIcon />
                                    </div>
                                    <div className='flex items-center'>
                                        <span className="text-md font-semibold dark:text-white mr-1">Equipamentos</span>
                                        <ArrowDownIcon />
                                    </div>
                                </div>
                                {tab.equipments &&
                                    <div className='rounded-lg border border-gray-200 dark:border-gray-800'>
                                        <Link href="drones" className={"rounded-t-md " + subOptionStyle(['/home/drones'])}>
                                            <div>
                                                <span className="text-md font-semibold dark:text-white">Drones</span>
                                            </div>
                                        </Link>
                                        <Link href="batteries" className={subOptionStyle(['/home/batteries'])}>
                                            <div>
                                                <span className="text-md font-semibold dark:text-white">Baterias</span>
                                            </div>
                                        </Link>
                                        <Link href="equipments" className={"rounded-b-md " + subOptionStyle(['/home/equipments'])}>
                                            <div>
                                                <span className="text-md font-semibold dark:text-white">Equipamentos</span>
                                            </div>
                                        </Link>
                                    </div>
                                }
                            </>
                        }

                        <div
                            className="w-full flex items-center gap-5 h-12 border-y border-y-gray-200 dark:border-y-gray-800">
                            <span className="text-md font-semibold dark:text-white">Outros</span>
                        </div>

                        <Link href="my-profile"
                            className="w-full flex items-center gap-5 h-12 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all">
                            <div className={optionIconStyle(['/home/my-profile'])}>
                                <UserIcon />
                            </div>
                            <div>
                                <span className="text-md font-semibold dark:text-white">Minha Conta</span>
                            </div>
                        </Link>

                        <div onClick={() => signOut()}
                            className="w-full flex items-center gap-5 h-12 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all">
                            <div className="p-1.5 mx-2 rounded-md shadow-md bg-white dark:bg-slate-700 text-gray-500 dark:text-white">
                                <ExitIcon />
                            </div>
                            <div>
                                <span className="text-md font-semibold dark:text-white">Sair</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}