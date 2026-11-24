---
title: "Apps and personal tools"
description: "The personal apps BMO makes for you, sharing them within the company through the app catalogue, and what an app is allowed to reach (isolation, network and secrets)."
order: 5
shots:
  - name: catalogue
    alt: "The app catalogue: app search and sharing notices at the top, and below them the list of shared apps with their status marks and install counts"
  - name: personal-apps
    alt: "My personal apps in settings: each app with its description, update time, version, the network addresses and secret names it uses, and buttons to share, go back a version or delete"
---

## What an app is

In BMO, an **app** is a screen and the tools it uses, bundled together so they can be turned on and off as one. Some are platform apps, such as notes or documents; others are **personal apps** your BMO made just for you. The parts the system can't do without, such as the console's own screens, rooms and the brain, are not apps and can't be turned off.

## Turning apps on and off

Each app is turned on or off on the organisation screen's "Apps & tools" tab. Members click "Open" in "My apps & tools" under "Settings", and this tab opens with "Me" selected.

- **Under "Me":** turn the apps offered to you on or off with a switch. Under each line you see "Set by you", "Follows organization" or "Locked by organization", and "Revert" clears your own choice.
- **For an organisation:** heads choose "On", "Off" or "Follow parent organization", and fix it for everyone below with "Lock for sub-organizations".
- **Offering:** whether an organisation can use an app at all is decided by the platform administrator's "Offer" switch. An app that isn't offered shows as "Not offered".

Calling an app that is turned off gives the answer "This app is turned off by organization settings."

## Making a personal app

If you keep doing the same thing by hand, just ask BMO in conversation to make it into an app. BMO hands the job to a work agent, which writes the source in the personal apps folder on your PC and builds it on that PC.

- Apps are built and run **on your PC**, so your machine has to be linked to your account ("Machine" in "Settings", or the desktop app).
- Once an app is finished, BMO can use it from your next conversation turn.
- If the app has a screen, it appears in the sidebar's "My apps" group. Only you can see it. If your PC is off, it says "Your PC is off, so this app can't be opened."
- Your organisation can decide whether you may make personal apps. If nobody blocks it, you can.

## "My personal apps"

Your apps are listed one per line in "My personal apps" under "Settings". Each shows the app's name and description, its "Update" time, its "Version", and what the app is allowed to reach.

- **"Share":** share it with people in your company. See "Sharing" below.
- **"Back to the earlier version":** go back to the version just before the current one. Your PC keeps up to three versions older than the current one.
- **"Delete":** take the app off the list. Its source and data stay on your PC.

## What an app can reach

A personal app runs only in an isolated space on your PC. It reads its own program folder and writes to its own data folder, and nothing more: it can't reach your home folder, other apps' folders, or token and key files. On a PC where this isolation can't be set up, personal apps don't run.

For an app to use anything beyond that, it has to say so in its manifest beforehand, and the screen shows exactly that.

| Mark | Meaning |
|---|---|
| "Uses only its own data" | The app asks for nothing beyond its own data |
| "Uses the network" and addresses | It connects only to the addresses listed, and can't reach anywhere else |
| "Uses secrets" and names | It receives values from your secrets only while it runs, and BMO never sees them |
| "Not in your secret store" | A secret the app asks for isn't in your store yet |

Network addresses can only be written as host names, such as `api.example.com`; IP addresses and `localhost` are not accepted. Secret values live only in memory while the app runs and are gone once it ends, and if the app writes a value into its output, it is masked.

Network and secret use stay off until the platform allows them for the company. Where they aren't allowed, you see the reason, for example "Your organisation does not allow personal apps the network, so this app does not run."

## Sharing

Click "Share" and, in the "Share the app" window, choose "Team", "Heads above" or "Whole company". You can only choose as far as your organisation allows.

Sharing happens only within your own company. The app's source is copied to the company catalogue, and each recipient's PC builds that source itself to make its own copy. Each recipient's data stays on their own PC. For every shared version, a review agent writes a "Review report" on what the app does and whether it tries to use more than its manifest says. If the organisation requires it, others can install the app only after a head gives their "Approve".

## The app catalogue

The "App catalogue" under "Applications" in the sidebar gathers the apps people in the company have shared.

- At the top are "Find an app" and the sharing scope filter ("All", "Team", "Heads above", "Whole company", "Named directly").
- Newly shared apps, updates that need checking and apps waiting for your approval gather in "Notices", and "Mark all read" clears them.
- Click an app to see who made it, its version, when it was shared, its install count, who it is shared with, its "Permissions", its "Review report", and "View source" to read its source.
- "Install" makes a copy on your PC, and when there is a new version, "Update" moves you to it. A new version that asks for no more permissions arrives on its own.
- The menu has "Approve", "Clone" (bring it in as your own personal app, which then gets no more updates), "Request platform app", "Delete" and "Stop sharing".

Heads also have "Organisation". Pick an organisation, and "Turn on" installs the app on the PCs of everyone in it, "Turn off" turns it off, and "Recall" removes it from every PC in that organisation and keeps it off.

## Stopping sharing and recalling

- **"Stop sharing"** is done by the maker or owner, and blocks only new installs. Copies already installed keep running.
- **"Recall"** is done by a head (in their own organisation) or the platform administrator (across the whole platform). It removes every copy in that scope and stops it from being turned on again.

If the maker leaves the company, the apps they shared stay in the catalogue and their head becomes the new owner.

## Good to know

- An app that many companies would find useful can be sent to the platform administrator with "Request platform app". The administrator reviews the source and releases it as a platform app.
- How to build platform tools yourself, and the tool host, are in the [bmo-pocket](https://github.com/ahas/bmo-pocket) repository.
