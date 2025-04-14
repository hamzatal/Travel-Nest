<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Review;

class Deal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'featured_image_url',
        'gallery_images',
        'location',
        'latitude',
        'longitude',
        'average_rating',
        'review_count',
        'duration',
        'original_price',
        'discounted_price',
        'discount_percentage',
        'valid_until',
        'category_id',
        'features',
        'inclusions',
        'exclusions',
        'itinerary',
        'is_trending',
        'is_active',
        'popularity_score',
        'availability_dates'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'valid_until' => 'datetime',
        'gallery_images' => 'array',
        'features' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'itinerary' => 'array',
        'is_trending' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'average_rating' => 'float',
        'review_count' => 'integer',
        'popularity_score' => 'integer',
        'availability_dates' => 'array'
    ];

    /**
     * Get the category that the deal belongs to
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the featured deal associated with this deal
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function featuredDeal()
    {
        return $this->hasOne(FeaturedDeal::class);
    }

    /**
     * Get the users who have favorited this deal
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_favorites', 'deal_id', 'user_id')
                    ->withTimestamps();
    }

    /**
     * Get the reviews for this deal
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Scope a query to only include active deals
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where('valid_until', '>=', now());
    }

    /**
     * Scope a query to only include trending deals
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTrending($query)
    {
        return $query->where('is_trending', true);
    }

    /**
     * Scope a query to get last minute deals
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLastMinute($query)
    {
        return $query->active()
                     ->where('valid_until', '<=', now()->addDays(7))
                     ->orderBy('valid_until', 'asc');
    }

    /**
     * Calculate time remaining until the deal expires
     *
     * @return int
     */
    public function getHoursRemainingAttribute()
    {
        return now()->diffInHours($this->valid_until);
    }
}