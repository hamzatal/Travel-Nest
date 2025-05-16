<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CompanyPackageController extends Controller
{
    /**
     * Display a listing of the packages.
     */
    public function index(): Response
    {
        $packages = Package::where('company_id', Auth::guard('company')->id())->get();
        return Inertia::render('Company/Packages', [
            'packages' => $packages,
        ]);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['title', 'subtitle', 'description', 'price', 'discount_price', 'start_date', 'end_date', 'is_featured', 'discount_type']);
        $data['company_id'] = Auth::guard('company')->id();
        $data['image'] = $request->file('image')->store('packages', 'public');

        Package::create($data);

        return redirect()->route('company.packages.index')->with('success', 'Package created successfully.');
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, Package $package): RedirectResponse
    {
        $this->authorize('update', $package);

        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['title', 'subtitle', 'description', 'price', 'discount_price', 'start_date', 'end_date', 'is_featured', 'discount_type']);

        if ($request->hasFile('image')) {
            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            $data['image'] = $request->file('image')->store('packages', 'public');
        }

        $package->update($data);

        return redirect()->route('company.packages.index')->with('success', 'Package updated successfully.');
    }

    /**
     * Remove the specified package.
     */
    public function destroy(Package $package): RedirectResponse
    {
        $this->authorize('delete', $package);

        if ($package->image) {
            Storage::disk('public')->delete($package->image);
        }

        $package->delete();

        return redirect()->route('company.packages.index')->with('success', 'Package deleted successfully.');
    }

    /**
     * Toggle the featured status of the package.
     */
    public function toggleFeatured(Package $package): RedirectResponse
    {
        $this->authorize('update', $package);

        $package->update(['is_featured' => !$package->is_featured]);

        return redirect()->route('company.packages.index')->with('success', 'Featured status toggled successfully.');
    }
}
