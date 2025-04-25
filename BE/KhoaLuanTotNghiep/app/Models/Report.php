<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports';

    protected $fillable = [ 
        'total_order',
        'total_amount',
        'type',
        'report_date'
    ];

    protected $casts = [
        'report_date' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    // Quan hệ với user (nếu cần dùng)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}