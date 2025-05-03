<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'discount_price',
        'start_date',
        'end_date',
        'duration',
        'destination',
        'image',
        'rating',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
