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
        'is_active'
    ];
}
