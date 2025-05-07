<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class BookController extends Controller
{
    /**
     * Show the booking form for a specific destination.
     */
    public function create(Request $request)
    {
        // Get destination_id from query string
        $destinationId = $request->query('destination_id');

        // Fetch the destination
        $destination = Destination::findOrFail($destinationId);

        // Render the Book page with destination and auth data
        return Inertia::render('Book/Book', [
            'destination' => [
                'id' => $destination->id,
                'name' => $destination->name,
                'location' => $destination->location,
                'price' => $destination->price,
                'discount_price' => $destination->discount_price,
            ],
            'auth' => Auth::user() ? [
                'user' => Auth::user(),
            ] : null,
        ]);
    }

    /**
     * Store a new booking in the database.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1|max:8',
            'notes' => 'nullable|string|max:500',
            'total_price' => 'required|numeric|min:0',
        ]);

        // Create the booking
        $book = Book::create([
            'user_id' => Auth::id(),
            'destination_id' => $validated['destination_id'],
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'notes' => $validated['notes'],
            'total_price' => $validated['total_price'],
            'status' => 'pending',
        ]);

        // Redirect back with success message
        return Redirect::route('book.create', ['destination_id' => $validated['destination_id']])
            ->with('success', 'Booking confirmed successfully!');
    }
}
