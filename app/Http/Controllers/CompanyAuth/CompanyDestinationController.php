<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CompanyDestinationController extends Controller
{
    /**
     * Display a listing of the destinations.
     */
    public function index(): Response
    {
        $destinations = Destination::where('company_id', Auth::guard('company')->id())->get();
        return Inertia::render('Company/Destinations', [
            'destinations' => $destinations,
        ]);
    }

    /**
     * Store a newly created destination.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'location' => 'required|string|max:255',
            'tag' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('image')->store('destinations', 'public');

        Destination::create([
            'company_id' => Auth::guard('company')->id(),
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'location' => $request->location,
            'tag' => $request->tag,
            'image' => $path,
            'is_featured' => $request->boolean('is_featured'),
        ]);

        return redirect()->route('company.destinations.index')->with('success', 'Destination created successfully.');
    }

    /**
     * Update the specified destination.
     */
    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $this->authorize('update', $destination);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'location' => 'required|string|max:255',
            'tag' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'description', 'price', 'discount_price', 'location', 'tag', 'is_featured']);

        if ($request->hasFile('image')) {
            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $data['image'] = $request->file('image')->store('destinations', 'public');
        }

        $destination->update($data);

        return redirect()->route('company.destinations.index')->with('success', 'Destination updated successfully.');
    }

    /**
     * Remove the specified destination.
     */
    public function destroy(Destination $destination): RedirectResponse
    {
        $this->authorize('delete', $destination);

        if ($destination->image) {
            Storage::disk('public')->delete($destination->image);
        }

        $destination->delete();

        return redirect()->route('company.destinations.index')->with('success', 'Destination deleted successfully.');
    }

    /**
     * Toggle the featured status of the destination.
     */
    public function toggleFeatured(Destination $destination): RedirectResponse
    {
        $this->authorize('update', $destination);

        $destination->update(['is_featured' => !$destination->is_featured]);

        return redirect()->route('company.destinations.index')->with('success', 'Featured status toggled successfully.');
    }
}
