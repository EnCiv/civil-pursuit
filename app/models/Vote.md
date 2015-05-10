Model :: Vote
===

Vote results based on criterias

# Schema

| Field    | Type     | Required | Description            |
|----------|----------|----------|------------------------|
| item     | Item     | yes      | The item evaluated     |
| criteria | Criteria | yes      | The criteria evaluated |
| user     | User     | yes      | The user evaluating    |
| value    | Number   | yes      | The vote's value       |

# Values

The vote is the answer to the question formulated in the Criteria (ie, 'Is this item interesting?') - to which the user can answer either Yes, No or No Opinion. Value is the numeric representation of the vote:

| Answer | Chart | Value |
|--------|-------|-------|
| No     | -1    | 0     |
| N/O    | +0    | 1     |
| Yes    | +1    | 2     |

# Statics

- [Get Accumulation](app/models/Vote/statics/get-accumulation.md)