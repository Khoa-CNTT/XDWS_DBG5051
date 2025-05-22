<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $booking;
    public function __construct($booking)
    {
        $this->booking = $booking;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Xác nhận đặt bàn thành công!')
            ->greeting('Xin chào ' . $this->booking->customer_name)
            ->line('Đơn đặt bàn của bạn vào lúc ' . $this->booking->booking_time . ' ngày ' . $this->booking->booking_date . " đã được xác nhận.")
            ->line('Chúng tôi rất mong được đón tiếp bạn.')
            ->line('Cảm ơn bạn đã đặt bàn!')
            ->salutation('Trân trọng, ' . config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
