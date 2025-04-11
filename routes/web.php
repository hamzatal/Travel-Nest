<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
})->name('welcome');

Route::get('/destinations', function () {
    return Inertia::render('Destinations', [
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
})->name('destinations');

Route::get('/about', function () {
    return Inertia::render('About', [
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact', [
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
})->name('contact');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard')->middleware('verified');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::fallback(function () {
    return Inertia::render('NotFound', [
        'auth' => Auth::check() ? ['user' => Auth::user()] : [],
    ]);
});

require __DIR__.'/auth.php';