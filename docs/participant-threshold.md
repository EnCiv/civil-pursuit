# Participant Threshold Feature Specification

**Version:** 1.0  
**Date:** February 3, 2026  
**Project:** civil-pursuit  
**Status:** Specification

## Overview

Add an optional `participantThreshold` configuration to CivilPursuit web components that defines the minimum number of participants who must complete the answer step in Round 1 (round 0 in code) before anyone can proceed to subsequent steps in the deliberation.

## Problem Statement

**Current State:**

- The current threshold for proceeding is hardcoded as `2 * group_size - 1`
- This is calculated in [intermission.jsx](app/components/intermission.jsx#L311) and may be calculated elsewhere
- There is no way to configure this threshold for different deliberation contexts
- Some deliberations may need different participant thresholds based on topic sensitivity, desired group diversity, or other factors

**Issues:**

- Lack of flexibility for different deliberation scenarios
- Cannot adjust threshold based on discussion context or goals
- Fixed formula may not suit all use cases

## Objectives

1. Add optional `participantThreshold` prop to CivilPursuit web component configuration in `iotas.json`
2. Store `participantThreshold` in the dturn object alongside other deliberation configuration
3. Check threshold in dturn logic, tournament component, and intermission component
4. Maintain backward compatibility: default to `2 * group_size - 1` when `participantThreshold` is not specified
5. Ensure all existing tests continue to pass
6. Add new tests for threshold behavior in Jest (dturn) and Storybook (components)

## Architecture & Design

### Configuration (iotas.json)

The `participantThreshold` will be an optional property within the `dturn` object in the CivilPursuit web component configuration:

```json
{
    ...
    "webComponent": {
      "webComponent": "CivilPursuit",
      "dturn": {
        "group_size": 5,
        "finalRound": 1,
        "participantThreshold": 500
      },
      "participants": 12,
      ...
    }
}
```

**Property Details:**

- **participantThreshold** (optional, number): Minimum number of participants who must complete the answer step in Round 1 (round 0) before any participant can proceed to subsequent steps
- If omitted or undefined, defaults to `2 * group_size - 1`
- Must be a positive integer
- Should typically be greater than or equal to `group_size` for meaningful deliberation

### dturn Integration

The `participantThreshold` will be stored in the dturn object and initialized in `initDiscussion`:

**Location:** `app/dturn/dturn.js`

**Changes:**

1. Add `participantThreshold` to the options object accepted by `initDiscussion`
2. Store in `Discussions[discussionId].participantThreshold`
3. Add logic to check threshold when determining if users can proceed past answer step
4. Default calculation: `participantThreshold = options.participantThreshold || (2 * group_size - 1)`

**Example:**

```javascript
function initDiscussion(discussionId, options = {}) {
  const { group_size = 10, participantThreshold, ...otherOptions } = options

  Discussions[discussionId] = {
    // ... existing properties
    group_size,
    participantThreshold: participantThreshold || 2 * group_size - 1,
    // ... other properties
  }
}
```

### Component Integration

#### Intermission Component

**Location:** `app/components/intermission.jsx`

**Current Logic (Line ~311):**

```javascript
let responsesNeeded = (data?.dturn?.group_size || 10) * 2 - 1 - (data.participants || 1)
```

**Updated Logic:**

```javascript
const threshold = data?.dturn?.participantThreshold || (data?.dturn?.group_size || 10) * 2 - 1
let responsesNeeded = threshold - (data.participants || 1)
```

**Changes:**

1. Replace hardcoded threshold calculation with check for `data.dturn.participantThreshold`
2. Fall back to `2 * group_size - 1` if `participantThreshold` is not defined
3. Update messages to use the threshold value dynamically
4. Ensure the check applies only to Round 1 (round 0) completion

#### Tournament Component

**Location:** `app/components/tournament.jsx` (needs investigation)

**Changes:**

1. Respect `participantThreshold` when determining step progression
2. Prevent users from advancing past answer step if threshold not met
3. Display appropriate messaging about remaining participants needed

### Data Flow

1. **Configuration Load:**

   - `iotas.json` contains optional `participantThreshold` within the `dturn` object for discussion
   - Server loads configuration when user subscribes to discussion

2. **Discussion Initialization:**

   - Discussions are initialized when a user subscribes to the discussion via the `subscribe-deliberation` socket API
   - The socket API passes `participantThreshold` from the iota configuration to dturn's `initDiscussion`
   - dturn stores threshold in `Discussions[discussionId]` object

3. **Client Access:**

   - dturn object (including `participantThreshold`) is passed to client via deliberation context
   - Components access threshold via `data.dturn.participantThreshold`

4. **Threshold Check:**
   - During Round 1, after answer step completion, check if `participants >= participantThreshold`
   - If threshold met: allow progression to grouping/ranking steps
   - If threshold not met: show intermission with message about waiting for more participants

## Implementation Plan

### Phase 1: dturn Core Logic

1. **Update `app/dturn/dturn.js`:**

   - Add `participantThreshold` parameter to `initDiscussion`
   - Store in `Discussions[discussionId]` object
   - Add threshold check logic in relevant functions
   - Add helper function `hasMetParticipantThreshold(discussionId)` if needed

2. **Jest Tests for dturn:**
   - Test default behavior (no `participantThreshold` specified)
   - Test custom `participantThreshold` override
   - Test threshold boundary conditions (exactly at threshold, one below, one above)
   - Test that progression is blocked when threshold not met
   - Ensure all existing dturn tests continue to pass

### Phase 2: Component Integration

1. **Update `app/components/intermission.jsx`:**

   - Replace hardcoded threshold calculation with `participantThreshold` check
   - Update message generation to use dynamic threshold value
   - Ensure backward compatibility with discussions that don't have `participantThreshold`

2. **Update `app/components/tournament.jsx`:**

   - Add threshold check for step progression
   - Prevent advancement past answer step when threshold not met
   - Coordinate with intermission messaging

3. **Storybook Tests:**
   - **intermission.stories.jsx**: Add stories testing threshold behavior
     - Story with custom threshold (e.g., 15) and threshold not met
     - Story with custom threshold (e.g., 15) and threshold met
     - Story with no threshold (default behavior)
   - **tournament.stories.js**: Add stories testing threshold behavior
     - Story showing users blocked at answer step when threshold not met
     - Story showing progression allowed when threshold met
   - Ensure all existing component stories continue to pass

### Phase 3: Integration & Configuration

1. **Update `subscribe-deliberation` socket API:**

   - Ensure `participantThreshold` is extracted from the iota's `dturn` configuration
   - Pass the value to dturn's `initDiscussion` function
   - Verify value is properly propagated through the stack

2. **Update `iotas.json` (example configuration):**

   - Create a new test discussion based on `/what-direction-test-1` path
   - Add `participantThreshold` to the `dturn` object (e.g., 500 participants)
   - Document the property with inline comments in the CivilPursuit web component configuration

3. **Integration Testing:**
   - Test full flow from configuration load to threshold enforcement
   - Verify socket API responses include `participantThreshold` in dturn object
   - Test with both custom and default threshold values

## Testing Strategy

### Jest Tests (dturn)

**File:** `app/dturn/__tests__/dturn.test.js` or new test file

**Test Cases:**

1. **Default threshold behavior:**

   - Initialize discussion without `participantThreshold`
   - Verify threshold defaults to `2 * group_size - 1`
   - Test with various `group_size` values

2. **Custom threshold override:**

   - Initialize discussion with `participantThreshold: 15`
   - Verify threshold is set to 15 regardless of `group_size`
   - Test that logic uses custom value correctly

3. **Threshold boundary conditions:**

   - Test with participants = threshold - 1 (should block)
   - Test with participants = threshold (should allow)
   - Test with participants = threshold + 1 (should allow)

4. **Backward compatibility:**
   - Ensure existing tests without threshold continue to pass
   - Verify default calculation matches current behavior

### Storybook Tests (Components)

**File:** `stories/intermission.stories.jsx`

**New Stories:**

1. **Intermission with custom threshold not met:**

   - Mock data: `dturn.participantThreshold = 15`, `participants = 8`
   - Expected: Message shows "7 more people" needed
   - Verify "Continue" button is disabled/not shown

2. **Intermission with custom threshold met:**

   - Mock data: `dturn.participantThreshold = 15`, `participants = 15`, round complete
   - Expected: Shows continuation options
   - Verify progression is allowed

3. **Intermission with default threshold:**
   - Mock data: no `participantThreshold`, `dturn.group_size = 10`
   - Expected: Behaves as current implementation (threshold = 19)
   - Verify backward compatibility

**File:** `stories/tournament.stories.js` (or new file if needed)

**New Stories:**

1. **Tournament blocked at answer step (threshold not met):**

   - Mock data: `dturn.participantThreshold = 15`, `participants = 10`
   - Expected: User completes answer step, proceeds to intermission
   - Verify cannot advance to grouping step

2. **Tournament allows progression (threshold met):**
   - Mock data: `dturn.participantThreshold = 15`, `participants = 15`
   - Expected: User completes answer step and can proceed to grouping step
   - Verify normal flow continues

### Manual Testing Checklist

- [ ] Create new discussion with custom `participantThreshold` in `iotas.json`
- [ ] Verify threshold is displayed correctly in intermission messages
- [ ] Test with participants below threshold - confirm blocking behavior
- [ ] Test with participants at threshold - confirm progression allowed
- [ ] Test existing discussions without threshold - confirm default behavior
- [ ] Test round progression with custom threshold
- [ ] Verify socket API responses include correct threshold value

## Edge Cases & Considerations

1. **Invalid threshold values:**

   - If `participantThreshold` is negative or zero, the threshold is considered met (no blocking)
   - If not a number or undefined, fall back to default calculation `2 * group_size - 1`
   - No explicit validation needed - let comparison logic handle edge cases naturally

2. **Threshold less than group_size:**

   - This is allowed but not recommended for deliberation quality
   - Document that `participantThreshold` should typically be >= `group_size` for meaningful grouping
   - No validation or warnings - configuration flexibility is prioritized

3. **Threshold greater than expected participants:**

   - No maximum threshold limit - any positive integer is allowed
   - High thresholds (e.g., 500) may create long wait times for progression
   - This is intentional for scenarios requiring large-scale participation before deliberation begins
   - Document as valid use case for campaigns or public initiatives

4. **Mid-deliberation threshold changes:**

   - Threshold is immutable after discussion initialization
   - Changes to `iotas.json` do not affect active discussions in memory
   - Only new subscriptions (new discussion initialization) will use updated threshold

5. **Different rounds:**
   - `participantThreshold` applies only to Round 1 (round 0 in code)
   - Subsequent rounds use existing logic based on available participants
   - Future enhancement: Per-round thresholds could be added if needed

## Backward Compatibility

**Guarantees:**

1. All existing discussions without `participantThreshold` continue to work with current behavior
2. Default calculation `2 * group_size - 1` remains unchanged
3. All existing tests pass without modification
4. No breaking changes to API or socket interfaces

**Migration:**

- No migration required for existing discussions
- Optional: Add `participantThreshold` to active discussions if desired

## Success Criteria

1. ✅ `participantThreshold` can be configured in `iotas.json`
2. ✅ dturn properly stores and uses threshold value
3. ✅ Intermission component uses threshold for progression logic and messaging
4. ✅ Tournament component respects threshold for step progression
5. ✅ Default behavior (no threshold specified) matches current implementation
6. ✅ All existing tests pass without modification
7. ✅ New Jest tests for dturn threshold logic (minimum 4 test cases)
8. ✅ New Storybook stories for component threshold behavior (minimum 3 stories)
9. ✅ Manual testing confirms threshold enforcement works end-to-end

## Future Enhancements

1. **Per-round thresholds:** Allow different thresholds for each round
2. **Dynamic thresholds:** Calculate threshold based on participant engagement metrics
3. **Admin dashboard:** Allow moderators to adjust threshold for active discussions
4. **Threshold notifications:** Email participants when threshold is approaching or reached
5. **Threshold analytics:** Track and report threshold metrics across discussions

## References

- [intermission.jsx](app/components/intermission.jsx) - Current threshold calculation
- [dturn.js](app/dturn/dturn.js) - Deliberation turn logic
- [iotas.json](iotas.json) - Configuration file
- [late-sign-up-spec.md](docs/late-sign-up-spec.md) - Related feature for reference

## Threshold Messaging

### Intermission Message for Threshold Not Met

When `participantThreshold` is configured and not yet met, display:

**Headline:**
"Your voice is in. Now, help us unlock the path forward."

**Body:**
"Thank you for contributing. Your response is saved and currently private to ensure every participant provides a totally independent vision, free from outside influence.

**Current Progress:** [X] / [threshold] Participants

We are [remaining] participants away from the next phase. Once we hit [threshold], we will invite you back to review a diverse cross-section of visions from your fellow citizens and begin the work of finding a direction that truly unites us.

**Want to get there faster?** The more perspectives we have, the more practical our results will be. If you know someone—especially someone who might see things differently than you do—please share this link with them."

### Message Variables

- `[X]` = Current participant count (`data.participants`)
- `[threshold]` = Configured threshold (`data.dturn.participantThreshold`)
- `[remaining]` = Participants needed (`threshold - participants`)

### Implementation Notes

1. Only display this enhanced message when `participantThreshold` is explicitly configured
2. For discussions using default threshold (`2 * group_size - 1`), use existing messaging
3. Include ShareButtons component below message to encourage sharing
4. Message should be displayed in Round 1 (round 0) only

## Notes

- Line 311 in `intermission.jsx` contains the current threshold calculation
- The term "Round 1" in UI corresponds to "round 0" in code
- Participants count represents those who have started and answered in round 0
- The `group_size` default is 10 (defined in dturn `getInitOptions`)
