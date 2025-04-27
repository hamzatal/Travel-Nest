<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\WatchedMoviesController;
use App\Http\Controllers\SubscriptionController;


Route::post('/chatbot', [ChatBotController::class, 'chatbot']); // Updated to 'chatbot'

/*
|----------------------------------------------------------------------
| API Routes
|----------------------------------------------------------------------
*/

Route::get('movies/chatgpt-recommendations/{userId}', [MovieController::class, 'chatGptRecommendations']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Contacts Routes
Route::get('contacts', [ContactController::class, 'index']);
Route::get('contacts/{contact}', [ContactController::class, 'show']);
Route::post('contacts', [ContactController::class, 'store']);
Route::delete('contacts/{contact}', [ContactController::class, 'destroy']);


// Users Routes
Route::get('users', [UserController::class, 'index']);
Route::get('users/{user}', [UserController::class, 'show']);
Route::delete('users/{user}', [UserController::class, 'destroy']);

Route::get('/subscriptions/revenue', [SubscriptionController::class, 'getTotalRevenue']);
