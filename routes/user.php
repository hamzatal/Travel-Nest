<?php

use App\Http\Controllers\UserAuth\LoginController;
use App\Http\Controllers\UserAuth\ProfileController;
use App\Http\Controllers\UserAuth\UserDashboardController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('/dashboard', [UserDashboardController::class, 'index'])
        ->name('user.dashboard')
        ->middleware('verified');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('user.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('user.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('user.profile.destroy');
});