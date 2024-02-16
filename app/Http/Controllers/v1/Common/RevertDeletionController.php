<?php

namespace App\Http\Controllers\v1\Common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RevertDeletionController extends Controller
{
    public function __invoke(Request $request, string $table)
    {
        DB::table($table)->whereIn('id', $request->ids)->update([
            'deleted_at' => null
        ]);
        
        return response(["message" => "Registro recuperado com sucesso!"], 200);
    }
}
