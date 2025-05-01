<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use App\Models\Destination;
use App\Models\Offer;
use App\Models\HeroSection;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index()
    {
        // Get authenticated admin user
        $admin = Auth::user();

        // Gather stats
        $stats = [
            'users' => User::count(),
            'deactivated_users' => User::where('is_active', 0)->count(), // Modified to use is_active
            'messages' => Contact::count(),
            'unread_messages' => Contact::where('is_read', false)->count(),
            'destinations' => Destination::count(),
            'offers' => Offer::count(),
            'hero_sections' => HeroSection::count(),
        ];

        // Get latest users (last 5)
        $latestUsers = User::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'email', 'created_at']);

        // Get latest messages (last 5)
        $latestMessages = Contact::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'email', 'message', 'is_read', 'created_at']);

        return Inertia::render('Admin/Dashboard', [
            'admin' => $admin,
            'stats' => $stats,
            'latest_users' => $latestUsers,
            'latest_messages' => $latestMessages,
        ]);
    }
}
