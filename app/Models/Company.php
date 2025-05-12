<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_name',
        'license_number',
        'email',
        'password',
        'avatar',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login' => 'datetime',
    ];

    // Relationship with Packages
    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    // Relationship with Destinations
    public function destinations()
    {
        return $this->hasMany(Destination::class);
    }

    // Relationship with Offers
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
}
