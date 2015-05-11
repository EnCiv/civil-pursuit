Migrations changelog
===

# v4: Criterias

Since types (view v2), we need to plug the Criteria collection to the Type collection.

# v3: Item short id

For SEO reasons, we want to generate short ids for each item so they are more URL-friendly. This migration takes care of giving short ids to existing items that lack it.

# v2: Type

Say goodbye to the hard-coded types! Now types are stored in their own collections and can be manipulated to the extent of our imagination. Have a look at [the Type model](app/models/Type.js) for more info.