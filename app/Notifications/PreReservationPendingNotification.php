<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PreReservationPendingNotification extends Notification
{
    use Queueable;

    protected $reservationDetails;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($reservationDetails)
    {
        $this->reservationDetails = $reservationDetails;
    }


    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    //->line('The introduction to the notification.')
                    //->action('Notification Action', url('/'))
                    //->line('Thank you for using our application!');
            ->subject('Votre pré-réservation est en attente')
            ->greeting('Bonjour ' . $this->reservationDetails['nom'] . ' ' . $this->reservationDetails['prenom'])
            ->line('Vous avez effectué une pré-réservation pour l\'appartement suivant :')
            ->line('Ville : ' . $this->reservationDetails['nom_ville'])
            ->line('Résidence : ' . $this->reservationDetails['id_resid'])
            ->line('Date de début : ' . $this->reservationDetails['date_debut'])
            ->line('Date de fin : ' . $this->reservationDetails['date_fin'])
            ->line('Votre pré-réservation est en attente de validation par l\'administrateur.')
            ->line('Vous recevrez un autre email lorsque votre réservation sera confirmée.')
            ->salutation('Merci pour votre confiance.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
