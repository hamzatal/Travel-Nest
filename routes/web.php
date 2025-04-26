<?php

use App\Http\Controllers\UserAuth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\AdminAuth\AdminUserController;
use App\Http\Controllers\AdminAuth\AdminContactMessageController;
use App\Http\Controllers\AdminAuth\AdminHeroController;
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

// Deals Page Route
Route::get('/deal', [DealController::class, 'index'])->name('deal.index');

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

// Contact Us page route
Route::get('/contact-us', function () {
    return Inertia::render('ContactUs');
})->name('contact-us');

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
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    //! Admin User Management Routes
    // Admin Users List Route
    Route::get('/users', function () {
        return Inertia::render('Admin/Users');
    })->name('admin.users');

    // Admin User Management CRUD Routes
    Route::resource('users', AdminUserController::class, ['as' => 'admin']);

    // Admin User Toggle Status Route
    Route::put('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleUserStatus'])
        ->name('admin.users.toggleStatus');




    //! Admin Contact Messages Routes

    Route::get('/messages', function () {
        return Inertia::render('Admin/Messages');
    })->name('admin.messages');    //! Admin Messages Routes
    Route::get('/destinations', function () {
        return Inertia::render('Admin/Destinations');
    })->name('admin.destinations');

    //! Admin Offers Routes
    Route::get('/offers', function () {
        return Inertia::render('Admin/Offers');
    })->name('admin.offers');

    //! Admin Hero Section Routes
    Route::get('/hero', function () {
        return Inertia::render('Admin/HeroSections');
    })->name('admin.hero');
    //! Admin Home Route
    Route::get('/home', function () {
        return Inertia::render('Admin/Home');
    })->name('admin.home');

    //! Admin Logout Route
    Route::post('/admin/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('admin.logout');
});