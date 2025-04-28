<?php

use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// ===================================================
//! Public Routes (No Authentication Required)
// ===================================================

// Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Static Pages
Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/contact-us', fn() => Inertia::render('contact-us'))->name('contact-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');

// ===================================================
//! Authentication Routes
// ===================================================

require __DIR__ . '/auth.php';

// ===================================================
//! Protected Routes (User Authenticated)
// ===================================================

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard
    Route::get('/home', fn() => Inertia::render('Home'))->name('home');

    // Profile Pages
    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');

    // Profile Management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'deactivate'])->name('deactivate');
        Route::post('/reactivate', [ProfileController::class, 'reactivate'])->name('reactivate');
    });

    // Preferences
    Route::get('/preferences', 'PreferenceController@edit')->name('preferences.edit');
    Route::patch('/preferences', 'PreferenceController@update')->name('preferences.update');
});

// ===================================================
//! ChatBot API (Authenticated)
// ===================================================

Route::middleware(['auth'])->prefix('chatbot')->name('chatbot.')->group(function () {
    Route::post('/message', [ChatBotController::class, 'processMessage'])->name('message');
    Route::get('/history', [ChatBotController::class, 'getHistory'])->name('history');
});

// ===================================================
//! Admin Authentication (Guest: Admin Only)
// ===================================================

Route::middleware('guest:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

// ===================================================
//! Admin Protected Routes (Authenticated: Admin)
// ===================================================

Route::middleware('auth:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    
    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('admin/Dashboard'))->name('dashboard');

    // Users Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', 'Admin\UserController@index')->name('index');
        Route::get('/{user}', 'Admin\UserController@show')->name('show');
        Route::put('/{user}', 'Admin\UserController@update')->name('update');
    });

    // Analytics
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', 'Admin\AnalyticsController@index')->name('index');
        Route::get('/users', 'Admin\AnalyticsController@users')->name('users');
        Route::get('/movies', 'Admin\AnalyticsController@movies')->name('movies');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', 'Admin\SettingController@index')->name('index');
        Route::post('/', 'Admin\SettingController@update')->name('update');
    });

    // Contact Messages
    Route::get('/contacts', [AdminController::class, 'showContacts'])->name('contacts');
});

// ===================================================
//! API Routes (Authenticated)
// ===================================================

Route::middleware(['auth', 'web'])->prefix('api')->name('api.')->group(function () {
    
    Route::get('/profile', [ProfileController::class, 'getProfile'])->name('profile.get');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/user', [UserController::class, 'getUser'])->name('user.get');
    Route::post('/update', [UserController::class, 'updateUser'])->name('user.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::put('/profile/deactivate', [ProfileController::class, 'deactivate'])->name('profile.deactivate');
});

// ===================================================
//! Fallback Route
// ===================================================

Route::fallback(fn() => Inertia::render('Errors/404'));
Route::get('/404', fn() => Inertia::render('Errors/404'))->name('404');

