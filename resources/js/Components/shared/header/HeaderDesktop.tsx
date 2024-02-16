import * as React from 'react';
import { usePage, Link } from '@inertiajs/react'
// Custom
import { useTheme } from '@/Context/ThemeContext';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { RightIcon } from '../icons/RightIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { DroneIcon } from '../icons/DroneIcon';
import { ToolIcon } from '../icons/ToolIcon';
import { BatteryIcon } from '../icons/BatteryIcon';

interface IOpenMenu {
    admin: boolean;
    equipments: boolean;
}

const initialOpenMenu = { admin: false, flights: false, equipments: false }

export function HeaderDesktop() {

    const [openMenu, setOpenMenu] = React.useState<IOpenMenu>({ admin: false, equipments: false });
    const { ThemeButton } = useTheme();
    const { user, signOut } = useAuthentication();
    const { url } = usePage()

    function optionStyle(path: string[]) {
        return path.includes(url) ?
            'flex items-center gap-1 p-4 text-md text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500' :
            'flex items-center gap-1 p-4 text-md border-b-2 border-transparent rounded-t-lg hover:border-gray-300 dark:hover:text-gray-300';
    }

    function handleOpenMenu(e: React.MouseEvent) {
        const new_value = !openMenu[e.currentTarget.id as keyof typeof openMenu];
        setOpenMenu({ ...initialOpenMenu, [e.currentTarget.id]: new_value });
    }

    return (
        <header className="hidden xl:block w-full bg-white shadow px-4 lg:px-6 pt-2.5 dark:bg-gray-800">
            <div className="w-full flex flex-wrap justify-between items-center pb-0.5">

                {/* Left */}
                <div className='flex'>
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

                {/* Middle */}
                <div className="hidden xl:flex justify-between items-center w-full lg:w-auto lg:order-1" id="mobile-menu-2">
                    <div className="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">

                        <ul className="flex flex-wrap -mb-px">

                            {!!user?.modules.gadmin.read &&
                                <li>
                                    <Link href='administration' className={optionStyle(['/home/administration'])}>
                                        Administração
                                    </Link>
                                </li>
                            }

                            {!!user?.modules.gpc.read &&
                                <li id="admin" className='relative cursor-pointer' onClick={handleOpenMenu}>
                                    <span className={optionStyle(['/home/users', '/home/roles'])}>
                                        Usuários e Cargos
                                    </span>
                                    {!!openMenu.admin &&
                                        <div className='absolute top-15 shadow-lg rounded-md px-1 py-2 flex flex-col bg-white dark:bg-gray-900 dark:border dark:border-gray-800'>
                                            <Link href="users" className='w-72 p-3 rounded-md flex items-center gap-1 cursor-pointer text-gray-600 dark:text-white hover:text-green-600 dark:hover:text-green-600 group'>
                                                <UsersIcon /> <span className='mx-3'>Usuários</span> <span className='hidden group-hover:block'><RightIcon /></span>
                                            </Link>
                                            <div className='w-72 p-3 rounded-md flex items-center gap-1 text-gray-200 dark:text-gray-800'>
                                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                                                </svg>
                                                <span className='mx-3'>Cargos</span>
                                                <span className='hidden'>
                                                    <RightIcon />
                                                </span>
                                            </div>
                                        </div>
                                    }
                                </li>
                            }

                            {!!user?.modules.gos.read &&
                                <li>
                                    <Link href='service-orders' className={optionStyle(['/home/service-orders'])}>
                                        Ordens de Serviço
                                    </Link>
                                </li>
                            }

                            {!!user?.modules.gpv.read &&
                                <li>
                                    <Link href='flight-plans' className={optionStyle(['/home/flight-plans'])}>
                                        Planos de Voo
                                    </Link>
                                </li>
                            }

                            {!!user?.modules.ge.read &&
                                <li id="equipments" className='relative cursor-pointer' onClick={handleOpenMenu}>
                                    <span className={optionStyle(['/home/drones', '/home/batteries', '/home/equipments'])}>
                                        Equipamentos
                                    </span>
                                    {!!openMenu.equipments &&
                                        <div className='absolute top-15 shadow-lg rounded-md px-1 py-2 flex flex-col bg-white dark:bg-gray-900 dark:border dark:border-gray-800'>
                                            <Link href="drones" className='w-72 p-3 rounded-md flex items-center gap-1 cursor-pointer text-gray-600 dark:text-white hover:text-green-600 dark:hover:text-green-600 group'>
                                                <DroneIcon /> <span className='mx-3'>Drones</span> <span className='hidden group-hover:block'><RightIcon /></span>
                                            </Link>
                                            <Link href="batteries" className='w-72 p-3 rounded-md flex items-center gap-1 cursor-pointer text-gray-600 dark:text-white hover:text-green-600 dark:hover:text-green-600 group'>
                                                <BatteryIcon /> <span className='mx-3'>Baterias</span> <span className='hidden group-hover:block'><RightIcon /></span>
                                            </Link>
                                            <Link href="equipments" className='w-72 p-3 rounded-md flex items-center gap-1 cursor-pointer text-gray-600 dark:text-white hover:text-green-600 dark:hover:text-green-600 group'>
                                                <ToolIcon /> <span className='mx-3'>Equipamentos</span> <span className='hidden group-hover:block'><RightIcon /></span>
                                            </Link>
                                        </div>
                                    }
                                </li>
                            }

                            <li>
                                <Link href="my-profile" className={optionStyle(['/home/my-profile'])}>
                                    Minha Conta
                                </Link>
                            </li>

                            <li>
                                <div onClick={() => signOut()} className="inline-block cursor-pointer p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                                    Sair
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}