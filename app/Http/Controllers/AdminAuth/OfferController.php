<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::all();
        return Inertia::render('Admin/OffersView', [
            'offers' => $offers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount' => 'required|numeric|min:0|max:100',
            'expiry_date' => 'required|date|after:today',
        ]);

        Offer::create($request->all());

        return redirect()->route('admin.offers')->with('success', 'Offer created successfully.');
    }

    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount' => 'required|numeric|min:0|max:100',
            'expiry_date' => 'required|date|after:today',
        ]);

        $offer->update($request->all());

        return redirect()->route('admin.offers')->with('success', 'Offer updated successfully.');
    }

    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();
        return redirect()->route('admin.offers')->with('success', 'Offer deleted successfully.');
    }
}