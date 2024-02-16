<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use App\Models\Modules\PersonsRoles\Roles\Role;
use App\Models\Modules\PersonsRoles\Users\Profile;
use App\Models\Modules\PersonsRoles\Users\PasswordReset;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guard = 'admin';
    protected $guarded = [];

    function role()
    {
        return $this->belongsTo(Role::class);
    }

    function profile()
    {
        return $this->morphOne(Profile::class, "profilable");
    }

    function password_reset_token()
    {
        return $this->morphMany(PasswordReset::class, "resettable")->where("deleted_at", null);
    }

    // Acessors and mutators

    public function getFirstNameAttribute(): string
    {
        return explode(" ", $this->name)[0];
    }

    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Hash::make($value),
        );
    }
}
