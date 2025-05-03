<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DestinationController extends Controller
{
    // Display destinations in admin dashboard
    public function index()
    {
        $destinations = Destination::all();
        return Inertia::render('Admin/DestinationsView', [
            'destinations' => $destinations,
        ]);
    }

    // Store a new destination
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'location' => 'required|string|min:3|max:255',
            'description' => 'required|string|min:10',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'tag' => 'nullable|string|max:50',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_featured' => 'boolean',
        ]);

        $data = $request->only([
            'name',
            'location',
            'description',
            'price',
            'discount_price',
            'tag',
            'rating',
            'is_featured'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('destinations', 'public');
        }

        // Set default values for optional fields
        $data['rating'] = $data['rating'] ?? 0;
        $data['tag'] = $data['tag'] ?? '';
        $data['is_featured'] = $data['is_featured'] ?? false;

        Destination::create($data);

        return redirect()->route('admin.destinations')->with('success', 'Destination created successfully.');
    }

    // Update an existing destination
    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'location' => 'required|string|min:3|max:255',
            'description' => 'required|string|min:10',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'tag' => 'nullable|string|max:50',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_featured' => 'boolean',
        ]);

        $data = $request->only([
            'name',
            'location',
            'description',
            'price',
            'discount_price',
            'tag',
            'rating',
            'is_featured'
        ]);

        if ($request->hasFile('image')) {
            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $data['image'] = $request->file('image')->store('destinations', 'public');
        }

        // Set default values for optional fields
        $data['rating'] = $data['rating'] ?? 0;
        $data['tag'] = $data['tag'] ?? '';
        $data['is_featured'] = $data['is_featured'] ?? false;

        $destination->update($data);

        return redirect()->route('admin.destinations')->with('success', 'Destination updated successfully.');
    }

    // Delete a destination
    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        if ($destination->image) {
            Storage::disk('public')->delete($destination->image);
        }
        $destination->delete();
        return redirect()->route('admin.destinations')->with('success', 'Destination deleted successfully.');
    }

    // Toggle featured status
    public function toggleFeatured($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->is_featured = !$destination->is_featured;
        $destination->save();

        return redirect()->route('admin.destinations')->with(
            'success',
            $destination->is_featured
                ? 'Destination set as featured successfully.'
                : 'Destination removed from featured successfully.'
        );
    }

    // Get destinations for the homepage (featured destinations)
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
                'image' => $destination->image ? asset('storage/destinations/' . basename($destination->image)) : null,
                'price' => $destination->price ?? 0,
                'discount_price' => $destination->discount_price ?? null,
                'tag' => $destination->tag ?? '',
                'rating' => $destination->rating ?? 0,
                'is_featured' => $destination->is_featured ?? false,
            ];
            Log::debug('Featured Destination:', $data);
            return $data;
        });
        return $mappedDestinations;
    }

    // Display all destinations for /destinations page
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
            Log::debug('All Destinations:', $data);
            return $data;
        });

        return Inertia::render('DestinationsPage', [
            'destinations' => $destinations,
        ]);
    }

    // Display a single destination for /destinations/:id
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
            Log::info('Destination fetched:', ['id' => $id, 'destination' => $destinationData]);
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
