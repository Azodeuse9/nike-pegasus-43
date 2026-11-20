# Zero University — Nike Pegasus 43 Final Performance Audit Report

> **Assignment:** "Build a size grid that stays still."  
> **Repository:** [https://github.com/Azodeuse9/nike-pegasus-43](https://github.com/Azodeuse9/nike-pegasus-43)  
> **Live Production URL:** [https://nike-pegasus-43.vercel.app](https://nike-pegasus-43.vercel.app)  
> **Audit Script:** [`audit-performance.mjs`](./audit-performance.mjs)  
> **Evidence Directory:** [`performance-evidence/`](./performance-evidence/)  

---

## 1. Performance Budget Compliance

Configured in [`speed-budget.json`](./speed-budget.json):

| Metric | Budget Target | Actual Measurement | Status |
| :--- | :--- | :--- | :--- |
| `performance_score_min` | **≥ 90** | **94 / 100** (Fresh Lighthouse Mobile Run — Exact YAML Slow 4G Profile) | **PASS** |
| `size_grid_shift_px_max` | **0px** | **0.00px** maximum displacement across 461 continuous RAF frames | **PASS** |
| `size_button_min_px` | **≥ 44px** | **77.75px × 66.00px** minimum across all 26 buttons | **PASS** |

---

## 2. Web Platform Slow 4G Mobile Check Profile (Exact CDP Settings)

The continuous layout audit was executed in headless Chromium using the Chrome DevTools Protocol (`Network.emulateNetworkConditions` and `Emulation.setCPUThrottlingRate`) matching the exact specification:

- **Viewport Dimensions:** 375 × 812 CSS pixels (iPhone standard)
- **Device Pixel Ratio (DPR):** 3.0
- **Mobile Emulation:** Enabled (`isMobile: true`, `hasTouch: true`)
- **Network Latency:** `562.5 ms` RTT
- **Download Throughput:** `1474.56 Kbps` (188,743.68 bytes/sec)
- **Upload Throughput:** `675.00 Kbps` (86,400.00 bytes/sec)
- **CPU Throttling Rate:** `4x` slowdown

---

## 3. Continuous Layout Stability Measurement

Rather than relying on two-point snapshots, layout stability was continuously measured on every `requestAnimationFrame` loop alongside `PerformanceObserver` layout-shift tracking:

- **Continuous RAF Frames Measured:** **461 frames** tracked from first DOM appearance until complete page settlement and scroll.
- **First Observed Size Grid Y Position:** **`763.00px`** (recorded at Frame #0, timestamp 2,189.0ms)
- **Final Observed Size Grid Y Position:** **`763.00px`** (recorded at Frame #460, timestamp 11,495.3ms)
- **Minimum Recorded Y Position:** `763.00px`
- **Maximum Recorded Y Position:** `763.00px`
- **Maximum Vertical Displacement:** **`0.00px`**
- **Cumulative Layout Shift (CLS):** **`0.0000`**
- **Continuous Frame Samples (Excerpt):**
  - Frame #0 (2,189.0ms): `Y = 763.00px`
  - Frame #1 (2,248.1ms): `Y = 763.00px`
  - Frame #2 (2,415.6ms): `Y = 763.00px`
  - Frame #3 (2,428.5ms): `Y = 763.00px`
  - Frame #4 (2,439.9ms): `Y = 763.00px`
  - Frame #229 (6,177.1ms): `Y = 763.00px`
  - Frame #230 (6,193.2ms): `Y = 763.00px`
  - Frame #231 (6,210.9ms): `Y = 763.00px`
  - Frame #456 (11,429.2ms): `Y = 763.00px`
  - Frame #457 (11,445.8ms): `Y = 763.00px`
  - Frame #458 (11,460.7ms): `Y = 763.00px`
  - Frame #459 (11,480.1ms): `Y = 763.00px`
  - Frame #460 (11,495.3ms): `Y = 763.00px`

---

## 4. Real Chrome Performance Trace

Captured during initial page loading and bidirectional scrolling under the exact Slow 4G + 4x CPU slowdown profile:

- **Trace Evidence File:** [`performance-evidence/chrome-performance-trace.json`](./performance-evidence/chrome-performance-trace.json)
- **Summary Evidence File:** [`performance-evidence/audit-summary.json`](./performance-evidence/audit-summary.json)
- **Total Trace Events Collected:** **66,067 events**
- **Long Tasks (> 50ms):** 8 total recorded during initial navigation & hydration under 4x CPU throttle:
  1. `773 ms` at `1,442 ms`
  2. `898 ms` at `7,573 ms` (React hydration & chunk evaluation under 4x CPU throttle)
  3. `71 ms` at `8,510 ms`
  4. `93 ms` at `9,067 ms`
  5. `102 ms` at `9,781 ms`
  6. `74 ms` at `10,118 ms`
  7. `57 ms` at `10,272 ms`
  8. `97 ms` at `10,337 ms`

---

## 5. Frame Performance & Dropped Frames Analysis

Analyzed directly from Chrome DevTools trace event markers:

- **`BeginFrame` Events:** 626
- **`DrawFrame` Events:** 59
- **`DroppedFrame` Events:** 20 (detected during the initial 4x CPU throttled rapid scroll burst)
- **`PipelineReporter` Events:** 2,196
- **Dropped Pipeline States:** 0
- **Average Frame Interval:** `18.37 ms` (~54.4 FPS under 4x CPU throttle)
- **Frames > 16.67ms (sub-60fps under 4x throttle):** 237 of 625 frames (37.9%)
- **Frames > 33.33ms (sub-30fps under 4x throttle):** 3 of 625 frames (0.48%)

---

## 6. Fresh Independent Lighthouse Mobile Run (Reconciled YAML Profile)

Executed against the live production deployment ([`https://nike-pegasus-43.vercel.app`](https://nike-pegasus-43.vercel.app)) with the exact Web Platform Slow 4G Mobile Check Profile configuration:

- **Lighthouse Report File:** [`performance-evidence/lighthouse-yaml-profile-report.json`](./performance-evidence/lighthouse-yaml-profile-report.json)
- **Report Fetch Timestamp:** `2026-11-20T05:16:16.067Z`
- **Lighthouse Engine Version:** `13.6.0`

### Reconciled Configuration Settings in Saved Report (`configSettings`)

| Parameter | Required Value | Saved in `configSettings.throttling` | Status |
| :--- | :--- | :--- | :--- |
| `requestLatencyMs` | `562.5` | `562.5` | **Exact Match** |
| `downloadThroughputKbps` | `1474.56` | `1474.56` | **Exact Match** |
| `uploadThroughputKbps` | `675` | `675` | **Exact Match** |
| `rttMs` | `150` | `150` | **Exact Match** |
| `throughputKbps` | `1638.4` | `1638.4` | **Exact Match** |
| `cpuSlowdownMultiplier` | `4` | `4` | **Exact Match** |
| `screenEmulation.width` | `375` | `375` | **Exact Match** |
| `screenEmulation.height` | `812` | `812` | **Exact Match** |
| `screenEmulation.deviceScaleFactor` | `3` | `3` | **Exact Match** |
| `screenEmulation.mobile` | `true` | `true` | **Exact Match** |
| `screenEmulation.disabled` | `false` | `false` | **Exact Match** |

*Note on Internal Throttling:* In `simulate` mode, Lighthouse stores and preserves all specified network parameters (`requestLatencyMs`, `downloadThroughputKbps`, `uploadThroughputKbps`, `rttMs`, `throughputKbps`, `cpuSlowdownMultiplier`) inside `configSettings.throttling` without normalization or mutation.

### Actual Measured Results

- **Lighthouse Mobile Performance Score:** **94 / 100** ✅ (Exceeds `performance_score_min: 90`)
- **First Contentful Paint (FCP):** `1.3 s` (1,291 ms)
- **Largest Contentful Paint (LCP):** `2.8 s` (2,787 ms)
- **Total Blocking Time (TBT):** `130 ms` (132.5 ms)
- **Cumulative Layout Shift (CLS):** **`0`** (`0.0000`)
- **Speed Index:** `2.4 s` (2,374 ms)

---

## 7. Size Selector (26 Inventory Variants)

- **Total Variants Audited:** 26 of 26
- **All Variants Present in DOM:** **PASS**
- **Sold-out Variants:** EU 35.5, EU 44, EU 50, EU 50.5 are strictly `disabled` and non-selectable (**PASS**).
- **Button Dimensions:**
  - Minimum button width: `77.75px`
  - Minimum button height: `66.00px`
  - Target: ≥ 44 × 44 CSS px (**PASS** across all 26 buttons)

---

## 8. Gallery Visual Integrity

- **Gallery Card:** `335px × 335px` (1:1 square, `bg-[#F1F1F1]`)
- **Image Wrapper:** `302px × 302px` (`w-[90%] h-[90%]`, exact 90% scale)
- **Source Assets:** Transparent RGBA PNGs (`/assets/nike-pegasus-43-1.png` to `5.png`)
- **Filters & Shadows:** `filter: none`, `box-shadow: none`, `border: none`

---

## 9. Test Summary & Regression Status

| Test Suite / Metric | Measured Value | Result |
| :--- | :--- | :--- |
| `speed-budget.json` Validation | Target values exact | **PASS** |
| Continuous Size Grid Movement | `0.00px` across 461 frames | **PASS** |
| Minimum Button Dimensions | `77.75px × 66.00px` | **PASS** |
| Lighthouse Mobile Performance (YAML Profile) | `94 / 100` | **PASS** |
| Real Performance Trace | 66,067 events in `chrome-performance-trace.json` | **PASS** |
| Dropped Frames | 20 dropped frames during 4x CPU scroll burst | **EVIDENCED** |
| TypeScript Typecheck | `npx tsc --noEmit` | **PASS** |
| ESLint | `npm run lint` | **PASS** (0 errors, 0 warnings) |
| Production Build | `npm run build` | **PASS** |
| Regression Suites | All 6 test scripts passing | **PASS** |
| Live Verification Selectors | All 5 data-testid attributes verified | **PASS** |
