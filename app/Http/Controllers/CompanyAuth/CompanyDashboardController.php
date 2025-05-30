<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Checkout;
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

            if (!$company) {
                return redirect()->route('company.login')->with('error', 'Please log in to access the dashboard.');
            }

            $stats = [
                'destinations' => Destination::where('company_id', $company->id)->count(),
                'offers' => Offer::where('company_id', $company->id)->count(),
                'packages' => Package::where('company_id', $company->id)->count(),
                'checkouts' => Checkout::where(function ($query) use ($company) {
                    $query->whereHas('destination', fn($q) => $q->where('company_id', $company->id))
                        ->orWhereHas('offer', fn($q) => $q->where('company_id', $company->id))
                        ->orWhereHas('package', fn($q) => $q->where('company_id', $company->id));
                })->count(),
                'total_revenue' => Checkout::where('status', 'confirmed')
                    ->where(function ($query) use ($company) {
                        $query->whereHas('destination', fn($q) => $q->where('company_id', $company->id))
                            ->orWhereHas('offer', fn($q) => $q->where('company_id', $company->id))
                            ->orWhereHas('package', fn($q) => $q->where('company_id', $company->id));
                    })
                    ->sum('total_price'),
            ];

            // Fetching destinations with 'title' as 'name' for frontend consistency
            $destinations = Destination::where('company_id', $company->id)
                ->paginate(10)
                ->through(function ($destination) {
                    return [
                        'id' => $destination->id,
                        'name' => $destination->title, // 'name' in frontend, 'title' in DB
                        'location' => $destination->location,
                        'price' => (float)$destination->price,
                        'discount_price' => (float)$destination->discount_price,
                        'description' => $destination->description,
                        'image' => $destination->image ? Storage::url($destination->image) : null,
                        'is_featured' => (bool)$destination->is_featured,
                        'rating' => (float)$destination->rating,
                        'category' => $destination->category, // 'tag' in frontend, 'category' in DB
                    ];
                });

            $offers = Offer::where('company_id', $company->id)
                ->with('destination')
                ->paginate(10)
                ->through(function ($offer) {
                    return [
                        'id' => $offer->id,
                        'title' => $offer->title,
                        'description' => $offer->description,
                        'price' => (float)$offer->price,
                        'discount_price' => (float)$offer->discount_price,
                        'discount_type' => $offer->discount_type,
                        'start_date' => $offer->start_date ? $offer->start_date->format('Y-m-d') : null,
                        'end_date' => $offer->end_date ? $offer->end_date->format('Y-m-d') : null,
                        'image' => $offer->image ? Storage::url($offer->image) : null,
                        'is_active' => (bool)$offer->is_active,
                        'location' => $offer->location,
                        'category' => $offer->category,
                        'rating' => (float)$offer->rating,
                        'destination_id' => $offer->destination_id,
                        'destination' => $offer->destination ? [
                            'id' => $offer->destination->id,
                            'name' => $offer->destination->title, // Use title for consistency
                        ] : null,
                    ];
                });

            $packages = Package::where('company_id', $company->id)
                ->with('destination')
                ->paginate(10)
                ->through(function ($package) {
                    return [
                        'id' => $package->id,
                        'title' => $package->title,
                        'subtitle' => $package->subtitle,
                        'description' => $package->description,
                        'price' => (float)$package->price,
                        'discount_price' => (float)$package->discount_price,
                        'discount_type' => $package->discount_type,
                        'start_date' => $package->start_date ? $package->start_date->format('Y-m-d') : null,
                        'end_date' => $package->end_date ? $package->end_date->format('Y-m-d') : null,
                        'image' => $package->image ? Storage::url($package->image) : null,
                        'is_featured' => (bool)$package->is_featured,
                        'is_active' => (bool)$package->is_active,
                        'location' => $package->location,
                        'category' => $package->category,
                        'rating' => (float)$package->rating,
                        'destination_id' => $package->destination_id,
                        'destination' => $package->destination ? [
                            'id' => $package->destination->id,
                            'name' => $package->destination->title,
                        ] : null,
                    ];
                });

            $checkouts = Checkout::where(function ($query) use ($company) {
                $query->whereHas('destination', fn($q) => $q->where('company_id', $company->id))
                    ->orWhereHas('offer', fn($q) => $q->where('company_id', $company->id))
                    ->orWhereHas('package', fn($q) => $q->where('company_id', $company->id));
            })
                ->with(['user', 'destination', 'offer', 'package'])

                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->through(function ($checkout) {
                    return [
                        'id' => $checkout->id,
                        'user' => $checkout->user ? [
                            'id' => $checkout->user->id,
                            'name' => $checkout->user->name,
                            'phone' => $checkout->user->phone,
                            'email' => $checkout->user->email,
                        ] : null,
                        'destination' => $checkout->destination ? [
                            'id' => $checkout->destination->id,
                            'name' => $checkout->destination->title,
                            'image' => $checkout->destination->image ? Storage::url($checkout->destination->image) : null,
                        ] : null,
                        'offer' => $checkout->offer ? [
                            'id' => $checkout->offer->id,
                            'title' => $checkout->offer->title,
                            'image' => $checkout->offer->image ? Storage::url($checkout->offer->image) : null,
                        ] : null,
                        'package' => $checkout->package ? [
                            'id' => $checkout->package->id,
                            'title' => $checkout->package->title,
                            'image' => $checkout->package->image ? Storage::url($checkout->package->image) : null,
                        ] : null,
                        'status' => $checkout->status,
                        'total_price' => (float)$checkout->total_price,
                        'check_in' => $checkout->check_in ? $checkout->check_in->format('Y-m-d') : null,
                        'check_out' => $checkout->check_out ? $checkout->check_out->format('Y-m-d') : null,
                        'guests' => $checkout->guests,
                        'created_at' => $checkout->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return Inertia::render('Company/Dashboard', [
                'company' => [
                    'id' => $company->id,
                    'company_name' => $company->company_name,
                    'email' => $company->email,
                    'avatar' => $company->contact_avatar ? Storage::url($company->contact_avatar) : null,
                ],
                'stats' => $stats,
                'destinations' => $destinations,
                'offers' => $offers,
                'packages' => $packages,
                'bookings' => $checkouts,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load company dashboard:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load dashboard data. Please try again.');
        }
    }
}
