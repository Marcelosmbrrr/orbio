<?php

namespace App\Notifications\Administration;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TenantCreationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private string $password;

    public function __construct(string $password)
    {
        $this->password = $password;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('ORBIO - DADOS DE ACESSO')
            ->greeting("Bem vindo " . $notifiable->first_name . "!")
            ->line("Utilize os dados abaixo para acessar o sistema.")
            ->line("Email: " . $notifiable->email)
            ->line("Senha: " . $this->password);
    }
}
