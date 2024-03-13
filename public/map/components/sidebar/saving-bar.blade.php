<div>
    <div id="saving-bar" class="max-w-xl p-3 h-screen overflow-y-auto bg-white border-l border-r dark:bg-gray-900 dark:border-gray-700 hidden">
        <div class="mb-3">
            <img id="cropper-image" class="h-auto" src="" alt="flight plan image">
        </div>
        <div class="flex flex-col gap-2">
            <div>
                <label for="name-confirmation" class="block text-sm font-semibold leading-6 text-gray-900">Nome</label>
                <div class="mt-2.5">
                    <input type="text" name="name-confirmation" id="name-confirmation" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6" placeholder="Informe o nome">
                </div>
            </div>
            <div>
                <label for="speed-confirmation" class="block text-sm font-semibold leading-6 text-gray-900">Velocidade (m/s)</label>
                <div class="mt-2.5">
                    <input type="text" name="speed-confirmation" id="speed-confirmation" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6" disabled>
                </div>
            </div>
            <div>
                <label for="distance-confirmation" class="block text-sm font-semibold leading-6 text-gray-900">Distância (m)</label>
                <div class="mt-2.5">
                    <input type="text" name="distance-confirmation" id="distance-confirmation" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6" disabled>
                </div>
            </div>
            <div>
                <label for="altitude-confirmation" class="block text-sm font-semibold leading-6 text-gray-900">Altitude (m)</label>
                <div class="mt-2.5">
                    <input type="text" name="altitude-confirmation" id="altitude-confirmation" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6" disabled>
                </div>
            </div>
            <div>
                <label for="time-confirmation" class="block text-sm font-semibold leading-6 text-gray-900">Tempo (min)</label>
                <div class="mt-2.5">
                    <input type="text" name="time-confirmation" id="time-confirmation" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6" disabled>
                </div>
            </div>
            <div class="text-right">
                <button type="button" id="btn-close-saving-bar" class="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-green-800">Cancelar</button>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onclick="saveFlightPlan()">Salvar</button>
            </div>
        </div>
    </div>
</div>