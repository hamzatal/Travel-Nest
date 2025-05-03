<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'bookable_type',
        'bookable_id',
        'start_date',
        'end_date',
        'guests',
        'price',
        'special_requests',
        'status',
        'payment_status',
        'payment_method',
        'transaction_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'price' => 'decimal:2',
    ];

    /**
     * Get the user who made the booking.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the bookable item (destination, package, or deal).
     */
    public function bookable()
    {
        return $this->morphTo();
    }

    /**
     * Get the payment associated with the booking.
     */
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Calculate the total duration of the booking in days.
     *
     * @return int
     */
    public function getDurationInDaysAttribute()
    {
        return $this->start_date->diffInDays($this->end_date);
    }

    /**
     * Calculate the total price of the booking.
     *
     * @return float
     */
    public function getTotalPriceAttribute()
    {
        return $this->price * $this->getDurationInDaysAttribute();
    }

    /**
     * Scope a query to only include bookings with a specific status.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if booking can be cancelled.
     *
     * @return bool
     */
    public function canBeCancelled()
    {
        // Can be cancelled if status is pending or confirmed and start date is at least 24 hours away
        return in_array($this->status, ['pending', 'confirmed']) &&
            $this->start_date->diffInHours(now()) >= 24;
    }
}
