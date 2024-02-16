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
	<div id="right-menu" class="mapboxgl-ctrl-group mapboxgl-ctrl right-menu show-marker">
		<button class="mapbox-gl-draw_ctrl-draw-btn marker" id="marker">
			<img class="text-center m-auto" src="https://cdn-icons-png.flaticon.com/512/447/447031.png" width="20px" height="20px">
		</button>
	</div>

	<!-- BOTTOM BAR -->
	<div id="bottom-bar" class="w-full h-18 flex justify-center fixed bottom-2 z-10">
		<div class="w-auto h-full p-5 bg-white rounded-lg">
			<span id="calculated-area" class="text-stone-800 font-medium">0 ha</span> -
			<span id="calculated-distance" class="text-stone-800 font-medium">0 Km</span> -
			<span id="calculated-time" class="text-stone-800 font-medium">0 s</span>
		</div>
	</div>

	<x-map-menu />
	<x-flight-plan-configuration />
	<x-flight-plan-confirmation />
	<x-map-instructions />
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></script>
	<script src="{{ asset('map/js/libs/cropper/cropper.js') }}"></script>
	<script src="{{ asset('map/js/index.js') }}"></script>
</body>

</html>