<?php

use App\Http\Controllers\UserAuth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

//! User Authentication Routes (Unauthenticated Users)
// Login Routes
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('user.login');

Route::post('/login', [LoginController::class, 'login']);

// Register Routes
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::post('/register', [RegisteredUserController::class, 'store'])->name('user.register');

// Password Reset Routes
Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
    ->name('password.request');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->name('password.email');

//! User Routes (Authenticated Users)
Route::middleware(['auth'])->group(function () {
    // User Profile Route
    Route::get('/profile', function () {
        $user = Auth::user();
        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('User/Profile');
    })->name('user.profile');

    // User Logout Route
    Route::post('/logout', [LoginController::class, 'logout'])->name('user.logout');
});