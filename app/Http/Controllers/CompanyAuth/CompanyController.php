<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Handle company login.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('company')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Log the company out of the application.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('company')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Display the company profile.
     */
    public function profile(): Response
    {
        return Inertia::render('Company/Profile', [
            'company' => Auth::guard('company')->user(),
        ]);
    }

    /**
     * Update the company profile.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $company = Auth::guard('company')->user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'license_number' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:companies,email,' . $company->id],
        ]);

        $company->update($request->only(['name', 'company_name', 'license_number', 'email']));

        return redirect()->route('company.profile')->with('success', 'Profile updated successfully.');
    }
}
