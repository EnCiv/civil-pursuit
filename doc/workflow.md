Synaccord - Workflow
===

# github issues

Create or take an issue number. Imagine I create an issue that is number #21 with the title "Something is wrong".

**Mark issue as "in progress"**

# Create branch about issue

Branch name should be:

```
<issue number>/<collaborator initials>-<issue title slugified>
```

As for our example:

```bash
git checkout master
git pull origin master
git checkout -b 21/fv-something-is-wrong
```

# Commit messages

Always end your commit messages by the number of the branch, ex:

```bash
git commit -am 'fix bug #21'
```

# Pull request

- Create a Pull Request from your branch to master.
- Explain what you did to solve the issue in PR's description
- Comment files in Files Changed

**Mark issue as "ready"**

# Review

Let other collaborators review your code. Once reviewers OK the PR, the user that created the PR will merge it.

# Close issue

Close issue once PR is merged. Issue will be closed automatically if you commit the message "fix" ended by the issue number.

```bash
git commit -am 'Fix #21'; # Github will close automatically the issue once PR is merged
```
