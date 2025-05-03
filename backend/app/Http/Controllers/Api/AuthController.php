<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
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
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Optional: Log the user in immediately after registration
        // Auth::login($user);
        // $token = $request->user()->createToken('auth_token')->plainTextToken;
        // return response()->json(['token' => $token, 'user' => $user], 201);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            // Optional: 'device_name' => 'required', // Helps identify the token
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
             throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        //$request->session()->regenerate(); // Important for session-based SPA auth

        // --- Token-Based Approach ---
        $user = $request->user();
        // Revoke previous tokens if desired
        // $user->tokens()->delete();
        $token = $user->createToken($request->input('device_name', 'default_device_name'))->plainTextToken; // Use device name from request or default

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
        // --- End Token-Based ---

        // --- Cookie-Based SPA Approach (Simpler if frontend/backend on same top-level domain) ---
        // No token needs to be returned explicitly, Sanctum handles session cookie
        // return response()->json(['user' => $request->user()]);
        // --- End Cookie-Based ---
    }

    public function logout(Request $request)
    {
        // --- Token-Based Approach ---
        // Revoke the token that was used to authenticate the current request...
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
        // --- End Token-Based ---

        // --- Cookie-Based SPA Approach ---
        // Auth::guard('web')->logout();
        // $request->session()->invalidate();
        // $request->session()->regenerateToken();
        // return response()->json(['message' => 'Logged out successfully']);
        // --- End Cookie-Based ---
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['message' => __($status)], 400); // Or use 422 for validation-like error
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

         if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60), // Invalidate remember tokens
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['message' => __($status)], 400);
    }

     // Optional: Get Authenticated User
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}