import * as React from 'react';

interface IProps {
    label: string;
    field: string;
    controllable: boolean;
    active: boolean;
    setOrderBy: Function;
}

export function FieldOrder({ label, field, setOrderBy, controllable, active }: IProps) {

    const [order, setOrder] = React.useState<"asc" | "desc">("asc");

    function renderIcon() {

        let arrow_up_style = 'text-gray-100 dark:text-gray-700';
        let arrow_down_style = 'text-gray-100 dark:text-gray-700';

        if (controllable && active) {
            if (order === "asc") {
                arrow_up_style = 'text-green-800 dark:text-white';
            } else {
                arrow_down_style = 'text-green-800 dark:text-white';
            }
        }

        return (
            <div className='flex text-stone-900 dark:text-white'>
                <div className={arrow_up_style}>
                    <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
                    </svg>
                </div>
                <div className={arrow_down_style}>
                    <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v12m0 0 4-4m-4 4L1 9" />
                    </svg>
                </div>
            </div>
        )
    }

    function onChangeOrder() {
        setOrder(order === "asc" ? "desc" : "asc");
        setOrderBy({ field, order });
    }

    return (
        <div onClick={onChangeOrder} className='flex items-center gap-1 cursor-pointer'>
            <div>{label}</div>
            {renderIcon()}
        </div>
    )

}