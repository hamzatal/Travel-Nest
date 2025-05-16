<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::all()->map(function ($offer) {
            $offer->image = $offer->image ? asset('storage/offers/' . $offer->image) : null;
            return $offer;
        });
        return Inertia::render('Admin/Deals/AdminDeals', ['offers' => $offers]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $imagePath = $request->file('image')->store('offers', 'public');
        $imageName = basename($imagePath);

        Offer::create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $imageName,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'discount_type' => $request->discount_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => true,
        ]);

        return redirect()->route('admin.offers.index')->with('success', 'Offer created successfully.');
    }

    public function update(Request $request, $id)
    {

        $offer = Offer::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $data = $request->only([
            'title',
            'description',
            'price',
            'discount_price',
            'discount_type',
            'start_date',
            'end_date',
        ]);

        if ($request->hasFile('image')) {
            if ($offer->image) {
                Storage::disk('public')->delete('offers/' . $offer->image);
            }
            $imagePath = $request->file('image')->store('offers', 'public');
            $data['image'] = basename($imagePath);
        }

        $offer->update($data);

        return redirect()->route('admin.offers.index')->with('success', 'Offer updated successfully.');
    }
    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        if ($offer->image) {
            Storage::disk('public')->delete('offers/' . $offer->image);
        }
        $offer->delete();

        return redirect()->route('admin.offers.index')->with('success', 'Offer deleted successfully.');
    }

    public function toggleActive($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->is_active = !$offer->is_active;
        $offer->save();

        $message = $offer->is_active ? 'Offer activated successfully.' : 'Offer deactivated successfully.';
        return redirect()->route('admin.offers.index')->with('success', $message);
    }
}
