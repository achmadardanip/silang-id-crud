<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // Opsional: jika ingin email dikirim via antrian (queue)
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang; // Untuk terjemahan

// Hapus 'implements ShouldQueue' jika tidak menggunakan queue
class CustomResetPasswordNotification extends Notification // implements ShouldQueue
{
    use Queueable;

    /**
     * Token reset password.
     *
     * @var string
     */
    public $token;

    /**
     * Buat instance notifikasi baru.
     *
     * @param string $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Dapatkan channel pengiriman notifikasi.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail']; // Kirim via email
    }

    /**
     * Dapatkan representasi email dari notifikasi.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        // --- Bagian Penting: Membuat URL Frontend ---
        // Ambil base URL frontend dari file .env atau set default
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173'); // PASTIKAN FRONTEND_URL ada di .env!

        // Buat URL lengkap ke halaman reset password di React Anda
        $resetUrl = $frontendUrl . '/password-reset/' . $this->token . '?email=' . urlencode($notifiable->getEmailForPasswordReset());
        // Contoh hasil: http://localhost:5173/password-reset/TOKEN_NYA?email=user@example.com
        // ------------------------------------------

        // Buat pesan email
        return (new MailMessage)
            ->subject(Lang::get('Reset Password Notification')) // Judul Email
            ->line(Lang::get('You are receiving this email because we received a password reset request for your account.')) // Baris 1
            ->action(Lang::get('Reset Password'), $resetUrl) // Tombol/Link dengan URL Frontend
            ->line(Lang::get('This password reset link will expire in :count minutes.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60)])) // Baris 2 (Info Expire)
            ->line(Lang::get('If you did not request a password reset, no further action is required.')); // Baris 3
    }

    /**
     * Dapatkan representasi array dari notifikasi. (Bisa dikosongkan jika tidak perlu)
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