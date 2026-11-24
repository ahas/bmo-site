---
title: "Administration"
description: "The platform settings (providers, secret kinds, system mail), the platform's supply and Claude accounts, emergency app recall, people and permissions management, and the agency and monitor screens the platform administrator uses."
order: 10
shots:
  - name: agents
    alt: "The roles tab of the agency screen: a table with each role's run line, tool bundles, skills, role prompt and number of running agents"
  - name: cards
    alt: "The services tab of the monitor screen: memory use bars for each card of the GPU nodes, and each service's VRAM and status"
---

## The platform administrator

The platform administrator is the person who looks after the whole BMO platform. The first console account created during the install is the platform administrator, and it opens every screen under "System services" in the sidebar. Members don't see the "Platform settings" item, and opening it by its address sends them back to the home screen.

## Platform settings

"Platform settings" is the screen that gathers the settings for the platform itself that don't sit on the delegation chain. It has three tabs, "Providers", "Secret kinds" and "Mail", and changes apply at once. What the platform sets on the chain (apps, agent defaults, supply) is handled on the organisation screen by picking "Whole platform".

### The "Providers" tab

- **Providers:** each provider agents can use has its remaining usage and a switch. Turning the switch off turns that provider off at once and skips it in every order. The last one can't be turned off.
- **"Provider secrets":** secrets that provider tools pick by name (for example, a DeepSeek payment card or a DeepSeek sign-in).
- **Deployment's "Batch deploy interval":** how many minutes apart the commits waiting to deploy are put live together.
- **"Notifications":** turn the "Restart notices" and "Rest notices" sent to the owner's private room on and off.

### The "Secret kinds" tab

Set the kinds that everyone's secret forms ask for (for example, a key and password pair). In "Add kind", write a key, a name, a description and fields (single line, multiple lines, file, hidden value, required). Only kinds live here, no secret values.

### The "Mail" tab

Set up the **system mail** the platform sends itself (password reset links, email verification, security notices).

- "Sending server" is picked from the outgoing servers kept on the "Mail servers" tab of "Whole platform" on the organisation screen.
- Pick the "From address", the "From name", and the "Sign-in secret" used to sign in to the server, by its name in the secret store. The password never appears on this screen.
- Once saved it is marked "Set up", and "Send a test mail" checks it. Without system mail, anything that needs to send mail says so and shows a one-time link for the administrator to hand over instead.

## The platform's supply

The "Supply" tab with "Whole platform" picked on the organisation screen is the platform's own supply.

- **"Platform default policy":** for each supply source, whether it is on by default, whether people can change it ("Allow personal settings" or "Fixed"), and its order.
- **"Conversion rate", "Reservation credits" and "Enforce supply limits":** how credits convert, how large a reservation is, and whether limits are actually enforced. While enforcement is off, usage is only recorded and no run is ever stopped.
- **"Ledger" and "Audit log":** every credit movement and every change to grants, policies, settings and plans is kept.
- **"Plans":** create personal and organisation plans with their names, prices, billing periods and the credits each period gives. An organisation applies one of the plans on offer on its "Supply" tab.
- **"Platform supply keys":** each provider that reads its key from a file shows "Key set" or "No key" and a "Set key" link. The key is written to "Whole platform" in the secret store and is never shown again.
- **"Claude accounts":** the list of Claude accounts Claude Code uses in turn. Choose "Sign in here" in "Add account" to sign in without a terminal: approve in your browser with "Open sign-in page", paste the code you receive into "Authorization code", and click "Finish sign-in". Drag to reorder, pick one account with "Use this account now" in the menu, or go back with "In order". No screen ever shows a token or the contents of a credential.

Payments are switched off. Credits only grow by being granted.

## Managing apps and emergency recall

Apps for the whole platform are handled on the organisation screen: pick "Whole platform" in the tree, then open the "Apps, tools & skills" tab.

- **"Offer":** whether the app is offered when nothing is set for a company.
- **"On" / "Off":** whether it is on when nobody has set it otherwise. The value set by the app's maker is marked "(default)".
- **"Lock for sub-organizations":** fixes it for every company, organisation and person.
- **"Emergency recall":** turns the app off everywhere at once. It asks "Turn off the (app name) app everywhere?", and clicking "Recall" sets its status to "Emergency recalled". Until the recall is lifted nobody can turn it on, but the values companies, organisations and people had set are kept and apply again when you click "Lift recall".

"Platform app requests" on the same screen gathers companies' requests to make a shared personal app into a platform app. The administrator reads the source and decides whether to release it.

## People and permissions

- **Creating accounts:** on the organisation screen's "Invites" tab, make a link with "Create invite link" and hand it over. Only administrators can invite someone in the "Head" role.
- **The "Users" tab:** look up everyone on the platform. Opening a person shows the "Account", "Organization", "BMO", "Supply" and "Activity" tabs, and "Security" under "Account" shows email verification, two-step verification and whether the person can sign in. The menu offers "Move", "Add concurrent post", "Connect machine", "Edit profile", "BMO settings permission", "Reset password", "Reset two-step verification", "Disable account" and "Mark as left".
- **Account actions:** "Reset password" and "Reset two-step verification" are done by administrators and the person's head. Nobody sets or sees the password: a one-time link goes out by email, or, where mail can't be used, the link is shown once to be handed over directly. "Disable account" is for administrators only; the account can no longer sign in and all its sessions end. Every action is kept in the person's history.
- **"Permissions":** on the organisation screen's "Permissions" tab, which areas of the console that person can read and write, set per area with "Read" and "Write" switches. The platform administrator can write every area, so there is nothing to change for them.
- **"Activity":** see that person's rooms, agents, sessions and recent runs. When an administrator opens someone else's private room it is read-only, and no read marks reach the people in that room.
- **"Mark as left":** cannot be undone. The person can no longer sign in, and their BMO never wakes again. Their personal work, private conversations and BMO's memories can be read only by the platform administrator.

Secrets are the one exception. Each person's secret values live in their own space, and even the platform administrator can't read them.

## Other admin screens

| Screen | What it does |
|---|---|
| "Agency" | Manage agents' roles, providers and models, work repositories and your own model engines on the "Roles", "Agents", "Repositories", "Registered models" and "Model files" tabs |
| "Brain" | View and correct the memories of agent brains; organisation brains and the global base are read-only |
| "Monitor" | See the GPU nodes' cards and service status on the "Devices", "Nodes", "Services" and "Logs" tabs (`operator` install) |
| "Cache siren" | Watch prompt cache hits and new tokens live (`operator` install) |
| "Research" | Research runs and their settings (`team` and up) |
| "DB", "Document viewer" | Look into data and documents directly |

Screens not in your install kind are left out of the sidebar and search altogether.

## Putting new versions live

After the install, each repository's new commits go live through BMO's deployment process. Commits waiting to deploy are put live together at each "Batch deploy interval". Adding a new repository is BMO's job, and it does so only when the owner has approved that repository.

## Good to know

- The first account's name and password are set during the install. If you forget the password, set it again with "Forgot your password?" on the sign-in screen (when system mail is set up), or on the server with the account command of [bmo-web](https://github.com/ahas/bmo-web).
- The platform administrator can turn "Provide organization supply to this company" on and off for each company on the organisation screen's "Supply" tab.
- Browser notifications and voice briefings are set under "Notifications" and "Voice briefing" in the administrator's "Settings".
