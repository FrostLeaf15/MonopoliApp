<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlayerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $players = Player::all();
        return Inertia::render('Players/Index', ['players' => $players]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'pawn_color' => 'required|string',
        ]);

        Player::create([
            'name' => $request->name,
            'pawn_color' => $request->pawn_color,
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Player $player)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Player $player)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Player $player)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Player $player)
    {
        //
    }

    /**
     * Update the specified resource balance.
     */
    public function updateBalance(Request $request, Player $player)
    {
        $request->validate(['amount' => 'required|integer']);
        $player->balance += $request->amount;
        $player->save();

        return redirect()->back();
    }

    /**
     * Update the specified resource property.
     */
    public function addProperty(Request $request, Player $player)
    {
        $request->validate(['property' => 'required|string']);

        $properties = $player->properties ?? [];

        if (!in_array($request->property, $properties)) {
            $properties[] = $request->property;

            // Urutkan berdasarkan abjad
            sort($properties, SORT_NATURAL | SORT_FLAG_CASE);

            $player->properties = $properties;
            $player->save();
        }

        return redirect()->back();
    }

    public function updateProperty(Request $request, Player $player)
    {
        $request->validate([
            'index' => 'required|integer',
            'value' => 'required|string',
        ]);

        $properties = $player->properties ?? [];

        if (isset($properties[$request->index])) {
            $properties[$request->index] = $request->value;

            // Urutkan ulang
            sort($properties, SORT_NATURAL | SORT_FLAG_CASE);

            $player->properties = $properties;
            $player->save();
        }

        return redirect()->back();
    }

    public function deleteProperty(Request $request, Player $player)
    {
        $request->validate(['index' => 'required|integer']);

        $properties = $player->properties ?? [];

        if (isset($properties[$request->index])) {
            unset($properties[$request->index]);
            $player->properties = array_values($properties); // Reset index array
            $player->save();
        }

        return redirect()->back();
    }

    public function transfer(Request $request)
    {
        $request->validate([
            'from_id' => 'required|exists:players,id',
            'to_id' => 'required|exists:players,id|different:from_id',
            'amount' => 'required|integer|min:1',
        ]);

        $from = Player::find($request->from_id);
        $to = Player::find($request->to_id);

        if ($from->balance < $request->amount) {
            return back()->withErrors(['amount' => 'Saldo tidak cukup']);
        }

        $from->balance -= $request->amount;
        $to->balance += $request->amount;

        $from->save();
        $to->save();

        return back()->with('success', 'Transfer berhasil!');
    }
}
