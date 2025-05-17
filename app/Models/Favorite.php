<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'destination_id',
        'package_id',
        'offer_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($favorite) {
            $validator = Validator::make($favorite->toArray(), [
                'destination_id' => 'nullable|exists:destinations,id',
                'package_id' => 'nullable|exists:packages,id',
                'offer_id' => 'nullable|exists:offers,id',
            ], [
                'at_least_one' => 'At least one of destination_id, package_id, or offer_id must be provided.',
            ]);

            $validator->after(function ($validator) use ($favorite) {
                if (!$favorite->destination_id && !$favorite->package_id && !$favorite->offer_id) {
                    $validator->errors()->add('at_least_one', 'At least one of destination_id, package_id, or offer_id must be provided.');
                }
            });

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        });

        static::updating(function ($favorite) {
            $validator = Validator::make($favorite->toArray(), [
                'destination_id' => 'nullable|exists:destinations,id',
                'package_id' => 'nullable|exists:packages,id',
                'offer_id' => 'nullable|exists:offers,id',
            ], [
                'at_least_one' => 'At least one of destination_id, package_id, or offer_id must be provided.',
            ]);

            $validator->after(function ($validator) use ($favorite) {
                if (!$favorite->destination_id && !$favorite->package_id && !$favorite->offer_id) {
                    $validator->errors()->add('at_least_one', 'At least one of destination_id, package_id, or offer_id must be provided.');
                }
            });

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        });
    }
}
