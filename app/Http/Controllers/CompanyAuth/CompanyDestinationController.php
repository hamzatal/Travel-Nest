<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class CompanyDestinationController extends Controller
{
    // Note: The index method for each resource (Destination, Offer, Package) is now primarily
    // handled by CompanyDashboardController to centralize data fetching for the single dashboard page.
    // These methods might be removed or adapted if not directly called by routes other than the main dashboard.
    // For now, they are kept for completeness but their direct call might not be needed.

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|min:3',
                'description' => 'required|string|min:10|max:5000',
                'location' => 'required|string|max:100',
                'tag' => 'required|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'price' => 'required|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'is_featured' => 'boolean',
                'is_active' => 'boolean', // Added
            ]);

            $validated['title'] = $validated['name'];
            $validated['category'] = $validated['tag'];
            unset($validated['name'], $validated['tag']);

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $validated['image'] = $request->file('image')->store('destinations', 'public');
            }

            $validated['company_id'] = Auth::guard('company')->id();

            Destination::create($validated);

            return redirect()->back()->with('success', 'Destination created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create destination: ' . $e->getMessage());
            return back()->with('error', 'Failed to create destination.');
        }
    }

    public function update(Request $request, Destination $destination)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|min:3', // Changed to sometimes
                'description' => 'sometimes|string|min:10|max:5000',
                'location' => 'sometimes|string|max:100',
                'tag' => 'sometimes|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife', // Changed to tag
                'price' => 'sometimes|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'is_featured' => 'sometimes|boolean',
                'is_active' => 'sometimes|boolean', // Added
            ]);

            // Map 'name' to 'title' and 'tag' to 'category'
            if (isset($validated['name'])) {
                $validated['title'] = $validated['name'];
                unset($validated['name']);
            }
            if (isset($validated['tag'])) {
                $validated['category'] = $validated['tag'];
                unset($validated['tag']);
            }

            // Handle image upload
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                if ($destination->image) {
                    Storage::disk('public')->delete($destination->image);
                }
                $validated['image'] = $request->file('image')->store('destinations', 'public');
            } else {
                unset($validated['image']);
            }

            $destination->update($validated);

            return redirect()->back()->with('success', 'Destination updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update destination.');
        }
    }
    public function destroy(Destination $destination)
    {
        try {
            $company = Auth::guard('company')->user();

            if ($destination->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized to delete this destination.');
            }

            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $destination->delete();

            return redirect()->route('company.dashboard')->with('success', 'Destination deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete destination. ' . $e->getMessage());
        }
    }

    public function toggleFeatured(Destination $destination)
    {
        try {
            $company = Auth::guard('company')->user();

            if ($destination->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized to modify this destination.');
            }

            $destination->is_featured = !$destination->is_featured;
            $destination->save();

            $message = $destination->is_featured ? 'Destination set as featured.' : 'Destination removed from featured.';
            return redirect()->route('company.dashboard')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle featured status for destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to toggle featured status. ' . $e->getMessage());
        }
    }
    public function toggleActive(Destination $destination)
    {
        try {
            $destination->is_active = !$destination->is_active;
            $destination->save();

            $message = $destination->is_active ? 'Destination activated.' : 'Destination deactivated.';
            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle active status for destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to toggle active status.');
        }
    }
}
