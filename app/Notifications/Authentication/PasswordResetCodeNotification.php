<?php

namespace App\Notifications\Authentication;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetCodeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('ORBIO - CÓDIGO')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Recebemos uma requisição para alteração da sua senha. Para realizar a operação utilize o código abaixo.")
            ->line("Código: " . $notifiable->password_reset_token[0]->token)
            ->line('Se não foi você quem requisitou o procedimento, ignore.');
    }
}
