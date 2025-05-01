<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HeroSectionController extends Controller
{
    public function index()
    {
        $heroSections = HeroSection::all();
        return Inertia::render('Admin/HeroSectionsView', ['heroSections' => $heroSections]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imageName = $request->file('image')->store('hero_sections', 'public');
        $imageName = basename($imageName);

        HeroSection::create([
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'image' => $imageName,
            'is_active' => true, // Default to active
        ]);

        return redirect()->route('admin.hero')->with('success', 'Hero section created successfully.');
    }

    public function update(Request $request, $id)
    {
        $hero = HeroSection::findOrFail($id);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [];
        if ($request->filled('title')) {
            $data['title'] = $request->title;
        }
        if ($request->filled('subtitle')) {
            $data['subtitle'] = $request->subtitle;
        }
        if ($request->hasFile('image')) {
            if ($hero->image) {
                Storage::disk('public')->delete('hero_sections/' . $hero->image);
            }
            $imageName = $request->file('image')->store('hero_sections', 'public');
            $data['image'] = basename($imageName);
        }

        if (!empty($data)) {
            $hero->update($data);
        }

        return redirect()->route('admin.hero')->with('success', 'Hero section updated successfully.');
    }


    public function destroy($id)
    {
        $hero = HeroSection::findOrFail($id);
        Storage::disk('public')->delete($hero->image);
        $hero->delete();

        return redirect()->route('admin.hero')->with('success', 'Hero section deleted successfully.');
    }
    public function toggleActive($id)
    {
        $hero = HeroSection::findOrFail($id);
        $hero->is_active = !$hero->is_active;
        $hero->save();

        $message = $hero->is_active ? 'Hero section activated successfully.' : 'Hero section deactivated successfully.';
        return redirect()->route('admin.hero')->with('success', $message);
    }
}
