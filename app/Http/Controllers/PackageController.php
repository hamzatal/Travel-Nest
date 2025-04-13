<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::all();
        return Inertia::render('Packages', [
            'packages' => $packages,
        ]);
    }
}