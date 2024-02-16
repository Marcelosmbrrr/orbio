import * as React from 'react';

interface IProps {
    can_open: boolean;
    title: string;
    image_url?: string;
}

export function ShowImage(props: IProps) {

    const [open, setOpen] = React.useState(false);

    function onOpen() {
        setOpen(true);
    }

    function onClose() {
        setOpen(false);
    }

    if (!props.can_open) {
        return (
            <button type="button" className="text-gray-200 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-full text-sm p-2 text-center inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
            </button>
        )
    }

    return (
        <>
            <button onClick={onOpen} type="button" className="text-green-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-full text-sm p-2 text-center inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
            </button>

            {open &&
                <div className="relative z-50">

                    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"></div>

                    {/* Modal */}
                    <div className="fixed top-0 left-0 w-full h-screen z-50">
                        <div className="relative w-fit mx-auto mt-48">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 p-2">
                                <div className="flex justify-between items-center pb-2 rounded-t">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-2">
                                        {props.title}
                                    </h3>
                                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <div className="p-1">
                                    <img className="w-auto h-96 rounded-b-md" src={props.image_url} alt="image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}