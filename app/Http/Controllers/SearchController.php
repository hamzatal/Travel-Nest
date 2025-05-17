<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Destination;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SearchController extends Controller
{
    public function live(Request $request)
    {
        $query = $request->input('q', '');

        $destinations = Destination::where('is_featured', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->orWhere('location', 'like', '%' . $query . '%');
            })
            ->take(5)
            ->get()
            ->map(function ($destination) {
                $destination->image = $destination->image ? Storage::url($destination->image) : null;
                $destination->type = 'destination';
                return $destination;
            });

        $packages = Package::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->orWhere('location', 'like', '%' . $query . '%');
            })
            ->take(5)
            ->get()
            ->map(function ($package) {
                $package->image = $package->image ? Storage::url($package->image) : null;
                $package->type = 'package';
                return $package;
            });

        $offers = Offer::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->orWhere('location', 'like', '%' . $query . '%');
            })
            ->take(5)
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? Storage::url($offer->image) : null;
                $offer->type = 'offer';
                return $offer;
            });

        $results = $destinations->merge($packages)->merge($offers)->take(5);

        return response()->json([
            'results' => $results,
        ]);
    }

    public function index(Request $request)
    {
        $query = $request->input('q', '');

        $destinations = Destination::where('is_featured', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->orWhere('location', 'like', '%' . $query . '%');
            })
            ->get()
            ->map(function ($destination) {
                $destination->image = $destination->image ? Storage::url($destination->image) : null;
                $destination->type = 'destination';
                return $destination;
            });

        $packages = Package::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->orWhere('location', 'like', '%' . $query . '%');
            })
            ->get()
            ->map(function ($package) {
                $package->image = $package->image ? Storage::url($package->image) : null;
                $package->type = 'package';
                return $package;
            });

        $offers = Offer::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->orWhere('location', 'like', '%' . $query . '%');
            })
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? Storage::url($offer->image) : null;
                $offer->type = 'offer';
                return $offer;
            });

        $results = $destinations->merge($packages)->merge($offers);

        return Inertia::render('SearchResults', [
            'results' => $results,
            'query' => $query,
        ]);
    }
}
