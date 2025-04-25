<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $table = 'bookings';


    protected $fillable = [
        'customer_name',
        'email',
        'phone',
        'guests',
        'booking_date',
        'booking_time',
        'note',
        'status'
    ];
}
