<?php

namespace App\Models\Modules\PersonsRoles\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Modules\PersonsRoles\Users\Address;
use App\Models\Modules\PersonsRoles\Users\Document;
use App\Models\Modules\PersonsRoles\Users\Contact;

class Profile extends Model
{
    use HasFactory;

    protected $guarded = [];

    function user()
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    function address()
    {
        return $this->hasOne(Address::class, "profile_id", "id");
    }

    function contact()
    {
        return $this->hasOne(Contact::class, "profile_id", "id");
    }

    function document()
    {
        return $this->hasOne(Document::class, "profile_id", "id");
    }
}
