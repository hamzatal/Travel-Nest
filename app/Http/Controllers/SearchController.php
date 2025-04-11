<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        $results = [];
        if ($query) {
            $results = collect([
                ['name' => 'Santorini, Greece', 'image' => 'https://images.unsplash.com/photo-1602081593934-2b93e2c2a1e2', 'price' => '$1,200'],
                ['name' => 'Kyoto, Japan', 'image' => 'https://images.unsplash.com/photo-1545565078-6aa49e01e369', 'price' => '$1,450'],
                ['name' => 'Patagonia, Chile', 'image' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 'price' => '$1,800'],
            ])->filter(function ($item) use ($query) {
                return stripos($item['name'], $query) !== false;
            })->values()->all();
        }

        return Inertia::render('SearchResults', [
            'results' => $results,
        ]);
    }
}