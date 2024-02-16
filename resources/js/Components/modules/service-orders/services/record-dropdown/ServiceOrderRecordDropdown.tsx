import * as React from 'react';
// Custom
import { MapIcon } from '@/Components/shared/icons/MapIcon';
import { ErrorIcon } from '@/Components/shared/icons/ErrorIcon';
import { LogIcon } from '@/Components/shared/icons/LogIcon';
import { ToolIcon } from '@/Components/shared/icons/ToolIcon';
import { UsersIcon } from '@/Components/shared/icons/UsersIcon';
import { ReportIcon } from '@/Components/shared/icons/ReportIcon';
import { ServiceOrderUsers } from './tabs/ServiceOrderUsers';
import { ServiceOrderFlightPlans } from './tabs/ServiceOrderFlightPlans';
import { ServiceOrderLogs } from './tabs/ServiceOrderLogs';
import { ServiceOrderIncidents } from './tabs/ServiceOrderIncidents';
import { ServiceOrderEquipments } from './tabs/ServiceOrderEquipments';
import { ServiceOrderReports } from './tabs/ServiceOrderReports';
import { ServiceOrderSituation } from './tabs/ServiceOrderSituation';

interface IProps {
    order: {
        id: string;
        number: string;
        situation: { name: string, key: string, description: string };
        canceled: boolean;
        observation: string;
        users: { pilot: any, client: any };
        equipments: { drones: Array<any>, batteries: Array<any>, equipments: Array<any> };
        logs: Array<any>;
        incidents: Array<any>;
        reports: Array<any>;
        flight_plans: Array<any>;
        allowed_actions: {
            manage_status: boolean,
            manage_logs: boolean,
            manage_reports: boolean,
            manage_incidents: boolean
        },
        created_at: string;
        updated_at: string;
    },
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}
type Item = "situation" | "users" | "flight-plans" | "logs" | "incidents" | "equipments" | "reports" | "checklist";

export function ServiceOrderRecordDropdown(props: IProps) {

    const [item, setItem] = React.useState<Item>("situation");

    function renderItemContent() {

        if (item === "situation") {
            return <ServiceOrderSituation situation={props.order.situation} observation={props.order.observation} />
        } else if (item === "users") {
            return <ServiceOrderUsers id={props.order.id} pilot={props.order.users.pilot} client={props.order.users.client} setReload={props.setReload} />
        } else if (item === "flight-plans") {
            return <ServiceOrderFlightPlans id={props.order.id} flight_plans={props.order.flight_plans} setReload={props.setReload} />
        } else if (item === "logs") {
            return <ServiceOrderLogs id={props.order.id} can_manage_logs={props.order.allowed_actions.manage_logs} logs={props.order.logs} setReload={props.setReload} />
        } else if (item === "incidents") {
            return <ServiceOrderIncidents id={props.order.id} can_manage_incidents={props.order.allowed_actions.manage_incidents} incidents={props.order.incidents} setReload={props.setReload} />
        } else if (item === "equipments") {
            return <ServiceOrderEquipments id={props.order.id} drones={props.order.equipments.drones} batteries={props.order.equipments.batteries} equipments={props.order.equipments.equipments} setReload={props.setReload} />
        } else if (item === "reports") {
            return <ServiceOrderReports id={props.order.id} can_manage_reports={props.order.allowed_actions.manage_reports} reports={props.order.reports} setReload={props.setReload} />
        }

    }

    function openStyle(actual_item: string) {
        if (actual_item === item) {
            return "inline-flex items-center px-4 py-3 text-white bg-green-600 rounded-md active w-full dark:bg-green-600";
        } else {
            return "inline-flex items-center px-4 py-3 text-gray-400 dark:text-gray-600 bg-white rounded-md w-full dark:bg-gray-800";
        }
    }

    return (
        <div className="p-1 bg-white dark:bg-gray-800">
            <ul className="p-1 mb-2 flex gap-x-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                <li>
                    <button onClick={() => setItem("situation")} className={openStyle("situation")}>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 7V2.13a2.98 2.98 0 0 0-1.293.749L4.879 5.707A2.98 2.98 0 0 0 4.13 7H9Z" />
                            <path d="M18.066 2H11v5a2 2 0 0 1-2 2H4v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 20 20V4a1.97 1.97 0 0 0-1.934-2ZM10 18a1 1 0 1 1-2 0v-2a1 1 0 1 1 2 0v2Zm3 0a1 1 0 0 1-2 0v-6a1 1 0 1 1 2 0v6Zm3 0a1 1 0 0 1-2 0v-4a1 1 0 1 1 2 0v4Z" />
                        </svg>
                        <span className='ml-2'>Situação</span>
                    </button>
                </li>
                <li>
                    <button onClick={() => setItem("users")} className={openStyle("users")}>
                        <UsersIcon />
                        <span className='ml-2'>Pessoas</span>
                    </button>
                </li>
                <li>
                    <button onClick={() => setItem("flight-plans")} className={openStyle("flight-plans")}>
                        <MapIcon />
                        <span className='ml-2'>Planos de Voo</span>
                    </button>
                </li>
                <li>
                    <button onClick={() => setItem("equipments")} className={openStyle("equipments")}>
                        <ToolIcon />
                        <span className='ml-2'>Equipamentos</span>
                    </button>
                </li>
                <li>
                    <button onClick={() => setItem("logs")} className={openStyle("logs")}>
                        <LogIcon />
                        <span className='ml-2'>Logs</span>
                    </button>
                </li>
                <li>
                    <button onClick={() => setItem("incidents")} className={openStyle("incidents")}>
                        <ErrorIcon />
                        <span className='ml-2'>Incidentes</span>
                    </button>
                </li>
                <li>
                    <button onClick={() => setItem("reports")} className={openStyle("reports")}>
                        <ReportIcon />
                        <span className='ml-2'>Relatórios</span>
                    </button>
                </li>
            </ul>
            <div className="h-96 py-1 px-3 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-900 w-full overflow-y-scroll">
                {renderItemContent()}
            </div>
        </div>
    )
}