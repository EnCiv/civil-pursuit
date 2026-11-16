# Bidirectional Data Pattern — Intentional State Mutation

**Reference:** https://github.com/EnCiv/.github/wiki/Bidirectional-data-in-multi%E2%80%90part-nested-react-components

---

## The Problem

Some components handle **bidirectional data**: data flows both down from the server/database
or a socket.io subscription push (read) and up from user input (write). If not handled carefully this creates an infinite loop:

1. Server data updates → component re-renders with new props
2. Re-render triggers `onDone` call with current value
3. Parent stores the value and re-renders
4. Repeat indefinitely

---

## The Pattern

There are two variants, both based on the same idea: mutate the state object in place
so React sees no reference change and does not schedule an extra re-render.

### Variant A — Mutation inside a `setState` updater

```js
setState(prevState => {
  prevState[key] = newValue        // ← direct mutation
  return prevState                 // ← same reference → React bails out, no re-render
})
```

Because React performs a reference-equality check (`Object.is(prev, next)`), returning the
same object suppresses the re-render. The mutation is visible to future reads of the state
but does not trigger a downstream render cycle, breaking the feedback loop.

When a re-render IS needed (e.g. the data is now fully valid and the UI must update),
return a new object instead:

```js
setState(prevState => {
  prevState[key] = newValue
  if (needsRerender) return { ...prevState }  // ← new reference → React re-renders
  else return prevState                        // ← same reference → no re-render
})
```

### Variant B — Mutation directly during render

When a prop change triggers a re-render, the component is already going to re-render;
there is no need to call `setState` just to update the displayed value. Instead,
mutate the state object in place during the render body:

```js
const [inputState, setInputState] = useState({ subject: '', description: '' })
const [prev] = useState({ value })

// During render — component is already re-rendering due to prop change:
if (prev.value !== value) {
  inputState.subject = value.subject    // ← mutate in place
  inputState.description = value.description
  prev.value = value                    // ← update tracker
}
// The render below uses inputState directly — no extra re-render needed.
```

This avoids the "double re-render" (one for the incoming prop, one for the setState)
while still giving the component the updated values for the current render pass.

---

## Where This Pattern Is Used in civil-pursuit

**Variant A — mutation in `setState` updater:**

| File | State variable | Trigger |
|------|---------------|------|
| `app/components/pair-compare.jsx` | `ranksByParentId` | Each intermediate comparison; re-render only when all ranked |
| `app/components/steps/answer.js` | `validByType` | Each sub-form validity update; `onDone` called but re-render suppressed |

**Variant B — mutation during render when prop changes:**

| File | State variable | Trigger |
|------|---------------|------|
| `app/components/point-input.jsx` | `inputState` | `value` prop changes from above; avoids double re-render |
| `app/components/steps/grouping.jsx` | `gs` | `reducedPointList` prop changes; resets grouping state in-place |
| `app/components/steps/why.js` | `completedByPointId` | `pointWhyList` prop changes; must run before children render |

**`step-slider.jsx`** returns the same `state` reference on `transitionComplete` for a related
but distinct reason: animation efficiency (no mutation; just skip re-render when transition ends).

---

## Why This Is Not a Bug

This pattern is a documented EnCiv convention. **Do not "fix" it by adding `{ ...prevState }`**
unless you have confirmed that the re-render loop risk has been addressed.

The apparent anti-pattern is intentional:
- The component IS tracking state correctly via the mutable object.
- The suppressed re-render prevents a downstream `onDone` call from bouncing back up
  and causing an infinite render loop.
- The mutation is always idempotent: setting `object[key] = value` twice with the same
  value is safe.

---

## Risks and Known Issues

### 1. React Strict Mode double-invocation

React Strict Mode calls `setState` updater functions twice in development. Because the
mutation is idempotent (same key, same value on the second call) this is safe in practice.

### 2. Test flakiness from animation transitions

In `pair-compare.jsx`, each comparison triggers a 500ms CSS transition that animates the
next point into view. During the transition the incoming point exists in a hidden disabled
container (`<Point vState="disabled">`, no click handler); only after the transition
completes does it move to the clickable visible `<button>`.

If an automated test clicks the point text while the transition is still running, the
click lands on the disabled element and `rankIdxCategory` is never called — so
`setTimeout(() => onDone(...))` is never scheduled, and `onDone` never fires.

Importantly, **the updater itself runs promptly** and the `setTimeout` callback fires
quickly (~31ms) once a correct click lands. The deferred-updater scenario does not occur;
returning the same reference simply suppresses the re-render but does not delay the
`setTimeout` call inside the updater.

**Fix in tests:** wait for the clickable `<button title="Choose as more important: Point N">`
to appear rather than using a fixed `asyncSleep`. That button title only exists when
`idxRight` is committed and React has re-rendered — i.e. the transition is complete:

```js
// ✗ races with the 500ms transition timer:
await asyncSleep(500)
const Point3 = await waitFor(() => canvas.getByText('Point 3'))

// ✓ waits for the clickable button position:
const Point3 = await waitFor(() => canvas.getByTitle('Choose as more important: Point 3'))
```

See `stories/pair-compare.stories.jsx`.

### 3. Debugging

Since `console.log(state)` after a mutation-and-same-ref return will show the mutated
object even if React did not re-render, React DevTools state snapshots may appear
inconsistent. Be aware when debugging.

---

## AI Agent Note

If you see code of this form in civil-pursuit:

```js
setSomeState(prevState => {
  prevState[key] = value   // looks like a mutation bug
  return prevState         // looks like it will never trigger a re-render
})
```

This is **intentional**. Do not change it to `return { ...prevState }` without understanding
the bidirectional data flow in that component. Read this document and the linked wiki page
before making changes.
