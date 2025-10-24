# Specification: DemInfo Component Revision

**Version:** 1.1  
**Date:** October 22, 2025  
**Project:** civil-pursuit  
**Branch:** dem-info-v2  
**Status:** Implementation Complete

## Overview

Revise the `dem-info.jsx` component to fetch demographic data from the `jsforms` model instead of receiving it as props. The data is stored in the `moreDetails` property of the jsforms collection and is defined by JSON Schema and UI Schema configurations from `iotas.json`.

## Implementation Summary

**Status**: ✅ **IMPLEMENTATION COMPLETE** (October 22, 2025)

All planned components have been successfully implemented and tested:

### Completed Components

1. ✅ **Socket API** (`app/socket-apis/get-dem-info.js`)

   - Batch demographic data fetching with privacy enforcement
   - 13 integration tests passing (MongoMemoryServer)
   - Security: userId always stripped from responses
   - Privacy: shareInfo="Yes" required to return data

2. ✅ **DemInfoContext** (`app/components/dem-info-context.jsx`)

   - Context provider following `deliberation-context` pattern
   - Prop: `demInfoProviderDefault` (optional, defaults to `{}`)
   - State management with `setOrDeleteByMutatePath`
   - UISchema extraction from iota configuration

3. ✅ **useFetchDemInfo Hook** (`app/components/hooks/use-fetch-dem-info.js`)

   - Returns explicit `fetchDemInfo(pointIds)` function
   - **Static `requestedById` cache**: Prevents redundant fetches across ALL component instances
   - Two-level deduplication: context cache + static request cache
   - `resetRequestedById()` helper for test isolation

4. ✅ **DemInfo Component** (`app/components/dem-info.jsx`)

   - Renders demographic data with UISchema ordering
   - Special handling: `yearOfBirth` → displays calculated age
   - Minimal styling with bullet separators
   - Filters out `shareInfo` field from display
   - Defensive null handling

5. ✅ **CivilPursuit Integration** (`app/web-components/civil-pursuit.js`)

   - Wraps app with `DemInfoProvider`
   - Extracts and sets UISchema from iota steps
   - Scoped to single discussion

6. ✅ **Step Component Integration**
   - `GroupingStep`: Fetches parent points after `get-points-for-round`
   - `RankStep`: No fetch (optimization - only gets ranks, no new points)
   - `WhyStep`: Fetches NEW why points after `get-user-whys`
   - `CompareWhysStep`: Fetches NEW why points after `get-why-ranks-and-points`
   - `RerankStep`: Fetches NEW why points after `get-user-post-ranks-and-top-ranked-whys`

### Test Coverage

- **Socket API Tests**: 13 integration tests with MongoMemoryServer ✅
- **Storybook Tests**: 299 component tests across all stories ✅
- **Test Suites**: 39 suites passing ✅
- **Coverage**: All components, privacy rules, caching, optimization patterns

### Key Optimizations Implemented

1. **Static Cache**: `requestedById` object shared across all hook instances prevents redundant fetches even when navigating between steps
2. **Fetch Only New IDs**: Step components only request dem-info for NEW point IDs returned by their API calls, not for IDs already in DeliberationContext
3. **Age Calculation**: `yearOfBirth` automatically converted to current age for better privacy and relevance

### Remaining Work

- ⏳ **Manual Testing**: Testing with production data, different discussions, privacy scenarios, performance validation

### Architecture Highlights

- **Privacy-First**: shareInfo="Yes" required, userId always stripped
- **Performance**: Static caching, batch fetching, minimal re-renders
- **Extensibility**: Schema-driven rendering via UISchema
- **Maintainability**: Follows existing project patterns (deliberation-context, react-jss)

## Key Requirements

### Security

- **CRITICAL**: Never transmit `userId` to the browser except when it matches the authenticated user's ID
- `pointId` (point `_id` as string) is safe to transmit
- `discussionId` is safe to transmit
- All socket API responses must strip `userId` before sending to client (unless it's the user's own data)

### Data Flow

1. Point component renders with `pointId` (the point's `_id`)
2. DemInfo component requests dem-info by `pointId`
3. Socket API uses `pointId` → gets point → extracts `userId` → fetches jsforms data
4. API filters out `userId` before sending to browser
5. DemInfo retrieves data from context and renders

---

## Components

### 1. DemInfoContext (`app/components/dem-info-context.jsx`)

**Purpose**: Centralized store for demographic information, minimizing redundant API calls.

**Structure**:

```javascript
{
  uischema: { /* uischema for render order - applies to all data */ },
  demInfoById: {
    [pointId]: { /* schema-defined fields */ }
  }
}
```

**API** (follows `deliberation-context` pattern):

- `DemInfoProvider` - React context provider component
  - Props: `demInfoProviderDefault` (optional) - Initial data object (defaults to `{}`)
  - Usage: `<DemInfoProvider demInfoProviderDefault={{ uischema: {...}, demInfoById: {...} }}>...</DemInfoProvider>`
  - Typically used without props; initial data is set via `upsert()` after mount
- `useDemInfoContext()` - Hook returning `{ data, upsert }`

**Context Value**:

- `data` - Object containing `{ uischema, demInfoById }`
- `upsert(obj)` - Function to update context using `setOrDeleteByMutatePath`

**Usage Pattern**:

```javascript
const { data, upsert } = useDemInfoContext()

// Set UISchema
upsert({
  uischema: {
    /* uischema from iota */
  },
})

// Set dem-info for pointIds
upsert({
  demInfoById: {
    [pointId]: {
      /* moreDetails */
    },
  },
})

// Get UISchema
const uischema = data.uischema

// Get dem-info for a point
const demInfo = data.demInfoById?.[pointId]
```

**Implementation Notes**:

- Use React Context API with `createContext` and `useContext`
- Provider wraps the app at CivilPursuit level (scoped to one discussion)
- Follow `deliberation-context` pattern with `data` and `upsert`
- Use `setOrDeleteByMutatePath` for state updates (from `app/lib/set-or-delete-by-mutate-path`)
- UISchema is set once by CivilPursuit component on mount (extracted from iota steps)
- Batches `pointIds` to avoid duplicate API calls
- Handles race conditions (multiple components requesting same pointId)
- Caches results indefinitely (no expiration needed for this use case)
- Uses socket.io to call `get-dem-info` API

**Socket Integration**:

```javascript
window.socket.emit('get-dem-info', ['id1', 'id2'], demInfo => {
  if (demInfo) {
    // Success: demInfo is object with { [pointId]: data }
    upsert({ demInfoById: demInfo })
  } else {
    // Error: demInfo is undefined, handle silently (don't update context)
  }
})
```

**Internal State Management**:

- Use `useState` to manage data object
- Use `useRef` for tracking pending requests (avoid duplicate fetches)
- Use `useCallback` to memoize `upsert` function
- Return new object reference only when data actually changes (like `deliberation-context`)

**Tests**: React component testing is done through Storybook stories, not unit tests. See Storybook Tests section for comprehensive test scenarios.

---

### 2. DemInfo Component (`app/components/dem-info.jsx`)

**Purpose**: Display demographic information for a point's author.

**Props**:

- `pointId: string` (required) - The `_id` of the point

**Behavior**:

- On mount/pointId change: check `data.demInfoById[pointId]` for data
- If not cached, trigger fetch via helper function or hook
- If no data or empty data, return `null`
- Otherwise, render data values

**Data Access**:

```javascript
const { data } = useDemInfoContext()
const demInfo = data.demInfoById?.[pointId]
const uischema = data.uischema
```

**Rendering Rules**:

- Visually minimal: simple inline text, separated by " • " (bullet point)
- Only render **values**, not property names
- Order: render in the order defined by the uischema
- Filter out `shareInfo` field (internal use only, not displayed)
- Filter out any null/undefined values
- **Special handling for `yearOfBirth`**: Calculate and display age instead of birth year
  - Age = current year - yearOfBirth
  - Example: if yearOfBirth is 1985 and current year is 2025, display "40"
- Example output: `California • 40 • Democrat`

**Rendering Logic**:

1. Get uischema from `data.uischema` (set once by CivilPursuit)
2. Get demInfo from `data.demInfoById[pointId]`
3. Parse uischema elements array
4. Extract property names from `scope` (e.g., `#/properties/stateOfResidence` → `stateOfResidence`)
5. Filter for properties present in demInfo
6. Skip `shareInfo` property
7. For each property value:
   - If property is `yearOfBirth`, calculate age: `currentYear - yearOfBirth`
   - Otherwise, use the value as-is
8. Render values in uischema order, separated by " • "
9. If no uischema available, render in alphabetical order (fallback)

**Styling**:

- Small, muted text (use `theme.colors.textMuted` or similar from `app/components/theme.js`)
- Inline-block or flex layout
- No borders, no background, minimal padding
- Font size smaller than main content

**Tests**: React component testing is done through Storybook stories. See `stories/dem-info.stories.jsx` for comprehensive test scenarios covering all rendering variations, uischema parsing, and null conditions.

---

### 3. Socket API Handler (`app/socket-apis/get-dem-info.js`)

**Purpose**: Fetch demographic data for multiple points while enforcing security rules.

**API Signature**:

```javascript
// Client calls:
window.socket.emit('get-dem-info', pointIds, callback)
// where pointIds is string[] - array of point IDs

// Server responds (success):
callback({
  [pointId]: {
    /* moreDetails fields */
  },
})

// Server responds (error):
callback(undefined)
```

**Server-side Logic**:

1. Validate `pointIds` is array of strings
2. Validate user is authenticated (`this.synuser`)
3. For each `pointId`:
   - Query `Point` model to get point document by `_id` (as ObjectId)
   - If point not found, set result to `null` and continue
   - Extract `userId` (string) from point
   - Extract `discussionId` (string) from point
   - Query `Jsforms` model: `findOne({ userId, parentId: discussionId })`
   - If jsform not found, set result to `null` and continue
   - Extract `moreDetails` property
   - **Check `shareInfo` field**: If `shareInfo !== "Yes"`, set result to `null` and continue
   - If `userId` !== `this.synuser.id`, remove `userId` from moreDetails
   - Store result: `{ [pointId]: moreDetails }` or `{ [pointId]: null }`
4. Return results object to callback, or `undefined` on error

**Privacy Enforcement**:

- `shareInfo` must equal `"Yes"` (case-sensitive) to share demographic data
- If `shareInfo` is `"No"`, missing, or any other value, return `null` for that pointId
- This respects user privacy preferences

**No UISchema in Response**: The UISchema is managed by CivilPursuit component and set in the context once on mount. The socket API only returns the moreDetails data.

**Error Handling**:

- Invalid `pointIds` (not array or empty): return `undefined`
- Unauthenticated: return `undefined`
- Point not found: return `null` for that `pointId` (don't fail entire request)
- Jsform not found: return `null` for that `pointId`
- Database errors: log error with `logger.error`, return `undefined`

**Callback Pattern**:

```javascript
// Success
callback({ pointId1: { data }, pointId2: { data }, pointId3: null })

// Error
callback(undefined)
```

**Model Usage** (per project conventions):

```javascript
import Point from '../models/point'
import Jsforms from '../models/jsforms'
import { ObjectId } from 'mongodb'

// Convert string pointId to ObjectId for query
const point = await Point.findOne({ _id: new ObjectId(pointId) })

// parentId is the discussionId in Jsforms
const jsform = await Jsforms.findOne({ userId: point.userId, parentId: point.discussionId })

// Check shareInfo before returning
if (jsform.moreDetails?.shareInfo !== 'Yes') {
  return null // User has not consented to share
}

// Return just the moreDetails data
return jsform.moreDetails
```

**Tests** (`app/socket-apis/__tests__/get-dem-info.test.js`):

- Integration test using MongoMemoryServer (per coding instructions)
- Setup: Create test points, jsforms documents with various shareInfo values
- Returns object with dem-info for valid pointIds where shareInfo="Yes"
- Returns null for pointId where shareInfo="No"
- Returns null for pointId where shareInfo is missing
- Returns null for pointId with no jsform data (within success object)
- Removes userId from response for other users' points
- Includes userId for authenticated user's own points (if shareInfo="Yes")
- Handles multiple pointIds in single request
- Returns undefined for unauthenticated requests
- Returns undefined for invalid pointIds format
- Handles points that don't exist gracefully (returns null for those pointIds)
- Handles database errors gracefully (returns undefined)
- Returns only moreDetails data (no uischema)
- Does not render shareInfo field itself in response

**Test Setup Requirements**:

- Use `@shelf/jest-mongodb` and `mongodb-memory-server`
- Mock `this.synuser` for authentication
- Mock `global.logger` (info: silent, warn/error: console for debugging)
- Use `jest.clearAllMocks()` in cleanup

---

### 4. CivilPursuit Component Integration (`app/web-components/civil-pursuit.jsx`)

**Purpose**: Initialize DemInfoContext with UISchema for the discussion.

**Changes Required**:

1. Wrap component tree with `DemInfoProvider`
2. Extract UISchema from iota steps on mount
3. Call `setUISchema()` to store in context

**Implementation**:

```javascript
import React, { useEffect } from 'react'
import { DemInfoProvider, useDemInfoContext } from '../components/dem-info-context'

function CivilPursuit({ iota, ...props }) {
  return (
    <DemInfoProvider>
      <CivilPursuitContent iota={iota} {...props} />
    </DemInfoProvider>
  )
}

function CivilPursuitContent({ iota, ...props }) {
  const { upsert } = useDemInfoContext()

  useEffect(() => {
    // Extract uischema from iota steps
    const steps = iota?.webComponent?.steps || []
    const moreDetailsStep = steps.find(
      step => step.webComponent === 'Jsform' && step.name === 'moreDetails'
    )

    if (moreDetailsStep?.uischema) {
      upsert({ uischema: moreDetailsStep.uischema })
    }
  }, [iota, upsert])

  return (
    // ... existing rendering
  )
}
```

**Tests**: React component testing is done through Storybook stories, not unit tests. See Storybook Tests section for integration test scenarios.

---

### 5. Integration with Step Components

**Status**: ✅ **COMPLETED** - All step components integrated.

**Integrated Files**:

- `app/components/steps/grouping.jsx` ✅ (Fetches parent points)
- `app/components/steps/rank.js` ✅ (No fetch needed - only fetches ranks, not points)
- `app/components/steps/why.js` ✅ (Fetches why points)
- `app/components/steps/compare-whys.js` ✅ (Fetches why points)
- `app/components/steps/rerank.js` ✅ (Fetches why points)

**Preferred Pattern: useFetchDemInfo Hook Returns Function**:

Create a shared hook `app/components/hooks/use-fetch-dem-info.js` that **returns a function** to be called explicitly:

```javascript
import { useCallback } from 'react'
import { useDemInfoContext } from '../dem-info-context'

// Static variable shared across all hook instances
// Tracks which pointIds have been requested to avoid redundant fetches
// This prevents re-fetching the same IDs even across different step components
const requestedById = {}

// Reset function for testing - clears the static cache
export function resetRequestedById() {
  Object.keys(requestedById).forEach(key => delete requestedById[key])
}

export default function useFetchDemInfo() {
  const context = useDemInfoContext()

  const data = context?.data
  const upsert = context?.upsert

  const fetchDemInfo = useCallback(
    pointIds => {
      if (!data || !upsert) return
      if (!pointIds || pointIds.length === 0) return

      // Filter out IDs that are already in cache OR have been requested
      const uncached = pointIds.filter(id => !data.demInfoById?.hasOwnProperty(id) && !requestedById[id])
      if (uncached.length === 0) return

      // Mark these IDs as requested (across all hook instances)
      uncached.forEach(id => (requestedById[id] = true))

      window.socket.emit('get-dem-info', uncached, demInfo => {
        if (demInfo) {
          upsert({ demInfoById: demInfo })
        }
      })
    },
    [data?.demInfoById, upsert]
  )

  return fetchDemInfo
}
```

**Key Implementation Details**:

- **Static `requestedById` object**: Shared across ALL hook instances (not per-instance like `useRef`)
- **Cross-step caching**: If an ID is fetched in GroupingStep, it won't be re-fetched in RankStep or any other step
- **Two-level deduplication**:
  1. Checks `data.demInfoById` (context cache) - data already fetched and in state
  2. Checks `requestedById` (static cache) - request already sent (may not be in state yet)
- **No context dependency**: Uses plain object, not context state, to avoid triggering re-renders
- **Test helper**: `resetRequestedById()` exported for test cleanup to ensure test isolation

**Testing Note**: In test stories, call `resetRequestedById()` before each test to clear the static cache:

```javascript
import { resetRequestedById } from '../app/components/hooks/use-fetch-dem-info'

export const someTestStory = {
  decorators: [
    Story => {
      useState(() => {
        resetRequestedById() // Clear static cache for test isolation
      })
      return <Story />
    },
    // ... other decorators
  ],
  // ... test implementation
}
```

return fetchDemInfo
}

````

**Rationale**: By returning a function instead of automatically fetching, we can call it explicitly after socket API calls that fetch points. This solves the timing and hook dependency issues.

**Step Component Usage**:

**Pattern**: Call `useFetchDemInfo()` to get the `fetchDemInfo` function, then call it explicitly **after** socket API calls that fetch points.

```javascript
import React, { useContext, useEffect } from 'react'
import DeliberationContext from '../deliberation-context'
import useFetchDemInfo from '../hooks/use-fetch-dem-info'

// Example 1: GroupingStep ✅
export default function GroupingStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const fetchDemInfo = useFetchDemInfo()  // Get the function

  useEffect(() => {
    window.socket.emit('get-points-for-round', discussionId, round, points => {
      if (!points) return

      // Update context with points
      const pointById = {}
      for (const point of points) {
        pointById[point._id] = point
      }
      upsert({ pointById })

      // Now fetch demographic info for these points
      const pointIds = points.map(p => p._id)
      fetchDemInfo(pointIds)  // Called explicitly after API response
    })
  }, [round])

  return <GroupPoints {...otherProps} />
}

// Example 2: RankStep ✅
export default function RankStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const fetchDemInfo = useFetchDemInfo()  // Get the function

  useEffect(() => {
    window.socket.emit('get-user-ranks', discussionId, round, 'pre', result => {
      if (!result) return
      const preRankByParentId = result.reduce((acc, rank) => {
        acc[rank.parentId] = rank
        return acc
      }, {})
      upsert({ preRankByParentId })

      // No fetchDemInfo call here: get-user-ranks returns only ranks (no new points)
      // Parent points were already fetched in GroupingStep
    })
  }, [round])

  return <RankPoints {...otherProps} />
}

// Example 3: WhyStep ✅
export default function WhyStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const fetchDemInfo = useFetchDemInfo()

  useEffect(() => {
    const ids = data.reducedPointList.map(pG => pG.point._id)
    window.socket.emit('get-user-whys', ids, results => {
      if (!results) return

      const myWhyByCategoryByParentId = {}
      for (const point of results) {
        if (!myWhyByCategoryByParentId[point.category]) myWhyByCategoryByParentId[point.category] = {}
        myWhyByCategoryByParentId[point.category][point.parentId] = point
      }
      upsert({ myWhyByCategoryByParentId })

      // Fetch dem-info for NEW why points returned from API (not parent points - those are already in context)
      const whyIds = results.map(w => w._id)
      fetchDemInfo(whyIds)
    })
  }, [])

  return <WhyStepContent {...otherProps} />
}

// Example 4: CompareWhysStep ✅
export default function CompareWhysStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const fetchDemInfo = useFetchDemInfo()

  useEffect(() => {
    const { mostIds, leastIds } = Object.values(preRankByParentId ?? {}).reduce(
      ({ mostIds, leastIds }, rank) => {
        if (rank.category === 'most') mostIds.push(rank.parentId)
        else if (rank.category === 'least') leastIds.push(rank.parentId)
        return { mostIds, leastIds }
      },
      { mostIds: [], leastIds: [] }
    )

    window.socket.emit('get-why-ranks-and-points', discussionId, round, mostIds, leastIds, result => {
      if (!result) return
      const { ranks, whys } = result
      upsert({ whyRankByParentId: ranks, randomWhyById: whys })

      // Fetch dem-info for NEW why points from API (not parent points - already in context)
      const whyIds = whys.map(w => w._id)
      fetchDemInfo(whyIds)
    })
  }, [round])

  return <CompareWhys {...otherProps} />
}

// Example 5: RerankStep ✅
export default function RerankStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const fetchDemInfo = useFetchDemInfo()

  useEffect(() => {
    const parentIds = reducedPointList.map(pg => pg.point._id)
    window.socket.emit('get-user-post-ranks-and-top-ranked-whys', discussionId, round, parentIds, result => {
      if (!result) return
      const { ranks, whys } = result
      upsert({ postRankByParentId: ranks, whysByCategoryByParentId: whys })

      // Fetch dem-info for NEW why points from API (not parent points - already in context)
      const whyIds = whys.map(w => w._id)
      fetchDemInfo(whyIds)
    })
  }, [round])

  return <Rerank {...otherProps} />
}
````

**Implementation Steps for Each Component**:

1. Import `useFetchDemInfo` hook from `../hooks/use-fetch-dem-info`
2. Call `const fetchDemInfo = useFetchDemInfo()` at component top level to get the function
3. Inside the `useEffect` that calls socket API to fetch points:
   - After receiving the response and updating context
   - Extract pointIds from the response
   - Call `fetchDemInfo(pointIds)` explicitly
4. No other changes needed - Point component already renders DemInfo internally

**Why This Pattern Works**:

- Respects React's Rules of Hooks (hook called at top level)
- Explicit control over when fetching happens (after API calls)
- No dependency on changing props/state to trigger fetching
- Clean separation: socket API fetches points → update context → fetch dem-info
- Caching and deduplication still handled by the hook
- Works naturally with the existing pattern of updating DeliberationContext in socket callbacks

**OPTIMIZATION: Fetch Only New IDs**:

**Important**: Only fetch demographic info for IDs that are **new from the API call**, not for IDs already in DeliberationContext.

**Rationale**: Points already in DeliberationContext were fetched via previous API calls, so their demographic info has already been fetched (or attempted). Fetching them again wastes network bandwidth and server resources.

**Pattern**:

```javascript
// ✅ CORRECT: Fetch only new IDs from API response
window.socket.emit('get-user-whys', ids, results => {
  upsert({ myWhyByCategoryByParentId })

  // Only fetch dem-info for the NEW why points returned by the API
  const whyIds = results.map(w => w._id)
  fetchDemInfo(whyIds) // Only new IDs
})

// ❌ INCORRECT: Don't fetch IDs already in context
window.socket.emit('get-user-whys', ids, results => {
  upsert({ myWhyByCategoryByParentId })

  // DON'T do this - these parent IDs are already in context
  fetchDemInfo(ids) // These were already fetched in a previous step
})
```

**Examples**:

- **GroupingStep**: Fetches parent points from API → fetch dem-info for those `pointIds`
- **RankStep**: Fetches ranks only (no new points) → no fetchDemInfo call needed (parent points already fetched in GroupingStep)
- **WhyStep**: Fetches why points from API → fetch dem-info for `whyIds` (not parent IDs, those are already in context)
- **CompareWhysStep**: Fetches why points from API → fetch dem-info for new `whyIds` (not parent IDs)
- **RerankStep**: Fetches why points from API → fetch dem-info for new `whyIds` (not parent IDs)

**Note**: The hook's internal caching prevents duplicate network requests even if the same ID is passed multiple times, but following this optimization pattern avoids unnecessary hook processing and keeps the code efficient.

**Tests**:

- Integration tests for `useFetchDemInfo` hook via Storybook stories
- Storybook stories for each step component showing dem-info integration
- Verify `fetchDemInfo` function is returned from hook
- Verify `fetchDemInfo` is called explicitly after socket API calls
- Verify hook filters uncached pointIds correctly
- Verify hook calls socket.emit with correct pointIds
- Verify hook calls `upsert` when callback receives data
- Verify hook avoids duplicate fetches for same pointIds
- Verify dem-info data appears in DemInfoContext after fetch

---

## Models

### Point Model (`app/models/point.js`)

**Assumption**: Already exists with schema:

```javascript
{
  _id: ObjectId,
  userId: string,        // userId as string
  discussionId: string,  // discussionId as string
  subject: string,
  description: string,
  // ... other fields
}
```

**No changes needed** - used for lookups only.

**Important**: On the client side, `_id` is always a string. In the database, `_id` is always an ObjectId object. Server-side code must use `new ObjectId(stringId)` to convert strings for database queries.

---

### Jsforms Model (`app/models/jsforms.js`)

**Status**: Already exists.

**Schema** (from existing model):

```javascript
{
  _id: ObjectId,              // Required
  parentId: string,           // Required (discussionId)
  userId: string,             // Optional
  [propertyName]: object      // Additional properties (e.g., moreDetails)
}
```

**Usage Pattern**:

```javascript
import Jsforms from '../models/jsforms'

// Query by userId and discussionId (parentId)
const jsform = await Jsforms.findOne({ userId, parentId: discussionId })

// Access moreDetails
const moreDetails = jsform?.moreDetails
```

**Key Points**:

- `parentId` is the `discussionId` in this context
- `moreDetails` is stored as an additional property (flexible schema)
- No `createdAt` or `updatedAt` fields
- Uses `@enciv/mongo-collections` Collection class

**No new tests needed** - model already exists and is tested.

---

## Schema/UI Schema Usage

### Data Source: `iotas.json`

**Relevant Section** (example from first iota):

```json
{
  "webComponent": "Jsform",
  "name": "moreDetails",
  "schema": {
    /* JSON Schema */
  },
  "uischema": {
    /* UI Schema */
  }
}
```

**Schema Variability**: Different iotas have different `moreDetails` schemas:

**Example 1** (lines 32-93):

```json
{
  "stateOfResidence": { "type": "string", "enum": ["Alabama", ...] },
  "dateOfBirth": { "type": "string", "format": "date" }
}
```

**Example 2** (lines 464-558):

```json
{
  "politicalParty": { "type": "string", "enum": ["Democrat", "Republican", ...] },
  "stateOfResidence": { "type": "string", "enum": ["Alabama", ...] },
  "yearOfBirth": { "type": "integer", "minimum": 1900, "maximum": 2025 },
  "Gender": { "type": "string", "enum": ["Male", "Female", "Other"] },
  "shareInfo": { "type": "string", "enum": ["Yes", "No"] }
}
```

### UI Schema Structure

**Purpose**: Defines render order and display rules.

**Example**:

```json
{
  "type": "VerticalLayout",
  "elements": [
    { "type": "Control", "scope": "#/properties/politicalParty" },
    { "type": "Control", "scope": "#/properties/stateOfResidence" },
    { "type": "Control", "scope": "#/properties/yearOfBirth" },
    { "type": "Control", "scope": "#/properties/Gender" },
    { "type": "Control", "scope": "#/properties/shareInfo" }
  ]
}
```

### DemInfo Rendering Logic

1. Parse uischema elements array from API response
2. Extract property names from `scope` (e.g., `#/properties/stateOfResidence` → `stateOfResidence`)
3. Filter for properties present in data
4. **Skip `shareInfo` property** (internal use only)
5. Render values in uischema order
6. If no uischema provided, render in alphabetical order (fallback)

**Example Rendering**:

- Input data: `{ stateOfResidence: "California", yearOfBirth: 1985, politicalParty: "Democrat" }`
- UISchema order: politicalParty, stateOfResidence, yearOfBirth
- Output: `"Democrat • California • 1985"`

---

## Clarifications & Design Decisions

### 1. Jsform Model Lookup

**Decision**: One jsform per user per discussion.

- Each user fills out the moreDetails form once per discussion
- Query: `findOne({ userId, parentId: discussionId })` returns single document
- `parentId` in Jsforms model corresponds to `discussionId`
- If user fills form multiple times, use latest (updateOne pattern)

### 2. Schema Variability Across Discussions

**Decision**: UISchema is set once per discussion by CivilPursuit component.

- CivilPursuit extracts uischema from iota on mount
- Stores in context via `upsert({ uischema })`
- One uischema applies to all dem-info in that discussion
- Socket API only returns moreDetails data (not uischema)
- Fallback to alphabetical order if uischema not available

**Rationale**: Simpler architecture, avoids redundant data transmission. Follows existing `deliberation-context` pattern.

### 3. Privacy Filter for `shareInfo: "No"`

**Decision**: Enforce privacy - respect `shareInfo` field.

- If `shareInfo === "Yes"`, return demographic data
- If `shareInfo === "No"` or missing or any other value, return `null`
- Privacy is enforced server-side in the socket API
- Users must explicitly opt-in to share their demographic information

**Rationale**:

- Respects user privacy preferences
- Clear consent model (opt-in, not opt-out)
- Aligns with data privacy best practices

### 4. DemInfoContext Placement

**Decision**: Place in `CivilPursuit` component.

- Wraps all discussion steps
- Scopes context to one discussion
- Appropriate lifecycle for caching per-discussion data

**Implementation**:

```javascript
// In app/components/civil-pursuit.jsx
import { DemInfoProvider } from './dem-info-context'

function CivilPursuit(props) {
  return <DemInfoProvider>{/* existing content */}</DemInfoProvider>
}
```

### 5. Handling Missing Jsform Data

**Decision**: Render nothing (`null`) when data is missing.

- No jsform: `null`
- Empty moreDetails: `null`
- Partial data: render available fields only
- No placeholder text (keeps UI minimal)

**Rationale**: Cleaner UI, less visual noise for optional feature.

### 6. Testing Strategy for Schema/UISchema Parsing

**Decision**: Use mock fixtures for unit tests.

- Create minimal test fixtures for different schema structures
- Test parsing logic with known inputs/outputs
- Integration tests can use real iotas.json if needed

**Example Test Fixture**:

```javascript
const mockUISchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/state' },
    { type: 'Control', scope: '#/properties/year' },
  ],
}

const mockData = {
  state: 'California',
  year: 1985,
}
```

### 7. Performance: Context Update Frequency

**Decision**: Optimize for minimal re-renders.

- Context uses shallow equality for demInfoMap
- Only updates when new pointIds are fetched
- Components use `useMemo` to avoid unnecessary re-renders
- Batch API calls (collect pointIds before calling)

**Implementation Notes**:

- Use `useState` for demInfoMap in context
- Update only changed entries (merge, don't replace entire map)
- Batching: collect all pointIds from a render cycle before API call

---

## Implementation Order

### Phase 1: Foundation

1. ~~**Create Jsform model**~~ - Already exists at `app/models/jsforms.js`
   - No changes needed
   - Uses `parentId` for discussionId
   - No new tests needed

### Phase 2: API Layer

2. **Create socket API** (`app/socket-apis/get-dem-info.js`)
   - Implement security logic (strip userId)
   - Implement privacy logic (check shareInfo="Yes")
   - Implement batch lookup
   - Use `parentId` when querying Jsforms
   - Write integration tests with MongoMemoryServer

### Phase 3: Client State

3. **Create DemInfoContext** (`app/components/dem-info-context.jsx`)
   - Implement provider following `deliberation-context` pattern
   - Use `useState`, `useCallback`, and `useRef`
   - Implement `upsert` using `setOrDeleteByMutatePath`
   - Implement batching logic with useRef to track pending requests
   - Socket integration for fetching data
   - Write tests

### Phase 4: UI Component

4. **Revise DemInfo component** (`app/components/dem-info.jsx`)

   - Update to use context
   - Implement rendering logic (uischema order, bullet separators)
   - Write tests

5. **Update CivilPursuit component** (`app/web-components/civil-pursuit.jsx`)
   - Wrap with DemInfoProvider
   - Extract and set UISchema from iota
   - Write tests

### Phase 5: Integration

6. **Create useFetchDemInfo hook** (`app/components/hooks/use-fetch-dem-info.js`)

   - Implement shared hook for fetching dem-info
   - Handle caching and deduplication
   - Write tests

7. **Integrate with step components**
   - ✅ Add `useFetchDemInfo(pointIds)` to RankStep
   - Add `useFetchDemInfo(pointIds)` to GroupingStep
   - Add `useFetchDemInfo(pointIds)` to ReviewPointList
   - Add `useFetchDemInfo(pointIds)` to WhyStep
   - Add `useFetchDemInfo(pointIds)` to CompareReasons
   - Update/create Storybook stories for each step showing dem-info integration

### Phase 6: Testing & Refinement

8. **Testing & Integration** ✅ **COMPLETED**

   - ✅ All socket API integration tests passing (13 tests)
   - ✅ All Storybook component tests passing (299 tests)
   - ✅ Static `requestedById` cache for cross-component deduplication
   - ✅ Optimization: only fetch NEW IDs from API responses
   - ⏳ Manual testing with production data (remaining)

9. **Manual testing** (TODO)
   - Test with different discussions/schemas from iotas.json
   - Verify privacy rules (userId never sent to client, shareInfo enforced)
   - Verify performance with many points
   - Test edge cases (missing data, errors, shareInfo="No")
   - Verify UISchema is correctly extracted and applied

---

## Testing Checklist

### Integration Tests (Socket API)

- [x] Socket API with real MongoDB (MongoMemoryServer) - `app/socket-apis/__tests__/get-dem-info.test.js`
- [x] Socket API security (userId filtering) - covered in socket API tests
- [x] Socket API privacy (shareInfo enforcement) - covered in socket API tests
- [x] Socket API batch requests - covered in socket API tests
- [x] Socket API uses parentId for Jsforms queries - covered in socket API tests

### Storybook Tests (React Components)

**Note**: All React component testing is done through Storybook stories, not traditional unit tests. This provides visual testing and interaction testing in a realistic environment.

- [x] **DemInfo component** (`stories/dem-info.stories.jsx`)

  - ✅ `WithMultipleFields` - Story with valid dem-info data (multiple fields)
  - ✅ `WithSingleField` - Story with single field
  - ✅ `NoData` - Story with no data (renders nothing)
  - ✅ `ShareInfoNo` - Story with shareInfo="No" (renders nothing)
  - ✅ `UISchemaOrdering` - Story showing uischema ordering (custom order vs alphabetical fallback)
  - ✅ `UserIdSkipped` - Story with userId present (should be skipped in rendering)
  - ✅ `ShareInfoFieldSkipped` - Story with shareInfo field (should be skipped in rendering)
  - ✅ `InteractiveToggle` - Interactive controls to toggle data availability
  - ✅ `EmptyFields` - Story with empty field values

- [x] **Point component with DemInfo** (`stories/point.stories.jsx`)

  - ✅ `PointWithDemInfo` - Story showing point with associated demographic info below
  - ✅ `PointWithNoDemInfo` - Story with point where no dem-info available
  - ✅ `MultiplePointsWithMixedDemInfo` - Story with multiple points showing different dem-info
  - ✅ `PointWithDemInfoSelected` - Demonstrate the visual integration of DemInfo within Point display (selected state)

- [x] **RankStep with DemInfo** (`stories/rank-step.stories.js`)

  - ✅ RankStep does NOT call fetchDemInfo (optimization: get-user-ranks returns only ranks, no new points)
  - ✅ Parent points already fetched in GroupingStep
  - ✅ Test removed as it was testing functionality that should not exist

- [x] **RerankStep with DemInfo** (`stories/rerank-step.stories.js`)

  - ✅ `DesktopWithDemInfo` - Shows rerank step with dem-info for all points including nested whys

- [x] **GroupingStep with DemInfo** (`stories/grouping-step.stories.jsx`)

  - ✅ `groupingStepFetchesDemInfo` - Verify fetchDemInfo is called after get-points-for-round with correct pointIds
  - ✅ `groupingStepCachesDemInfo` - Verify static cache prevents redundant fetches across instances
  - ✅ Test verifies get-dem-info socket API is called
  - ✅ Test verifies dem-info data is populated in DemInfoContext

- [x] **WhyStep with DemInfo** (`stories/why-step.stories.jsx`)

  - ✅ Story showing why step with dem-info for why points (not parent points)
  - ✅ Verified useFetchDemInfo integration fetches only NEW why point IDs

- [x] **CompareWhysStep with DemInfo** (`stories/compare-whys.stories.jsx`)

  - ✅ Story showing compare whys with dem-info for why points
  - ✅ Verified useFetchDemInfo integration fetches only NEW why point IDs

- [x] **RerankStep with DemInfo** (`stories/rerank-step.stories.js`)

  - ✅ `DesktopWithDemInfo` - Shows rerank/review step with dem-info for parent points and nested why points
  - ✅ Verified useFetchDemInfo integration fetches only NEW why point IDs

- [x] **Tournament with DemInfo** (`stories/tournament.stories.js`)
  - ✅ Full tournament flow with dem-info throughout all steps
  - ✅ Includes get-dem-info API decorator with test data generation
  - ✅ DemInfoProvider properly wraps tournament with UISchema setup

### Manual Tests (Remaining)

- [ ] Multiple discussions with different schemas (test with iotas.json discussions)
- [ ] User's own points (userId excluded server-side even for own points per implementation)
- [ ] Other users' points (userId excluded)
- [ ] Points where shareInfo="Yes" (data shown with age calculated from yearOfBirth)
- [ ] Points where shareInfo="No" (no data shown)
- [ ] Points where shareInfo is missing (no data shown)
- [ ] Missing jsform data (graceful null handling)
- [ ] Network errors (graceful error handling)
- [ ] Many points (performance with static cache optimization)
- [ ] yearOfBirth to age conversion accuracy across different years

---

## Code Style & Conventions

### File Organization

- Follow existing project structure
- Use ES modules (`import`/`export`) for new files
- Match existing file's style when editing

### Model Usage

- Import models directly: `import Jsform from '../models/jsform'`
- Use standard MongoDB methods
- Convert string IDs to ObjectId: `new ObjectId(stringId)`

### Socket APIs

- Export function that takes `(__, callback)` or `(payload, callback)`
- Use `this.synuser` for authenticated user
- Always return `undefined` or `{}` or `[]`

### Testing

- Integration tests for database operations (MongoMemoryServer)
- Mock `global.logger` appropriately
- Use `jest.clearAllMocks()` in cleanup
- Descriptive test names

### Logging

- Use `global.logger.error()` for errors
- Use `global.logger.warn()` for warnings
- Use `global.logger.info()` for info (sparingly)

---

## Security Checklist

- [ ] Never send `userId` to client (except user's own)
- [ ] Validate all inputs (pointIds array)
- [ ] Require authentication for API
- [ ] Use ObjectId conversion for database queries
- [ ] Handle database errors gracefully (don't expose internals)
- [ ] Audit socket API response before sending

---

## Success Criteria

### Security

1. DemInfo displays demographic data for points (with user consent)
2. Data is fetched from jsforms model using `parentId`
3. UISchema determines render order
4. Minimal, clean visual design
5. Graceful handling of missing data
6. Privacy enforced: shareInfo must be "Yes"
7. UserId never sent to client (except user's own)
8. Authentication required for API
9. No security warnings in tests
10. shareInfo privacy preference enforced server-side

### Performance

1. Batch API calls (multiple pointIds)
2. Cache results in context with useFetchDemInfo hook
3. No unnecessary re-renders
4. Fast rendering with many points

### Code Quality

1. All tests passing
2. No linting errors
3. Follows project conventions
4. Well-documented code

---

## Future Enhancements

### Privacy Management

- Allow users to update shareInfo preference after initial submission
- Show indicator when data is being shared
- Dashboard for users to see what data they're sharing

### Advanced Rendering

- ✅ **IMPLEMENTED**: Age calculation from yearOfBirth (displays current age instead of birth year)
- Tooltips with full field names (future enhancement)
- Responsive design for mobile (future enhancement)

### Analytics

- Track how often dem-info is viewed
- A/B test different display formats
- Measure impact on engagement

---

## Appendix: Example Data Flows

### Flow 1: User Views Point with Dem-Info

1. RankStep renders list of points
2. RankStep useEffect extracts pointIds, filters for uncached
3. RankStep calls socket API: `{ pointIds: ['id2', 'id3'] }`
4. Socket API:
   - Gets point id2: `{ userId: 'user-a', discussionId: 'disc-1' }`
   - Gets jsform: `{ userId: 'user-a', discussionId: 'disc-1', moreDetails: { state: 'CA' } }`
   - Removes userId (not calling user)
   - Returns object: `{ id2: { state: 'CA' }, id3: { state: 'NY' } }`
5. RankStep callback receives object, calls `upsert({ demInfoById: { id2: {...}, id3: {...} } })`
6. Context updates via `setOrDeleteByMutatePath`, returns new data ref
7. DemInfo components for id2 and id3 re-render
8. DemInfo gets `data.uischema` and `data.demInfoById[pointId]`, renders: "CA"

### Flow 2: User Views Their Own Point

1. Same steps 1-4 as Flow 1
2. Socket API detects `point.userId === this.synuser.id`
3. Includes `userId` in response: `{ id2: { state: 'CA', userId: 'user-a' } }`
4. Callback receives object, DemInfo can use userId for special rendering (future enhancement)
5. Note: UISchema already set in context by CivilPursuit on mount

### Flow 3: Missing Dem-Info

1. RankStep renders point with id5
2. RankStep calls socket API with `['id5']`
3. Socket API gets point id5
4. Socket API queries jsform: not found
5. Socket API returns object: `{ id5: null }`
6. RankStep callback receives object, calls `upsert({ demInfoById: { id5: null } })`
7. DemInfo for id5 checks `data.demInfoById[id5]`: null
8. DemInfo renders: `null` (nothing shown)

---

## Document History

- **v1.0** (October 21, 2025): Initial specification created
- **v1.1** (October 22, 2025): Updated to reflect completed implementation
  - Added Implementation Summary section
  - Updated all component statuses to completed
  - Documented static `requestedById` cache optimization
  - Documented "fetch only new IDs" optimization pattern
  - Added yearOfBirth → age calculation feature
  - Updated test coverage details (13 socket API tests, 299 Storybook tests)
  - Updated integration status for all 5 step components
  - Clarified that RankStep does NOT fetch (optimization)
  - Added Tournament story integration
  - Updated manual testing checklist
  - Changed status from "Specification" to "Implementation Complete"
