<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            // Simpan email sebagai lowercase
            'email' => strtolower($request->email),
            'password' => $request->password, // Otomatis hash via Model Mutator/Casts
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    /**
     * Authenticate user and return API token.
     */
    public function login(Request $request)
    {
        // *** PERBAIKAN 1: Tambahkan konversi lowercase ***
        if ($request->has('email')) {
            $request->merge(['email' => strtolower($request->input('email'))]);
        }

        // Validasi input (sekarang pakai email lowercase)
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Coba autentikasi (pakai email lowercase)
        if (!Auth::attempt($request->only('email', 'password'))) {
             throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        // *** PERBAIKAN 2: Hapus/Comment session regenerate untuk API Token ***
        // $request->session()->regenerate();

        // Dapatkan user yang baru saja login
        $user = Auth::user(); // Lebih aman pakai Auth::user() setelah attempt

        // Buat API token baru
        $token = $user->createToken($request->input('device_name', 'api_token_' . $user->id))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Log the user out (invalidate the token).
     */
    public function logout(Request $request)
    {
        if ($request->user()) { // Pastikan ada user terotentikasi
             $request->user()->currentAccessToken()->delete();
             return response()->json(['message' => 'Logged out successfully']);
        }
        return response()->json(['message' => 'No authenticated user'], 401); // Atau response lain
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(Request $request)
    {
        // *** PERBAIKAN: Tambahkan konversi lowercase ***
        if ($request->has('email')) {
             $request->merge(['email' => strtolower($request->input('email'))]);
        }

        // Validasi (pakai email lowercase)
        $request->validate(['email' => 'required|email|exists:users,email']);

        // Kirim link reset (pakai email lowercase)
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['message' => __($status)], 400);
    }

    /**
     * Reset the user's password.
     */
    public function resetPassword(Request $request)
    {
         // *** PERBAIKAN: Tambahkan konversi lowercase ***
         if ($request->has('email')) {
              $request->merge(['email' => strtolower($request->input('email'))]);
         }

         // Validasi (pakai email lowercase)
         $validator = Validator::make($request->all(), [
             'token' => 'required',
             'email' => 'required|email',
             'password' => 'required|string|min:8|confirmed',
         ]);

         if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
         }

         // Proses reset (pakai email lowercase)
         $status = Password::reset(
             $request->only('email', 'password', 'password_confirmation', 'token'),
             function (User $user, string $password) {
                 $user->forceFill([
                     'password' => Hash::make($password),
                     'remember_token' => Str::random(60),
                 ])->save();
                 event(new PasswordReset($user));
             }
         );

         return $status === Password::PASSWORD_RESET
             ? response()->json(['message' => __($status)], 200)
             : response()->json(['message' => __($status)], 400);
    }

     /**
      * Get the authenticated User details.
      */
     public function user(Request $request)
     {
         return response()->json($request->user());
     }
}