synapp / Default props
===

Default props are the props passed by default to `app.jsx` and handled to all children. They are vertical to the app.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| env | string | "development" | The env the app is running against (development or production) |
| path | string | "/" | The URI of the app |
| user | User | false | The signed-in user (@deprecated) |
| intro | Item | {Item} | The intro item |
| reqItem | Iten |  {Item} | In case we are in an item page, the item |
