<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{


    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'status', 'created_at')->get();
        return response()->json($users);
    }

    public function toggleUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->status = $request->status;
        $user->save();

        return response()->json($user);
    }

    public function showContacts()
    {
        $messages = Contact::select('id', 'name', 'email', 'subject', 'message', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/ContactsView', [
            'messages' => $messages
        ]);
    }


    public function getAdminProfile()
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

    public function updateAdminProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $admin->id,
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
}
