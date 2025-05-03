<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Package;
use App\Models\Deal;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display the booking page with all travel options
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get all destinations
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
                $destination->image = $destination->image ? asset('storage/destinations/' . basename($destination->image)) : null;
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

        // Get all packages
        $packages = Package::select([
            'id',
            'title',
            'description',
            'price',
            'discount_price',
            'image',
            'rating',
            'is_featured'
        ])
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($package) {
                $package->image = $package->image ? asset('storage/packages/' . basename($package->image)) : null;
                $package->name = $package->name ?? 'Unknown Package';
                $package->description = $package->description ?? '';
                $package->price = $package->price ?? 0;
                $package->discount_price = $package->discount_price ?? null;
                $package->rating = $package->rating ?? 0;
                return $package;
            });

        // Get all Offers
        $offers = Offer::select([
            'id',
            'title',
            'description',
            'price',
            'discount_price',
            'image',
        ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? asset('storage/offers/' . basename($offer->image)) : null;
                $offer->name = $offer->name ?? 'Unknown Offer';
                $offer->description = $offer->description ?? '';
                $offer->price = $offer->price ?? 0;
                $offer->discount_price = $offer->discount_price ?? null;
                return $offer;
            });
        

        return Inertia::render('Book/BookNow', [
            'destinations' => $destinations,
            'packages' => $packages,
            'offers' => $offers,
        ]);
    }

    /**
     * Process a booking request
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validate booking data
        $validatedData = $request->validate([
            'type' => 'required|string|in:destination,package,deal',
            'item_id' => 'required|integer',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'guests' => 'required|integer|min:1',
            'special_requests' => 'nullable|string|max:500',
        ]);

        // Get the appropriate model based on type
        switch ($validatedData['type']) {
            case 'destination':
                $model = Destination::class;
                break;
            case 'package':
                $model = Package::class;
                break;
            case 'offer':
                $model = Offer::class;
                break;
            default:
                throw new \InvalidArgumentException('Invalid booking type.');
        }

        // Find the selected item
        $item = $model::findOrFail($validatedData['item_id']);

        // Create the booking (assuming you have a Booking model)
        $booking = auth()->user()->bookings()->create([
            'bookable_type' => $model,
            'bookable_id' => $item->id,
            'start_date' => $validatedData['start_date'],
            'end_date' => $validatedData['end_date'],
            'guests' => $validatedData['guests'],
            'special_requests' => $validatedData['special_requests'] ?? null,
            'price' => $item->discount_price ?? $item->price,
            'status' => 'pending',
        ]);

        return redirect()->route('bookings.show', $booking->id)
            ->with('success', 'Your booking has been submitted successfully!');
    }
}
