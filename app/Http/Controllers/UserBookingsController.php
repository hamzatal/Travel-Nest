<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Favorite;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserBookingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to view your bookings and favorites.');
        }

        $bookings = Booking::where('user_id', $user->id)
            ->with([
                'destination' => function ($query) {
                    $query->select([
                        'id',
                        'title',
                        'location',
                        'description',
                        'image',
                        'price',
                        'discount_price',
                        'category',
                        'rating',
                    ]);
                },
                'offer' => function ($query) {
                    $query->select([
                        'id',
                        'title',
                        'description',
                        'location',
                        'price',
                        'discount_price',
                        'discount_type',
                        'image',
                        'category',
                        'rating',
                        'end_date',
                    ]);
                },
                'package' => function ($query) {
                    $query->select([
                        'id',
                        'title',
                        'description',
                        'price',
                        'discount_price',
                        'image',
                        'category',
                    ]);
                },
            ])
            ->select([
                'id',
                'user_id',
                'destination_id',
                'offer_id',
                'package_id',
                'check_in',
                'check_out',
                'guests',
                'total_price',
                'status',
                'created_at',
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                if ($booking->destination) {
                    $booking->destination->image = $booking->destination->image
                        ? Storage::url($booking->destination->image)
                        : null;
                }
                if ($booking->offer) {
                    $booking->offer->image = $booking->offer->image
                        ? Storage::url($booking->offer->image)
                        : null;
                }
                if ($booking->package) {
                    $booking->package->image = $booking->package->image
                        ? Storage::url($booking->package->image)
                        : null;
                }
                return $booking;
            });

        $favorites = Favorite::where('user_id', $user->id)
            ->with([
                'destination' => function ($query) {
                    $query->select([
                        'id',
                        'title',
                        'location',
                        'description',
                        'image',
                        'price',
                        'discount_price',
                        'category',
                        'rating',
                    ]);
                },
                'package' => function ($query) {
                    $query->select([
                        'id',
                        'title',
                        'description',
                        'price',
                        'discount_price',
                        'image',
                        'category',
                    ]);
                },
                'offer' => function ($query) {
                    $query->select([
                        'id',
                        'title',
                        'description',
                        'location',
                        'price',
                        'discount_price',
                        'discount_type',
                        'image',
                        'category',
                        'rating',
                        'end_date',
                    ])->where('is_active', true);
                },
            ])
            ->select(['id', 'user_id', 'destination_id', 'package_id', 'offer_id', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($favorite) {
                if ($favorite->destination) {
                    $favorite->destination->image = $favorite->destination->image
                        ? Storage::url($favorite->destination->image)
                        : null;
                }
                if ($favorite->package) {
                    $favorite->package->image = $favorite->package->image
                        ? Storage::url($favorite->package->image)
                        : null;
                }
                if ($favorite->offer) {
                    $favorite->offer->image = $favorite->offer->image
                        ? Storage::url($favorite->offer->image)
                        : null;
                }
                return $favorite;
            });

        return Inertia::render('UserBookings', [
            'bookings' => $bookings,
            'favorites' => $favorites,
        ]);
    }
}
