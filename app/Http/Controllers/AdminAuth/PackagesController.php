<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PackagesController extends Controller
{
    public function indexPublic()
    {
        $packages = Package::all();
        return Inertia::render('Packages/Index', [
            'packages' => $packages,
        ]);
    }

    public function index()
    {
        $packages = Package::all();
        return Inertia::render('Admin/Packages/AdminPackage', [
            'packages' => $packages,
            'auth' => auth('admin')->user(),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Store Package Request:', $request->all());

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string|min:10',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('packages', 'public');
        }

        Package::create($validated);

        return redirect()->route('admin.packages.index')->with('success', 'Package created successfully.');
    }

    public function update(Request $request, Package $package)
    {
        Log::info('Update Package Request:', $request->all());

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string|min:10',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_featured' => 'boolean',
        ]);

        // Preserve existing values for nullable fields
        $data = $validated;
        $data['subtitle'] = $data['subtitle'] ?? $package->subtitle;
        $data['start_date'] = $data['start_date'] ?? $package->start_date;
        $data['end_date'] = $data['end_date'] ?? $package->end_date;
        $data['discount_price'] = $data['discount_price'] ?? $package->discount_price;
        $data['discount_type'] = $data['discount_type'] ?? $package->discount_type;
        $data['rating'] = $data['rating'] ?? $package->rating;

        if ($request->hasFile('image')) {
            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            $data['image'] = $request->file('image')->store('packages', 'public');
        } else {
            $data['image'] = $package->image;
        }

        Log::info('Update Package Data:', $data);

        $package->update($data);

        return redirect()->route('admin.packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy(Package $package)
    {
        if ($package->image) {
            Storage::disk('public')->delete($package->image);
        }
        $package->delete();

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted successfully.');
    }

    public function toggleFeatured(Package $package)
    {
        $package->is_featured = !$package->is_featured;
        $package->save();

        $message = $package->is_featured ? 'Package set as featured successfully.' : 'Package removed from featured successfully.';
        return redirect()->route('admin.packages.index')->with('success', $message);
    }

    public function show(Package $package)
    {
        return Inertia::render('Packages/Show', [
            'package' => $package,
            'auth' => auth()->user(),
        ]);
    }
}
