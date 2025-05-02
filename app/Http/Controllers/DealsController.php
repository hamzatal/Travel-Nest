<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DealsController extends Controller
{
    public function index()
    {
        $offers = Offer::where('is_active', true)
            ->get()
            ->map(function ($offer) {
                $offer->image = $offer->image ? asset('storage/offers/' . $offer->image) : null;
                return $offer;
            });

        return Inertia::render('Deals', [
            'offers' => $offers,
        ]);
    }

    public function show($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->image = $offer->image ? asset('storage/offers/' . $offer->image) : null;

        return Inertia::render('OfferDetails', [
            'offer' => $offer,
        ]);
    }
}
