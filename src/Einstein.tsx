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
        <div></div>
    );
}

export default TheoryOfRelativity;