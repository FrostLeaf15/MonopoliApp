import { useState } from "react";
import { router } from "@inertiajs/react";
import DiceRoller from "@/Components/DiceRoller";

export default function Index({ players }) {
    const [name, setName] = useState("");
    const [pawnColor, setPawnColor] = useState("");
    const [balanceInputs, setBalanceInputs] = useState({});
    const [propertyInputs, setPropertyInputs] = useState({});
    const [editingProperty, setEditingProperty] = useState({});
    const [editValues, setEditValues] = useState({});
    const [fromId, setFromId] = useState("");
    const [toId, setToId] = useState("");
    const [amount, setAmount] = useState("");

    const handleAddPlayer = () => {
        router.post("/players", { name, pawn_color: pawnColor });
        setName("");
        setPawnColor("");
    };

    const handleBalanceChange = (id, amount) => {
        if (!amount) return;
        router.post(`/players/${id}/balance`, { amount: parseInt(amount) });
        setBalanceInputs((prev) => ({ ...prev, [id]: "" }));
    };

    const handleAddProperty = (id, newProp, existingProps) => {
        if (!newProp || existingProps.includes(newProp)) return;
        router.post(`/players/${id}/property`, { property: newProp });
        setPropertyInputs((prev) => ({ ...prev, [id]: "" }));
    };

    const handleDeleteProperty = (playerId, index) => {
        router.post(`/players/${playerId}/property/delete`, { index });
    };

    const handleUpdateProperty = (playerId, index, newValue) => {
        if (!newValue) return;

        router.post(`/players/${playerId}/property/update`, {
            index,
            value: newValue,
        });

        const key = `${playerId}-${index}`;
        setEditingProperty((prev) => ({ ...prev, [key]: false }));
    };

    const handleTransfer = (e) => {
        e.preventDefault();
        router.post("/players/transfer", {
            from_id: fromId,
            to_id: toId,
            amount: parseInt(amount),
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Data Player Monopoli</h1>

            {/* Input Tambah Player */}
            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Nama Player"
                    className="border px-3 py-2 rounded w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Warna Pion"
                    className="border px-3 py-2 rounded w-full"
                    value={pawnColor}
                    onChange={(e) => setPawnColor(e.target.value)}
                />
                <button
                    onClick={handleAddPlayer}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {" "}
                    Tambah Player{" "}
                </button>
            </div>

            <form
                onSubmit={handleTransfer}
                className="border p-4 rounded my-8 max-w-full"
            >
                <h2 className="text-lg font-bold mb-2">Transfer Saldo</h2>

                <div className="mb-2">
                    <label className="block">Dari Pemain</label>
                    <select
                        value={fromId}
                        onChange={(e) => setFromId(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Pilih Pemain --</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Ke Pemain</label>
                    <select
                        value={toId}
                        onChange={(e) => setToId(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Pilih Pemain --</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Jumlah Transfer</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border p-2 rounded"
                        min="1"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Transfer
                </button>
            </form>
            <div className="mb-5">
                <DiceRoller />
            </div>
            {/* Daftar Player */}
            <div className="grid gap-4">
                {players.map((player) => (
                    <div
                        key={player.id}
                        className="border rounded p-4 bg-white shadow"
                    >
                        <h2 className="text-lg font-semibold">{player.name}</h2>
                        <p className="text-sm text-gray-600">
                            Pion: {player.pawn_color}
                        </p>

                        {/* Saldo */}
                        <div className="my-3">
                            <p className="mb-1">
                                Saldo:{" "}
                                <strong>
                                    Rp{player.balance.toLocaleString()}
                                </strong>
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Nominal saldo"
                                    value={balanceInputs[player.id] || ""}
                                    onChange={(e) =>
                                        setBalanceInputs((prev) => ({
                                            ...prev,
                                            [player.id]: e.target.value,
                                        }))
                                    }
                                    className="border px-2 py-1 rounded w-32"
                                />
                                <button
                                    onClick={() =>
                                        handleBalanceChange(
                                            player.id,
                                            balanceInputs[player.id]
                                        )
                                    }
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Tambah
                                </button>
                                <button
                                    onClick={() =>
                                        handleBalanceChange(
                                            player.id,
                                            -balanceInputs[player.id]
                                        )
                                    }
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Kurangi
                                </button>
                                <button
                                    onClick={() =>
                                        handleBalanceChange(player.id, 10000)
                                    }
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    +10.000
                                </button>
                                <button
                                    onClick={() =>
                                        handleBalanceChange(player.id, 20000)
                                    }
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    +20.000
                                </button>
                                <button
                                    onClick={() =>
                                        handleBalanceChange(player.id, -20000)
                                    }
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    -20.000
                                </button>
                                <button
                                    onClick={() =>
                                        handleBalanceChange(player.id, -50000)
                                    }
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    -50.000
                                </button>
                            </div>
                        </div>

                        {/* Properti */}
                        <div className="mt-3">
                            <h4 className="font-medium mb-1">Properti:</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tambah properti"
                                    value={propertyInputs[player.id] || ""}
                                    onChange={(e) =>
                                        setPropertyInputs((prev) => ({
                                            ...prev,
                                            [player.id]: e.target.value,
                                        }))
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddProperty(
                                                player.id,
                                                propertyInputs[player.id],
                                                player.properties || []
                                            );
                                        }
                                    }}
                                    className="border px-2 py-1 rounded"
                                />
                                <button
                                    onClick={() =>
                                        handleAddProperty(
                                            player.id,
                                            propertyInputs[player.id],
                                            player.properties || []
                                        )
                                    }
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Tambah
                                </button>
                            </div>
                            <ul className="list-disc ml-5 mt-5">
                                {(player.properties || []).map((prop, idx) => {
                                    const key = `${player.id}-${idx}`;
                                    const isEditing = editingProperty[key];

                                    return (
                                        <li
                                            key={key}
                                            className="flex justify-between items-center mb-1"
                                        >
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={
                                                            editValues[key] ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditValues(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [key]: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        className="border px-2 py-1 rounded mr-2 flex-1"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateProperty(
                                                                player.id,
                                                                idx,
                                                                editValues[key]
                                                            )
                                                        }
                                                        className="bg-green-600 text-white px-2 py-1 text-sm rounded mr-1"
                                                    >
                                                        Simpan
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setEditingProperty(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [key]: false,
                                                                })
                                                            )
                                                        }
                                                        className="text-gray-500 text-sm"
                                                    >
                                                        Batal
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="flex-1">
                                                        {prop}
                                                    </span>
                                                    <div className="flex gap-1 ml-4">
                                                        <button
                                                            onClick={() => {
                                                                setEditValues(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [key]: prop,
                                                                    })
                                                                );
                                                                setEditingProperty(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [key]: true,
                                                                    })
                                                                );
                                                            }}
                                                            className="text-blue-600 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteProperty(
                                                                    player.id,
                                                                    idx // sekarang pakai variabel yang benar
                                                                )
                                                            }
                                                            className="text-red-600 text-sm"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
