<?php

namespace App\Http\Controllers\UserAuth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Dashboard', [
            'user' => \Illuminate\Support\Facades\Auth::user(),
        ]);
    }
}