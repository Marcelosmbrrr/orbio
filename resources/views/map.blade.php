<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel='shortcut icon' type='image/x-icon' href="{{ asset('map/images/favicon/favicon.ico') }}">
	<link rel="android-chrome" sizes="192x192" href="{{ asset('map/images/favicon/android-chrome-192x192.png') }}">
	<link rel="android-chrome" sizes="512x512" href="{{ asset('map/images/favicon/android-chrome-512x512.png') }}">
	<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('map/images/favicon/apple-touch-icon.png') }}">
	<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('map/images/favicon/favicon-32x32.png') }}">
	<link rel="icon" type="image/png" sizes="16x16" href="{{ asset('map/images/favicon/favicon-16x16.png') }}">
	<link rel="manifest" href="/site.webmanifest">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />

	<!--- STYLES --->
	<link href="{{ asset('map/css/index.css') }}" type="text/css" rel="stylesheet">
	<!-- MAPBOX-GL -->
	<script src="{{ asset('map/js/libs/mapbox/mapbox-gl.js') }}"></script>
	<link href="{{ asset('map/css/mapbox-gl.css') }}" type="text/css" rel='stylesheet' />
	<!-- TURF E MAPBOX-GL-DRAW -->
	<script src="{{ asset('map/js/libs/mapbox/turf.min.js') }}"></script>
	<script src="{{ asset('map/js/libs/mapbox/mapbox-gl-draw.js') }}"></script>
	<link href="{{ asset('map/css/mapbox-gl-draw.css') }}" type="text/css" rel="stylesheet">
	<!-- MAPBOX-GL-GEOCODER -->
	<script src="{{ asset('map/js/libs/mapbox/mapbox-gl-geocoder.min.js') }}"></script>
	<link href="{{ asset('map/css/mapbox-gl-geocoder.css') }}" type="text/css" rel="stylesheet">
	<!-- Promise polyfill script required to use Mapbox GL Geocoder in IE 11 -->
	<script src="{{ asset('map/js/libs/mapbox/es6-promise.min.js') }}"></script>
	<script src="{{ asset('map/js/libs/mapbox/es6-promise.auto.min.js') }}"></script>
	<!-- AXIOS -->
	<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
	<!-- FILESAVER -->
	<script src="{{ asset('map/js/libs/file_saver/src/FileSaver.js') }}"></script>
	<!-- HTML2CANVAS -->
	<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"></script>
	<!-- CROPPER -->
	<link href="{{ asset('map/css/cropper.css') }}" rel="stylesheet">

	<title>{{ env('APP_NAME'); }}</title>
</head>

<body>
	<div id='map'></div>

	<!-- MARKER MENU -->
	<div id="right-menu" class="flex justify-center bg-white p-1 rounded-md right-menu">
		<button id="marker">
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
				<path fill-rule="evenodd" d="M12 2a8 8 0 0 1 6.6 12.6l-.1.1-.6.7-5.1 6.2a1 1 0 0 1-1.6 0L6 15.3l-.3-.4-.2-.2v-.2A8 8 0 0 1 11.8 2Zm3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd"/>
			  </svg>
		</button>
	</div>

	<div id="alert" class="opacity-0 z-50 fixed flex items-center w-fit p-4 space-x-4 text-gray-500 bg-red-500 divide-x rtl:divide-x-reverse divide-gray-200 rounded-md shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" style="bottom: 5px;"  role="alert">
		<div id="alert-message" class="text-base leading-5 text-white bg-red-500 rounded-lg opacity-100 font-regular"><!-- message --></div>
	</div>

	<!-- BOTTOM BAR -->
	<div id="bottom-bar" class="w-full flex justify-center h-18 fixed bottom-0 z-10">
		<div class="w-80 text-center bg-white rounded-t-lg h-full p-5">
			<span id="calculated-area" class="text-stone-800 font-medium">0 ha</span> -
			<span id="calculated-distance" class="text-stone-800 font-medium">0 Km</span> -
			<span id="calculated-time" class="text-stone-800 font-medium">0 s</span>
		</div>
	</div>

	<x-sidebar.sidebar />
	<x-sidebar.help-bar />
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js"></script>
	<script src="{{ asset('map/js/libs/cropper/cropper.js') }}"></script>
	<script src="{{ asset('map/js/index.js') }}"></script>
</body>

</html>