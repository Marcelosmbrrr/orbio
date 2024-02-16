<?php

namespace App\Models\Modules\PersonsRoles\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Modules\PersonsRoles\Users\User;

class PasswordReset extends Model
{
    use HasFactory, SoftDeletes;

    public $table = "password_reset_tokens";
    protected $guarded = [];
    const UPDATED_AT = null;

    function user()
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }
}
