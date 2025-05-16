<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyPackageController extends Controller
{

    public function index()
    {
        $packages = Package::where('company_id', auth('company')->id())->get();
        return Inertia::render('Company/Dashboard', ['packages' => $packages]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            // Add other fields as needed
        ]);

        $package = Package::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'company_id' => auth('company')->id(),
            // Add other fields as needed
        ]);

        return response()->json(['message' => 'Package created successfully', 'package' => $package], 201);
    }


    public function update(Request $request, Package $package)
    {
        $this->authorize('update', $package);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            // Add other fields as needed
        ]);

        $package->update($validated);

        return response()->json(['message' => 'Package updated successfully'], 200);
    }

    public function destroy(Package $package)
    {
        $this->authorize('delete', $package);

        $package->delete();

        return response()->json(['message' => 'Package deleted successfully'], 200);
    }
}
