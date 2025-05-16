<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\Offer;
use App\Models\Package;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CompanyDashboardController extends Controller
{
    /**
     * Display the company dashboard.
     */
    public function index(): Response
    {
        $company = Auth::guard('company')->user();

        $destinations = Destination::where('company_id', $company->id)->get();
        $offers = Offer::where('company_id', $company->id)->get();
        $packages = Package::where('company_id', $company->id)->get();
        $bookings = Booking::whereHas('destination', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        })->orWhereHas('offer', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        })->orWhereHas('package', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        })->with(['user', 'destination', 'offer', 'package'])->get();

        return Inertia::render('Company/Dashboard', [
            'destinations' => $destinations,
            'offers' => $offers,
            'packages' => $packages,
            'bookings' => $bookings,
        ]);
    }
}
