import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';

// Context
import { AuthenticationProvider } from './Context/AuthenticationContext';
import { ThemeProvider } from './Context/ThemeContext';
import { SnackbarProvider } from 'notistack';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Orbio';

createInertiaApp({
    title: (title) => `${appName} - ${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AuthenticationProvider>
                <ThemeProvider>
                    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
                        <App {...props} />
                    </SnackbarProvider>
                </ThemeProvider>
            </AuthenticationProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
