import * as React from 'react';
import { SearchIcon } from '../icons/SearchIcon';

interface IProps {
    setValue: Function;
}

export function ImageUpload(props: IProps) {

    const [image, setImage] = React.useState<string | null>(null);

    function onChange(e: any) {
        const uploaded_file = e.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            const imgURL = URL.createObjectURL(uploaded_file);
            setImage(imgURL);
            props.setValue('image', uploaded_file);
        }
    }

    return (
        <div>
            <div className='flex'>
                <label htmlFor="file_input" className="flex items-center text-gray-900 bg-white border cursor-pointer border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-70">
                    Procurar Imagem
                </label>
                <input id="file_input" type="file" onChange={onChange} className="hidden w-full" />
            </div>
            <div>
                {image &&
                    <div className="h-32 w-32 mt-3 rounded-lg p-0 bg-center bg-cover" style={{ backgroundImage: `url('${image}')` }}>
                    </div>
                }
            </div>
        </div>
    )
}