import * as React from 'react';

interface IProps {
    situation: { name: string, key: string, description: string };
    observation: string;
}

export const ServiceOrderSituation = React.memo((props: IProps) => {

    const situation_name = React.useMemo(() => {
        if (props.situation.key === 'created') {
            return 'Aguardando aprovação'
        } else if (props.situation.key === 'approved') {
            return 'Aprovado'
        } else if (props.situation.key === 'finished') {
            return 'Finalizado'
        } else if (props.situation.key === 'canceled') {
            return 'Cancelado'
        }
    }, []);

    return (
        <>
            <h3 className="text-lg font-bold text-gray-600 dark:text-white mb-1">Situação</h3>
            <p className='mb-2'>Nome: {situation_name}</p>
            <p className='mb-2'>Descrição: {props.situation.description}</p>
            <div>
                <textarea value={props.observation ?? "Nenhuma observação"} readOnly rows={4} className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
            </div>
        </>
    )

});