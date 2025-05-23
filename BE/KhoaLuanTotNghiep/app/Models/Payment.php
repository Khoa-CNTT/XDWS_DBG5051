<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $table = 'payments';

    protected $fillable = ['order_id','table_number', 'amount','method', 'status'];

     public function table()
    {
        return $this->belongsTo(Table::class, 'table_number', 'table_number');
    }
}
