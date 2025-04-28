<?php
namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Login');
    }
    protected function attemptLogin(Request $request)
    {
        $credentials = $this->credentials($request);
        $user = \App\Models\User::where('email', $credentials['email'])->first();

        if ($user && !$user->is_active) {
            return false; 
        }

        return Auth::attempt($credentials, $request->filled('remember'));
    }
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);
    
        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();
            
            if ($user->is_active == 0) {
                Auth::logout();  
                return back()->withErrors([
                    'email' => 'Your account has been deactivated.',
                ]);
            }
    
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        }
    
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
    
    public function destroy(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    protected function credentials(Request $request)
    {
        return [
            'email' => $request->email,
            'password' => $request->password,
            'is_active' => 1,
        ];
    }
}