<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'subtitle',
        'description',
        'price',
        'discount_price',
        'discount_type',
        'start_date',
        'end_date',
        'image',
        'location',
        'duration',
        'group_size',
        'inclusions',
        'itinerary',
        'tag',
        'rating',
        'is_featured',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_featured' => 'boolean',
        'inclusions' => 'array',
        'itinerary' => 'array',
    ];

    // Relationship with Company
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Relationship with Bookings
    public function bookings()
    {
        return $this->hasMany(UserBooking::class, 'package_id');
    }
}