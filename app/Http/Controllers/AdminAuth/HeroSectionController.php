<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroSectionController extends Controller
{
    public function index()
    {
        $heroSections = HeroSection::all();
        return inertia('Admin/Hero/AdminHero', [
            'heroSections' => $heroSections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:255',
            'subtitle' => 'required|string|min:3|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imageName = time() . '.' . $request->image->extension();
        $request->image->storeAs('hero', $imageName, 'public');

        HeroSection::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'],
            'image' => 'hero/' . $imageName,
            'is_active' => false,
        ]);

        return redirect()->route('admin.hero.index')->with('success', 'Hero section added successfully.');
    }

    public function update(Request $request, $id)
    {
        $hero = HeroSection::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|min:3|max:255',
            'subtitle' => 'nullable|string|min:3|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = array_filter([
            'title' => $validated['title'] ?? $hero->title,
            'subtitle' => $validated['subtitle'] ?? $hero->subtitle,
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($hero->image);
            $imageName = time() . '.' . $request->image->extension();
            $request->image->storeAs('hero', $imageName, 'public');
            $data['image'] = 'hero/' . $imageName;
        }

        if (!empty($data)) {
            $hero->update($data);
        }

        return redirect()->route('admin.hero.index')->with('success', 'Hero section updated successfully.');
    }

    public function destroy($id)
    {
        $hero = HeroSection::findOrFail($id);
        Storage::disk('public')->delete($hero->image);
        $hero->delete();

        return redirect()->route('admin.hero.index')->with('success', 'Hero section deleted successfully.');
    }

    public function toggleActive($id)
    {
        $hero = HeroSection::findOrFail($id);
        $hero->is_active = !$hero->is_active;
        $hero->save();

        $message = $hero->is_active ? 'Hero section activated successfully.' : 'Hero section deactivated successfully.';
        return redirect()->route('admin.hero.index')->with('success', $message);
    }
}
