<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\ContactMessage;

class AdminContactMessageController extends Controller
{
    /**
     * Display a listing of the messages.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $messages = ContactMessage::latest()->paginate(10);

        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
        ]);
    }

    /**
     * Show the specified message.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);
        
        // Mark as read if not already
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('Admin/MessagesShow', [
            'message' => $message,
        ]);
    }

    /**
     * Mark a message as read.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Message marked as read');
    }

    /**
     * Mark a message as unread.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsUnread($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => false]);

        return redirect()->back()->with('success', 'Message marked as unread');
    }

    /**
     * Remove the specified message from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return redirect()->route('admin.messages')->with('success', 'Message deleted successfully');
    }
}