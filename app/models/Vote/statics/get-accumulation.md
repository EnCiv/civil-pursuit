Models / Vote / Statics / Get Accumulation
===

Get votes for a given item and return results in the form of an accumulation

# Signature

    (ObjectId itemId, Function cb)

# Callback

    (Error? error, Accumulation accumulation)

# Accumulation

Accumulation is a hash table of votes of one item indexed by criterias:

    Accumulation[ Criteria ] = { total: Number, values: [VoteResult] }

# VoteResult

    VoteResult = { "-1": Number, "+0": Number, "+1": Number }

# Conversion

Vote values are saved as numbers, but are returned labelled in accumulation, such as:

```
 0 => "-1"
 1 => "+0"
 2 => "+1"
```

# Example

```js
Vote.getAccumulation(itemId, function (error, accumulation) {
    if ( error ) throw error;

    console.log(accumulation);

    /**
    {
        [criteria._id]: {
            total       :   Number(values.sum()),
            values      :   {
                [-1]    :   Number,
                [+0]    :   Number,
                [+1]    :   Number
            }
        }
    }
    */
    });
