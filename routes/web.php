<?php

// ===================================================
//! Admin Authentication
// ===================================================

use App\Http\Controllers\AdminAuth\AdminController;
use App\Http\Controllers\AdminAuth\DashboardController;
use App\Http\Controllers\AdminAuth\HeroSectionController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\AdminAuth\OfferController;
use App\Http\Controllers\AdminAuth\PackagesController;

// ===================================================
//! User Authentication
// ===================================================

use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\DealsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ===================================================
//! Public Routes (No Authentication Required)
// ===================================================

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'destinations' => app(DestinationController::class)->featured(),
    ]);
})->name('welcome');

Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');

//? Destinations Routes
Route::get('/destinations', [DestinationController::class, 'allDestinations'])->name('destinations.index');
Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');

//? Packages Routes
Route::get('/packages', [PackagesController::class, 'indexPublic'])->name('packages.index');
Route::get('/packages/{package}', [PackagesController::class, 'show'])->name('packages.show');

//? Booking Routes
Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');
Route::get('/booking/{id}', [BookingController::class, 'show'])->name('booking.show');
// ===================================================
//! Authentication Routes
// ===================================================

require __DIR__ . '/auth.php';

// ===================================================
//! Protected Routes (User Authenticated)
// ===================================================

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');

    //? Deals Routes
    Route::get('/deals', [DealsController::class, 'index'])->name('deals');
    Route::get('/offer/{id}', [DealsController::class, 'show'])->name('offer.show');

    //? Search Route
    Route::get('/search', [SearchController::class, 'index'])->name('search');
    Route::get('/search/live', [SearchController::class, 'live'])->name('search.live');

    //? Profile Routes
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'deactivate'])->name('deactivate');
        Route::post('/reactivate', [ProfileController::class, 'reactivate'])->name('reactivate');
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
//! Admin Routes
// ===================================================

//? Admin Authentication (Guest: Admin Only)
Route::middleware('guest:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

//? Admin Protected Routes (Authenticated: Admin)
Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    //? Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //? Admin Profile
    Route::get('/profile', [AdminController::class, 'getAdminProfile'])->name('profile');
    Route::put('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');
    Route::post('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');

    //? Users Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('toggle-status');
    });

    //? Contact Messages
    Route::get('/messages', [AdminController::class, 'showContacts'])->name('messages');
    Route::get('/contacts', [AdminController::class, 'showContacts'])->name('contacts');
    Route::patch('/messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');

    //? Admin Destinations Routes
    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [DestinationController::class, 'index'])->name('manage');
        Route::post('/', [DestinationController::class, 'store'])->name('store');
        Route::put('/{id}', [DestinationController::class, 'update'])->name('update');
        Route::delete('/{id}', [DestinationController::class, 'destroy'])->name('destroy');
    });

    //? Offers Routes
    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [OfferController::class, 'index'])->name('index');
        Route::post('/', [OfferController::class, 'store'])->name('store');
        Route::put('/{id}', [OfferController::class, 'update'])->name('update');
        Route::delete('/{id}', [OfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/toggle', [OfferController::class, 'toggleActive'])->name('toggle');
    });

    //? Hero Sections Routes
    Route::prefix('hero')->name('hero.')->group(function () {
        Route::get('/', [HeroSectionController::class, 'index'])->name('index');
        Route::post('/', [HeroSectionController::class, 'store'])->name('store');
        Route::put('/{id}', [HeroSectionController::class, 'update'])->name('update');
        Route::patch('/{id}/toggle', [HeroSectionController::class, 'toggleActive'])->name('toggle');
        Route::delete('/{id}', [HeroSectionController::class, 'destroy'])->name('delete');
    });

    //? Packages Routes
    Route::get('/packages', [PackagesController::class, 'index'])->name('packages.index');
    Route::get('/packages/create', [PackagesController::class, 'create'])->name('packages.create');
    Route::post('/packages', [PackagesController::class, 'store'])->name('packages.store');
    Route::get('/packages/{package}/edit', [PackagesController::class, 'edit'])->name('packages.edit');
    Route::put('/packages/{package}', [PackagesController::class, 'update'])->name('packages.update');
    Route::delete('/packages/{package}', [PackagesController::class, 'destroy'])->name('packages.destroy');
});

// ===================================================
//! API Routes
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
