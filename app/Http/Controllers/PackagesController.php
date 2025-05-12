<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PackagesController extends Controller
{
    public function indexPublic()
    {
        $packages = Package::with('company')->get();
        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'auth' => auth()->user(),
        ]);
    }

    public function index()
    {
        $user = auth()->user();
        $packages = $user->is_company
            ? Package::where('company_id', $user->id)->get()
            : Package::all();
        return Inertia::render('Company/Packages/Index', [
            'packages' => $packages,
            'auth' => $user,
        ]);
    }

    public function create()
    {
        return Inertia::render('Company/Packages/Create', [
            'auth' => auth()->user(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'group_size' => 'nullable|string|max:255',
            'inclusions' => 'nullable|array',
            'itinerary' => 'nullable|array',
            'tag' => 'nullable|string|max:50',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_featured' => 'boolean',
        ]);

        $validated['company_id'] = auth()->user()->id; // Assuming company is logged in

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('packages', 'public');
        }

        Package::create($validated);

        return redirect()->route('company.packages.index')->with('success', 'Package created successfully.');
    }

    public function edit(Package $package)
    {
        $this->authorize('update', $package); // Ensure company can only edit their packages
        return Inertia::render('Company/Packages/Edit', [
            'package' => $package,
            'auth' => auth()->user(),
        ]);
    }

    public function update(Request $request, Package $package)
    {
        $this->authorize('update', $package);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'group_size' => 'nullable|string|max:255',
            'inclusions' => 'nullable|array',
            'itinerary' => 'nullable|array',
            'tag' => 'nullable|string|max:50',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            $validated['image'] = $request->file('image')->store('packages', 'public');
        }

        $package->update($validated);

        return redirect()->route('company.packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy(Package $package)
    {
        $this->authorize('delete', $package);
        if ($package->image) {
            Storage::disk('public')->delete($package->image);
        }
        $package->delete();

        return redirect()->route('company.packages.index')->with('success', 'Package deleted successfully.');
    }

    public function show(Package $package)
    {
        $package->load('company');
        return Inertia::render('Packages/Show', [
            'package' => $package,
            'auth' => auth()->user(),
        ]);
    }
}
