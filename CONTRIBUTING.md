# Contributing

When contributing to this repository, please first discuss the change you wish to make via Jira issue
with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Setup](#setup)
- [Building](#building)
- [Running Tests Locally](#running-tests-locally)
- [Formatting your Source Code](#formatting-your-source-code)
- [Linting/verifying your Source Code](#lintingverifying-your-source-code)
- [Publishing Snapshot Builds](#publishing-snapshot-builds)

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of other developer, or if you do not have permission to do that, you may request the second reviewer to merge it for you.
5. Anyone can review a PR but only a few people can merge it to develop

## Contributing / Development

Use git flow principle for development

- [https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)

### Git flow config

- Branch name for production releases: master
- Branch name for "next release" development: develop
- Feature branches: feature/
- Release branches: release/
- Hotfix branches: hotfix/
- Support branches: support/
- Version tag prefix: v

### Avoiding conflicts

Since we are all working in the same files we are going to have a lot of conflicts. In order to avoid git creating conflicts due to whitespace, we should add a comment at the end of each of your functions/methods in the files are that very problematic.

We are going to add something like

```
} // end of <name of function>
```

This comment MUST BE UNIQUE in the whole file.

### Jira

We have a board with a few columns, the developer is the owner of moving the tickets all across the board.

```
OPEN: Ticket has been assigned, but developer hasn't started working on it yet.
IN PROGRESS: Ticket is in progress.
CODE REVIEW: PR is up and ready for review.
READY FOR QA: As backend, we don't do that, we should have the postman request, also we are gonna be working in E2E.
REGRESSION: Just for mobile
DONE: Ticket is merged.
```

## CI/CD - Stages

We have a on-going project for this, basically what we have right now is that for each PR we do a build that runs the tests and also compiles the stack, you can look at the `deploy:cicd` for details.

Ideally, we will be running E2E for each branch to make sure everything is running well, but that's WIP, so far, we have POSTMAN well maintanined.

Dev is our stable env, we do code freeze and publish to that env from time to time.

If you need to deploy to a more unstable env you can do: `deploy:stage-unstable`

Plan is to have

- Dev: For developers to play and test
- Test: For mobile to have a more stable env
- Staging: Prod mirror
- Prod: Production environment

We have that in the roadmap, hold tight.

### Newman Tests

We are doing some initial configs to run the postman collection as a CI, to read more about it see the [Newman documentation](./newman/README.md)

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project
a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project. Examples of
representing a project include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at robert.baron@omni.cr. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the project change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope**, a **ticket reference** and a **subject**:

```
<type>(<scope>): SA-### - <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

```
docs(changelog): SA-001 - update changelog to beta.5
```

```
fix(release): SA-001 - need to depend on latest rxjs and zone.js
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to the CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **chore**: Housecleaning tasks.

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

The following is the list of supported scopes:

```
// TODO: DEFINE THIS ONCE WE HAVE PACKAGES
```

There are currently a few exceptions to the "use package name" rule:

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- use lowercase
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes**

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].
