<?php

// ===================================================
//! Admin Authentication
// ===================================================

use App\Http\Controllers\AdminAuth\AdminController;
use App\Http\Controllers\AdminAuth\DashboardController;
use App\Http\Controllers\AdminAuth\HeroSectionController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\AdminAuth\OfferController as AdminOfferController;
use App\Http\Controllers\AdminAuth\PackagesController;

// ===================================================
//! User Authentication
// ===================================================

use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserBookingsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ===================================================
//! Company Authentication
// ===================================================

use App\Http\Controllers\CompanyAuth\CompanyController;
use App\Http\Controllers\CompanyAuth\CompanyDashboardController;
use App\Http\Controllers\CompanyAuth\CompanyDestinationController;
use App\Http\Controllers\CompanyAuth\CompanyOfferController;
use App\Http\Controllers\CompanyAuth\CompanyPackageController;

// ===================================================
//! Authentication Routes (Keep Public)
// ===================================================

require __DIR__ . '/auth.php';

// ===================================================
//! Public Routes (Not Authenticated)
// ===================================================

Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// ===================================================
//! Protected Routes - Home page accessible to both users and companies
// ===================================================

Route::middleware(['auth:web,company', 'verified'])->group(function () {
    // Home page accessible to both regular users and companies
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    // Public routes that both user types can access
    Route::get('/destinations', [DestinationController::class, 'allDestinations'])->name('destinations.index');
    Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');
    Route::get('/packages', [PackagesController::class, 'indexPublic'])->name('packages.index');
    Route::get('/packages/{package}', [PackagesController::class, 'show'])->name('packages.show');
    Route::get('/offers', [OfferController::class, 'index'])->name('offers');
    Route::get('/offers/{offer}', [OfferController::class, 'show'])->name('offers.show');
});

// ===================================================
//! Protected Routes - User Only
// ===================================================

Route::middleware(['auth:web', 'verified', 'active'])->group(function () {
    // Routes only for regular users
    Route::get('/UserBookings', [UserBookingsController::class, 'index'])->name('bookings.index');
    Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');
    Route::get('/booking/{id}', [BookingController::class, 'show'])->name('booking.show');
    Route::get('/book', [BookingController::class, 'create'])->name('book.create');
    Route::post('/book', [BookingController::class, 'store'])->name('book.store');
    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');
    Route::get('/search', [SearchController::class, 'index'])->name('search');
    Route::get('/search/live', [SearchController::class, 'live'])->name('search.live');

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'deactivate'])->name('deactivate');
        Route::post('/reactivate', [ProfileController::class, 'reactivate'])->name('reactivate');
    });
});

// ===================================================
//! ChatBot API (Authenticated Users Only)
// ===================================================

Route::middleware(['auth:web'])->prefix('chatbot')->name('chatbot.')->group(function () {
    Route::post('/message', [ChatBotController::class, 'processMessage'])->name('message');
    Route::get('/history', [ChatBotController::class, 'getHistory'])->name('history');
});

// ===================================================
//! Admin Routes
// ===================================================

Route::get('/admin/login', [LoginController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [LoginController::class, 'store'])->name('admin.login.submit');

Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [AdminController::class, 'getAdminProfile'])->name('profile');
    Route::put('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');
    Route::post('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');
    Route::post('/profile/password', [AdminController::class, 'updateAdminPassword'])->name('profile.password');
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('toggle-status');
    });
    Route::get('/messages', [AdminController::class, 'showContacts'])->name('messages');
    Route::get('/contacts', [AdminController::class, 'showContacts'])->name('contacts');
    Route::patch('/messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');
    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [DestinationController::class, 'index'])->name('index');
        Route::post('/', [DestinationController::class, 'store'])->name('store');
        Route::put('/{destination}', [DestinationController::class, 'update'])->name('update');
        Route::delete('/{destination}', [DestinationController::class, 'destroy'])->name('destroy');
        Route::patch('/{destination}/toggle-featured', [DestinationController::class, 'toggleFeatured'])->name('toggle-featured');
    });
    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [AdminOfferController::class, 'index'])->name('index');
        Route::post('/', [AdminOfferController::class, 'store'])->name('store');
        Route::put('/{id}', [AdminOfferController::class, 'update'])->name('update');
        Route::delete('/{id}', [AdminOfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/toggle', [AdminOfferController::class, 'toggleActive'])->name('toggle');
    });
    Route::prefix('hero')->name('hero.')->group(function () {
        Route::get('/', [HeroSectionController::class, 'index'])->name('index');
        Route::post('/', [HeroSectionController::class, 'store'])->name('store');
        Route::put('/{id}', [HeroSectionController::class, 'update'])->name('update');
        Route::patch('/{id}/toggle', [HeroSectionController::class, 'toggleActive'])->name('toggle');
        Route::delete('/{id}', [HeroSectionController::class, 'destroy'])->name('delete');
    });
    Route::prefix('packages')->name('packages.')->group(function () {
        Route::get('/', [PackagesController::class, 'index'])->name('index');
        Route::post('/', [PackagesController::class, 'store'])->name('store');
        Route::put('/{package}', [PackagesController::class, 'update'])->name('update');
        Route::patch('/{package}/toggle-featured', [PackagesController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::delete('/{package}', [PackagesController::class, 'destroy'])->name('destroy');
    });
});

// ===================================================
//! Company Routes
// ===================================================

Route::middleware(['auth:company'])->prefix('company')->name('company.')->group(function () {
    Route::get('/dashboard', [CompanyDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [CompanyController::class, 'profile'])->name('profile');
    Route::put('/profile', [CompanyController::class, 'updateProfile'])->name('profile');
    Route::put('/profile/password', [CompanyController::class, 'updatePassword'])->name('profile.password');
    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [CompanyDestinationController::class, 'index'])->name('index');
        Route::post('/', [CompanyDestinationController::class, 'store'])->name('store');
        Route::put('/{destination}', [CompanyDestinationController::class, 'update'])->name('update');
        Route::delete('/{destination}', [CompanyDestinationController::class, 'destroy'])->name('destroy');
        Route::patch('/{destination}/toggle-featured', [CompanyDestinationController::class, 'toggleFeatured'])->name('toggle-featured');
    });
    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [CompanyOfferController::class, 'index'])->name('index');
        Route::post('/', [CompanyOfferController::class, 'store'])->name('store');
        Route::put('/{id}', [CompanyOfferController::class, 'update'])->name('update');
        Route::delete('/{id}', [CompanyOfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/toggle', [CompanyOfferController::class, 'toggleActive'])->name('toggle');
    });
});

Route::post('/company/login', [CompanyController::class, 'login'])->name('company.login');
Route::post('/company/logout', [CompanyController::class, 'logout'])->name('company.logout');

// ===================================================
//! API Routes (Users Only)
// ===================================================

Route::middleware(['auth:web', 'web'])->prefix('api')->name('api.')->group(function () {
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
