<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule; // Import Rule for unique validation on update

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Optional: Add pagination
        // return User::paginate(15);
        return User::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         // More robust validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8', // No confirmation needed here if frontend handles it
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated(); // Get validated data

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        return response()->json($user, 201); // Return created user with 201 status
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user) // Route model binding automatically finds the user
    {
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
         // More robust validation
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255', // 'sometimes' means validate only if present
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id), // Ignore current user's email
            ],
             // Optional: Handle password update separately
            'password' => 'sometimes|nullable|string|min:8', // Allow empty password to not change it
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        // Only update password if it's provided and not empty
        if (!empty($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']); // Don't update password if it's empty/not provided
        }

        $user->update($validatedData);

        return response()->json($user); // Return updated user
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Optional: Add authorization check (e.g., admin cannot delete themselves)
        // if (Auth::id() === $user->id) {
        //     return response()->json(['message' => 'You cannot delete your own account.'], 403);
        // }

        $user->delete();

        // Return no content status on successful deletion
        return response()->noContent(); // 204 status
    }
}