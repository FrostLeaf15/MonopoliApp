<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = ['name', 'pawn_color', 'balance', 'properties'];

    protected $casts = [
        'properties' => 'array',
    ];
}
