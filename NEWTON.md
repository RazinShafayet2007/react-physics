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

### Example

- Given: mass $m=2\ \mathrm{kg}$, applied force $F=6\ \mathrm{N}$. Using Newton's second law:

  $$a = \frac{F}{m} = \frac{6}{2} = 3\ \mathrm{m/s^2}.$$ 

- With the visualization scale $100\ \mathrm{px}=1\ \mathrm{m}$, acceleration in px/s^2 is:

  $$a_{px} = \frac{a}{\text{pxToMeter}} = \frac{3}{1/100} = 300\ \mathrm{px/s^2}.$$ 

- Starting from rest, after $t=0.5\ \mathrm{s}$ (Euler integration approximation):

  Velocity: $v = v_0 + a_{px}\,t = 0 + 300\times0.5 = 150\ \mathrm{px/s}$. 

  Position: $x = x_0 + v\,t = 0 + 150\times0.5 = 75\ \mathrm{px}$. 
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

### Example

- Two objects A and B with masses $m_A=1\ \mathrm{kg}$, $m_B=1\ \mathrm{kg}$. Initial velocities (in visualization units) are $v_A=120\ \mathrm{px/s}$, $v_B=0\ \mathrm{px/s}$. Treat px/s directly in collision formulas because both objects use the same scale.

- For a 1D elastic collision the post-collision velocities are:

  $$v'_A = \frac{v_A(m_A - m_B) + 2m_B v_B}{m_A + m_B}, \qquad v'_B = \frac{v_B(m_B - m_A) + 2m_A v_A}{m_A + m_B}.$$ 

- With $m_A=m_B=1$, this simplifies to swapping velocities: $v'_A=0$, $v'_B=120$. That means after collision A stops and B moves right at 120 px/s (momentum and kinetic energy conserved).
---

## Notes & behavior

- Integration method: both components use simple Euler integration (sufficient for demonstration; for higher accuracy use semi-implicit Euler or a smaller fixed dt).
- Units mapping: physics calculations use SI (m, s, N) then convert to pixels for rendering using `pxToMeter`.
- Collision: current detection is 1D and assumes axis-aligned circles/boxes; it resolves collisions with standard elastic formulas.

If you want, I can also add comments directly inside `src/Newton.tsx` or create inline tooltips in the UI. Tell me which you'd prefer.
