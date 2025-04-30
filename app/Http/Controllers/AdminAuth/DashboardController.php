<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Message;
use App\Models\Destination;
use App\Models\Offer;
use App\Models\HeroSection;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('Admin/Dashboard', [
            'admin' => auth()->user(),
            'stats' => [
                'users' => User::count(),
                'messages' => Message::count(),
                'unread_messages' => Message::where('is_read', false)->count(),
                'destinations' => Destination::count(),
                'offers' => Offer::count(),
                'hero_sections' => HeroSection::count(),
            ],
            'latest_users' => User::latest()->take(5)->get(),
            'latest_messages' => Message::latest()->take(5)->get(),
        ]);
    }
}
