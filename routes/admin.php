<?php

use App\Http\Controllers\UserAuth\LoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

//! Admin Routes (Authenticated Admins)
Route::middleware(['auth'])->group(function () {
    // Admin Dashboard Route
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if (!$user->is_admin) {
            return redirect()->route('user.profile');
        }
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // Admin Logout Route
    Route::post('/logout', [LoginController::class, 'logout'])->name('admin.logout');
});