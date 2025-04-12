<?php

namespace App\Http\Controllers\UserAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('user.login')->with('error', 'You must be logged in to access this page.');
        }

        if ($user->is_admin) {
            return redirect()->route('admin.profile.edit');
        }

        return Inertia::render('User/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
            'auth' => ['user' => $user],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('user.login')->with('error', 'You must be logged in to access this page.');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return redirect()->route('user.profile.edit')->with('status', 'profile-updated');
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('user.login')->with('error', 'You must be logged in to access this page.');
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}