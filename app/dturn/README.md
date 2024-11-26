# Deliberative Tournaments

A library of methods to implement tournaments for productive large scale deliberation where each person provides a statement, is shown a small group of statements form others, groups similar statments, and then ranks the statments. Then in subsequent rounds each person is shown a group of statements from the top (1/group-size) or the previous round.

Ideally this will support a million people deliberating and converging on a group of answers they support in 6 rounds. (Or a billion in 9 rounds be we are going to run into memory limitations at that point)

- Within a round, each statment is shown an equal number of times
- In subsequent rounds, statements are grouped if the majority of people who saw the statements grouped them
- there are two ways to move up through the rounds, either:
  1. people will be shown statements for the next round as soon as there are enough to fill the group. This method's risk is that people may not see a diverse enough statments when people from the same ogranzation go through at the same time.
  2. people can not see statements for the next round until a minimum number of people have made it through the previous round. This method will give a better distribution of statements to each person.

The is algorithim keeps track of the current state of the deliberation in memory. Memory usage is O(N LogN ) so be careful.
Some api calls may be O(N LogN ) in time. Be careful.

## Interface

```
const {
    initDiscussion,
    insertStatementId,
    getStatementIds,
    putGroupings,
    rankMostImportant,
} = require('dturn')
```

### initDiscussion( discussionId, options )

- **discussionId** is a globally unique string to identify the discussion. Like a Mongo ObjectId
- **options** is an object of properties to initialize the discussion with
  - **group_size**: the size of a group, like 10
  - **gmajority**: the multiplyer to calculate the majority size, like 0.5
  - **max_rounds**: maximum depth to collect statments in grouping, like 10
  - **min_shown_count**:the minimum number of times a item pair is shown in order to decide if a majority have grouped it like Math.floor(group_size/2)+1
  - **min_rank**: when filterning statements for the next round, they must at least have this number of users voting for it
  - **updateUInfo**: function to call to write out incremental changes to a database for later rehydration
  - **getAllUInfo**: funtion to get all the incremental changes from a database to rehydrate the deliberation
  - **updates**: function to send updates to all connected clients. Not to be confused with updateUInfo. {participants: number, lastRound: number}
- **returns** a promse that is fulfilled when the initialition is complete, includeing the call to getAllUinfo

### insertStatementId( discussionId, userId, statementId )

- **discussionId** the discussion this is part of
- **userId** the globally unique id refering to the user, like a MongoDb ObjectId
- **statementId** the globally unique id refering to the statment the user has made, like a MongDb ObjectId. The implementation is reponsible for storying the actual statment information, this library only works with the statementIds.
- **returns** statementId or undefined if no statements are available for the user for this round - throws an errof if the discussionId was never initialized.
  Statements are always inserted into round 1. Future development may allow statements into other rounds.

### getStatementIds( discussionId, round, userId )

- **discussionId** the discussion this is part of
- **round** the round from which to get statements
- **userId** the globally unique id refering to the user, like a MongoDb ObjectId
- **returns** a promse that resolves to an array of group_size statement ids, or undefined if there was an error. For round 1, one less than statement ids is returned, and the user's statement should be added to the list. Future calls for the same user for the same round will return the same statement list.
  In order to use the getStatementIds, it requires to add 2 \* group size - 1 statements inserted first.

### putGroupings( discussionId, round, userId, groupings )

- **discussionId** the discussion this is part of
- **round** the round from which to get statements
- **userId** the globally unique id refering to the user, like a MongoDb ObjectId
- **groupings** an array of one or more arrays of statments groupings.

### rankMostImportant( discussionId, round, userId, statementId, rank )

- **discussionId** the discussion this is part of
- **round** the round from which to get statements
- **userId** the globally unique id refering to the user, like a MongoDb ObjectId
- **rank** a number, like 1. Positive and negative numbers are possible but not tested.
- **returns** undefined and might take a while becasue the operation is complex

## API for testing but not production

### Discussions

This is the global discussion object, where the local data of each open discussion is stored. Don't mess with this! See the source code for the format.

### report( discussionId, Statements )

- **discussionId** the discussion this is part of
- **Statements** an Object where statementIds can be used to lookup the statment, and where statement.description is a number.
- **returns** undefined, outputs a lot of stuff to the console
  This is there for testing. See the code
