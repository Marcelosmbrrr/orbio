<?php

namespace App\Listeners\Authentication;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Tenant;

class AccountActivationListener
{
    public function handle(object $event): void
    {
        if (getAuth()->name === "web") {
            $user = User::find(getAuth()->user()->id);
        } else if (getAuth()->name === "tenant") {
            $user = Tenant::find(getAuth()->user()->id);
        }

        $user->update([
            "status" => true
        ]);

        $user->profile->address()->create();
        $user->profile->document()->create();
        $user->profile->contact()->create();
    }
}
