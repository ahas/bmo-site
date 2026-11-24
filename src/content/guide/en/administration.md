---
title: "Administration"
description: "The platform settings, emergency app recall, people and permissions management, and the agency and monitor screens the platform administrator uses."
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

"Platform settings" is the screen that gathers the settings for the platform itself. Changes apply at once.

### The "Providers" tab

- **Providers:** each provider agents can use has its remaining usage and a switch. Turning the switch off turns that provider off at once and skips it in every order. The last one can't be turned off. Providers that read a key file show "Key set" or "No key" and a "Set key" button, and the key's value is never shown again.
- **"Provider secrets":** secrets that provider tools pick by name.
- **"Claude accounts":** the list of Claude accounts Claude Code uses in turn. Choose "Sign in here" in "Add account" to sign in without a terminal: approve in your browser with "Open sign-in page", paste the code you receive into "Authorization code", and click "Finish sign-in". Drag to reorder, pick one account with "Use this account now" in the menu, or go back with "In order". No screen ever shows a token or the contents of a credential.
- **Deployment's "Batch deploy interval":** how many minutes apart the commits waiting to deploy are put live together.

### The "Secret kinds" tab

Set the kinds that everyone's secret forms ask for (for example, a key and password pair). In "Add kind", write a key, a name, a description and fields (single line, multiple lines, file, hidden value, required). Only kinds live here, no secret values.

### The "Plans" and "Credits" tabs

- In "Plans", create personal and organisation plans with their names, prices, billing periods and the credits each period gives. An organisation applies one of the plans on offer on the "Plan" tab of the organisation screen.
- In "Credits", set the "Platform default policy", the "Conversion rate", "Reservation credits" and "Enforce supply limits", and "Grant credits" to people or organisations. Every movement is kept in the "Ledger" and the "Audit log".

Payments are switched off. Credits only grow by being granted, and while "Enforce supply limits" is off, usage is only recorded and no run is ever stopped.

## Managing apps and emergency recall

Apps for the whole platform are handled on the organisation screen: pick "Whole platform" in the tree, then open the "Apps & tools" tab.

- **"Offer":** whether the app is offered when nothing is set for a company.
- **"On" / "Off":** whether it is on when nobody has set it otherwise. The value set by the app's maker is marked "(default)".
- **"Lock for sub-organizations":** fixes it for every company, organisation and person.
- **"Emergency recall":** turns the app off everywhere at once. It asks "Turn off the (app name) app everywhere?", and clicking "Recall" sets its status to "Emergency recalled". Until the recall is lifted nobody can turn it on, but the values companies, organisations and people had set are kept and apply again when you click "Lift recall".

"Platform app requests" on the same screen gathers companies' requests to make a shared personal app into a platform app. The administrator reads the source and decides whether to release it.

## People and permissions

- **Creating accounts:** on the organisation screen's "Invites" tab, make a link with "Create invite link" and hand it over. Only administrators can invite someone in the "Head" role.
- **The "Users" tab:** look up everyone on the platform. Opening a person shows the "Account", "Organization", "Permissions", "BMO", "Supply" and "Activity" tabs, and the "Manage" menu offers "Move", "Add concurrent post", "Connect machine", "Edit profile", "BMO settings permission" and "Mark as left".
- **"Permissions":** which areas of the console that person can read and write, set per area with "Read" and "Write" switches. The platform administrator can write every area, so there is nothing to change for them.
- **"Activity":** see that person's rooms, agents, sessions and recent runs. When an administrator opens someone else's private room it is read-only, and no read marks reach the people in that room.
- **"Mark as left":** cannot be undone. The person can no longer sign in, and their BMO never wakes again. Their personal work, private conversations and BMO's memories can be read only by the platform administrator.

Secrets are the one exception. Each person's secret values live in their own space, and even the platform administrator can't read them.

## Other admin screens

| Screen | What it does |
|---|---|
| "Agency" | Manage agents' roles, providers and models, work repositories and your own model engines on the "Roles", "Agents", "Repositories", "Registered models" and "Model files" tabs |
| "Brain" | View and correct the memories of every brain, and review global memory candidates |
| "Monitor" | See the GPU nodes' cards and service status on the "Devices", "Nodes", "Services" and "Logs" tabs (`operator` install) |
| "Cache siren" | Watch prompt cache hits and new tokens live (`operator` install) |
| "Research" | Research runs and their settings (`team` and up) |
| "DB", "Document viewer" | Look into data and documents directly |

Screens not in your install kind are left out of the sidebar and search altogether.

## Putting new versions live

After the install, each repository's new commits go live through BMO's deployment process. Commits waiting to deploy are put live together at each "Batch deploy interval". Adding a new repository is BMO's job, and it does so only when the owner has approved that repository.

## Good to know

- The first account's name and password are set during the install. If you forget the password, set it again on the server with the account command of [bmo-web](https://github.com/ahas/bmo-web).
- The platform administrator can turn "Provide organization supply to this company" on and off for each company on the organisation screen.
- Browser notifications and voice briefings are set under "Notifications" and "Voice briefing" in the administrator's "Settings".
