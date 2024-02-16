import * as React from 'react';
// Custom
import { HomeLayout } from '@/Layouts/HomeLayout';
import { ProfileData } from '@/Components/modules/profile/ProfileData';
import { ProfilePassword } from '@/Components/modules/profile/ProfilePassword';

type ITab = "data" | "change-password";

export default function UserProfile() {

    const [tab, setTab] = React.useState<ITab>("data");

    const actualTabComponent = React.useMemo(() => {
        if (tab === "data") {
            return <ProfileData />
        }
        return <ProfilePassword />
    }, [tab]);

    function onChangeTab(e: any) {
        setTab(e.currentTarget.id);
    }

    function tabElement(tab_id: string) {

        let data = { title: "", icon: "", className: { text: "", icon: "" } }

        if (tab_id === "data") {
            data.title = "Meus Dados";
        } else if (tab_id === "change-password") {
            data.title = "Alterar Senha";
        }

        if (tab === tab_id) {
            data.className.text = "inline-flex items-center justify-center p-4 text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 group";
            data.className.icon = "text-green-600 dark:text-green-500"
        } else {
            data.className.text = "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group";
            data.className.icon = "text-gray-400 dark:text-gray-500"
        }

        return (
            <p className={data.className.text}>
                {data.title}
            </p>
        )
    }

    return (
        <HomeLayout>
            <div className="p-3 mx-auto w-full h-auto xl:w-1/2">
                <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        <li id="data" onClick={onChangeTab} className="cursor-pointer">
                            {tabElement("data")}
                        </li>
                        <li id="change-password" onClick={onChangeTab} className="mr-2 cursor-pointer">
                            {tabElement("change-password")}
                        </li>
                    </ul>
                </div>
                {actualTabComponent}
            </div>
        </HomeLayout>
    )
}