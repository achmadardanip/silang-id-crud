<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <-- Make sure this is present and used
use App\Notifications\CustomResetPasswordNotification; // <<-- TAMBAHKAN USE STATEMENT INI

class User extends Authenticatable // Optional: implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable; // <-- Use HasApiTokens

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Kirim notifikasi reset password kustom.
     * Override method bawaan Laravel.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token) // <<-- TAMBAHKAN METHOD INI
    {
        $this->notify(new CustomResetPasswordNotification($token));
    }
}