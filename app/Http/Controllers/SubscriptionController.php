<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function getTotalRevenue()
    {
        $totalRevenue = DB::table('subscriptions')
            ->where('status', 'active')
            ->sum('price');

        return response()->json([
            'total_revenue' => $totalRevenue
        ]);
    }
}