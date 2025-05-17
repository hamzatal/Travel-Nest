<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CompanyOfferController extends Controller
{
    public function index()
    {
        try {
            $company = Auth::guard('company')->user();
            $offers = Offer::where('company_id', $company->id)
                ->with('destination')
                ->get()
                ->map(function ($offer) {
                    return [
                        'id' => $offer->id,
                        'destination' => $offer->destination ? ['id' => $offer->destination->id, 'name' => $offer->destination->name] : null,
                        'title' => $offer->title,
                        'description' => $offer->description,
                        'location' => $offer->location,
                        'category' => $offer->category,
                        'price' => $offer->price,
                        'discount_price' => $offer->discount_price,
                        'discount_type' => $offer->discount_type,
                        'start_date' => $offer->start_date ? $offer->start_date->format('Y-m-d') : null,
                        'end_date' => $offer->end_date ? $offer->end_date->format('Y-m-d') : null,
                        'image' => $offer->image ? Storage::url($offer->image) : null,
                        'rating' => $offer->rating,
                        'is_active' => $offer->is_active,
                        'created_at' => $offer->created_at,
                        'updated_at' => $offer->updated_at,
                    ];
                });

            return Inertia::render('Company/Offers/Index', [
                'offers' => $offers,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch company offers:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load offers.');
        }
    }

    public function store(Request $request)
    {
        try {
            $company = Auth::guard('company')->user();

            $validated = $request->validate([
                'destination_id' => 'nullable|exists:destinations,id,company_id,' . $company->id,
                'title' => 'required|string|max:255',
                'description' => 'required|string|min:10',
                'location' => 'required|string|max:255',
                'category' => 'required|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|string|in:percentage,fixed',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_active' => 'boolean',
            ]);

            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('offers', 'public');
            }

            $validated['company_id'] = $company->id;
            $validated['is_active'] = $validated['is_active'] ?? true;

            Offer::create($validated);

            return redirect()->route('company.offers.index')->with('success', 'Offer created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create company offer:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create offer.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $company = Auth::guard('company')->user();
            $offer = Offer::findOrFail($id);
            if ($offer->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized action.');
            }

            $validated = $request->validate([
                'destination_id' => 'nullable|exists:destinations,id,company_id,' . $company->id,
                'title' => 'required|string|max:255',
                'description' => 'required|string|min:10',
                'location' => 'required|string|max:255',
                'category' => 'required|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|string|in:percentage,fixed',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_active' => 'boolean',
            ]);

            $data = $validated;
            $data['destination_id'] = $data['destination_id'] ?? $offer->destination_id;
            $data['is_active'] = $data['is_active'] ?? $offer->is_active;

            if ($request->hasFile('image')) {
                if ($offer->image) {
                    Storage::disk('public')->delete($offer->image);
                }
                $data['image'] = $request->file('image')->store('offers', 'public');
            } else {
                $data['image'] = $offer->image;
            }

            $offer->update($data);

            return redirect()->route('company.offers.index')->with('success', 'Offer updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update company offer:', ['offer_id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update offer.');
        }
    }

    public function destroy($id)
    {
        try {
            $company = Auth::guard('company')->user();
            $offer = Offer::findOrFail($id);
            if ($offer->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized action.');
            }

            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            $offer->delete();

            return redirect()->route('company.offers.index')->with('success', 'Offer deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete company offer:', ['offer_id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to delete offer.');
        }
    }

    public function toggleActive($id)
    {
        try {
            $company = Auth::guard('company')->user();
            $offer = Offer::findOrFail($id);
            if ($offer->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized action.');
            }

            $offer->is_active = !$offer->is_active;
            $offer->save();

            $message = $offer->is_active ? 'Offer activated successfully.' : 'Offer deactivated successfully.';
            return redirect()->route('company.offers.index')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle company offer status:', ['offer_id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to toggle offer status.');
        }
    }
}
