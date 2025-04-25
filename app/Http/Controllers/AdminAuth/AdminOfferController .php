<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Offer;
use Illuminate\Support\Facades\Storage;

class AdminOfferController extends Controller
{
    /**
     * Display a listing of the offers.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $offers = Offer::latest()->paginate(10);

        return Inertia::render('Admin/Offers/Index', [
            'offers' => $offers,
        ]);
    }

    /**
     * Show the form for creating a new offer.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Offers/Create');
    }

    /**
     * Store a newly created offer in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'required|numeric|min:0|lt:price',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('offers', 'public');
            $validated['image'] = $path;
        }

        Offer::create($validated);

        return redirect()->route('admin.offers.index')->with('success', 'Offer created successfully');
    }

    /**
     * Show the form for editing the specified offer.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $offer = Offer::findOrFail($id);

        return Inertia::render('Admin/Offers/Edit', [
            'offer' => $offer,
        ]);
    }

    /**
     * Update the specified offer in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'required|numeric|min:0|lt:price',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            
            $path = $request->file('image')->store('offers', 'public');
            $validated['image'] = $path;
        }

        $offer->update($validated);

        return redirect()->route('admin.offers.index')->with('success', 'Offer updated successfully');
    }

    /**
     * Remove the specified offer from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        
        // Delete image
        if ($offer->image) {
            Storage::disk('public')->delete($offer->image);
        }
        
        $offer->delete();

        return redirect()->route('admin.offers.index')->with('success', 'Offer deleted successfully');
    }

    /**
     * Toggle the active status of the offer.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleActive($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->update(['is_active' => !$offer->is_active]);

        return redirect()->back()->with('success', 'Offer active status updated');
    }
}