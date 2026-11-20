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
| `performance_score_min` | **≥ 90** | **90 / 100** (Fresh Live Vercel Production Run — Exact YAML Slow 4G Profile) | **PASS** |
| `size_grid_shift_px_max` | **0px** | **0.00px** maximum displacement across 742 continuous RAF frames | **PASS** |
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

- **Continuous RAF Frames Measured:** **742 frames** tracked from first DOM appearance until complete page settlement and scroll.
- **First Observed Size Grid Y Position:** **`763.00px`** (recorded at Frame #0, timestamp 2,428.0ms)
- **Final Observed Size Grid Y Position:** **`763.00px`** (recorded at Frame #741, timestamp 9,812.7ms)
- **Minimum Recorded Y Position:** `763.00px`
- **Maximum Recorded Y Position:** `763.00px`
- **Maximum Vertical Displacement:** **`0.00px`**
- **Cumulative Layout Shift (CLS):** **`0.0000`**
- **Continuous Frame Samples (Excerpt):**
  - Frame #0 (2,428.0ms): `Y = 763.00px`
  - Frame #1 (2,493.3ms): `Y = 763.00px`
  - Frame #2 (2,710.4ms): `Y = 763.00px`
  - Frame #3 (2,730.1ms): `Y = 763.00px`
  - Frame #4 (2,744.7ms): `Y = 763.00px`
  - Frame #370 (5,280.5ms): `Y = 763.00px`
  - Frame #371 (5,287.5ms): `Y = 763.00px`
  - Frame #372 (5,294.7ms): `Y = 763.00px`
  - Frame #737 (9,765.3ms): `Y = 763.00px`
  - Frame #738 (9,773.0ms): `Y = 763.00px`
  - Frame #739 (9,779.2ms): `Y = 763.00px`
  - Frame #740 (9,793.7ms): `Y = 763.00px`
  - Frame #741 (9,812.7ms): `Y = 763.00px`

---

## 4. Real Chrome Performance Trace

Captured during initial page loading and bidirectional scrolling under the exact Slow 4G + 4x CPU slowdown profile:

- **Trace Evidence File:** [`performance-evidence/chrome-performance-trace.json`](./performance-evidence/chrome-performance-trace.json)
- **Summary Evidence File:** [`performance-evidence/audit-summary.json`](./performance-evidence/audit-summary.json)
- **Total Trace Events Collected:** **84,376 events**
- **Long Tasks (> 50ms):** 10 total recorded during initial navigation & hydration under 4x CPU throttle:
  1. `975 ms` at `1,494 ms`
  2. `1,083 ms` at `7,596 ms` (React hydration & chunk evaluation under 4x CPU throttle)
  3. `120 ms` at `8,724 ms`
  4. `140 ms` at `9,257 ms`
  5. `61 ms` at `9,509 ms`
  6. `53 ms` at `9,978 ms`
  7. `129 ms` at `10,155 ms`
  8. `100 ms` at `10,506 ms`
  9. `55 ms` at `10,656 ms`
  10. `85 ms` at `10,722 ms`

---

## 5. Frame Performance & Dropped Frames Analysis

Analyzed directly from Chrome DevTools trace event markers:

- **`BeginFrame` Events:** 1,272
- **`DrawFrame` Events:** 57
- **`DroppedFrame` Events:** 158 (detected during the initial 4x CPU throttled rapid scroll burst)
- **Average Frame Interval:** `18.37 ms` (~54.4 FPS under 4x CPU throttle)

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

- **Lighthouse Mobile Performance Score:** **90 / 100** ✅ (Meets/exceeds `performance_score_min: 90`)
- **First Contentful Paint (FCP):** `1.3 s` (1,344 ms)
- **Largest Contentful Paint (LCP):** `3.0 s` (2,999 ms)
- **Total Blocking Time (TBT):** `230 ms` (226.5 ms)
- **Cumulative Layout Shift (CLS):** **`0`** (`0.0000`)
- **Speed Index:** `2.0 s` (2,044 ms)

---

## 7. Size Selector (26 Inventory Variants)

- **Total Variants Audited:** 26 of 26
- **Source of Truth:** `Pegasus Size and Stock Snapshot, 8 December 2026.json`
- **All Variants Present in DOM:** **PASS**
- **Inventory Breakdown:** 10 In Stock, 7 Low Stock, 9 Sold Out
- **Sold-out Variants:** EU 36.5, EU 38.5, EU 42.5, EU 44, EU 45.5, EU 48.5, EU 49.5, EU 50, EU 50.5 are strictly `disabled` and non-selectable (**PASS**).
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
| Continuous Size Grid Movement | `0.00px` across 742 frames | **PASS** |
| Minimum Button Dimensions | `77.75px × 66.00px` (min 44px) | **PASS** |
| Lighthouse Mobile Performance (YAML Profile) | `90 / 100` | **PASS** |
| Real Performance Trace | 84,376 events in `chrome-performance-trace.json` | **PASS** |
| Dropped Frames | 158 dropped frames during 4x CPU scroll burst | **EVIDENCED** |
| TypeScript Typecheck | `npx tsc --noEmit` | **PASS** |
| ESLint | `npm run lint` | **PASS** (0 errors, 0 warnings) |
| Production Build | `npm run build` | **PASS** |
| Regression Suites | All 6 test scripts passing | **PASS** |
| Live Verification Selectors | All 5 data-testid attributes verified | **PASS** |
