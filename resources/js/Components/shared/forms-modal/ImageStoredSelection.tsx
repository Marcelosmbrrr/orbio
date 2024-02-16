import * as React from 'react';
// Custom
import { api } from '@/Services/api';

interface IProps {
    source: string;
    title: string;
}

export function ImageStoredSelection(props: IProps) {

    const [open, setOpen] = React.useState(false);
    const [images, setImages] = React.useState<number[]>([1, 2]);
    const [selectedImage, setSelectedImage] = React.useState<number>(0);
    const [pending, setPending] = React.useState(true);

    function onOpen() {
        setOpen(true);
        setImages([]);
        setSelectedImage(0);
        fetchImages();
    }

    function onClose() {
        setOpen(false);
    }

    async function fetchImages() {
        try {
            //const response = await api.get("/api/v1/actions/images");
            //const data = await response.json();
            //setImages(data);
        } catch (e: any) {
            console.error(e, e.stack);
        } finally {
            setPending(false);
        }
    }

    function onSelectedImage(image_index: number) {
        setSelectedImage(image_index);
    }

    function imageClassName(image_index: number) {
        if (selectedImage != image_index) {
            return "h-auto max-w-full rounded-lg cursor-pointer opacity-50";
        } else {
            return "h-auto max-w-full rounded-lg cursor-pointer";
        }
    }

    return (
        <>
            <button disabled onClick={onOpen} type="button" className="flex text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-70">
                Lista de Imagens
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
                                        Seleção de Imagem
                                    </h3>
                                </div>
                                <div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-72 overflow-y-scroll">
                                        {!pending && [1, 2].map((image, index) =>
                                            <div>
                                                <img onClick={() => onSelectedImage(index)} className={imageClassName(index)} src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" alt="" />
                                            </div>
                                        )}
                                        {pending && <span>Carregando ...</span>}
                                    </div>
                                    <div className="flex justify-end gap-1 mt-5">
                                        <button onClick={onClose} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Cancelar
                                        </button>
                                        <button onClick={onClose} className="focus:outline-none text-white bg-green-800 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}