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
            'offers' => Offer::where('is_active', true)
                ->with(['destination', 'company'])
                ->get()
                ->map(function ($offer) {
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
                        'average_rating' => $offer->average_rating,
                        'is_active' => $offer->is_active ?? false,
                        'duration' => $offer->duration,
                        'group_size' => $offer->group_size,
                        'company' => $offer->company ? [
                            'id' => $offer->company->id,
                            'company_name' => $offer->company->company_name,
                        ] : null,
                        'destination' => $offer->destination ? [
                            'id' => $offer->destination->id,
                            'title' => $offer->destination->title,
                            'location' => $offer->destination->location,
                        ] : null,
                    ];
                }),
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function show($id)
    {
        $offer = Offer::with(['destination', 'company', 'reviews.user'])->find($id);

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
                'average_rating' => $offer->average_rating,
                'is_active' => $offer->is_active ?? false,
                'duration' => $offer->duration,
                'group_size' => $offer->group_size,
                'company' => $offer->company ? [
                    'id' => $offer->company->id,
                    'company_name' => $offer->company->company_name,
                ] : null,
                'destination' => $offer->destination ? [
                    'id' => $offer->destination->id,
                    'title' => $offer->destination->title,
                    'location' => $offer->destination->location,
                ] : null,
                'reviews' => $offer->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'user' => [
                            'id' => $review->user->id,
                            'name' => $review->user->name,
                        ],
                        'created_at' => $review->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
            ],
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
        ]);
    }
}
