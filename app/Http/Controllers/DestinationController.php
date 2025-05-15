<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::all();
        return Inertia::render('Admin/Destinations/AdminDestinations', [
            'destinations' => $destinations,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:3|max:255',
                'location' => 'required|string|min:3|max:255',
                'description' => 'required|string|min:10|max:1000',
                'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'tag' => 'nullable|string|max:50',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'boolean',
            ]);

            $data = $validated;
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('destinations', 'public');
            }

            $data['rating'] = $data['rating'] ?? 0;
            $data['tag'] = $data['tag'] ?? '';
            $data['is_featured'] = $data['is_featured'] ?? false;

            $destination = Destination::create($data);

            return redirect()->route('admin.destinations.index')->with('success', 'Destination created successfully.');
        } catch (ValidationException $e) {
            Log::error('Store destination validation failed:', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors())->with('error', 'Failed to create destination.');
        } catch (\Exception $e) {
            Log::error('Store destination failed:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create destination: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $destination = Destination::findOrFail($id);

            $validated = $request->validate([
                'name' => 'nullable|string|min:3|max:255',
                'location' => 'nullable|string|min:3|max:255',
                'description' => 'nullable|string|min:10|max:1000',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
                'price' => 'nullable|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'tag' => 'nullable|string|max:50',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'nullable|boolean',
            ]);

            // Remove the discount_price validation against price
            if (
                isset($validated['discount_price']) && isset($validated['price']) &&
                $validated['discount_price'] >= $validated['price']
            ) {
                return back()->withErrors(['discount_price' => 'Discount price must be less than regular price'])
                    ->with('error', 'Failed to update destination.');
            }

            $data = [
                'name' => $validated['name'] ?? $destination->name,
                'location' => $validated['location'] ?? $destination->location,
                'description' => $validated['description'] ?? $destination->description,
                'price' => $validated['price'] ?? $destination->price,
                'discount_price' => isset($validated['discount_price']) ? ($validated['discount_price'] ?: null) : $destination->discount_price,
                'tag' => isset($validated['tag']) ? ($validated['tag'] ?: null) : $destination->tag,
                'rating' => isset($validated['rating']) ? ($validated['rating'] ?: null) : $destination->rating,
                'is_featured' => $validated['is_featured'] ?? $destination->is_featured,
            ];

            if ($request->hasFile('image')) {
                if ($destination->image) {
                    Storage::disk('public')->delete($destination->image);
                }
                $data['image'] = $request->file('image')->store('destinations', 'public');
            } elseif ($request->input('image') === '') {
                if ($destination->image) {
                    Storage::disk('public')->delete($destination->image);
                }
                $data['image'] = null;
            } else {
                $data['image'] = $destination->image;
            }

            $destination->update($data);

            return redirect()->route('admin.destinations.index')->with('success', 'Destination updated successfully.');
        } catch (ValidationException $e) {
            Log::error('Update destination validation failed:', ['id' => $id, 'errors' => $e->errors()]);
            return back()->withErrors($e->errors())->with('error', 'Failed to update destination.');
        } catch (\Exception $e) {
            Log::error('Update destination failed:', ['id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update destination: ' . $e->getMessage());
        }
    }
    public function destroy($id)
    {
        try {
            $destination = Destination::findOrFail($id);

            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $destination->delete();

            return redirect()->route('admin.destinations.index')->with('success', 'Destination deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Destroy destination failed:', ['id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to delete destination: ' . $e->getMessage());
        }
    }

    public function toggleFeatured($id)
    {
        try {
            $destination = Destination::findOrFail($id);
            $destination->is_featured = !$destination->is_featured;
            $destination->save();

            return redirect()->route('admin.destinations.index')->with(
                'success',
                $destination->is_featured
                    ? 'Destination set as featured successfully.'
                    : 'Destination removed from featured successfully.'
            );
        } catch (\Exception $e) {
            Log::error('Toggle featured failed:', ['id' => $id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Failed to toggle featured status: ' . $e->getMessage());
        }
    }

    public function featured()
    {
        $destinations = Destination::where('is_featured', true)->get();
        if ($destinations->isEmpty()) {
            $destinations = Destination::orderBy('created_at', 'desc')->take(4)->get();
        }
        $mappedDestinations = $destinations->map(function ($destination) {
            $data = [
                'id' => $destination->id,
                'name' => $destination->name ?? 'Unknown Destination',
                'location' => $destination->location ?? 'Unknown Location',
                'description' => $destination->description ?? '',
                'image' => $destination->image ? asset('storage/' . $destination->image) : null,
                'price' => $destination->price ?? 0,
                'discount_price' => $destination->discount_price ?? null,
                'tag' => $destination->tag ?? '',
                'rating' => $destination->rating ?? 0,
                'is_featured' => $destination->is_featured ?? false,
            ];
            return $data;
        });
        return $mappedDestinations;
    }

    public function allDestinations(Request $request)
    {
        $query = Destination::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%");
        }

        $destinations = $query->get()->map(function ($destination) {
            $data = [
                'id' => $destination->id,
                'name' => $destination->name ?? 'Unknown Destination',
                'location' => $destination->location ?? 'Unknown Location',
                'description' => $destination->description ?? '',
                'image' => $destination->image ? asset('storage/' . $destination->image) : null,
                'price' => $destination->price ?? 0,
                'discount_price' => $destination->discount_price ?? null,
                'tag' => $destination->tag ?? '',
                'rating' => $destination->rating ?? 0,
                'is_featured' => $destination->is_featured ?? false,
            ];
            return $data;
        });

        return Inertia::render('DestinationsPage', [
            'destinations' => $destinations,
        ]);
    }

    public function show($id)
    {
        try {
            $destination = Destination::findOrFail($id);
            $destinationData = [
                'id' => $destination->id,
                'name' => $destination->name ?? 'Unknown Destination',
                'location' => $destination->location ?? 'Unknown Location',
                'description' => $destination->description ?? '',
                'image' => $destination->image ? asset('storage/' . $destination->image) : null,
                'price' => $destination->price ?? 0,
                'discount_price' => $destination->discount_price ?? null,
                'tag' => $destination->tag ?? '',
                'rating' => $destination->rating ?? 0,
                'is_featured' => $destination->is_featured ?? false,
            ];
            return Inertia::render('DestinationDetails', [
                'destination' => $destinationData,
                'flash' => [
                    'success' => session('success') ?? null,
                    'error' => session('error') ?? null,
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Destination not found:', ['id' => $id]);
            return Inertia::render('Errors/404', [
                'message' => 'The destination you are looking for does not exist.',
            ]);
        }
    }
}
