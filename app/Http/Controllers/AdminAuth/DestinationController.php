
<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DestinationsController extends Controller
{
    public function index()
    {
        try {
            $destinations = Destination::with(['company'])->get()->map(function ($destination) {
                return [
                    'id' => $destination->id,
                    'company' => $destination->company ? [
                        'id' => $destination->company->id,
                        'name' => $destination->company->company_name
                    ] : null,
                    'title' => $destination->title,
                    'description' => $destination->description,
                    'location' => $destination->location,
                    'category' => $destination->category,
                    'price' => $destination->price,
                    'discount_price' => $destination->discount_price,
                    'image' => $destination->image ? Storage::url($destination->image) : null,
                    'rating' => $destination->rating,
                    'is_featured' => $destination->is_featured,
                    'created_at' => $destination->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $destination->updated_at->format('Y-m-d H:i:s'),
                ];
            });

            $companies = Company::select('id', 'company_name')
                ->where('is_active', true)
                ->get()->map(function ($company) {
                    return [
                        'id' => $company->id,
                        'company_name' => $company->company_name,
                    ];
                });

            return Inertia::render('Admin/Destinations/AdminDestinations', [
                'destinations' => $destinations,
                'companies' => $companies,
                'auth' => Auth::guard('admin')->user(),
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load admin destinations: ' . $e->getMessage());
            return Inertia::render('Admin/Destinations/AdminDestinations', [
                'destinations' => [],
                'companies' => [],
                'auth' => Auth::guard('admin')->user(),
                'flash' => ['error' => 'Failed to load data.'],
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'company_id' => 'required|exists:companies,id',
                'title' => 'required|string|max:255|min:3',
                'description' => 'required|string|min:10|max:5000',
                'location' => 'nullable|string|max:100',
                'category' => 'nullable|string|max:100',
                'price' => 'required|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'boolean',
            ]);

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $validated['image'] = $request->file('image')->store('destinations', 'public');
            } else {
                return back()->withErrors(['image' => 'Invalid or missing image file.']);
            }

            Destination::create($validated);

            return redirect()->route('admin.destinations.index')->with('success', 'Destination created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create destination: ' . $e->getMessage());
            return back()->with('error', 'Failed to create destination.');
        }
    }

    public function update(Request $request, Destination $destination)
    {
        try {
            $validated = $request->validate([
                'company_id' => 'required|exists:companies,id',
                'title' => 'required|string|max:255|min:3',
                'description' => 'required|string|min:10|max:5000',
                'location' => 'nullable|string|max:100',
                'category' => 'nullable|string|max:100',
                'price' => 'required|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'boolean',
            ]);

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                if ($destination->image) {
                    Storage::disk('public')->delete($destination->image);
                }
                $validated['image'] = $request->file('image')->store('destinations', 'public');
            } else {
                $validated['image'] = $destination->image;
            }

            $destination->update($validated);

            return redirect()->route('admin.destinations.index')->with('success', 'Destination updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update destination.');
        }
    }

    public function destroy(Destination $destination)
    {
        try {
            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $destination->delete();

            return redirect()->route('admin.destinations.index')->with('success', 'Destination deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete destination.');
        }
    }

    public function toggleFeatured(Destination $destination)
    {
        try {
            $destination->is_featured = !$destination->is_featured;
            $destination->save();

            $message = $destination->is_featured ? 'Destination set as featured.' : 'Destination removed from featured.';
            return redirect()->route('admin.destinations.index')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle featured status for destination ID ' . $destination->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to toggle featured status.');
        }
    }
}
