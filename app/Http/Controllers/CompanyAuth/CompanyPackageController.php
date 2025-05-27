<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class CompanyPackageController extends Controller
{
    // Index method removed as it's handled by CompanyDashboardController
    // The dashboard provides all necessary data for rendering packages.

    public function store(Request $request)
    {
        try {
            $company = Auth::guard('company')->user();
            if (!$company->is_active) {
                return back()->with('error', 'Your company is not active. Please contact the admin.');
            }

            $validated = $request->validate([
                'destination_id' => 'required|exists:destinations,id',
                'title' => 'required|string|max:255|min:3',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'required|string|min:10|max:5000',
                'price' => 'required|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|in:percentage,fixed',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'category' => 'nullable|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'duration' => 'nullable|integer|min:1',
                'group_size' => 'nullable|integer|min:1',
                'is_active' => 'boolean',
                'is_featured' => 'boolean',
            ]);

            // Verify destination belongs to the company for security
            $destination = Destination::where('id', $validated['destination_id'])
                ->where('company_id', $company->id)
                ->first();
            if (!$destination) {
                throw ValidationException::withMessages(['destination_id' => 'Selected destination does not belong to your company.']);
            }

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $validated['image'] = $request->file('image')->store('packages', 'public');
            } else {
                throw ValidationException::withMessages(['image' => 'Invalid or missing image file.']);
            }

            $validated['company_id'] = $company->id;
            $validated['is_active'] = $validated['is_active'] ?? true;
            $validated['is_featured'] = $validated['is_featured'] ?? false;
            // Add location from destination if not provided
            $validated['location'] = $destination->location;

            Package::create($validated);

            return redirect()->route('company.dashboard')->with('success', 'Package created successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to create package: ' . $e->getMessage());
            return back()->with('error', 'Failed to create package. ' . $e->getMessage());
        }
    }

    public function update(Request $request, Package $package)
    {
        try {
            $company = Auth::guard('company')->user();
            if ($package->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized to update this package.');
            }

            $validated = $request->validate([
                'destination_id' => 'required|exists:destinations,id',
                'title' => 'required|string|max:255|min:3',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'required|string|min:10|max:5000',
                'price' => 'required|numeric|min:0.01',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'discount_type' => 'nullable|in:percentage,fixed',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'category' => 'nullable|in:Beach,Mountain,City,Cultural,Adventure,Historical,Wildlife',
                'duration' => 'nullable|integer|min:1',
                'group_size' => 'nullable|integer|min:1',
                'is_active' => 'boolean',
                'is_featured' => 'boolean',
            ]);

            // Verify destination belongs to the company during update
            $destination = Destination::where('id', $validated['destination_id'])
                ->where('company_id', $company->id)
                ->first();
            if (!$destination) {
                throw ValidationException::withMessages(['destination_id' => 'Selected destination does not belong to your company.']);
            }

            $dataToUpdate = $validated;
            unset($dataToUpdate['image']); // Handle image separately

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                if ($package->image) {
                    Storage::disk('public')->delete($package->image);
                }
                $dataToUpdate['image'] = $request->file('image')->store('packages', 'public');
            }

            $package->update($dataToUpdate);

            return redirect()->route('company.dashboard')->with('success', 'Package updated successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to update package ID ' . $package->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update package. ' . $e->getMessage());
        }
    }

    public function destroy(Package $package)
    {
        try {
            $company = Auth::guard('company')->user();
            if ($package->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized to delete this package.');
            }

            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            $package->delete();

            return redirect()->route('company.dashboard')->with('success', 'Package deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete package ID ' . $package->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete package. ' . $e->getMessage());
        }
    }

    public function toggleFeatured(Package $package)
    {
        try {
            $company = Auth::guard('company')->user();
            if ($package->company_id !== $company->id) {
                return back()->with('error', 'Unauthorized to modify this package.');
            }

            $package->is_featured = !$package->is_featured;
            $package->save();

            $message = $package->is_featured ? 'Package set as featured.' : 'Package removed from featured.';
            return redirect()->route('company.dashboard')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle featured status for package ID ' . $package->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to toggle featured status. ' . $e->getMessage());
        }
    }

    public function toggleActive(Package $package)
    {
        try {
            $package->is_active = !$package->is_active;
            $package->save();

            $message = $package->is_active ? 'Package activated.' : 'Package deactivated.';
            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle active status for package ID ' . $package->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to toggle active status.');
        }
    }
}
