<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Hero;
use App\Models\Destination;
use App\Models\Offer;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Display the home page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get active hero sections
        $heroSections = Hero::where('is_active', true)
            ->latest()
            ->get();
        
        // Get featured destinations
        $featuredDestinations = Destination::where('is_featured', true)
            ->latest()
            ->take(6)
            ->get();
        
        // Get active offers
        $activeOffers = Offer::where('is_active', true)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->latest()
            ->take(4)
            ->get();
        
        return Inertia::render('Home', [
            'auth' => Auth::check() ? ['user' => Auth::user()] : [],
            'heroSections' => $heroSections,
            'featuredDestinations' => $featuredDestinations,
            'activeOffers' => $activeOffers,
        ]);
    }
}