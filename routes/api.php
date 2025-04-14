<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatBotController;


Route::post('/chatbot', [ChatBotController::class, 'chatbot']); 
