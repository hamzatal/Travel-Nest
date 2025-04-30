<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = User::select('id', 'name', 'email', 'is_active', 'created_at')
            ->latest();

        // Handle search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Handle status filter
        if ($status = $request->input('status')) {
            $query->where('is_active', $status === 'active' ? 1 : 0);
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Toggle the status of a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        return redirect()->route('admin.users.index')->with('success', "User $status successfully");
    }

    /**
     * Display contact messages.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function showContacts(Request $request)
    {
        $messages = Contact::select('id', 'name', 'email', 'subject', 'message', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($request->expectsJson()) {
            return response()->json(['messages' => $messages]);
        }

        return Inertia::render('Admin/ContactsView', [
            'messages' => $messages
        ]);
    }

    /**
     * Get the admin's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAdminProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'avatar' => $admin->image ? Storage::url($admin->image) : null,
            'last_login' => $admin->last_login,
        ]);
    }

    /**
     * Update the admin's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAdminProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email,' . $admin->id,
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:8',
            'profileImage' => 'nullable|image|max:2048',
        ]);

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];

        if ($request->currentPassword && $request->newPassword) {
            if (!Hash::check($request->currentPassword, $admin->password)) {
                return response()->json(['error' => 'Current password is incorrect'], 422);
            }
            $admin->password = Hash::make($validated['newPassword']);
        }

        if ($request->hasFile('profileImage')) {
            if ($admin->image) {
                Storage::delete($admin->image);
            }
            $path = $request->file('profileImage')->store('admin_images', 'public');
            $admin->image = $path;
        }

        $admin->save();

        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'avatar' => $admin->image ? Storage::url($admin->image) : null,
            'last_login' => $admin->last_login,
        ]);
    }

    public function dashboard()
{
    $stats = [
        'users' => User::count(),
        'messages' => Contact::count(),
        'unread_messages' => Contact::where('is_read', false)->count(),
        'destinations' => 0, // Replace with Destination::count() if model exists
        'offers' => 0, // Replace with Offer::count() if model exists
        'hero_sections' => 0, // Replace with HeroSection::count() if model exists
    ];

    $latest_users = User::select('id', 'name', 'email', 'created_at')
        ->latest()
        ->take(5)
        ->get();

    $latest_messages = Contact::select('id', 'name', 'email', 'message', 'created_at', 'is_read')
        ->latest()
        ->take(5)
        ->get();

    return Inertia::render('Admin/Dashboard', [
        'stats' => $stats,
        'latest_users' => $latest_users,
        'latest_messages' => $latest_messages,
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
    ]);
}
}