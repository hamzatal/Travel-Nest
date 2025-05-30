<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Company;
use App\Models\Destination;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PackagesController extends Controller
{
    public function indexPublic()
    {
        $user = auth()->user();
        $packages = Package::with(['company', 'destination'])->get()->map(function ($package) use ($user) {
            $favorite = $user
                ? Favorite::where('user_id', $user->id)
                ->where('package_id', $package->id)
                ->first()
                : null;
            return array_merge($package->toArray(), [
                'is_favorite' => $favorite ? true : false,
                'favorite_id' => $favorite ? $favorite->id : null,
            ]);
        });
        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'auth' => $user ? ['user' => $user] : null,
        ]);
    }

    public function show($id)
    {
        $package = Package::with('company')->findOrFail($id);

        $isFavorite = false;
        $favoriteId = null;

        if (Auth::guard('web')->check()) {
            $favorite = Favorite::where('user_id', Auth::guard('web')->id())
                ->where('package_id', $package->id)
                ->first();

            if ($favorite) {
                $isFavorite = true;
                $favoriteId = $favorite->id;
            }
        }

        return Inertia::render('Packages/Show', [
            'package' => [
                'id' => $package->id,
                'title' => $package->title,
                'description' => $package->description,
                'location' => $package->location,
                'category' => $package->category,
                'image' => $package->image,
                'price' => $package->price,
                'discount_price' => $package->discount_price,
                'rating' => $package->rating,
                'is_featured' => $package->is_featured,
                'company' => $package->company ? [
                    'id' => $package->company->id,
                    'company_name' => $package->company->company_name,
                ] : null,
                'is_favorite' => $isFavorite,
                'favorite_id' => $favoriteId,
            ],
            'auth' => Auth::guard('web')->user() ? ['user' => Auth::guard('web')->user()] : null,
        ]);
    }

    public function index()
    {
        $packages = Package::with('company')->get();

        return Inertia::render('Packages/Index', [
            'packages' => $packages->map(function ($package) {
                $isFavorite = false;
                $favoriteId = null;

                if (Auth::guard('web')->check()) {
                    $favorite = Favorite::where('user_id', Auth::guard('web')->id())
                        ->where('package_id', $package->id)
                        ->first();

                    if ($favorite) {
                        $isFavorite = true;
                        $favoriteId = $favorite->id;
                    }
                }

                return [
                    'id' => $package->id,
                    'title' => $package->title,
                    'description' => $package->description,
                    'location' => $package->location,
                    'category' => $package->category,
                    'image' => $package->image,
                    'price' => $package->price,
                    'discount_price' => $package->discount_price,
                    'rating' => $package->rating,
                    'is_featured' => $package->is_featured,
                    'company' => $package->company ? [
                        'id' => $package->company->id,
                        'company_name' => $package->company->company_name,
                    ] : null,
                    'is_favorite' => $isFavorite,
                    'favorite_id' => $favoriteId,
                ];
            }),
            'auth' => Auth::guard('web')->user() ? ['user' => Auth::guard('web')->user()] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'destination_id' => 'required|exists:destinations,id',
            'title' => 'required|string|max:255|min:3',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string|min:10|max:5000',
            'price' => 'required|numeric|min:0.01',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'discount_type' => 'nullable|in:percentage,fixed',
            'start_date' => 'nullable|date|after_or_equal:today',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_featured' => 'boolean',
            'location' => 'nullable|string|max:100',
        ]);

        $validated['image'] = $request->file('image')->store('packages', 'public');
        Package::create($validated);

        return redirect()->route('admin.packages.index')->with('success', 'Package created successfully.');
    }

    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'destination_id' => 'required|exists:destinations,id',
            'title' => 'required|string|max:255|min:3',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string|min:10|max:5000',
            'price' => 'required|numeric|min:0.01',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'discount_type' => 'nullable|in:percentage,fixed',
            'start_date' => 'nullable|date|after_or_equal:today',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_featured' => 'boolean',
            'location' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('image')) {
            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            $validated['image'] = $request->file('image')->store('packages', 'public');
        } else {
            $validated['image'] = $package->image;
        }

        $package->update($validated);

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

        return redirect()->route('admin.packages.index')->with(
            'success',
            $package->is_featured ? 'Package set as featured.' : 'Package removed from featured.'
        );
    }
}
