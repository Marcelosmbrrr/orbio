<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class ServiceOrderLogUploadController extends Controller
{
    function __invoke(Request $request)
    {
        Gate::authorize('gos:write');

        $payload = [];

        foreach ($request->data as $index => $log) {

            // Get file size - kb
            $file_size = filesize($log) / 1024;
            if ($file_size <= 1) {
                $payload[$index] = [
                    "processing" => [
                        "to_save" => true,
                        "pending" => false,
                        "ok" => false,
                        "message" => "O arquivo está corrompido ou vazio."
                    ],
                    "status" => false,
                    "filename" => null,
                    "timestamp" => filectime($log),
                    "coordinates" => null,
                    "city" => null,
                    "state" => null,
                    "contents" => null,
                    "image" => null
                ];
                continue;
            }

            $original_filename = $log->getClientOriginalName();
            // The kml filename must be [name].kml
            $kml_filename = preg_replace("/\.tlog\.kmz$/", ".kml", $original_filename);
            // Check if kml already exists
            $already_exists = Storage::disk('public')->exists("logs/" . $kml_filename) || Storage::disk('public')->exists("logs/" . $kml_filename);

            if ($already_exists) {
                $payload[$index] = [
                    "processing" => [
                        "to_save" => false,
                        "pending" => false,
                        "ok" => false,
                        "message" => "O arquivo já existe."
                    ],
                    "status" => false,
                    "filename" => $kml_filename,
                    "timestamp" => filectime($log),
                    "coordinates" => null,
                    "city" => null,
                    "state" => null,
                    "contents" => null,
                    "image" => null
                ];
                continue;
            }

            $payload[$index] = $this->processLog($log, $kml_filename);
        }

        return response($payload, 200);
    }

    private function processLog($log, $kml_filename)
    {
        try {
            $zip = new \ZipArchive;

            if (!$zip->open($log)) {
                throw new \Exception("");
            }

            // Loop folder and files 
            for ($i = 0; $i < $zip->numFiles; $i++) {
                // Get actual filename
                $file_fullpath = $zip->getNameIndex($i);
                // Catch KML file that exists inside
                if (preg_match('/\.kml$/i', $file_fullpath)) {
                    $log_content = $zip->getFromIndex($i);
                }
            }

            return $this->generateKML($log, $log_content, $kml_filename);
        } catch (\Exception $e) {
            return [
                "processing" => [
                    "to_save" => false,
                    "pending" => false,
                    "ok" => false,
                    "message" => "O arquivo está corrompido ou vazio."
                ],
                "status" => false,
                "filename" => $kml_filename,
                "timestamp" => filectime($log),
                "coordinates" => null,
                "city" => null,
                "state" => null,
                "contents" => null,
                "image" => null
            ];
        }
    }

    private function generateKML($log, $log_content, $kml_filename)
    {
        try {

            $kml_structure = simplexml_load_string($log_content);

            if (!$kml_structure || !isset($kml_structure->Document->Folder->Folder->Placemark)) {
                throw new \Exception("O arquivo está corrompido ou vazio.");
            }

            // Acessing .kml content object
            $kml_placemark = $kml_structure->Document->Folder->Folder->Placemark;
            $kml_coordinates = (string) $kml_placemark->LineString->coordinates;

            // Structuring processable content
            $kml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><kml/>', LIBXML_NOXMLDECL);
            $document = $kml->addChild('Document');
            $placemark = $document->addChild('Placemark');
            $placemark->addChild('name', $kml_placemark->name);
            $line = $placemark->addChild('LineString');
            $line->addChild('altitudeMode', 'absolute');
            $line->addChild('coordinates', substr($kml_coordinates, strpos($kml_coordinates, "\n") + 1)); // string coordinates without the first "\n"

            // Get coordinates data
            $home_coordinate =  "{$kml_structure->Document->LookAt->latitude},{$kml_structure->Document->LookAt->longitude}";
            $address = Http::get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" . $home_coordinate . "&key=" . env("GEOCODING_API_KEY"))["results"][0]["address_components"];
            $state = strlen($address[3]["short_name"]) === 2 ? $address[3]["short_name"] : $address[4]["short_name"];
            $city = $address[2]["long_name"];

            return [
                "processing" => [
                    "to_save" => true,
                    "pending" => false,
                    "ok" => true,
                    "message" => "Verificado com sucesso."
                ],
                "status" => true,
                "filename" => $kml_filename,
                "timestamp" => filectime($log),
                "coordinates" => $home_coordinate,
                "city" => $city,
                "state" => $state,
                "contents" => $kml->asXML(),
                "image" => null
            ];
        } catch (\Exception $e) {
            return [
                "processing" => [
                    "to_save" => false,
                    "pending" => false,
                    "ok" => false,
                    "message" => "O arquivo está corrompido ou vazio."
                ],
                "status" => false,
                "filename" => $kml_filename,
                "timestamp" => filectime($log),
                "coordinates" => null,
                "city" => null,
                "state" => null,
                "contents" => null,
                "image" => null
            ];
        }
    }
}
