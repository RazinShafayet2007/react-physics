import { useEffect, useRef, useState } from "react";
import './index.css';

function NewtonFirstLaw() {
    const [pos, setPos] = useState(0); // px
    const [vel, setVel] = useState(100); // px/s
    const [mass, setMass] = useState(1); // kg (for reference)
    const [force, setForce] = useState(0); // N - external/net force
    const [running, setRunning] = useState(false);
    const [started, setStarted] = useState(false);
    const rafRef = useRef<number | null>(null);
    const lastRef = useRef<number | null>(null);
    const runLabel = running ? 'Pause' : (started ? 'Continue' : 'Start');

    // conversion: treat 100 px = 1 meter for visualization
    const pxToMeter = 1 / 100;

    useEffect(() => {
        if (!running) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastRef.current = null;
            return;
        }

        const step = (t: number) => {
            if (lastRef.current == null) lastRef.current = t;
            const dt = (t - lastRef.current) / 1000; // seconds
            lastRef.current = t;

            // Newton's first law: if net external force is zero, acceleration is zero
            const a_m_s2 = mass > 0 ? force / mass : 0;

            // convert acceleration to px/s^2
            const a_px_s2 = a_m_s2 / pxToMeter;

            const newVel = vel + a_px_s2 * dt;
            const newPos = pos + newVel * dt;

            setVel(newVel);
            setPos(newPos);

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastRef.current = null;
        };
    }, [running, force, mass, pos, vel]);

    const reset = () => {
        setRunning(false);
        setPos(0);
        setVel(100);
        setForce(0);
        setMass(1);
        setStarted(false);
    };

    const toggleRun = () => {
        if (running){
            setRunning(false);
        } else {
            setRunning(true);
            setStarted(true);
        }
    };

    return (
        <div className="p-5 font-sans">
            <h3 className="text-lg font-semibold mb-2">Newton's First Law Demonstration</h3>

            <div className="mb-3">Initial Velocity (px/s): <input type="number" value={vel} onChange={e=>setVel(Number(e.target.value))} className="ml-2 border p-1"/></div>
            <div className="mb-3">External Net Force (N): <input type="number" value={force} onChange={e=>setForce(Number(e.target.value))} className="ml-2 border p-1"/></div>
            <div className="mb-3">Mass (kg): <input type="number" min="0.01" step="0.1" value={mass} onChange={e=>setMass(Number(e.target.value))} className="ml-2 border p-1"/></div>

            <p className="mb-2">If net force = 0, acceleration = 0 and velocity stays constant.<br/>Acceleration: {(mass>0 ? (force/mass).toFixed(2) : '0')} m/s^2 — Velocity: {vel.toFixed(2)} px/s</p>

            <div className="relative w-[500px] h-[80px] border border-gray-300 bg-gray-50 mb-5">
                <div className="absolute top-4 w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded" style={{ left: `${pos}px` }}>•</div>
            </div>

            <button onClick={toggleRun} className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">{runLabel}</button>
            <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
        </div>
    );
}

function NewtonSecondLaw() {
    const [mass, setMass] = useState(1); // kg
    const [force, setForce] = useState(0); // N
    const [pos, setPos] = useState(0); // px
    const [vel, setVel] = useState(0); // px/s
    const [running, setRunning] = useState(false);
    const rafRef = useRef<number | null>(null);
    const lastRef = useRef<number | null>(null);

    // conversion: treat 100 px = 1 meter for visualization
    const pxToMeter = 1 / 100;

    useEffect(() => {
        if (!running) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastRef.current = null;
            return;
        }

        const step = (t: number) => {
            if (lastRef.current == null) lastRef.current = t;
            const dt = (t - lastRef.current) / 1000; // seconds
            lastRef.current = t;

            // a = F / m (m in kg, F in N)
            const a_m_s2 = mass > 0 ? force / mass : 0;

            // convert acceleration to px/s^2
            const a_px_s2 = a_m_s2 / pxToMeter;

            const newVel = vel + a_px_s2 * dt;
            const newPos = pos + newVel * dt;

            setVel(newVel);
            setPos(newPos);

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastRef.current = null;
        };
    }, [running, force, mass, pos, vel]);

    const reset = () => {
        setRunning(false);
        setPos(0);
        setVel(0);
        setForce(0);
        setMass(1);
    };

    return (
        <div className="p-5 font-sans">
            <h3 className="text-lg font-semibold mb-2">Newton's Second Law Simulation</h3>

            <div className="mb-3">Force (N): <input type="number" value={force} onChange={e=>setForce(Number(e.target.value))} className="ml-2 border p-1"/></div>
            <div className="mb-3">Mass (kg): <input type="number" min="0.01" step="0.1" value={mass} onChange={e=>setMass(Number(e.target.value))} className="ml-2 border p-1"/></div>

            <p className="mb-2">Acceleration: {(mass>0 ? (force/mass).toFixed(2) : '0')} m/s^2 — Velocity: {vel.toFixed(2)} px/s</p>

            <div className="relative w-[500px] h-[80px] border border-gray-300 bg-gray-50 mb-5">
                <div className="absolute top-4 w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded" style={{ left: `${pos}px` }}>m</div>
            </div>

            <button onClick={()=>setRunning(r=>!r)} className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">{running ? 'Pause' : 'Start'}</button>
            <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
        </div>
    );
}

function NewtonThirdLaw() {
    // positions and velocities (px)
    const [posA, setPosA] = useState(20);
    const [posB, setPosB] = useState(300);
    const [velA, setVelA] = useState(120); // px/s toward right
    const [velB, setVelB] = useState(0); // px/s
    const [log, setLog] = useState('');
    const [running, setRunning] = useState(false);
    const rafRef = useRef<number | null>(null);
    const lastRef = useRef<number | null>(null);

    const radius = 24; // for collision detection (object width ~40)
    const massA = 1; // kg
    const massB = 1; // kg

    useEffect(() => {
        if (!running) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastRef.current = null;
            return;
        }

        const step = (t: number) => {
            if (lastRef.current == null) lastRef.current = t;
            const dt = (t - lastRef.current) / 1000;
            lastRef.current = t;

            let xA = posA + velA * dt;
            let xB = posB + velB * dt;
            let vA = velA;
            let vB = velB;

            // simple 1D collision detection
            if (xA + radius >= xB - radius && velA > velB) {
                // elastic collision formula
                const newVA = (vA * (massA - massB) + 2 * massB * vB) / (massA + massB);
                const newVB = (vB * (massB - massA) + 2 * massA * vA) / (massA + massB);
                vA = newVA;
                vB = newVB;
                setLog('Collision: equal and opposite forces exchanged — velocities updated.');
                // separate objects slightly to avoid re-collision
                xA = xB - radius*2 - 1;
            }

            setPosA(xA);
            setPosB(xB);
            setVelA(vA);
            setVelB(vB);

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; lastRef.current = null };
    }, [running, posA, posB, velA, velB]);

    const trigger = () => setRunning(true);
    const reset = () => { setRunning(false); setPosA(20); setPosB(300); setVelA(120); setVelB(0); setLog(''); };

    return (
        <div className="p-5 font-sans">
            <h3 className="text-lg font-semibold mb-2">Newton's Third Law React Simulation</h3>
            <p className="min-h-[20px] text-blue-600 mb-2">{log}</p>

            <div className="relative w-[600px] h-[100px] border border-gray-300 bg-gray-50 mb-5 overflow-hidden">
                <div className="absolute top-6 w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded" style={{ left: `${posA}px` }}>A</div>
                <div className="absolute top-6 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded" style={{ left: `${posB}px` }}>B</div>
            </div>

            <button onClick={trigger} className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Start</button>
            <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
        </div>
    );
}

export { NewtonThirdLaw, NewtonSecondLaw, NewtonFirstLaw };