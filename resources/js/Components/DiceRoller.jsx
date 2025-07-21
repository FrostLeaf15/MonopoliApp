import React, { useState } from "react";
import "./diceStyles.css"; // Untuk animasi

const diceIcons = {
    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅",
};

const DiceRoller = () => {
    const [dice1, setDice1] = useState(1);
    const [dice2, setDice2] = useState(1);
    const [total, setTotal] = useState(2);
    const [rolling, setRolling] = useState(false);

    const rollDice = () => {
        setRolling(true);

        setTimeout(() => {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            setDice1(d1);
            setDice2(d2);
            setTotal(d1 + d2);
            setRolling(false);
        }, 800); // Delay efek roll
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow max-w-sm mx-auto mt-4">
            <h2 className="text-xl font-bold">🎲 Lempar Dadu</h2>
            <div className="flex gap-6 text-6xl font-mono">
                <span className={`dice ${rolling ? "rolling" : ""}`}>
                    {diceIcons[dice1]}
                </span>
                <span className={`dice ${rolling ? "rolling" : ""}`}>
                    {diceIcons[dice2]}
                </span>
            </div>
            <p className="text-lg font-semibold">Total: {total}</p>
            <button
                onClick={rollDice}
                disabled={rolling}
                className={`px-4 py-2 text-white rounded ${
                    rolling ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {rolling ? "Melempar..." : "Lempar Dadu"}
            </button>
        </div>
    );
};

export default DiceRoller;
