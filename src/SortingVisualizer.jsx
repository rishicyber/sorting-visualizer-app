import { useState, useEffect, useRef, useCallback } from "react";

const ALGORITHMS = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
};

const PALETTE = {
  bg: "#0a0a0f",
  panel: "#12121a",
  border: "#1e1e2e",
  accent: "#7c3aed",
  accentGlow: "#a855f7",
  bar: "#4c1d95",
  barActive: "#a855f7",
  barSwap: "#f59e0b",
  barSorted: "#10b981",
  text: "#e2e8f0",
  muted: "#64748b",
  label: "#94a3b8",
};

function generateArray(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
}

// --- Sorting generators ---

function* bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { arr: [...a], comparing: [j, j + 1], sorted: [] };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { arr: [...a], swapping: [j, j + 1], sorted: [] };
      }
    }
  }
  yield { arr: [...a], done: true };
}

function* selectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  const sorted = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { arr: [...a], comparing: [minIdx, j], sorted: [...sorted] };
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { arr: [...a], swapping: [i, minIdx], sorted: [...sorted] };
    }
    sorted.push(i);
  }
  yield { arr: [...a], done: true };
}

function* insertionSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { arr: [...a], comparing: [j - 1, j], sorted: [] };
      if (a[j] < a[j - 1]) {
        [a[j], a[j - 1]] = [a[j - 1], a[j]];
        yield { arr: [...a], swapping: [j, j - 1], sorted: [] };
        j--;
      } else break;
    }
  }
  yield { arr: [...a], done: true };
}

function* mergeSort(arr) {
  const a = [...arr];
  yield* mergeSortHelper(a, 0, a.length - 1);
  yield { arr: [...a], done: true };
}

function* mergeSortHelper(a, l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  yield* mergeSortHelper(a, l, m);
  yield* mergeSortHelper(a, m + 1, r);
  yield* merge(a, l, m, r);
}

function* merge(a, l, m, r) {
  const left = a.slice(l, m + 1);
  const right = a.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    yield { arr: [...a], comparing: [l + i, m + 1 + j], sorted: [] };
    if (left[i] <= right[j]) { a[k++] = left[i++]; }
    else { a[k++] = right[j++]; }
    yield { arr: [...a], swapping: [k - 1], sorted: [] };
  }
  while (i < left.length) { a[k++] = left[i++]; yield { arr: [...a], swapping: [k - 1], sorted: [] }; }
  while (j < right.length) { a[k++] = right[j++]; yield { arr: [...a], swapping: [k - 1], sorted: [] }; }
}

function* quickSort(arr) {
  const a = [...arr];
  yield* quickSortHelper(a, 0, a.length - 1);
  yield { arr: [...a], done: true };
}

function* quickSortHelper(a, l, r) {
  if (l >= r) return;
  let pivot = r, i = l - 1;
  for (let j = l; j < r; j++) {
    yield { arr: [...a], comparing: [j, pivot], sorted: [] };
    if (a[j] < a[pivot]) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      yield { arr: [...a], swapping: [i, j], sorted: [] };
    }
  }
  [a[i + 1], a[r]] = [a[r], a[i + 1]];
  yield { arr: [...a], swapping: [i + 1, r], sorted: [] };
  const p = i + 1;
  yield* quickSortHelper(a, l, p - 1);
  yield* quickSortHelper(a, p + 1, r);
}

function getGenerator(algo, arr) {
  switch (algo) {
    case "bubble": return bubbleSort(arr);
    case "selection": return selectionSort(arr);
    case "insertion": return insertionSort(arr);
    case "merge": return mergeSort(arr);
    case "quick": return quickSort(arr);
    default: return bubbleSort(arr);
  }
}

// Slider component
function Slider({ label, min, max, value, onChange, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: PALETTE.label, fontFamily: "'Space Mono', monospace" }}>{label}</span>
        <span style={{ fontSize: 13, color: PALETTE.accentGlow, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{
          width: "100%", accentColor: PALETTE.accentGlow,
          cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        }}
      />
    </div>
  );
}

export default function SortingVisualizer() {
  const [count, setCount] = useState(40);
  const [speed, setSpeed] = useState(50);
  const [algo, setAlgo] = useState("bubble");
  const [array, setArray] = useState(() => generateArray(40));
  const [state, setState] = useState({ arr: generateArray(40), comparing: [], swapping: [], sorted: [], done: false });
  const [running, setRunning] = useState(false);
  const [swapCount, setSwapCount] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const genRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);

  const reset = useCallback((n = count) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
    setRunning(false);
    const a = generateArray(n);
    setArray(a);
    setState({ arr: a, comparing: [], swapping: [], sorted: [], done: false });
    setSwapCount(0);
    setStepCount(0);
    genRef.current = null;
  }, [count]);

  useEffect(() => { reset(count); }, [count]);

  const start = useCallback(() => {
    if (running) return;
    genRef.current = getGenerator(algo, array);
    runningRef.current = true;
    setRunning(true);
    setSwapCount(0);
    setStepCount(0);

    let swaps = 0, steps = 0;
    const delay = () => Math.max(1, 200 - speed * 1.9);

    const step = () => {
      if (!runningRef.current) return;
      const result = genRef.current.next();
      if (result.done || result.value?.done) {
        setState(s => ({ ...s, comparing: [], swapping: [], done: true }));
        runningRef.current = false;
        setRunning(false);
        return;
      }
      const v = result.value;
      if (v.swapping?.length) swaps++;
      steps++;
      setState({ arr: v.arr, comparing: v.comparing || [], swapping: v.swapping || [], sorted: v.sorted || [], done: false });
      setSwapCount(swaps);
      setStepCount(steps);
      rafRef.current = setTimeout(step, delay());
    };
    step();
  }, [running, algo, array, speed]);

  const pause = () => {
    runningRef.current = false;
    setRunning(false);
    if (rafRef.current) clearTimeout(rafRef.current);
  };

  const resume = () => {
    if (running || state.done || !genRef.current) return;
    runningRef.current = true;
    setRunning(true);
    let swaps = swapCount, steps = stepCount;
    const delay = () => Math.max(1, 200 - speed * 1.9);
    const step = () => {
      if (!runningRef.current) return;
      const result = genRef.current.next();
      if (result.done || result.value?.done) {
        setState(s => ({ ...s, comparing: [], swapping: [], done: true }));
        runningRef.current = false;
        setRunning(false);
        return;
      }
      const v = result.value;
      if (v.swapping?.length) swaps++;
      steps++;
      setState({ arr: v.arr, comparing: v.comparing || [], swapping: v.swapping || [], sorted: v.sorted || [], done: false });
      setSwapCount(swaps);
      setStepCount(steps);
      rafRef.current = setTimeout(step, delay());
    };
    step();
  };

  const { arr, comparing, swapping, sorted, done } = state;
  const maxVal = Math.max(...arr, 1);

  const barColor = (i) => {
    if (done) return PALETTE.barSorted;
    if (swapping?.includes(i)) return PALETTE.barSwap;
    if (comparing?.includes(i)) return PALETTE.barActive;
    if (sorted?.includes(i)) return PALETTE.barSorted;
    return PALETTE.bar;
  };

  const barGlow = (i) => {
    if (done) return `0 0 8px ${PALETTE.barSorted}88`;
    if (swapping?.includes(i)) return `0 0 12px ${PALETTE.barSwap}cc`;
    if (comparing?.includes(i)) return `0 0 10px ${PALETTE.barActive}99`;
    return "none";
  };

  return (
    <div style={{
      minHeight: "100vh", background: PALETTE.bg, color: PALETTE.text,
      fontFamily: "'Space Mono', monospace",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px",
      backgroundImage: "radial-gradient(ellipse at 20% 10%, #1a0a2e 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #0a1a2e 0%, transparent 60%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: PALETTE.accentGlow, textTransform: "uppercase", marginBottom: 6 }}>Algorithm Visualizer</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, margin: 0, background: `linear-gradient(135deg, #e2e8f0 30%, ${PALETTE.accentGlow})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Sorting Studio
        </h1>
      </div>

      {/* Controls */}
      <div style={{
        width: "100%", maxWidth: 880,
        background: PALETTE.panel,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 20,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20,
        boxShadow: `0 0 40px #7c3aed18`,
      }}>
        {/* Algorithm selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: PALETTE.label }}>Algorithm</span>
          <select
            value={algo} onChange={e => { setAlgo(e.target.value); reset(); }}
            disabled={running}
            style={{
              background: "#1a1a2e", border: `1px solid ${PALETTE.border}`,
              color: PALETTE.text, borderRadius: 8, padding: "8px 12px",
              fontSize: 13, cursor: running ? "not-allowed" : "pointer",
              outline: "none", fontFamily: "'Space Mono', monospace",
            }}
          >
            {Object.entries(ALGORITHMS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <Slider label="Array Size" min={10} max={120} value={count} onChange={n => setCount(n)} disabled={running} />
        <Slider label="Speed" min={1} max={100} value={speed} onChange={setSpeed} disabled={false} />

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => reset()} disabled={running} style={btnStyle(PALETTE.border, running)}>
              ↺ New
            </button>
            {!running && !done && genRef.current ? (
              <button onClick={resume} style={btnStyle(PALETTE.accent, false, true)}>▶ Resume</button>
            ) : !running ? (
              <button onClick={start} disabled={done} style={btnStyle(PALETTE.accent, done, true)}>▶ Sort</button>
            ) : (
              <button onClick={pause} style={btnStyle("#b45309", false, true)}>⏸ Pause</button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "Elements", val: arr.length },
          { label: "Swaps", val: swapCount },
          { label: "Steps", val: stepCount },
          { label: "Status", val: done ? "✓ Sorted" : running ? "Sorting…" : "Ready" },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: PALETTE.panel, border: `1px solid ${PALETTE.border}`,
            borderRadius: 10, padding: "8px 18px", textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: PALETTE.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: done && label === "Status" ? PALETTE.barSorted : PALETTE.accentGlow }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { color: PALETTE.bar, label: "Default" },
          { color: PALETTE.barActive, label: "Comparing" },
          { color: PALETTE.barSwap, label: "Swapping" },
          { color: PALETTE.barSorted, label: "Sorted" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: PALETTE.muted }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Visualizer */}
      <div style={{
        width: "100%", maxWidth: 880,
        background: PALETTE.panel,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 16,
        padding: "16px",
        boxShadow: `0 0 60px #7c3aed22`,
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          height: 280, gap: arr.length > 80 ? 1 : arr.length > 50 ? 2 : 3,
        }}>
          {arr.map((val, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(val / maxVal) * 100}%`,
                minWidth: 2,
                background: barColor(i),
                borderRadius: "2px 2px 0 0",
                transition: "height 0.05s, background 0.1s",
                boxShadow: barGlow(i),
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 10, color: PALETTE.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {ALGORITHMS[algo]} · O(n²) average
      </div>
    </div>
  );
}

function btnStyle(bg, disabled, primary = false) {
  return {
    flex: 1, padding: "8px 0", borderRadius: 8,
    border: primary ? "none" : `1px solid ${bg}`,
    background: primary ? bg : "transparent",
    color: disabled ? "#555" : "#e2e8f0",
    fontSize: 12, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Space Mono', monospace",
    opacity: disabled ? 0.5 : 1,
    letterSpacing: "0.05em",
    transition: "opacity 0.2s",
  };
}
