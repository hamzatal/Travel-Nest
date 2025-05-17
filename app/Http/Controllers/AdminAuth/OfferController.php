<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::all()->map(function ($offer) {
            return [
                'id' => $offer->id,
                'title' => $offer->title ?? 'Unknown Offer',
                'location' => $offer->location ?? 'Unknown Location',
                'category' => $offer->category ?? '',
                'price' => $offer->price ?? 0,
                'discount_price' => $offer->discount_price ?? null,
                'discount_type' => $offer->discount_type ?? '',
                'start_date' => $offer->start_date ? $offer->start_date->format('Y-m-d') : null,
                'end_date' => $offer->end_date ? $offer->end_date->format('Y-m-d') : null,
                'image' => $offer->image ? Storage::url($offer->image) : null,
                'description' => $offer->description ?? '',
                'rating' => $offer->rating ?? 0,
                'is_active' => $offer->is_active ?? false,
                'company_id' => $offer->company_id,
                'destination_id' => $offer->destination_id,
            ];
        });
        return Inertia::render('Admin/Deals/AdminDeals', ['offers' => $offers]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string|max:255',
                'category' => 'required|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|string|in:percentage,fixed',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'company_id' => 'required|exists:companies,id',
                'destination_id' => 'nullable|exists:destinations,id',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_active' => 'boolean',
            ]);

            $data = $validated;
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('offers', 'public');
            }

            $data['is_active'] = $data['is_active'] ?? true;
            $data['rating'] = $data['rating'] ?? 0;

            Offer::create($data);

            return redirect()->route('admin.offers.index')->with('success', 'Offer created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create offer:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create offer: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $offer = Offer::findOrFail($id);

            $validated = $request->validate([
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'category' => 'nullable|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'price' => 'nullable|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'discount_type' => 'nullable|string|in:percentage,fixed',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'company_id' => 'nullable|exists:companies,id',
                'destination_id' => 'nullable|exists:destinations,id',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_active' => 'nullable|boolean',
            ]);

            if (
                isset($validated['discount_price']) && isset($validated['price']) &&
                $validated['discount_price'] >= $validated['price']
            ) {
                return back()->withErrors(['discount_price' => 'Discount price must be less than regular price']);
            }

            $data = [
                'title' => $validated['title'] ?? $offer->title,
                'description' => $validated['description'] ?? $offer->description,
                'location' => $validated['location'] ?? $offer->location,
                'category' => $validated['category'] ?? $offer->category,
                'price' => $validated['price'] ?? $offer->price,
                'discount_price' => isset($validated['discount_price']) ? ($validated['discount_price'] ?: null) : $offer->discount_price,
                'discount_type' => $validated['discount_type'] ?? $offer->discount_type,
                'start_date' => $validated['start_date'] ?? $offer->start_date,
                'end_date' => $validated['end_date'] ?? $offer->end_date,
                'company_id' => $validated['company_id'] ?? $offer->company_id,
                'destination_id' => $validated['destination_id'] ?? $offer->destination_id,
                'rating' => $validated['rating'] ?? $offer->rating,
                'is_active' => $validated['is_active'] ?? $offer->is_active,
            ];

            if ($request->hasFile('image')) {
                if ($offer->image) {
                    Storage::disk('public')->delete($offer->image);
                }
                $data['image'] = $request->file('image')->store('offers', 'public');
            }

            $offer->update($data);

            return redirect()->route('admin.offers.index')->with('success', 'Offer updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update offer:', ['id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update offer: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $offer = Offer::findOrFail($id);
            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            $offer->delete();

            return redirect()->route('admin.offers.index')->with('success', 'Offer deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete offer:', ['id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to delete offer: ' . $e->getMessage());
        }
    }

    public function toggleActive($id)
    {
        try {
            $offer = Offer::findOrFail($id);
            $offer->is_active = !$offer->is_active;
            $offer->save();

            $message = $offer->is_active ? 'Offer activated successfully.' : 'Offer deactivated successfully.';
            return redirect()->route('admin.offers.index')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle offer active status:', ['id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to toggle offer status: ' . $e->getMessage());
        }
    }
}
