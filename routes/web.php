<?php

use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\AdminAuth\AdminController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminAuth\DestinationController;
use App\Http\Controllers\AdminAuth\OfferController;
use App\Http\Controllers\AdminAuth\HeroSectionController;
use App\Http\Controllers\AdminAuth\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// ===================================================
//! Test Route (For Debugging)
// ===================================================








// ===================================================
//! Public Routes (No Authentication Required)
// ===================================================

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');

// ===================================================
//! Authentication Routes
// ===================================================

require __DIR__ . '/auth.php';

// ===================================================
//! Protected Routes (User Authenticated)
// ===================================================

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    Route::get('/home', fn() => Inertia::render('Home'))->name('home');
    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'deactivate'])->name('deactivate');
        Route::post('/reactivate', [ProfileController::class, 'reactivate'])->name('reactivate');
    });

    Route::prefix('chatbot')->name('chatbot.')->group(function () {
        Route::post('/message', [ChatBotController::class, 'processMessage'])->name('message');
        Route::get('/history', [ChatBotController::class, 'getHistory'])->name('history');
    });
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

Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

 // Dashboard
 Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    // Users Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('toggle-status');
    });
    Route::get('/messages', [AdminController::class, 'showContacts'])->name('messages');


    // Contact Messages
    Route::get('/contacts', [AdminController::class, 'showContacts'])->name('contacts');

    // Profile
    Route::get('/profile', [AdminController::class, 'getAdminProfile'])->name('profile');
    Route::post('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');

    
    // Destinations routes
    Route::get('/destinations', [DestinationController::class, 'index'])->name('admin.destinations');
    Route::delete('/destinations/{id}', [DestinationController::class, 'destroy'])->name('admin.destinations.delete');

    // Offers routes
    Route::get('/offers', [OfferController::class, 'index'])->name('admin.offers');
    Route::delete('/offers/{id}', [OfferController::class, 'destroy'])->name('admin.offers.delete');

    // Hero Sections routes
    Route::get('/hero', [HeroSectionController::class, 'index'])->name('admin.hero');
    Route::delete('/hero/{id}', [HeroSectionController::class, 'destroy'])->name('admin.hero.delete');
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