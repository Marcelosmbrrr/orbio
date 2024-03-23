import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';
import { Header } from '@/Components/shared/header/Header';
import { Sidebar } from '@/Components/shared/sidebar/Sidebar';
import { useAuthentication } from '@/Context/AuthenticationContext';
import { BackdropLoading } from '@/Components/shared/backdrop/BackdropLoading';

export function HomeLayout({ children }: PropsWithChildren) {

    const { isAuthenticated } = useAuthentication();

    // If verifying authentication...
    if (!isAuthenticated) {
        return (
            <BackdropLoading />
        )
    }

    if (isAuthenticated) {
        return (
            <div className='h-screen bg-white dark:bg-gray-800'>
                <Head title="Home" />
                <Header />
                <Sidebar />
                <div className="lg:ml-56 dark:bg-gray-800 px-5">
                    {children}
                </div>
            </div>
        )
    }

}