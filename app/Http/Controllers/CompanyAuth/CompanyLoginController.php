<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyLoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Company/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('company')->attempt($credentials)) {
            $request->session()->regenerate();
            Auth::guard('company')->user()->update(['last_login' => now()]);
            return redirect()->intended(route('company.dashboard'))->with('success', 'Logged in successfully!');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        Auth::guard('company')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/')->with('success', 'Logged out successfully!');
    }
}
