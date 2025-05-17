<?php

namespace App\Http\Controllers\CompanyAuth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::guard('company')->attempt($credentials, $request->boolean('remember'))) {
                $company = Auth::guard('company')->user();
                $company->last_login = now();
                $company->save();

                $request->session()->regenerate();
                Log::info('Company logged in:', ['company_id' => $company->id]);
                return redirect()->intended(route('company.dashboard'));
            }

            Log::warning('Company login failed:', ['email' => $request->email]);
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->with('error', 'Invalid login credentials.');
        } catch (\Exception $e) {
            Log::error('Company login error:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to login.');
        }
    }

    public function logout(Request $request)
    {
        try {
            $companyId = Auth::guard('company')->id();
            Auth::guard('company')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            Log::info('Company logged out:', ['company_id' => $companyId]);
            return redirect()->route('login');
        } catch (\Exception $e) {
            Log::error('Company logout error:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to logout.');
        }
    }

    public function profile()
    {
        try {
            $company = Auth::guard('company')->user();

            return Inertia::render('Company/Profile', [
                'company' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'company_name' => $company->company_name,
                    'license_number' => $company->license_number,
                    'email' => $company->email,
                    'avatar' => $company->avatar ? Storage::url($company->avatar) : null,
                    'last_login' => $company->last_login,
                    'created_at' => $company->created_at,
                    'updated_at' => $company->updated_at,
                ],
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch company profile:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load profile.');
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $company = Auth::guard('company')->user();

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'company_name' => ['required', 'string', 'max:255'],
                'license_number' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:companies,email,' . $company->id],
                'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            ]);

            if ($request->hasFile('avatar')) {
                if ($company->avatar) {
                    Storage::disk('public')->delete($company->avatar);
                }
                $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
            } else {
                unset($validated['avatar']);
            }

            $company->update($validated);

            Log::info('Company profile updated:', ['company_id' => $company->id]);
            return redirect()->route('company.profile')->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update company profile:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update profile.');
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $company = Auth::guard('company')->user();

            $validated = $request->validate([
                'current_password' => ['required', 'string'],
                'new_password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            if (!Hash::check($validated['current_password'], $company->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }

            $company->password = Hash::make($validated['new_password']);
            $company->save();

            Log::info('Company password updated:', ['company_id' => $company->id]);
            return redirect()->route('company.profile')->with('success', 'Password updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update company password:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update password.');
        }
    }
}
