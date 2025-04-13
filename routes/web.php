<?php

use App\Http\Controllers\UserAuth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

//! Public Routes
// Home Page Route
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// About Page Route
Route::get('/about', [AboutController::class, 'index'])->name('about.index');

// Contact Page Routes
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Destinations Page Route
Route::get('/destinations', function () {
    return Inertia::render('Destinations', [
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
})->name('destinations');

// Packages Page Route
Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');

//! User Authentication Routes (Unauthenticated Users)
Route::prefix('user')->group(function () {
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
});

//! User Routes (Authenticated Users)
Route::prefix('user')->middleware(['auth'])->group(function () {
    // User Profile Route
    Route::get('/profile', function () {
        $user = Auth::user();

        if (!$user) {
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
            return Inertia::render('Auth/Login', [
                'status' => 'Your account has been deleted. Please register again.',
            ]);
        }

        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('User/Profile');
    })->name('user.profile');

    // User Logout Route
    Route::post('/logout', [LoginController::class, 'logout'])->name('user.logout');
});

//! Admin Routes (Authenticated Admins)
Route::prefix('admin')->middleware(['auth'])->group(function () {
    // Admin Dashboard Route
    Route::get('/dashboard', function () {
        $user = Auth::user();

        if (!$user) {
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
            return Inertia::render('Auth/Login', [
                'status' => 'Your account has been deleted. Please register again.',
            ]);
        }

        if (!$user->is_admin) {
            return redirect()->route('user.profile');
        }
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // Admin Logout Route
    Route::post('/logout', [LoginController::class, 'logout'])->name('admin.logout');
});