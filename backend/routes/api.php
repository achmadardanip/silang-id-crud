<?php

// ... use statements ...
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest')->name('password.email'); // Nama sudah ada, bagus.

// V V V Tambahkan .name(...) di baris ini V V V
Route::post('/reset-password', [AuthController::class, 'resetPassword'])
      ->middleware('guest')
      ->name('password.reset'); // <<-- TAMBAHKAN BAGIAN INI

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::apiResource('users', UserController::class);
});