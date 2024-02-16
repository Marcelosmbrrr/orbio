<?php

namespace App\Models\Modules\PersonsRoles\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    public $table = "contact";
    protected $guarded = [];
    public $timestamps = false;
}
