<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Message;
use App\Models\Destination;
use App\Models\Offer;
use App\Models\Hero;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index()
    {
        // Add logic to fetch and return data for the admin dashboard
        return response()->json(['message' => 'Admin Dashboard']);
    }
    /**
     * Display admin dashboard
     */
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'admin' => Auth::user(),
            'stats' => [
                'users' => User::count(),
                'messages' => Contact::count(),
                'unread_messages' => Contact::where('is_read', false)->count(),
                'destinations' => Destination::count(),
                'offers' => Offer::count(),
                'hero_sections' => Hero::count(),
            ],              

            'latest_users' => User::latest()->take(5)->get(),
            'latest_messages' => Contact::with('user')->latest()->take(5)->get(),
        ]);
    }

    /**
     * Display all users
     */
    public function users()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::latest()->paginate(10),
        ]);
    }

    /**
     * Toggle user active status
     */
    public function toggleUserStatus(User $user)
    {
        // Prevent deactivating yourself
        if (Auth::id() === $user->id) {
            return back()->with('error', 'You cannot deactivate your own account');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return back()->with('success', $user->is_active ? 
            'User has been activated successfully' : 
            'User has been deactivated successfully');
    }

    /**
     * Display all messages
     */
    public function messages()
    {
        return Inertia::render('Admin/Messages', [
            'messages' => Contact::with('user')->latest()->paginate(10),
        ]);
    }

    /**
     * Mark message as read
     */
    public function markMessageAsRead(Contact $message)
    {
        $message->is_read = true;
        $message->save();

        return back()->with('success', 'Message marked as read');
    }

    /**
     * Display all destinations
     */
    public function destinations()
    {
        return Inertia::render('Admin/Destinations', [
            'destinations' => Destination::latest()->paginate(10),
        ]);
    }

    /**
     * Toggle destination active status
     */
    public function toggleDestinationStatus(Destination $destination)
    {
        $destination->is_active = !$destination->is_active;
        $destination->save();

        return back()->with('success', $destination->is_active ? 
            'Destination has been activated successfully' : 
            'Destination has been deactivated successfully');
    }

    /**
     * Display all offers
     */
    public function offers()
    {
        return Inertia::render('Admin/Offers', [
            'offers' => Offer::latest()->paginate(10),
        ]);
    }

    /**
     * Toggle offer active status
     */
    public function toggleOfferStatus(Offer $offer)
    {
        $offer->is_active = !$offer->is_active;
        $offer->save();

        return back()->with('success', $offer->is_active ? 
            'Offer has been activated successfully' : 
            'Offer has been deactivated successfully');
    }

    /**
     * Display all hero sections
     */
    public function heroSections()
    {
        return Inertia::render('Admin/HeroSections', [
            'hero_sections' => Hero::latest()->paginate(10),
        ]);
    }

    /**
     * Toggle hero section active status
     */
    public function toggleHeroSectionStatus(Hero $heroSection)
    {
        $heroSection->is_active = !$heroSection->is_active;
        $heroSection->save();

        return back()->with('success', $heroSection->is_active ? 
            'Hero section has been activated successfully' : 
            'Hero section has been deactivated successfully');
    }
}