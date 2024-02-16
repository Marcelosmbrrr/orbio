<!-- VERIFY BEFORE SAVE -->
<div id="configuration-modal" class="pt-5 pl-5 relative z-10 h-screen transition-all hidden">

    <!-- Modal content -->
    <div class="rounded-lg shadow bg-white max-w-sm">

        <!-- Modal header -->
        <div class="flex items-start justify-between p-2 rounded-t border-gray-100 border-b">
            <h3 id="confirmation-modal-title" class="text-xl font-semibold text-gray-900">
               Configurações
            </h3>
        </div>
        
        <!-- Modal body -->
        <div class="p-2">
            <form name="config">
                <div>
                    <select id="locations"
                        class="w-full mt-2 border text-gray-700 text-sm rounded-lg p-2.5 focus:outline-none focus:shadow-outline hover:border-gray-300 cursor-pointer">
                        <option selected disabled>Selecione uma plantação</option>
                        <option value="1">#01</option>
                        <option value="2">#02</option>
                        <option value="3">#03</option>
                    </select>
                </div>
                <div>
                    <div class="px-2 py-2">
                        <input type="checkbox" name="wp-grid" id="wp-grid"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
                        <label for="wp-grid" id="label-grid" class="text-gray-900">WP Grid</label>
                    </div>
                    <div class="px-2 py-2">
                        <input type="checkbox" name="optimize" id="optimize"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
                        <input type="hidden" name="extra-distance" id="extra-distance" value="0">
                        <label for="optimize" id="label-optimize" class="text-gray-900">Otimizar</label>
                    </div>
                </div>
                <div>
                    <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                        <label for="max-flight-time" id="label-max-flight-time"
                            class="block mb-2 text-sm font-medium text-gray-900">Tempo:
                            15min</label>
                        <input type="range" min="5" max="20" value="15" name="max-flight-time"
                            id="max-flight-time"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
                    </div>
                    <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                        <label for="altitude" id="label-altitude"
                            class="block mb-2 text-sm font-medium text-gray-900">Altitude: 10m</label>
                        <input id="altitude" name="altitude" type="range" min="10" max="50" value="10"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                    </div>
                    <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                        <label for="speed" id="label-speed"
                            class="block mb-2 text-sm font-medium text-gray-900">Velocidade: 8m/s</label>
                        <input id="speed" name="speed" type="range" min="1" max="15" value="8"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                    </div>
                    <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                        <label for="distance" id="label-distance"
                            class="block mb-2 text-sm font-medium text-gray-900">Distância:
                            50m</label>
                        <input id="distance" name="distance" type="range" min="1" max="100" value="50"
                            class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                    </div>
                </div>
            </form>
        </div>

        <!-- Modal footer -->
        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <button type="submit"id="btn-save-configuration-modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                Salvar
            </button>
        </div>

    </div>


</div>