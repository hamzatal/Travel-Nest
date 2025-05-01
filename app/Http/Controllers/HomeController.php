<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use App\Models\Offer;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $heroSections = HeroSection::select(['id', 'title', 'subtitle', 'image', 'cta_text'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($hero) {
                $hero->image = $hero->image ? asset('storage/hero_sections/' . basename($hero->image)) : null;
                return $hero;
            });

        $offers = Offer::select(['id', 'title', 'description', 'price', 'discount_price', 'discount_type', 'start_date', 'end_date', 'image'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? asset('storage/offers/' . basename($offer->image)) : null;
                return $offer;
            });

        return Inertia::render('Home', [
            'heroSections' => $heroSections,
            'offers' => $offers,
            'isDarkMode' => true,
        ]);
    }
}
