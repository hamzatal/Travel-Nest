<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Favorite;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OfferController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $offers = Offer::where('is_active', true)
            ->with(['destination', 'company'])
            ->get()
            ->map(function ($offer) use ($user) {
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
                    'rating' => $offer->rating ?? 0.0,
                    'is_active' => $offer->is_active ?? false,
                    'duration' => $offer->duration,
                    'group_size' => $offer->group_size,
                    'created_at' => $offer->created_at->toIso8601String(),
                    'company' => $offer->company ? [
                        'id' => $offer->company->id,
                        'company_name' => $offer->company->company_name,
                    ] : null,
                    'destination' => $offer->destination ? [
                        'id' => $offer->destination->id,
                        'title' => $offer->destination->title,
                        'location' => $offer->destination->location,
                    ] : null,
                    'is_favorite' => $user
                        ? Favorite::where('user_id', $user->id)
                        ->where('offer_id', $offer->id)
                        ->exists()
                        : false,
                ];
            });

        return Inertia::render('Offers/Index', [
            'offers' => $offers,
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $offer = Offer::with(['destination', 'company'])->find($id);

        if (!$offer) {
            abort(404, 'Offer not found');
        }

        $offerData = [
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
            'rating' => $offer->rating ?? 0.0,
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
            
        
            'is_favorite' => $user
                ? Favorite::where('user_id', $user->id)
                ->where('offer_id', $offer->id)
                ->exists()
                : false,
        ];

        return Inertia::render('Offers/Show', [
            'offer' => $offerData,
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
            'isFavorite' => $offerData['is_favorite'],
            'message' => session('message'),
        ]);
    }

    public function favorite(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to add to favorites');
        }

        $offer = Offer::findOrFail($id);
        $favorite = Favorite::where('user_id', $user->id)
            ->where('offer_id', $offer->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $message = 'Offer removed from favorites';
            $isFavorite = false;
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'offer_id' => $offer->id,
            ]);
            $message = 'Offer added to favorites';
            $isFavorite = true;
        }

        return Inertia::render('Offers/Show', [
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
                'rating' => $offer->rating ?? 0.0,
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
               
                'is_favorite' => $isFavorite,
            ],
            'auth' => ['user' => $user],
            'flash' => ['success' => $message],
            'isFavorite' => $isFavorite,
            'message' => $message,
        ])->with('message', $message);
    }
}
