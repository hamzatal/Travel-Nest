<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OfferController extends Controller
{
    public function index()
    {
        return Inertia::render('Offers/Deals', [
            'offers' => Offer::where('is_active', true)->get()->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'title' => $offer->title ?? 'Unknown Offer',
                    'location' => $offer->location ?? 'Unknown Location',
                    'category' => $offer->category ?? '',
                    'price' => $offer->price ?? 0,
                    'discount_price' => $offer->discount_price ?? null,
                    'discount_type' => $offer->discount_type ?? '',
                    'start_date' => $offer->start_date ? $offer->start_date->format('Y-m-d') : null,
                    'end_date' => $offer->end_date ? $offer->end_date->format('Y-m-d') : null,
                    'image' => $offer->image ? Storage::url($offer->image) : null,
                    'description' => $offer->description ?? '',
                    'rating' => $offer->rating ?? 0,
                    'is_active' => $offer->is_active ?? false,
                ];
            }),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function show($id)
    {
        $offer = Offer::find($id);

        if (!$offer) {
            abort(404, 'Offer not found');
        }

        return Inertia::render('Offers/OfferDetails', [
            'offer' => [
                'id' => $offer->id,
                'title' => $offer->title ?? 'Unknown Offer',
                'location' => $offer->location ?? 'Unknown Location',
                'category' => $offer->category ?? '',
                'price' => $offer->price ?? 0,
                'discount_price' => $offer->discount_price ?? null,
                'discount_type' => $offer->discount_type ?? '',
                'start_date' => $offer->start_date ? $offer->start_date->format('Y-m-d') : null,
                'end_date' => $offer->end_date ? $offer->end_date->format('Y-m-d') : null,
                'image' => $offer->image ? Storage::url($offer->image) : null,
                'description' => $offer->description ?? '',
                'rating' => $offer->rating ?? 0,
                'is_active' => $offer->is_active ?? false,
            ],
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
        ]);
    }
}
