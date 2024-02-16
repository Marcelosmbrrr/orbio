import * as React from 'react';
import { InfoIcon } from '../icons/InfoIcon';

interface IProps {
    title: string;
    description: string;
    groups?: {
        name: string;
        description: string;
    }[];
    actions: {
        name: string;
        description: string;
    }[]
}

export function InfoBar(props: IProps) {

    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <>
            <button onClick={() => setOpen(!open)} type="button" className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 mr-1 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <InfoIcon />
            </button>
            {open &&
                <div className="fixed top-0 left-0 w-screen h-screen z-50 py-1 pl-1 bg-gray-950 bg-opacity-75">
                    <div className='w-64 h-full flex flex-col gap-2 rounded p-2 bg-white dark:bg-gray-900'>
                        <div onClick={() => setOpen(false)} className="w-full flex items-center gap-5 h-10 rounded-md cursor-pointer transition-all">
                            <div className="px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-stone-900 dark:text-white hover:text-green-600 dark:hover:text-green-600">
                                    <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm14.47 3.97a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06L18 10.81V21a.75.75 0 01-1.5 0V10.81l-2.47 2.47a.75.75 0 11-1.06-1.06l3.75-3.75zM2.25 9A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm0 4.5a.75.75 0 01.75-.75h5.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="py-1 border-y border-y-gray-200 dark:border-y-gray-800">
                                <span className="text-md font-semibold dark:text-white">{props.title}</span>
                            </div>
                            <div className='py-2 text-justify'>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{props.description}</span>
                            </div>
                        </div>
                        {props.groups &&
                            <div>
                                <div className="py-1 border-y border-y-gray-200 dark:border-y-gray-800">
                                    <span className="text-md font-bold text-left dark:text-white">Grupos</span>
                                </div>
                                {props.groups.map((item, index) =>
                                    <div className='text-justify py-1' key={index}>
                                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400"><b className='dark:text-white'>{item.name}</b>: {item.description}</span>
                                    </div>
                                )}
                            </div>
                        }
                        <div>
                            <div className="py-1 border-y border-y-gray-200 dark:border-y-gray-800">
                                <span className="text-md font-bold text-left dark:text-white">Ações</span>
                            </div>
                            {props.actions.map((item, index) =>
                                <div className='text-justify py-1' key={index}>
                                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400"><b className='dark:text-white'>{item.name}</b>: {item.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}