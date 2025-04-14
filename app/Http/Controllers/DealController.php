<?php
namespace App\Http\Controllers;

use App\Models\Deal;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Deal', [
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}