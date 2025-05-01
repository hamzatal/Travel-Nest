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
            $offer->image = $offer->image ? asset('storage/offers/' . basename($offer->image)) : null;
            return $offer;
        });
        return Inertia::render('Admin/OffersView', ['offers' => $offers]);
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

        $imageName = $request->file('image')->store('offers', 'public');
        $imageName = basename($imageName);

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

        return redirect()->route('admin.offers')->with('success', 'Offer created successfully.');
    }

    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $data = [];
        if ($request->filled('title')) {
            $data['title'] = $request->title;
        }
        if ($request->filled('description')) {
            $data['description'] = $request->description;
        }
        if ($request->hasFile('image')) {
            if ($offer->image) {
                Storage::disk('public')->delete('offers/' . $offer->image);
            }
            $imageName = $request->file('image')->store('offers', 'public');
            $data['image'] = basename($imageName);
        }
        if ($request->filled('price')) {
            $data['price'] = $request->price;
        }
        if ($request->filled('discount_price')) {
            $data['discount_price'] = $request->discount_price;
        }
        if ($request->filled('discount_type')) {
            $data['discount_type'] = $request->discount_type;
        }
        if ($request->filled('start_date')) {
            $data['start_date'] = $request->start_date;
        }
        if ($request->filled('end_date')) {
            $data['end_date'] = $request->end_date;
        }

        if (!empty($data)) {
            $offer->update($data);
        }

        return redirect()->route('admin.offers')->with('success', 'Offer updated successfully.');
    }

    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        if ($offer->image) {
            Storage::disk('public')->delete('offers/' . $offer->image);
        }
        $offer->delete();

        return redirect()->route('admin.offers')->with('success', 'Offer deleted successfully.');
    }

    public function toggleActive($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->is_active = !$offer->is_active;
        $offer->save();

        $message = $offer->is_active ? 'Offer activated successfully.' : 'Offer deactivated successfully.';
        return redirect()->route('admin.offers')->with('success', $message);
    }
}
