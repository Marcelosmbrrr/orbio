import { PropsWithChildren } from 'react';
import { useTheme } from '@/Context/ThemeContext';

export function GuestLayout({ children }: PropsWithChildren) {

    const { ThemeButton } = useTheme();

    return (
        <div className='bg-gray-50 dark:bg-gray-900'>
            <div className='absolute right-5 top-5'>
                {ThemeButton()}
            </div>
            {children}
        </div>
    )
}