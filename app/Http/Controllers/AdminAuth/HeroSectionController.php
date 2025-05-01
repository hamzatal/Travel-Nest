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
        return Inertia::render('Admin/HeroSectionsView', [
            'heroSections' => $heroSections,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'cta_text' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['title', 'subtitle', 'cta_text']);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('hero_sections', 'public');
        }

        HeroSection::create($data);

        return redirect()->route('admin.hero')->with('success', 'Hero section created successfully.');
    }

    public function update(Request $request, $id)
    {
        $heroSection = HeroSection::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'cta_text' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['title', 'subtitle', 'cta_text']);
        if ($request->hasFile('image')) {
            if ($heroSection->image) {
                Storage::disk('public')->delete($heroSection->image);
            }
            $data['image'] = $request->file('image')->store('hero_sections', 'public');
        }

        $heroSection->update($data);

        return redirect()->route('admin.hero')->with('success', 'Hero section updated successfully.');
    }

    public function destroy($id)
    {
        $heroSection = HeroSection::findOrFail($id);
        if ($heroSection->image) {
            Storage::disk('public')->delete($heroSection->image);
        }
        $heroSection->delete();
        return redirect()->route('admin.hero')->with('success', 'Hero section deleted successfully.');
    }
}