<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CompanyOfferController extends Controller
{
    /**
     * Display a listing of the offers.
     */
    public function index(): Response
    {
        $offers = Offer::where('company_id', Auth::guard('company')->id())->get();
        return Inertia::render('Company/Offers', [
            'offers' => $offers,
        ]);
    }

    /**
     * Store a newly created offer.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'price', 'discount_price', 'start_date', 'end_date', 'is_active', 'discount_type']);
        $data['company_id'] = Auth::guard('company')->id();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('offers', 'public');
        }

        Offer::create($data);

        return redirect()->route('company.offers.index')->with('success', 'Offer created successfully.');
    }

    /**
     * Update the specified offer.
     */
    public function update(Request $request, Offer $offer): RedirectResponse
    {
        $this->authorize('update', $offer);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'price', 'discount_price', 'start_date', 'end_date', 'is_active', 'discount_type']);

        if ($request->hasFile('image')) {
            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            $data['image'] = $request->file('image')->store('offers', 'public');
        }

        $offer->update($data);

        return redirect()->route('company.offers.index')->with('success', 'Offer updated successfully.');
    }

    /**
     * Remove the specified offer.
     */
    public function destroy(Offer $offer): RedirectResponse
    {
        $this->authorize('delete', $offer);

        if ($offer->image) {
            Storage::disk('public')->delete($offer->image);
        }

        $offer->delete();

        return redirect()->route('company.offers.index')->with('success', 'Offer deleted successfully.');
    }

    /**
     * Toggle the active status of the offer.
     */
    public function toggleActive(Offer $offer): RedirectResponse
    {
        $this->authorize('update', $offer);

        $offer->update(['is_active' => !$offer->is_active]);

        return redirect()->route('company.offers.index')->with('success', 'Active status toggled successfully.');
    }
}
