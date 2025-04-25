<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Destination;
use Illuminate\Support\Facades\Storage;

class AdminDestinationController extends Controller
{
    /**
     * Display a listing of the destinations.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $destinations = Destination::latest()->paginate(10);

        return Inertia::render('Admin/Destinations', [
            'destinations' => $destinations,
        ]);
    }

    /**
     * Show the form for creating a new destination.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Destinations/Create');
    }

    /**
     * Store a newly created destination in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'is_featured' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $validated['image'] = $path;
        }

        Destination::create($validated);

        return redirect()->route('admin.destinations')->with('success', 'Destination created successfully');
    }

    /**
     * Show the form for editing the specified destination.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $destination = Destination::findOrFail($id);

        return Inertia::render('Admin/Destinations/Edit', [
            'destination' => $destination,
        ]);
    }

    /**
     * Update the specified destination in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'is_featured' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            
            $path = $request->file('image')->store('destinations', 'public');
            $validated['image'] = $path;
        }

        $destination->update($validated);

        return redirect()->route('admin.destinations')->with('success', 'Destination updated successfully');
    }

    /**
     * Remove the specified destination from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        
        // Delete image
        if ($destination->image) {
            Storage::disk('public')->delete($destination->image);
        }
        
        $destination->delete();

        return redirect()->route('admin.destinations')->with('success', 'Destination deleted successfully');
    }

    /**
     * Toggle the featured status of the destination.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleFeatured($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->update(['is_featured' => !$destination->is_featured]);

        return redirect()->back()->with('success', 'Destination featured status updated');
    }
}