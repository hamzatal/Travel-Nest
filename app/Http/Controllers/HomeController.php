<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Show the home page with hero sections.
     */
    public function index()
    {
        // Fetch hero sections
        $heroSections = HeroSection::select(['id', 'title', 'subtitle', 'image', 'cta_text', 'is_active'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($hero) {
                // Use only the filename from the stored path
                $hero->image = $hero->image ? asset('storage/hero_sections/' . basename($hero->image)) : null;
                return $hero;
            });

        return Inertia::render('Home', [
            'heroSections' => $heroSections,
        ]);
    }
}
