<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DealsController extends Controller
{
    public function index()
    {
        return Inertia::render('Offers/Deals', [
            'offers' => Offer::all()->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'title' => $offer->title,
                    'location' => $offer->location,
                    'price' => $offer->price,
                    'discount_price' => $offer->discount_price,
                    'discount_type' => $offer->discount_type,
                    'max_guests' => $offer->max_guests,
                    'start_date' => $offer->start_date,
                    'end_date' => $offer->end_date,
                    'image' => $offer->image ? asset('storage/offers/' . $offer->image) : null,
                    'description' => $offer->description,
                    'rating' => $offer->rating,
                    'is_featured' => $offer->is_featured,
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
                'title' => $offer->title,
                'location' => $offer->location,
                'price' => $offer->price,
                'discount_price' => $offer->discount_price,
                'discount_type' => $offer->discount_type,
                'max_guests' => $offer->max_guests,
                'start_date' => $offer->start_date,
                'end_date' => $offer->end_date,
                'image' => $offer->image ? asset('storage/offers/' . $offer->image) : null,
                'description' => $offer->description,
                'rating' => $offer->rating,
                'is_featured' => $offer->is_featured,
            ],
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

}
