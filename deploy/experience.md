# Reading room and observatory

The public experience has two intentional environments, selected by `SiteFrame`: Home, About, the course, lessons, proofs, privacy, tool guide and historical atlas use an ivory reading surface; sky, sphere, sensor, charts, map, compass and admin use a dark observing surface. Embedded geometric figures and equations retain a dark local surface inside the reading pages. Theme tokens, type scale and component rules are in `src/app/editorial.css`. Keep product text out of decorative artwork.

Use Vazirmatn Variable for all interface text, Persian and English. Amiri was removed; Georgia and generic sans-serif canvas labels were replaced. Body text is generally 16–18px, navigation 14–16px, and secondary captions 12–14px. Equation glyphs deliberately use KaTeX. Keep the English and Persian numeral preference independent of content language. Native inputs and browser theme colour follow the active surface.

Home has two featured tools, compact tool rows, a historical manuscript feature, a restrained green phone section, and the builder's personal story. The lantern and Khayyam verse remain brand signatures. Tool previews animate on intentional hover/focus, pause offscreen and honour reduced motion. No new 3D engine or animation library was introduced. Shared navigation/tool links do not prefetch heavy workspaces; both sky tabs are loaded on demand, and equation CSS is imported with the equation component.

## Sky projection and gestures

`createSkyProjector` computes an orthonormal camera frame once per draw. For stereographic exploration, let `(dx, dy, depth)` be a unit direction's components in that frame and `k = tan(verticalFov / 4)` (angles in radians). The projected coordinates are `(dx, dy) / ((1 + depth) k)`; the vertical half-height is one. The antipode is excluded. The inverse uses `theta = 2 atan(k sqrt(x² + y²))`. This replaces the wide-angle gnomonic camera, rather than cosmetically bending its horizon.

The geometric ground mask follows the vertical component of this same inverse ray. Its numerator is the quadratic `Fz (1 - k² (x² + y²)) + 2k (Rz x + Uz y)`. Cached scanline intervals where it is negative form the ground. Stars, grid, great-circle constellation segments, horizon and selection share the projection. Masking is recomputed only when the view or canvas size changes.

The all-sky preset uses an azimuthal-equidistant hemisphere centred on zenith. Radius is `theta / (pi/2)`: zenith at centre, every horizon bearing on the rim, north up and east left in the default orientation. Dragging rotates its compass; zooming in enters stereographic exploration while preserving the pointer's sky direction. Normal exploration zoom is clamped to 8–175 degrees. Spherical dragging rotates the camera frame and retains roll through the zenith, avoiding an azimuth clamp or pole flip. Pinch uses its midpoint as the anchor and supports continuing with one finger after release.

The renderer coalesces redraws with requestAnimationFrame; the ResizeObserver and font-ready listener are not recreated for every frame. It computes sidereal time once per update and caches catalogue arc geometry. Live time pauses when the workspace is outside the viewport or the document is hidden. Labels are placed brightest-first using measured text bounds, exclude the HUD, avoid collisions and clipped dome edges, and have a lower density on phones.

Positions retain the preceding educational astronomy model: geometric HYG/Hipparcos coordinates transformed with approximate mean sidereal time. Observation-date precession, nutation, proper motion and atmospheric refraction are not added by this UI revision. The explanatory note remains visible.

## Verification

`scripts/sky-projection.test.ts` checks half-angle scaling, independent direction round trips, ground-mask hemisphere agreement, pointer-anchored zoom/drag through zenith, and the full-sky rim/cardinal directions. It runs with the existing geometry, content, sensor, language, numeral and authentication tests via `npm test`.

Browser verification should cover both languages at 320/390/768/1024/1440px; manuscript and lesson readability; equation rendering; mobile menu and contact links; protected tool gates and an isolated local preview account; wheel, mouse drag, simulated touch/pinch, search/selection and keyboard controls; reduced motion and offscreen clock pause. Distinguish browser viewport emulation from physical-device testing. Compare font resource bytes and production route bundle sizes; do not present local development navigation timings as real-user performance measurements.
