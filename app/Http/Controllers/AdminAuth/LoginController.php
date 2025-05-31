<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia; 

class LoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Login');
    }

    public function store(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) { // Added remember functionality
                $admin = Auth::guard('admin')->user();
                if (method_exists($admin, 'update') && property_exists($admin, 'last_login')) { // Check if last_login can be set
                    $admin->last_login = now();
                    $admin->save();
                }

                $request->session()->regenerate();
                Log::info('Admin logged in:', ['admin_id' => $admin->id]);
                return redirect()->intended(route('admin.dashboard'));
            }

            Log::warning('Admin login failed:', ['email' => $request->email]);
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->with('error', 'Invalid login credentials.'); // This will be a flash message
        } catch (\Illuminate\Validation\ValidationException $e) { // Catch validation exception specifically
            Log::warning('Admin login validation failed:', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors())->withInput(); // Return with input and errors
        } catch (\Exception $e) {
            Log::error('Admin login error:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to login. Please try again later.');
        }
    }

    public function destroy(Request $request)
    {
        try {
            $adminId = Auth::guard('admin')->id(); // Get admin ID before logout
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            Log::info('Admin logged out:', ['admin_id' => $adminId]);
            return redirect()->route('admin.login');
        } catch (\Exception $e) {
            Log::error('Admin logout error:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to logout.');
        }
    }
}
