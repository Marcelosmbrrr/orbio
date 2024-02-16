import * as React from 'react';

interface IProps {
    setSearch: React.Dispatch<React.SetStateAction<string>>
    placeholder: string;
}

export function SearchBar({ setSearch, placeholder }: IProps) {

    const [value, setValue] = React.useState('');

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            setSearch(value);
        }
    }

    return (
        <input value={value} onKeyDown={onKeyDown} onChange={onChange} type="search" placeholder={placeholder} className="block p-2.5 w-full z-20 text-sm focus:outline-none border border-gray-300 text-gray-900 bg-gray-50 rounded-lg dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
    )
}