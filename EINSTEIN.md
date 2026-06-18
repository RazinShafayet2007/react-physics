# Einstein Component — Line-by-line guide

This file explains the important lines in `src/Einstein.tsx` and how they work. It focuses on the exported component (commonly named `TheoryOfRelativity` or `EinsteinRelativityDemo`).

**Overview:**
- **Purpose:** interactive demo of special relativity effects (time dilation and length contraction).
- **Inputs:** velocity (as fraction of $c$ or m/s), proper time $\Delta\tau$, proper length $L_0$.
- **Outputs:** Lorentz factor $\gamma$, dilated time $\Delta t$, contracted length $L$.

**File: src/Einstein.tsx — key parts**

- **Constants**: `const C = 299_792_458` — speed of light in m/s. Used to convert fractions into absolute velocity when needed.

- **State hooks**: `useState<number | ''>(...)` for inputs. Allowing `''` lets users clear inputs (backspace) before entering numbers.

- **Derived values / math**: compute `beta = v / c` (or read v fraction directly). Compute Lorentz factor:

	$$
	\gamma = \frac{1}{\sqrt{1-\beta^{2}}},\qquad \beta=\frac{v}{c}
	$$

- **Time dilation**: display `Delta_t = gamma * Delta_tau`. Guard against `beta >= 1` (physically invalid) and empty inputs.

- **Length contraction**: display `L = L_0 / gamma`. Again, guard inputs and show sensible default when invalid.

- **Input handlers**: use `onChange={e => setVFrac(e.target.value === '' ? '' : Number(e.target.value))}` — preserves empty input and stores numeric values otherwise.

- **Formatting**: use `toFixed(...)` only after confirming the value is a number, e.g. `typeof gamma === 'number' && isFinite(gamma)`.

- **UI notes**: show a clear invalid-state notice when `beta >= 1` or `gamma` is Infinity; do not attempt arithmetic that would produce NaN.

**Implementation tips**

- Keep `gamma` computation in a `useMemo` (or derived variable) so it re-computes only when `beta` changes.
- Convert UI-empty `''` to sensible numeric defaults (e.g. 0) only at the moment you use the value for a calculation — keep state typed as `number | ''` for a better UX.
- Validate and clamp velocity input to `< 1` (for fraction) or `< C` (for m/s) before computing `gamma` to avoid runtime errors.

**Mathematical example**

Suppose a spaceship measures a proper time interval of $\Delta\tau=2\ \mathrm{s}$ (two seconds on the ship) and travels at $v=0.8c$ relative to an observer on Earth. Compute $\gamma$, the dilated time $\Delta t$, and the contracted length if the proper length is $L_0=10\ \mathrm{m}$.

1) Compute $\beta$ and $\gamma$:

$$
\beta = 0.8,
\\
\gamma = \frac{1}{\sqrt{1-0.8^{2}}} = \frac{1}{\sqrt{1-0.64}} = \frac{1}{\sqrt{0.36}} = \frac{1}{0.6} \approx 1.666667.
$$

2) Time dilation (Earth observer measures):

$$
\Delta t = \gamma\,\Delta\tau = 1.666667 \times 2\ \mathrm{s} \approx 3.333333\ \mathrm{s}.
$$

3) Length contraction (moving object's length measured by Earth):

$$
L = \frac{L_{0}}{\gamma} = \frac{10\ \mathrm{m}}{1.666667} \approx 6.0\ \mathrm{m}.
$$

Show these values in the UI as formatted numbers and include a small notice: "Values with $v\ge c$ are invalid."  

**Example code notes**

- When showing $\gamma$ and derived values, check `Number.isFinite(gamma)` and render `∞` or an error message if not finite.
- Consider adding a visual indicator (e.g. color or icon) when input is empty or invalid to improve UX.

If you want, I can also provide a compact TypeScript snippet that computes these values (pure function) you can import into `src/Einstein.tsx`.
