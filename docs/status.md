# Tower Health

Tower Health is the public operations layer for Tower Map. It summarizes the
state of the building across public routes, wallet identity, registry checks,
moderation readiness, analytics snapshots, and release checks.

The status language is intentionally steady and operational. Tower Map should
feel maintained, monitored, and cared for.

## Current Health Model

Tower Health reads from:

```text
data/status.sample.json
reports/registry-summary.json
reports/moderation-summary.json
reports/analytics-snapshot.json
```

It writes:

```text
reports/status-summary.json
```

The generated report describes:

- site availability
- public route coverage
- wallet interaction readiness
- registry review state
- moderation workflow readiness
- analytics snapshot activity
- scheduled review items

## Status Language

Tower Map treats review work as part of healthy operations.

Use this language:

```text
healthy
active
monitored
tracked
scheduled review
maintenance complete
```

Avoid alarm-style public language for normal maintenance states. Pending
contract verification, high-occupancy floors, and review queues are not product
failure states. They are tracked operational work.

## Public Message

Recommended public framing:

```text
Tower Map is online, monitored, and maintained through repeatable registry,
moderation, analytics, and release checks.
```

## Healthy Does Not Mean Frozen

The tower can be healthy while still changing.

- Floor placement can be reviewed.
- Contract address verification can continue.
- Analytics snapshots can refresh.
- Notes can be moderated.
- Maintenance windows can be completed and recorded.

This makes Tower Map feel alive without making it feel unstable.

## Command

```bash
npm run status:report
```

This command should run after the registry, moderation, and analytics reports so
the health summary can reference the latest generated state.
