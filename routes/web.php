<?php

use App\Http\Controllers\AdminAuth\ProfileController as AdminProfileController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

//! ==================== MAIN PUBLIC ROUTES ====================
// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

//! ==================== STATIC CONTENT PAGES ====================
Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/contact-us', fn() => Inertia::render('contact-us'))->name('contact-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');

//! ==================== PAYMENT AND SUBSCRIPTION ROUTES ====================
Route::get('/PaymentSuccess', fn() => Inertia::render('PaymentSuccess'))->name('PaymentSuccess');
Route::get('/SubscriptionPage', fn() => Inertia::render('SubscriptionPage'))->name('SubscriptionPage');
Route::post('/process-payment', 'PaymentController@processPayment')->name('process.payment');
Route::get('/payment-callback', 'PaymentController@handleCallback')->name('payment.callback');

//! ==================== INCLUDE AUTHENTICATION ROUTES ====================
require __DIR__ . '/auth.php';

//! ==================== AUTHENTICATED USER ROUTES ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/home', fn() => Inertia::render('Home'))->name('home');

    // Profile
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
        Route::delete('/profile', [ProfileController::class, 'deactivate'])->name('profile.deactivate');
        Route::post('/profile/reactivate', [ProfileController::class, 'reactivate'])->name('profile.reactivate');
    });
    
    // Profile Page
    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');

    // Watchlist
    Route::get('/Packages', fn() => Inertia::render('Packages'))->name('Packages');
   
    // Preferences
    Route::get('/preferences', 'PreferenceController@edit')->name('preferences.edit');
    Route::patch('/preferences', 'PreferenceController@update')->name('preferences.update');

   
});

//! ==================== CHATBOT API ====================
Route::middleware(['auth'])->group(function() {
    Route::post('/chatbot/message', [ChatBotController::class, 'processMessage'])->name('chatbot.message');
    Route::get('/chatbot/history', [ChatBotController::class, 'getHistory'])->name('chatbot.history');
});

//! ==================== ADMIN AUTHENTICATION ROUTES ====================
Route::middleware('guest:admin')->group(function () {
    
    Route::get('admin/login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('admin/login', [LoginController::class, 'store']);
});

//! ==================== ADMIN PROTECTED ROUTES ====================
Route::middleware('auth:admin')->group(function () {
    Route::post('admin/logout', [LoginController::class, 'destroy'])->name('admin.logout');
    Route::get('admin/dashboard', fn() => Inertia::render('admin/Dashboard'))->name('admin.dashboard');

    Route::get('/admin/movies', 'Admin\MovieController@index')->name('admin.movies');
    Route::get('/admin/categories', 'Admin\CategoryController@index')->name('admin.categories');
    Route::get('/admin/users', 'Admin\UserController@index')->name('admin.users');
    Route::get('/admin/users/{user}', 'Admin\UserController@show')->name('admin.users.show');
    Route::put('/admin/users/{user}', 'Admin\UserController@update')->name('admin.users.update');

    Route::get('/admin/analytics', 'Admin\AnalyticsController@index')->name('admin.analytics');
    Route::get('/admin/analytics/users', 'Admin\AnalyticsController@users')->name('admin.analytics.users');
    Route::get('/admin/analytics/movies', 'Admin\AnalyticsController@movies')->name('admin.analytics.movies');

    Route::get('/admin/settings', 'Admin\SettingController@index')->name('admin.settings');
    Route::post('/admin/settings', 'Admin\SettingController@update')->name('admin.settings.update');

    Route::get('/admin/contacts', [AdminController::class, 'showContacts'])->name('admin.contacts');
});

//! ==================== FALLBACK ROUTE ====================
Route::fallback(fn() => Inertia::render('Errors/404'));
Route::get('/404', fn() => Inertia::render('Errors/404'))->name('404');
