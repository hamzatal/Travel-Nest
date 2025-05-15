<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use App\Models\Offer;
use App\Models\Destination;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        $heroSections = HeroSection::select(['id', 'title', 'subtitle', 'image'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($hero) {
                $hero->image = $hero->image ? Storage::url($hero->image) : null;
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

        $destinations = Destination::select([
            'id',
            'name',
            'location',
            'description',
            'image',
            'price',
            'discount_price',
            'tag',
            'rating',
            'is_featured'
        ])
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($destination) {
                $destination->image = $destination->image ? Storage::url($destination->image) : null;
                $destination->name = $destination->name ?? 'Unknown Destination';
                $destination->location = $destination->location ?? 'Unknown Location';
                $destination->description = $destination->description ?? '';
                $destination->price = $destination->price ?? 0;
                $destination->discount_price = $destination->discount_price ?? null;
                $destination->tag = $destination->tag ?? '';
                $destination->rating = $destination->rating ?? 0;
                $destination->is_featured = $destination->is_featured ?? false;
                return $destination;
            });

        return Inertia::render('Home', [
            'heroSections' => $heroSections,
            'offers' => $offers,
            'destinations' => $destinations,
        ]);
    }
}
