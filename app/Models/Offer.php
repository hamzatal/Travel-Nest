<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'price',
        'discount_price',
        'discount_type',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
    public function bookings()
    {
        return $this->hasMany(UserBooking::class, 'offer_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'offer_id');
    }
}

