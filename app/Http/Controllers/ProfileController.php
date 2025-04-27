<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\PasswordUpdateRequest;
use App\Http\Requests\DeactivateAccountRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return inertia('Profile/UserProfile', [
            'user' => $request->user(),
            'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->getMessages() : [],
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Log incoming request data for debugging
        Log::info('Profile update request:', [
            'files' => $request->hasFile('avatar') ? $request->file('avatar')->getClientOriginalName() : 'No file',
            'data' => $request->except('avatar'),
        ]);

        // Update the user's profile data
        $validated = $request->validated();
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'bio' => $validated['bio'],
            'phone' => $validated['phone'],
        ]);

        // Handle email verification if the email is changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
            if ($user instanceof MustVerifyEmail) {
                $user->sendEmailVerificationNotification();
            }
        }

        // Handle avatar upload
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            Log::info('Avatar file detected:', [
                'name' => $request->file('avatar')->getClientOriginalName(),
                'size' => $request->file('avatar')->getSize(),
                'mime' => $request->file('avatar')->getMimeType(),
            ]);

            // Delete the old avatar if it exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
                Log::info('Deleted old avatar:', ['path' => $user->avatar]);
            }

            // Store the new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
            Log::info('New avatar stored:', ['path' => $avatarPath]);
        } else {
            Log::info('No valid avatar file uploaded.');
        }

        // Save the updated user data
        $user->save();
        Log::info('User updated:', [
            'id' => $user->id,
            'avatar' => $user->avatar,
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $user->bio,
            'phone' => $user->phone,
        ]);

        return Redirect::route('UserProfile')->with('status', 'Profile updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => Hash::make($request->validated()['password']),
        ]);

        return Redirect::route('UserProfile')->with('status', 'Password updated successfully.');
    }

    /**
     * Deactivate the user's account.
     */
    public function deactivate(DeactivateAccountRequest $request): RedirectResponse
    {
        Log::info('Deactivate account request:', $request->all());

        $user = $request->user();
        
        if ($request->validated()['deactivation_reason']) {
            $user->deactivation_reason = $request->validated()['deactivation_reason'];
        }
        
        $user->is_active = false;
        $user->deactivated_at = Carbon::now();
        $user->save();
        
        Log::info('Account deactivated:', ['user_id' => $user->id]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return Redirect::to('/about-us')->with('status', 'Your account has been deactivated.');
    }
}