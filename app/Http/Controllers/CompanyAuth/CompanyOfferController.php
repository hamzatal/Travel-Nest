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
use Illuminate\Validation\ValidationException;

class CompanyOfferController extends Controller
{
    public function index()
    {
        try {
            $company = Auth::guard('company')->user();
            $offers = Offer::where('company_id', $company->id)
                ->with('destination')
                ->paginate(10)
                ->through(function ($offer) {
                    return [
                        'id' => $offer->id,
                        'destination_id' => $offer->destination_id,
                        'title' => $offer->title,
                        'description' => $offer->description,
                        'location' => $offer->location,
                        'category' => $offer->category,
                        'price' => (float)$offer->price,
                        'discount_price' => (float)$offer->discount_price,
                        'discount_type' => $offer->discount_type,
                        'start_date' => $offer->start_date ? $offer->start_date->format('Y-m-d') : null,
                        'end_date' => $offer->end_date ? $offer->end_date->format('Y-m-d') : null,
                        'image' => $offer->image ? Storage::url($offer->image) : null,
                        'rating' => (float)$offer->rating,
                        'is_active' => (bool)$offer->is_active,
                        'created_at' => $offer->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $offer->updated_at->format('Y-m-d H:i:s'),
                        'destination' => $offer->destination ? [
                            'id' => $offer->destination->id,
                            'name' => $offer->destination->title, // Use title for consistency
                        ] : null,
                    ];
                });

            // No need for a separate offers index page, render the dashboard
            return Inertia::render('Company/Dashboard', [
                'offers' => $offers,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
                // Pass other data needed by dashboard
                'destinations' => request()->session()->get('destinations') ?? ['data' => []],
                'packages' => request()->session()->get('packages') ?? ['data' => []],
                'bookings' => request()->session()->get('bookings') ?? ['data' => []],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch company offers: ' . $e->getMessage());
            return back()->with('error', 'Failed to load offers.');
        }
    }

    public function store(Request $request)
    {
        try {
            $company = Auth::guard('company')->user();

            $validated = $request->validate([
                'destination_id' => 'required|exists:destinations,id', // Should be 'id,company_id,' . $company->id for security
                'title' => 'required|string|max:255',
                'description' => 'required|string|min:10',
                'location' => 'nullable|string|max:255',
                'category' => 'nullable|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'price' => 'required|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|string|in:percentage,fixed',
                'start_date' => 'required|date', // Changed to required as per frontend logic
                'end_date' => 'required|date|after_or_equal:start_date', // Changed to required
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Added webp
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_active' => 'boolean',
            ]);

            // Ensure the destination belongs to the company
            $destination = Destination::where('id', $validated['destination_id'])
                ->where('company_id', $company->id)
                ->firstOrFail();

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $validated['image'] = $request->file('image')->store('offers', 'public');
            } else {
                throw ValidationException::withMessages(['image' => 'Invalid or missing image file.']);
            }

            $validated['company_id'] = $company->id;
            $validated['is_active'] = $validated['is_active'] ?? true;

            Offer::create($validated);

            return redirect()->route('company.dashboard')->with('success', 'Offer created successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to create company offer: ' . $e->getMessage());
            return back()->with('error', 'Failed to create offer.');
        }
    }

    public function update(Request $request, Offer $offer) // Changed $id to Offer $offer for route model binding
    {
        try {
            $company = Auth::guard('company')->user();
            if ($offer->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized action.');
            }

            $validated = $request->validate([
                'destination_id' => 'required|exists:destinations,id', // Changed to required for consistency
                'title' => 'required|string|max:255', // Changed to required
                'description' => 'required|string|min:10', // Changed to required
                'location' => 'nullable|string|max:255',
                'category' => 'nullable|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'price' => 'required|numeric|min:0.01', // Changed to required
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|string|in:percentage,fixed',
                'start_date' => 'required|date', // Changed to required
                'end_date' => 'required|date|after_or_equal:start_date', // Changed to required
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Added webp
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_active' => 'boolean',
            ]);

            // Ensure the destination belongs to the company during update
            $destination = Destination::where('id', $validated['destination_id'])
                ->where('company_id', $company->id)
                ->firstOrFail();

            $dataToUpdate = $validated;
            unset($dataToUpdate['image']); // Remove image from validated data to handle separately

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                if ($offer->image) {
                    Storage::disk('public')->delete($offer->image);
                }
                $dataToUpdate['image'] = $request->file('image')->store('offers', 'public');
            }


            $offer->update($dataToUpdate);

            return redirect()->route('company.dashboard')->with('success', 'Offer updated successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to update offer: ' . $e->getMessage(), ['id' => $offer->id]);
            return back()->with('error', 'Failed to update offer.');
        }
    }

    public function destroy(Offer $offer) // Changed $id to Offer $offer for route model binding
    {
        try {
            $company = Auth::guard('company')->user();
            if ($offer->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized action.');
            }

            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            $offer->delete();

            return redirect()->route('company.dashboard')->with('success', 'Offer deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete offer: ' . $e->getMessage(), ['id' => $offer->id]);
            return back()->with('error', 'Failed to delete offer.');
        }
    }

    public function toggleActive(Offer $offer)
    {
        try {
            $offer->is_active = !$offer->is_active;
            $offer->save();

            $message = $offer->is_active ? 'Offer activated.' : 'Offer deactivated.';
            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle active status for offer ID ' . $offer->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to toggle active status.');
        }
    }
}
