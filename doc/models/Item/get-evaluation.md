M O D E L S / I T E M / S T A T I C S / G E T - E V A L U A T I O N
===

# Business rules

# What is an evaluation?

Evaluation finds 5 related items to a given item and returns them in a fashion that it is easy for View to render it in a side-by-side comparator.

# Related items

Related items share these attributes:

- Same type
- Same parent

# Related items constraints

- Related items have a different Author User than the evaluated item
- Related items have not yet been voted by Evaluator User

# Items size

An evaluation contains 6 items: the evaluated item (the *item*) and 5 related items (the *items*).

## Item size constraints

In case that the evaluated item has less than 5 related items, then items size would be 1 (the *item*) + n *items* where n is either 1, 2, 3, 4 or 5.

In case that the *item* has zero related items, then no evaluation is created and an empty object is returned.
