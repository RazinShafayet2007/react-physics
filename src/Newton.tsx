import { useState as physicsState } from "react";
import './index.css';

function NewtonThirdLaw() {
    // Track positions of Object A and Object B
    const [posA, setPosA] = physicsState(0);
    const [posB, setPosB] = physicsState(200);
    const [forceLog, setForceLog] = physicsState("");

    const handleCollision = () => {
        // Object A moves (+50) and hits Object B
        setPosA(posA + 50);

        // Object B gets hit by Object A and moves (+50)
        setPosB(posB + 50);

        // Newton's Third Law: For every action, there is an equal and opposite reaction
        setForceLog(`Object A applies a force to Object B, and Object B applies an equal and opposite force to Object A.`);
    }

    const reset = () => {
        setPosA(0);
        setPosB(200);
        setForceLog("");    
    }

    return (
        <div className="p-5 font-sans">
            <h3 className="text-lg font-semibold mb-2">Newton's Third Law React Simulation</h3>
            <p className="min-h-[20px] text-blue-600 mb-4">{forceLog}</p>

            {/* Simulation Box */}
            <div className="relative w-[500px] h-[100px] border border-gray-300 bg-gray-50 mb-5">
                {/* Object A */}
                <div
                    className="absolute top-6 w-12 h-12 bg-red-500 text-white flex items-center justify-center transition-all duration-200 ease-out rounded"
                    style={{ left: `${posA}px` }}
                >
                    A
                </div>

                {/* Object B */}
                <div
                    className="absolute top-6 w-12 h-12 bg-blue-500 text-white flex items-center justify-center transition-all duration-200 ease-out rounded"
                    style={{ left: `${posB}px` }}
                >
                    B
                </div>
            </div>

            {/* Controls */}
            <button
                onClick={handleCollision}
                className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                Trigger Collision
            </button>
            <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Reset
            </button>
        </div>
    );
}

export default NewtonThirdLaw;