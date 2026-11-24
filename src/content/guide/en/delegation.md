---
title: "Organisations and the delegation chain"
description: "How settings come down from the platform through the company and its organisations to each person, what \"Follow parent\" and locks mean, and the order in which supply is decided."
order: 4
shots:
  - name: org
    alt: "The agents tab of the organisation screen: for personal, organisation and platform supply, a box to choose follow parent, allow sub-organisations or lock sub-organisations, and an on/off switch"
---

## What the delegation chain is

Many of BMO's settings come down from the top, one link at a time. This line is called the **delegation chain**.

1. The platform
2. The company
3. The organisations under the company (as many levels as it takes, down to the person's own)
4. The person

At each link, whoever looks after it (the platform administrator for the platform, the head for an organisation, and usually the person themselves for a person) decides two things: what the setting's value is, and whether the links below may change it.

A person's chain follows the organisation they belong to. Even if they hold a concurrent post in another organisation, that organisation's settings don't come down to them.

## Three choices: follow, allow, lock

Each setting on the organisation screen has a "Sub-organizations" box, where you pick one of these.

| Choice | Meaning |
|---|---|
| "Follow parent" | Leave it as the link above decided. Nothing is set here |
| "Allow sub-organizations" | Say plainly that organisations and people below may change it |
| "Lock sub-organizations" | Fix the setting so no link below can change it |

A lock applies to everyone below, however many levels down. Values the links below had set before the lock are not deleted: they are kept as they were and come back when the lock is lifted. "Allow sub-organizations" cannot lift a lock set above; a lock can only be lifted where it was set.

The platform administrator can still write a value at a link under a lock, but that value isn't read either until the lock is lifted.

## The order in which a value is decided

The value that actually applies to a person is found by reading the chain from the top.

- **The nearest link wins.** If nobody sets a value, the setting's default applies.
- **Within one link,** the first that exists is used, in this order: a rule naming that person, a rule for a group they belong to, a rule naming their organisation, and the link's own value.
- **A lock from above beats everything.** What a link under the lock says is not read.
- **Some settings only narrow.** For things like supply source switches or app offering, a link below can only close what was left open above; it can't reopen what was closed above.

## How it looks on screen

| Screen | What you see |
|---|---|
| Organisation screen | "Set by you", a followed value such as "On, following parent organization", and for a lock "Locked by a parent organization" |
| Your own settings | "Set by you", "Follows organization", "Locked by organization", "Set by the organization · {name}", and if the platform decided it, "Set by the global settings" |

A line that is "Set by you" has "Revert", which clears your value and goes back to the one that came down from above. For a locked setting, the button is greyed out and disabled, and who decided it is written underneath.

## Supply: what runs it and who pays

Supply is which credentials an agent's run goes out with, and who pays for it. Changing the supply source doesn't change the provider and model the agent uses.

There are three **agent supply sources**, and a run goes down them in this order.

1. "Personal supply": your own Claude sign-in or your own API key. You pay the provider directly.
2. "Organization supply": keys and Claude accounts registered by your organisation. The organisation pays.
3. "Platform supply": the platform's credentials. Paid from usage included in a plan, or from credits.

All three sources are delegation chain settings. "Personal supply" and "Platform supply" are open by default, and organisations can only close them. "Organization supply" is closed by default, and opens only when the platform administrator turns on "Provide organization supply to this company" for that company.

Organisations and the platform also have a **supply policy**. The policy decides which of "Personal supply", "Global supply", "Organization credits" and "Personal credits" are allowed, the order they are used in ("Supply order", which always ends with "Stop"), and how many organisation credits one person may use in a month. On a freshly installed platform, the default policy turns on personal supply only, and the sources the platform pays for stay off until an administrator turns them on.

### Your own "Supply" settings

Your side is under "Supply" in "Settings".

- "Agent supply sources": shows whether each of the three sources is on for you. You can see who decided, but you can't change it here.
- "Supply logins": add your Claude sign-ins and set their order. Click "Add supply login" to sign in in your browser, paste the code you receive into "Authorization code", and click "Finish sign-in".
- "Supply keys": pick a key you have stored in your secrets by name and link it. The key's value never appears on this screen.
- "Supply order": the order of the sources you use and whether each is on, plus a monthly cap on personal credits.
- "Usage this month": how much of each source you have used this month and how much is left.

Payments are switched off. Credits only grow when an administrator or credit manager grants them, and there is no top-up button.

## Other settings that come down the chain

| Setting | Where it is set |
|---|---|
| "Organization instructions", "Persona" | The organisation screen's "Agents" tab |
| "Signup setup", "Personal changes", "Manage repositories" | The organisation screen's "Agents" tab |
| Offering apps and turning them on or off | The organisation screen's "Apps & tools" tab |
| The document "Storage location" | The organisation screen's "Artifact storage" tab |
| "BMO settings permission" | The organisation screen's "BMO" tab ("Allow", "Block", "Follow parent organization") |
| Making personal apps, network and secret use, sharing scope | Platform and organisation settings |

## When a change takes effect

A changed value applies from the next turn on. Instructions and personas apply from each person's next conversation turn, supply sources from the start of the next run, and apps from the next call and the next screen load. Nothing announces what changed; whatever uses a setting asks the chain afresh each time.

## Good to know

- If nobody sets anything, people can change every personal setting about their agents.
- A supply source closed above appears greyed out in your settings, with a reason such as "Blocked by organization" or "Blocked by administrator".
- While "Enforce supply limits" is off, usage is only recorded and no run is ever stopped because of supply.
