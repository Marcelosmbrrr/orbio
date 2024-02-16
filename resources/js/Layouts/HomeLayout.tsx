import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';
import { HeaderDesktop } from '@/Components/shared/header/HeaderDesktop';
import { HeaderMobile } from '@/Components/shared/header/HeaderMobile';
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
            <>
                <Head title="Home" />
                <div className='flex flex-col h-screen'>
                    <HeaderDesktop />
                    <HeaderMobile />
                    <main className="p-5 pt-12 grow bg-gray-100 dark:bg-gray-900">
                        {children}
                    </main>
                </div>
            </>
        )
    }


}