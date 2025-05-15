<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'image',
        'price',
        'discount_price',
        'tag',
        'rating',
        'is_featured',
    ];
    public function bookings()
    {
        return $this->hasMany(UserBooking::class, 'destination_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'destination_id');
    }
}
