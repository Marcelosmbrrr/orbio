import * as React from 'react';

interface IProps {
    register: any;
    errors: any;
    client: string;
    pilot: string;
    attendant: string;
}

export function ReportBasicData(props: IProps) {

    const register = props.register;
    const errors = props.errors;

    return (
        <>
            <div>
                <span className="text-md text-gray-800 dark:text-white">Preencha o formulário abaixo com as informações básicas do relatório.</span>
            </div>
            <div className="grid gap-4 my-5 grid-cols-1 md:grid-cols-2">
                <div>
                    <label htmlFor="name" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do documento</label>
                    <input type="text" id="name" {...register('name')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome do relatório" />
                    <span className='text-red-500 text-sm'>{errors.name?.message}</span>
                </div>
                <div>
                    <label htmlFor="client" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cliente</label>
                    <select {...register('client')} id="client" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="" disabled selected>Selecione uma opção</option>
                        {props.client.length != 0 && <option value={props.client}>{props.client}</option>}
                        <option value="não informado">Nao Informar</option>
                    </select>
                    <span className='text-red-500 text-sm'>{errors.client?.message}</span>
                </div>
                <div>
                    <label htmlFor="responsible" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Responsável</label>
                    <select {...register('responsible')} id="responsible" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="" disabled selected>Selecione uma opção</option>
                        <option value={props.attendant}>{props.attendant}</option>
                        <option value="não informado">Não Informar</option>
                    </select>
                    <span className='text-red-500 text-sm'>{errors.responsible?.message}</span>
                </div>
                <div>
                    <label htmlFor="state" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">UF</label>
                    <input readOnly type="text" id="state" {...register('state')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o estado" />
                    <span className='text-red-500 text-sm'>{errors.state?.message}</span>
                </div>
                <div>
                    <label htmlFor="city" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
                    <input readOnly type="text" id="city" {...register('city')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a cidade" />
                    <span className='text-red-500 text-sm'>{errors.city?.message}</span>
                </div>
                <div>
                    <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fazenda</label>
                    <input type="text" id="farm" {...register('farm')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome da fazenda" />
                    <span className='text-red-500 text-sm'>{errors.farm?.message}</span>
                </div>
                <div>
                    <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fornecedor do Produto</label>
                    <input type="text" id="provider" {...register('provider')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome do produto" />
                    <span className='text-red-500 text-sm'>{errors.provider?.message}</span>
                </div>
                <div>
                    <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Área total aplicada (ha)</label>
                    <input type="text" id="area" {...register('area')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a área total aplicada" />
                    <span className='text-red-500 text-sm'>{errors.area?.message}</span>
                </div>
                <div>
                    <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número da aplicação</label>
                    <input type="text" id="number" {...register('number')} readOnly className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o número da aplicação" />
                    <span className='text-red-500 text-sm'>{errors.number?.message}</span>
                </div>
                <div>
                    <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dosagem</label>
                    <input type="text" id="dosage" {...register('dosage')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a dosagem" />
                    <span className='text-red-500 text-sm'>{errors.dosage?.message}</span>
                </div>
                <div>
                    <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data da aplicação</label>
                    <input type="date" {...register('date')} id="last_charge" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                    <span className='text-red-500 text-sm'>{errors.date?.message}</span>
                </div>
            </div>
        </>
    )
}