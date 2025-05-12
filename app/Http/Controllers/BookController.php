<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Package;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class BookController extends Controller
{
    /**
     * Show the booking form for a specific destination or package.
     */
    public function create(Request $request)
    {
        // Get destination_id or package_id from query string
        $destinationId = $request->query('destination_id');
        $packageId = $request->query('package_id');

        $data = [
            'auth' => Auth::user() ? [
                'user' => Auth::user(),
            ] : null,
        ];

        // Handle destination booking
        if ($destinationId) {
            $destination = Destination::findOrFail($destinationId);
            $data['destination'] = [
                'id' => $destination->id,
                'name' => $destination->name,
                'location' => $destination->location,
                'price' => $destination->price,
                'discount_price' => $destination->discount_price,
            ];
        }

        // Handle package booking
        if ($packageId) {
            $package = Package::findOrFail($packageId);
            $data['package'] = [
                'id' => $package->id,
                'title' => $package->title,
                'location' => $package->location,
                'price' => $package->price,
                'discount_price' => $package->discount_price,
            ];
        }

        // Ensure at least one ID is provided
        if (!$destinationId && !$packageId) {
            return Inertia::render('Error', [
                'message' => 'No destination or package specified.',
            ]);
        }

        // Render the Book page with data
        return Inertia::render('Book/Book', $data);
    }

    /**
     * Store a new booking in the database.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'destination_id' => 'nullable|exists:destinations,id',
            'package_id' => 'nullable|exists:packages,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1|max:8',
            'notes' => 'nullable|string|max:500',
            'total_price' => 'required|numeric|min:0',
        ]);

        // Ensure at least one of destination_id or package_id is provided
        if (!$validated['destination_id'] && !$validated['package_id']) {
            return Redirect::back()->withErrors(['error' => 'A destination or package must be specified.']);
        }

        // Create the booking
        $book = Book::create([
            'user_id' => Auth::id(),
            'destination_id' => $validated['destination_id'],
            'package_id' => $validated['package_id'],
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'notes' => $validated['notes'],
            'total_price' => $validated['total_price'],
            'status' => 'pending',
        ]);

        // Redirect back with success message
        $redirectParams = [];
        if ($validated['destination_id']) {
            $redirectParams['destination_id'] = $validated['destination_id'];
        }
        if ($validated['package_id']) {
            $redirectParams['package_id'] = $validated['package_id'];
        }

        return Redirect::route('book.create', $redirectParams)
            ->with('success', 'Booking confirmed successfully!');
    }
}
