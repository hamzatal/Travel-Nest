<?php

use App\Http\Controllers\UserAuth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;

Route::prefix('user')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('user.login');

    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout'])->name('user.logout');

    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');

    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');
});

Route::prefix('user')->middleware(['auth'])->group(function () {
    Route::get('/profile', function () {
        $user = Auth::user();
        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('User/Profile');
    })->name('user.profile');
});
Route::get('/destinations', function () {
    return Inertia::render('Destinations', [
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
})->name('destinations');

Route::get('/about', [AboutController::class, 'index'])->name('about.index');

Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if (!$user->is_admin) {
            return redirect()->route('user.profile');
        }
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::post('/logout', [LoginController::class, 'logout'])->name('admin.logout');
});

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');