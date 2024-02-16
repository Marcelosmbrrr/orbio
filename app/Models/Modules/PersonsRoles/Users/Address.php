<?php

namespace App\Models\Modules\PersonsRoles\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    public $table = "address";
    protected $guarded = [];
    public $timestamps = false;
}
