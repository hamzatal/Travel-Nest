<?php
namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    // Show all users
    public function index(Request $request)
    {
        $query = User::query();
        
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
        }
        
        if ($request->has('status') && $request->status != '') {
            if ($request->status == 'active') {
                $query->where('is_active', true);
            } elseif ($request->status == 'inactive') {
                $query->where('is_active', false);
            }
        }
        
        $users = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
    
    // Toggle User Active/Inactive - Fixed to use ID parameter
    public function toggleUserStatus($id)
    {
        $user = User::findOrFail($id);
        
        // Don't allow changing admin accounts
        if ($user->is_admin) {
            return back()->with('error', 'Cannot modify admin users.');
        }
        
        $user->is_active = !$user->is_active;
        $user->save();
        
        return back()->with('success', 'User status updated successfully.');
    }
}