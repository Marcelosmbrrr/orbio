<!-- VERIFY BEFORE SAVE -->
<div id="cropper-modal" class="relative z-10 h-screen transition-all backdrop-blur-md bg-white/30 hidden pt-5">

    <!-- Modal content -->
    <div class="relative rounded-lg shadow bg-white w-1/2 mx-auto">

        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 rounded-t border-gray-100 border-b">
            <h3 id="confirmation-modal-title" class="text-xl font-semibold text-gray-900">
                Salvar Plano de Voo
            </h3>
        </div>
        
        <!-- Modal body -->
        <div class="p-2">
            <div class="w-full mb-3 flex justify-center">
                <img id="cropper-image" class="h-auto max-w-full" src="" alt="flight plan image">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                    <label for="flight-speed" class="block text-sm font-semibold leading-6 text-gray-900">Velocidade (m/s)</label>
                    <div class="mt-2.5">
                        <input type="text" name="flight-speed" id="flight-speed" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
                    </div>
                </div>
                <div>
                    <label for="flight-distance" class="block text-sm font-semibold leading-6 text-gray-900">Distância (m)</label>
                    <div class="mt-2.5">
                        <input type="text" name="flight-distance" id="flight-distance" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
                    </div>
                </div>
                <div>
                    <label for="flight-altitude" class="block text-sm font-semibold leading-6 text-gray-900">Altitude (m)</label>
                    <div class="mt-2.5">
                        <input type="text" name="flight-altitude" id="flight-altitude" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
                    </div>
                </div>
                <div>
                    <label for="flight-time" class="block text-sm font-semibold leading-6 text-gray-900">Tempo (min)</label>
                    <div class="mt-2.5">
                        <input type="text" name="flight-time" id="flight-time" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal footer -->
        <div class="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dborder-gray-100 border-b">
            <button type="button" id="btn-close-cropper-modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">Cancelar</button>
            <button type="submit" id="btn-save-path" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                Salvar
            </button>
        </div>

        <!-- Alert -->
        <div id="modal-alert" class="flex items-center text-white text-sm font-bold px-4 py-3 rounded-b-lg" role="alert">
            <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
            </svg>
            <p id="alert-message"></p>
        </div>
    </div>


</div>