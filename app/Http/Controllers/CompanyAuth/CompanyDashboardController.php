<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\Offer;
use App\Models\Package;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CompanyDashboardController extends Controller
{
    public function index()
    {
        try {
            $company = Auth::guard('company')->user();

            $stats = [
                'destinations' => Destination::where('company_id', $company->id)->count(),
                'offers' => Offer::where('company_id', $company->id)->count(),
                'packages' => Package::where('company_id', $company->id)->count(),
                'bookings' => Booking::whereHas('destination', fn($q) => $q->where('company_id', $company->id))
                    ->orWhereHas('offer', fn($q) => $q->where('company_id', $company->id))
                    ->orWhereHas('package', fn($q) => $q->where('company_id', $company->id))
                    ->count(),
                'total_revenue' => Booking::whereHas('destination', fn($q) => $q->where('company_id', $company->id))
                    ->orWhereHas('offer', fn($q) => $q->where('company_id', $company->id))
                    ->orWhereHas('package', fn($q) => $q->where('company_id', $company->id))
                    ->where('status', 'confirmed')
                    ->sum('total_price'),
            ];

            $destinations = Destination::where('company_id', $company->id)
                ->get()
                ->map(function ($destination) {
                    return [
                        'id' => $destination->id,
                        'name' => $destination->name,
                        'location' => $destination->location,
                        'price' => $destination->price,
                        'image' => $destination->image ? Storage::url($destination->image) : null,
                        'is_featured' => $destination->is_featured,
                    ];
                });

            $offers = Offer::where('company_id', $company->id)
                ->get()
                ->map(function ($offer) {
                    return [
                        'id' => $offer->id,
                        'title' => $offer->title,
                        'price' => $offer->price,
                        'image' => $offer->image ? Storage::url($offer->image) : null,
                        'is_active' => $offer->is_active,
                    ];
                });

            $packages = Package::where('company_id', $company->id)
                ->get()
                ->map(function ($package) {
                    return [
                        'id' => $package->id,
                        'title' => $package->title,
                        'price' => $package->price,
                        'image' => $package->image ? Storage::url($package->image) : null,
                        'is_featured' => $package->is_featured,
                    ];
                });

            $bookings = Booking::whereHas('destination', fn($q) => $q->where('company_id', $company->id))
                ->orWhereHas('offer', fn($q) => $q->where('company_id', $company->id))
                ->orWhereHas('package', fn($q) => $q->where('company_id', $company->id))
                ->with(['user', 'destination', 'offer', 'package'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'user' => $booking->user ? ['id' => $booking->user->id, 'name' => $booking->user->name] : null,
                        'destination' => $booking->destination ? ['id' => $booking->destination->id, 'name' => $booking->destination->name] : null,
                        'offer' => $booking->offer ? ['id' => $booking->offer->id, 'title' => $booking->offer->title] : null,
                        'package' => $booking->package ? ['id' => $booking->package->id, 'title' => $booking->package->title] : null,
                        'status' => $booking->status,
                        'total_price' => $booking->total_price,
                        'created_at' => $booking->created_at,
                    ];
                });

            return Inertia::render('Company/Dashboard', [
                'company' => [
                    'id' => $company->id,
                    'company_name' => $company->company_name,
                    'email' => $company->email,
                    'avatar' => $company->avatar ? Storage::url($company->avatar) : null,
                ],
                'stats' => $stats,
                'destinations' => $destinations,
                'offers' => $offers,
                'packages' => $packages,
                'bookings' => $bookings,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load company dashboard:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load dashboard.');
        }
    }
}
