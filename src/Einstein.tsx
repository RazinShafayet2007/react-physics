import { useMemo, useState} from 'react';

const C = 299_792_458; // speed of light (m/s)

function TheoryOfRelativity() {
    // velocity as fraction of c (0..<1). Using string allows clearing the input.
  const [vFrac, setVFrac] = useState<number | ''>(0.5);
  const [properTime, setProperTime] = useState<number | ''>(1); // seconds (Δτ)
  const [properLength, setProperLength] = useState<number | ''>(1); // meters (L0)

  const v = typeof vFrac === 'number' ? Math.abs(vFrac) * C : 0; // m/s
  const beta = typeof vFrac === 'number' ? Math.abs(vFrac) : 0;

  const gamma = useMemo(() => {
    if (beta >= 1) return Infinity; // physically invalid (>= c)
    return 1 / Math.sqrt(1 - beta * beta);
  }, [beta]);

  const dilatedTime = useMemo(() => {
    if (typeof properTime !== 'number') return 0;
    if (!isFinite(gamma)) return Number.POSITIVE_INFINITY;
    return gamma * properTime; // Δt = γ Δτ
  }, [properTime, gamma]);

  const contractedLength = useMemo(() => {
    if (typeof properLength !== 'number') return 0;
    if (!isFinite(gamma)) return 0;
    return properLength / gamma; // L = L0 / γ
  }, [properLength, gamma]);

    return (
        <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Special Relativity — Simple Demo</h2>

      <div className="mb-3">
        Velocity (fraction of c, 0 ≤ v/c &lt; 1):
        <input
          type="number"
          min="0"
          max="0.999999"
          step="0.01"
          value={vFrac === '' ? '' : vFrac}
          onChange={(e) => setVFrac(e.target.value === '' ? '' : Number(e.target.value))}
          className="ml-2 border p-1"
        />
      </div>

      <div className="mb-3">
        Proper time Δτ (seconds):
        <input
          type="number"
          min="0"
          step="0.1"
          value={properTime === '' ? '' : properTime}
          onChange={(e) => setProperTime(e.target.value === '' ? '' : Number(e.target.value))}
          className="ml-2 border p-1"
        />
      </div>

      <div className="mb-3">
        Proper length L₀ (meters):
        <input
          type="number"
          min="0"
          step="0.1"
          value={properLength === '' ? '' : properLength}
          onChange={(e) => setProperLength(e.target.value === '' ? '' : Number(e.target.value))}
          className="ml-2 border p-1"
        />
      </div>

      <div className="mt-4 p-3 border rounded bg-gray-50">
        <p>
          Lorentz factor γ = {isFinite(gamma) ? gamma.toFixed(6) : '∞'}{' '}
          {beta >= 1 && <span className="text-red-600"> (invalid: v ≥ c)</span>}
        </p>

        <p>Time dilation (Δt = γ Δτ): {isFinite(dilatedTime) ? dilatedTime.toFixed(6) + ' s' : '∞'}</p>

        <p>Length contraction (L = L₀ / γ): {contractedLength ? contractedLength.toFixed(6) + ' m' : '0 m'}</p>

        <p className="text-sm text-gray-600 mt-2">
          Notes: γ = 1 / sqrt(1 − (v/c)^2). Values with v ≥ c are physically invalid.
        </p>
      </div>
    </div>
  );
}

export default TheoryOfRelativity;