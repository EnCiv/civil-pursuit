M O D E L S / I T E M / S T A T I C S / E V A L U A T E
===

# Abstract

## What is an evaluation?

Evaluation finds 5 related items to a given item and returns them in a fashion that it is easy for View to render it in a side-by-side comparator.

## Related items

Related items share these attributes:

- Same type
- Same parent

### Related items constraints

- Related items have a different Author User than the evaluated item
- Related items have not yet been voted by Evaluator User
- If item has a split type (such as Why/Why Not), then items should be 2 of the same type and then 3 of the contrary type (ie, if item is a Why, fetch 2 Whys and 3 Why Nots so they equally sum 6)

## Items size

An evaluation contains 6 items: the evaluated item (the *item*) and 5 related items (the *items*).

### Item size constraints

In case that the evaluated item has less than 5 related items, then items size would be 1 (the *item*) + n *items* where n is either 1, 2, 3, 4 or 5.

In case that the *item* has zero related items, then no evaluation is created and an empty object is returned.

# Definition

```js
var evaluation  =   Evaluation {
    item        :   ObjectID,
    type        :   ObjectID,
    items       :   [ItemModel],
    criterias   :   [CriteriaModel]
} 
```

# Signature

```js

// Node callback
Item.evaluate(ObjectID, function (Error, Evaluation) {}));

// Promise (not yet supported)
//Item.evaluate(ObjectID itemId)
//    .then(function (Evaluation) {}, function (Error) {});
```
