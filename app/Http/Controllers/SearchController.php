<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function live(Request $request)
    {
        $query = $request->input('q', '');

        $results = Offer::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%');
            })
            ->take(5) // Limit to 5 results for performance
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? asset('storage/offers/' . $offer->image) : null;
                return $offer;
            });

        return response()->json([
            'results' => $results,
        ]);
    }

    public function index(Request $request)
    {
        $query = $request->input('q', '');

        $results = Offer::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%');
            })
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? asset('storage/offers/' . $offer->image) : null;
                return $offer;
            });

        return Inertia::render('SearchResults', [
            'results' => $results,
            'query' => $query,
        ]);
    }
}
