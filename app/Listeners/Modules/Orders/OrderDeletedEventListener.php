<?php

namespace App\Listeners\Modules\Orders;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Events
use App\Events\Modules\Orders\OrderUpdatedEvent;
// Custom Mail
use App\Mail\Order\OrderUpdatedMail;

class OrderDeletedEventListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        Mail::to()->cc([])->send(new OrderDeletedMail());
    }
}
