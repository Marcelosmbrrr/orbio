<div>
    <div id="import-file-bar" class="h-screen py-3 overflow-y-auto bg-white border-l border-r w-60 dark:bg-gray-900 dark:border-gray-700 transition-all hidden">
        <div>
            <div class="flex items-center border-b-2 w-full px-3 py-3 transition-colors duration-200 gap-x-2">
                <svg class="h-5 w-5 mr-2 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M9 7V2.2a2 2 0 0 0-.5.4l-4 3.9a2 2 0 0 0-.3.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5h7.6l-.3.3a1 1 0 0 0 1.4 1.4l2-2c.4-.4.4-1 0-1.4l-2-2a1 1 0 0 0-1.4 1.4l.3.3H4V9h5a2 2 0 0 0 2-2Z" clip-rule="evenodd"/>
                </svg>
                <p class="text-md font-medium text-gray-700 capitalize dark:text-white">Importar Arquivo</p>
            </div>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <label class="text-left rtl:text-right cursor-pointer">
                    <span class="text-md font-medium text-gray-700 capitalize dark:text-white">Importar Texto</span>
                    <input type="file" id="file-import-txt" accept=".txt,.kml" hidden> 
                </label>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <label class="text-left rtl:text-right cursor-pointer">
                    <span class="text-md font-medium text-gray-700 capitalize dark:text-white">Importar Ponto</span>
                    <input type="file" id="file-import-kml" accept=".txt,.kml" hidden>
                </label>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <label class="text-left rtl:text-right cursor-pointer">
                    <span class="text-md font-medium text-gray-700 capitalize dark:text-white">Importar Poly</span>
                    <input type="file" id="file-import-poly" accept=".txt,.kml" hidden>
                </label>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <label class="text-left rtl:text-right cursor-pointer">
                    <span class="text-md font-medium text-gray-700 capitalize dark:text-white">Importar Rota</span>
                    <input type="file" id="file-import-path" accept=".txt,.kml" hidden> 
                </label>
            </button>
            <button class="flex items-center w-full px-3 py-3 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                <label class="text-left rtl:text-righ cursor-pointer">
                    <span class="text-md font-medium text-gray-700 capitalize dark:text-white">Importar MP</span>
                    <input type="file" id="file-import-mp" accept=".txt,.kml" hidden>
                </label>
            </button>
        </div>
    </div>
</div>