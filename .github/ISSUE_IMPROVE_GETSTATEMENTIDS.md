Title: Improve getStatementIds so user's authored statement in the current shown group doesn't block them

Description:
The current `getStatementIds` implementation will return undefined for a user if their authored statement is present in the currently active shown group for that round. This behavior causes some users to not receive a group and therefore they can't finish the round; tests and other flows must currently work around this limitation.

Requested improvement:
- Change `getStatementIds` so that if the user's authored statement appears in the current shown group, we still return a valid group for the user. Possible strategies:
  - Create a new shown group (same as the logic used to build a new shown group when none exists) that does not include the authored id and return that to the user.
  - If there are enough `ShownStatements` items, select an alternate group that excludes the authored id (prefer a group with `shownCount` < threshold).
  - If creating a fresh group isn't possible due to insufficient items, fall back to returning a partial group (less preferred) or queue the user for the next round.

Constraints and tests:
- Maintain existing invariants: group sizes must be preserved (round 0: group_size - 1 plus authored id; round>0: group_size), and shownCount balances should continue to track correctly.
- Add unit tests demonstrating the prior failing scenario: a user's authored id exists in the active shown group, but the function still returns a valid group for them in a deterministic way (use `process.env.JEST_TEST_ENV` behavior where necessary).
- Keep changes small and well-documented. If the chosen approach impacts other flows (e.g., shownCount accounting), document the effects and add tests for that behavior.

Background:
See `app/dturn/dturn.js` for the current implementation and `app/dturn/__tests__/get-users-to-invite-back.js` for tests that were previously affected by this behavior.

Labels: improvement, dturn, tests
