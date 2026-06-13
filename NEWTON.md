# Newton Component — Line-by-line guide

This file explains the important lines in `src/Newton.tsx` and how they work. It focuses on the three exported components: `NewtonFirstLaw`, `NewtonSecondLaw` and `NewtonThirdLaw`.

---

## NewtonFirstLaw

- `const [pos, setPos] = useState(0); // px`
  - Stores the visual horizontal position (pixels) of the object. Initial 0 px.

- `const [vel, setVel] = useState(100); // px/s`
  - Stores the object's velocity in pixels per second used for the visualization. Default 100 px/s. This is the quantity that remains constant when net force is zero.

- `const [mass, setMass] = useState(1); // kg (for reference)`
  - Mass in kilograms; used to compute acceleration from net force. Defaults to 1 kg.

- `const [force, setForce] = useState(0); // N - external/net force`
  - The net external force applied to the object in Newtons. When this is 0 the first law applies (no acceleration).

- `const [running, setRunning] = useState(false);`
  - Controls whether the animation loop is running (Start/Pause).

- `const [started, setStarted] = useState(false);`

- `const rafRef = useRef<number | null>(null); const lastRef = useRef<number | null>(null);`
  - `rafRef` stores the `requestAnimationFrame` id so it can be cancelled. `lastRef` stores the previous timestamp to compute `dt` between frames.

- `const pxToMeter = 1 / 100;`
  - Conversion factor mapping 100 pixels to 1 meter. Physics calculations use SI units (m, s, N) then convert to pixels for rendering.

- `useEffect(() => { ... }, [running, force, mass, pos, vel])`
  - The animation effect that updates position and velocity each frame when `running` is true. The dependency list includes values that affect each step.

  - Inside the effect:

  - `if (!running) { ... return; }`
    - Cancels any existing animation frame and clears timing refs when paused.

  - `const step = (t: number) => { ... }`
    - Frame callback receiving a high-resolution timestamp `t` (ms). It computes `dt`, integrates acceleration to velocity and velocity to position, then schedules the next frame.

  - `if (lastRef.current == null) lastRef.current = t;`
    - Initialize `lastRef` on the first frame so the first `dt` is well-defined.

  - `const dt = (t - lastRef.current) / 1000; lastRef.current = t;`
    - Compute time delta in seconds between frames (requestAnimationFrame timestamps are in ms).

  - `const a_m_s2 = mass > 0 ? force / mass : 0;`
    - Compute acceleration in m/s^2 using `a = F/m`. If `force` is zero then `a=0` (Newton's first law condition).

  - `const a_px_s2 = a_m_s2 / pxToMeter;`
    - Convert acceleration from m/s^2 to px/s^2 for visualization units.

  - `const newVel = vel + a_px_s2 * dt;`
    - Euler integration of velocity: `v += a * dt`. When `a=0` the velocity remains unchanged, demonstrating the first law.

  - `const newPos = pos + newVel * dt;`
    - Euler integration of position: `x += v * dt` using the updated velocity.

  - `setVel(newVel); setPos(newPos);`
    - Update React state so the UI re-renders with the new position/velocity.

  - `rafRef.current = requestAnimationFrame(step);`
    - Queue the next animation frame to continue the loop.

- `const reset = () => { ... }`
  - Stops the animation and restores the default `pos`, `vel`, `force`, and `mass` values.

- JSX controls and UI:
  - Input `Initial Velocity` bound to `vel` to set the starting velocity (px/s).
  - Input `External Net Force` bound to `force` (N); set this to 0 to observe inertia.
  - Input `Mass` bound to `mass` (kg) used in acceleration calculation.
  - Display line showing the computed acceleration `(force/mass)` and current `vel` (px/s).
  - The visualization area draws an object using the `pos` state (left style) so it moves across the container.
  - `Start/Pause` button toggles `running` to begin/pause the simulation; `Reset` calls `reset()`.

### Example

  If the net external force is zero, then by Newton's second law

  $$\sum F = m a = 0 \implies a = 0.$$ 

  Therefore $\ddot{x}(t)=0$ and the velocity is constant:

  $$\dot{x}(t)=v_0,\qquad x(t)=x_0+v_0 t.$$ 

- Numeric example:

  Take $m=2\ \mathrm{kg}$, $x_0=0$, $v_0=3\ \mathrm{m/s}$. If the net force is zero then

  $$x(t)=3t\ \mathrm{m}.$$ 

  If instead a constant net force $F=4\ \mathrm{N}$ acts on the mass, the acceleration is $a=F/m=2\ \mathrm{m/s^2}$ and

  $$\dot{x}(t)=3+2t,\qquad x(t)=3t+t^2\ \mathrm{m}.$$ 
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

- Integration method: these three components use simple Euler integration (sufficient for demonstration; for higher accuracy use semi-implicit Euler or a smaller fixed dt).
- Units mapping: physics calculations use SI (m, s, N) then convert to pixels for rendering using `pxToMeter`.
- Collision: current detection is 1D and assumes axis-aligned circles/boxes; it resolves collisions with standard elastic formulas.