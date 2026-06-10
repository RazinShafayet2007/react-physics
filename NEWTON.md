# Newton Component — Line-by-line guide

This file explains the important lines in `src/Newton.tsx` and how they work. It focuses on the two exported components: `NewtonSecondLaw` and `NewtonThirdLaw`.

---

## NewtonSecondLaw

- `const [mass, setMass] = useState(1); // kg`
  - state storing mass in kilograms; default 1 kg.

- `const [force, setForce] = useState(0); // N`
  - state storing applied force in Newtons; default 0 N.

- `const [pos, setPos] = useState(0); // px`
  - state for object's horizontal position in pixels for visualization.

- `const [vel, setVel] = useState(0); // px/s`
  - state's object velocity in pixels per second.

- `const pxToMeter = 1 / 100;`
  - conversion factor: 100 pixels = 1 meter, so `pxToMeter` = meters per pixel.

- useEffect(() => { ... }, [running, force, mass, pos, vel])
  - animation loop that runs only when `running` is true. It uses `requestAnimationFrame` and updates position & velocity each frame.

- `const dt = (t - lastRef.current) / 1000;`
  - converts the time delta from milliseconds (given by requestAnimationFrame) to seconds.

- `const a_m_s2 = mass > 0 ? force / mass : 0;`
  - Newton's second law a = F / m; defensive check to avoid divide-by-zero.

- `const a_px_s2 = a_m_s2 / pxToMeter;`
  - convert acceleration from m/s^2 to px/s^2 for the visualization units.

- `const newVel = vel + a_px_s2 * dt;`
  - integrate acceleration to update velocity (Euler integration): v += a * dt.

- `const newPos = pos + newVel * dt;`
  - integrate velocity to update position (Euler): x += v * dt.

- `setVel(newVel); setPos(newPos);`
  - write updated velocity and position into React state so the UI re-renders.

- `button onClick={()=>setRunning(r=>!r)}`
  - toggles the animation loop (start/pause).

---

## NewtonThirdLaw

- `const [posA, setPosA] = useState(20); const [posB, setPosB] = useState(300);`
  - initial x-positions (pixels) of objects A and B.

- `const [velA, setVelA] = useState(120); const [velB, setVelB] = useState(0);`
  - initial velocities (px/s) of A and B.

- `const radius = 24;`
  - half-size used to detect when the two objects overlap horizontally.

- useEffect(() => { ... }, [running, posA, posB, velA, velB])
  - animation loop similar to the second-law component. On each frame we compute new positions and handle collisions.

- `let xA = posA + velA * dt; let xB = posB + velB * dt;`
  - compute candidate new positions by simple Euler integration.

- `if (xA + radius >= xB - radius && velA > velB) { ... }`
  - collision detection: when the right edge of A reaches the left edge of B, and A is catching up.

- Elastic collision formulas:
  - `const newVA = (vA * (massA - massB) + 2 * massB * vB) / (massA + massB);`
  - `const newVB = (vB * (massB - massA) + 2 * massA * vA) / (massA + massB);`
  - These compute post-collision velocities for a 1D elastic collision conserving momentum and kinetic energy.

- `setLog('Collision: equal and opposite forces exchanged — velocities updated.');`
  - small textual log explaining the result (Newton's third law in action).

- After collision we set updated positions and velocities via `setPosA`, `setPosB`, `setVelA`, `setVelB` so the UI animates with the new values.

---

## Notes & behavior

- Integration method: both components use simple Euler integration (sufficient for demonstration; for higher accuracy use semi-implicit Euler or a smaller fixed dt).
- Units mapping: physics calculations use SI (m, s, N) then convert to pixels for rendering using `pxToMeter`.
- Collision: current detection is 1D and assumes axis-aligned circles/boxes; it resolves collisions with standard elastic formulas.

If you want, I can also add comments directly inside `src/Newton.tsx` or create inline tooltips in the UI. Tell me which you'd prefer.
