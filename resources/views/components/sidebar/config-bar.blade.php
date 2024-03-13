<div>
    <div id="config-bar" class="h-screen py-3 overflow-y-auto bg-white border-l border-r w-60 dark:bg-gray-900 dark:border-gray-700 hidden">
        <div>
            <div class="flex items-center border-b-2 mb-2 w-full px-3 py-3 transition-colors duration-200 gap-x-2">
                <svg class="h-5 w-5 mr-2 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M9.6 2.6A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2l.5.3a2 2 0 0 1 2.9 0l1.4 1.3a2 2 0 0 1 0 2.9l.1.5h.1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2l-.3.5a2 2 0 0 1 0 2.9l-1.3 1.4a2 2 0 0 1-2.9 0l-.5.1v.1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2l-.5-.3a2 2 0 0 1-2.9 0l-1.4-1.3a2 2 0 0 1 0-2.9l-.1-.5H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2l.3-.5a2 2 0 0 1 0-2.9l1.3-1.4a2 2 0 0 1 2.9 0l.5-.1V4c0-.5.2-1 .6-1.4ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clip-rule="evenodd"/>
                </svg>
                <p class="text-md font-medium text-gray-700 capitalize dark:text-white">Configurações</p>
            </div>
            <div class="max-w-sm mx-auto">
                <p class="text-md mx-2 font-medium text-gray-700 capitalize dark:text-white">Plantação</p>
                <select id="countries" class="bg-white border border-gray-100 text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                    <option selected disabled>Selecionar Opção</option>
                    <option value="1">#01</option>
                    <option value="2">#02</option>
                    <option value="3">#03</option>
                </select>
            </div>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <div class="flex items-center text-left rtl:text-right">
                    <label id="label-grid" for="wp-grid" class="text-md mr-2 font-medium text-gray-700 capitalize dark:text-white">WP Grid</label>
                    <input type="checkbox" name="wp-grid" id="wp-grid"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
                </div>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <div class="flex items-center text-left rtl:text-right">
                    <label for="optimize" class="text-md mr-2 font-medium text-gray-700 capitalize dark:text-white">Otimizar</label>
                    <input type="checkbox" name="optimize" id="optimize"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
                        <input type="hidden" name="extra-distance" id="extra-distance" value="0">
                </div>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <div class="text-left rtl:text-right">
                    <label id="label-max-flight-time" for="max-flight-time" class="text-md font-medium text-gray-700 capitalize dark:text-white">Tempo: 15 min</label>
                    <input type="range" min="5" max="20" value="15" name="max-flight-time"
                            id="max-flight-time"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
                </div>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <div class="text-left rtl:text-right">
                    <label id="label-altitude" for="altitude" class="text-md font-medium text-gray-700 capitalize dark:text-white">Altitude: 10m</label>
                    <input id="altitude" name="altitude" type="range" min="10" max="50" value="10"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                </div>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <div class="text-left rtl:text-right">
                    <label id="label-speed" for="speed" class="text-md font-medium text-gray-700 capitalize dark:text-white">Velocidade: 8m/s</label>
                    <input id="speed" name="speed" type="range" min="1" max="15" value="8"
                    class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                </div>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <div class="text-left rtl:text-right">
                    <label id="label-distance" for="distance" class="text-md font-medium text-gray-700 capitalize dark:text-white">Distância: 50m</label>
                    <input id="distance" name="distance" type="range" min="1" max="100" value="50"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                </div>
            </button>
        </div>
    </div>
</div>