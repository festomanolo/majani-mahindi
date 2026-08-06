# Contributing to Majani Mahindi

Thank you for your interest in contributing!

## Setup

```bash
git clone https://github.com/festomanolo/majani-mahindi.git
cd majani-mahindi
npm install
```

## Branch naming

- `feat/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `docs/<short-description>` — documentation only
- `chore/<short-description>` — maintenance / tooling

## Code Style

We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/). Run `npm run format` before committing.

## Pull Request Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Commit messages follow conventional commits

## Filing Issues

Please search existing issues before filing a new one. Include:
- Steps to reproduce
- Expected vs actual behaviour
- Browser/OS version
- Console errors if any

## Commit Messages

We follow the [Conventional Commits](https://conventionalcommits.org) specification:

```
type(scope): short description
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.

## Reporting a Security Issue

Do not open a public GitHub issue for security vulnerabilities. Email the maintainer directly with subject line [SECURITY].
