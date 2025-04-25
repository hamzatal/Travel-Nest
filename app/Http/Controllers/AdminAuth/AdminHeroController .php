<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Hero;
use Illuminate\Support\Facades\Storage;

class AdminHeroController extends Controller
{
    /**
     * Display a listing of the hero sections.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $heroes = Hero::latest()->paginate(10);

        return Inertia::render('Admin/HeroSections/Hero', [
            'Heros' => $heroes,
        ]);
    }

    /**
     * Show the form for creating a new hero section.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/HeroSections/Create');
    }

    /**
     * Store a newly created hero section in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hero', 'public');
            $validated['image'] = $path;
        }

        Hero::create($validated);

        return redirect()->route('admin.hero-sections')->with('success', 'Hero section created successfully');
    }

    /**
     * Show the form for editing the specified hero section.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $hero = Hero::findOrFail($id);

        return Inertia::render('Admin/HeroSections/Edit', [
            'Hero' => $hero,
        ]);
    }

    /**
     * Update the specified hero section in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $hero = Hero::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($hero->image) {
                Storage::disk('public')->delete($hero->image);
            }
            
            $path = $request->file('image')->store('hero', 'public');
            $validated['image'] = $path;
        }

        $hero->update($validated);

        return redirect()->route('admin.hero-sections')->with('success', 'Hero section updated successfully');
    }

    /**
     * Remove the specified hero section from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $hero = Hero::findOrFail($id);
        
        // Delete image
        if ($hero->image) {
            Storage::disk('public')->delete($hero->image);
        }
        
        $hero->delete();

        return redirect()->route('admin.hero-sections')->with('success', 'Hero section deleted successfully');
    }

    /**
     * Toggle the active status of the hero section.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleActive($id)
    {
        $hero = Hero::findOrFail($id);
        $hero->update(['is_active' => !$hero->is_active]);

        return redirect()->back()->with('success', 'Hero section active status updated');
    }
}
