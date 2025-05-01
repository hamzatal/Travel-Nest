<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::select('id', 'name', 'email', 'is_active', 'created_at')
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

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

    public function toggleUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->deactivated_at = $user->is_active ? null : now();
        $user->deactivation_reason = $user->is_active ? null : 'Deactivated by admin';
        $user->save();

        if (!$user->is_active) {
            \Illuminate\Support\Facades\DB::table('sessions')
                ->where('user_id', $user->id)
                ->delete();
        }

        $status = $user->is_active ? 'activated' : 'deactivated';
        \Illuminate\Support\Facades\Log::info("User {$user->id} $status by admin " . \Illuminate\Support\Facades\Auth::guard('admin')->id());
        return redirect()->route('admin.users.index')->with('success', "User $status successfully");
    }

    public function showContacts(Request $request)
    {
        $query = Contact::select('id', 'name', 'email', 'subject', 'message', 'created_at', 'is_read')
            ->orderBy('created_at', 'desc');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $messages = $query->get();

        return Inertia::render('Admin/ContactsView', [
            'messages' => $messages,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function destroyContact($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->delete();
            return redirect()->route('admin.messages')->with('success', 'Message deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.messages')->with('error', 'Failed to delete message.');
        }
    }

    public function replyContact(Request $request, $id)
    {
        // Log request entry
        Log::info("Entering replyContact", [
            'id' => $id,
            'method' => $request->method(),
            'data' => $request->all(),
            'headers' => $request->headers->all(),
        ]);

        // Validate request data
        $request->validate([
            'message' => 'required|string',
        ]);

        try {
            // Fetch contact
            Log::info("Fetching contact", ['id' => $id]);
            $contact = Contact::findOrFail($id);
            Log::info("Contact found", [
                'email' => $contact->email,
                'subject' => $contact->subject,
            ]);

            // Validate email
            if (!filter_var($contact->email, FILTER_VALIDATE_EMAIL)) {
                Log::error("Invalid email address", ['email' => $contact->email]);
                throw new \Exception("Invalid email address: {$contact->email}");
            }

            // Update contact as read
            Log::info("Marking contact as read");
            $contact->is_read = true;
            $contact->save();

            // Send plain-text email
            Log::info("Attempting to send email", ['to' => $contact->email]);
            Mail::raw($request->message, function ($message) use ($contact) {
                $message->to($contact->email)
                        ->subject("Reply to: {$contact->subject}")
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info("Email sent successfully", ['to' => $contact->email]);

            // Return success response
            return redirect()->route('admin.messages')->with('success', 'Reply sent successfully.');
        } catch (\Exception $e) {
            // Log error details
            Log::error("Failed to process replyContact", [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->route('admin.messages')->with('error', 'Failed to send reply: ' . $e->getMessage());
        }
    }

    public function dashboard()
    {
        $stats = [
            'users' => User::count(),
            'messages' => Contact::count(),
            'unread_messages' => Contact::where('is_read', false)->count(),
            'destinations' => 0,
            'offers' => 0,
            'hero_sections' => 0,
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