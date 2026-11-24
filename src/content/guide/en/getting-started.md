---
title: "Getting started"
description: "Install BMO by handing one line to a coding agent, choose the right path among the three install kinds and the desktop apps, then get to your first conversation through an invite link and the getting started guide."
order: 1
shots: []
---

## How BMO is installed

BMO is an AI agent platform that runs on your own computer. You talk with BMO in the web console, and BMO builds up a memory (the brain) and helps with your own work: notes, documents, your calendar, files and more.

You don't install BMO by typing commands one by one. Open a coding agent such as Claude Code or Codex on the computer that will run BMO, and hand it the line below exactly as it is.

```
Read https://bmo.ahas.io/install.md and install BMO on this machine.
```

The agent reads the install runbook from start to finish and then runs every command itself. It asks you only for what only you have: which install you want, your chat bot's token, the name and password for the console, a domain, any sign-in that has to happen in a browser, and your approval when the computer asks for administrator rights. It gathers the questions a step needs and asks them all at once.

## The computer you need

| Item | What it needs |
|---|---|
| Operating system | Linux. Package names follow the Debian and Ubuntu family |
| Processor | 64-bit x86 or ARM |
| Account | An ordinary user, not root |
| Memory | 16 GB or more (with less, builds can stall, so the agent asks first) |
| Disk | 60 GB or more free |
| Network | It must be able to reach GitHub |

BMO can also be installed on a computer without systemd. There, a supervisor program from BMO's testbed runs the services instead.

## Three install kinds

At the start, the agent asks once which install you want. The install kinds are defined in `presets.toml` in the public repository.

| Install kind | What it includes |
|---|---|
| `personal` | One person and their BMO: the console, memory, coding agents, one chat service, documents, notes, calendar, files, mail and remote desktop. No organisation features and nothing that needs a GPU |
| `team` | Everything in personal, plus companies, organisations, members, room permissions, code review and research |
| `operator` | Everything that is public: customer feedback, BMO's face, voice and vision on GPU nodes, GPU card sharing, the node monitor, a video library and the remote machine hub. Needs GPU machines, a domain and a reverse proxy |

`personal` and `team` pick one chat service, besides the web console, for talking with BMO: Telegram or Discord. `operator` installs both.

## What the install asks for

| Value | Meaning |
|---|---|
| Console name and password | The name and password you sign in to the console with. You choose them |
| Console address | Where the console opens. Without a domain, it opens at the `/bmo/` address on port 3210 on this computer |
| What BMO calls you | The name BMO uses for you in conversation |
| Your chat service ID and language | Your ID on the chat service, and the language BMO answers you in |
| Bot token | The token of your Telegram or Discord bot |
| Remote desktop password | The password for the remote desktop the console opens |

Secret values never end up on a command line, in a log or in the agent's answers. The agent writes each value to a temporary file, hands it to the installer and deletes it straight away.

## What the install does

1. It first shows the whole plan with a dry run that changes nothing.
2. It downloads every repository in the install kind.
3. It checks the programs, ports and inputs it needs, and creates the database and the settings files.
4. It deploys each repository for the first time, and creates the first console account, the first chat agent and your own room.
5. It checks the health of every service and sends a test message to your room.

If something fails along the way, you don't have to start over. Run the same install again and it carries on from where it stopped.

## When the install is done

The agent tells you the console address, your sign-in name (it never says the password), and the install kind and chat service it set up. Open the console and sign in, then send your chat bot a message too, to check that BMO answers.

Adding another repository after the install (for example `bmo-research`) is BMO's own job. BMO adds one only when you have approved that particular repository. New versions arrive through BMO's deployment process.

## The getting started guide

The first time you sign in, the console opens the **getting started guide** (`/start`). It asks, one step at a time, what needs deciding before BMO answers you, and ends with your first conversation with BMO. At the top of the screen are `{n}/{m}` and a progress bar, and you move between steps with "Back" and "Next".

- **The platform administrator:** it opens only when the platform has no supply source it can use. The steps are "Platform supply" (a Claude sign-in on the server, a provider's API key, or "Local AI" at an OpenAI-compatible address), "Connection test", "Default model" (the provider and model of the default supervisor that answers in rooms), "Company name" and "First chat".
- **Members:** of "Welcome", "Supply", "Provider", "Connect", "Connection test", "Machine" and "First chat", only the steps with something to do appear. If the organisation supplies everything, the supply steps are left out. People who must have their own Claude sign-in or key can't move on until it passes the test, and people for whom it is optional can skip with "Later".
- **"Connection test"** runs once now on the source you chose and tells you "Connected" or why it doesn't work.
- **"Machine"**, when your PC isn't linked yet, walks you through getting the desktop app and entering the pairing code.

Unless it is a supply step you can't do without, you can close the guide at any time, and the steps you have done are saved. Open it again later with "Show getting started again" under "Account" in "Settings".

## Joining by invitation

In `team` and `operator` installs, you join through a link a head made with "Create invite link". Open the link and choose a name, a user ID and a password to create your account, then link your PC. Pick one of two tabs for how to link it.

- **"Start with the desktop app":** download the installer for your operating system (installers for other operating systems are beside it), paste the address shown on screen when the app asks for the "BMO server address", then enter the "Pairing code" shown in the app window's title bar and click "Connect".
- **"Start with the jake command":** copy the one-line install command for Linux and WSL or for Windows, and run it on your PC.

Once the PC is linked, your account is ready, and your own BMO, your private room and the agents from the organisation's "Signup setup" are created. Signing in takes you straight into the getting started guide.

**Only one agent attaches to a PC.** If you open the desktop app on a PC where a jake of the same name is already installed, the app doesn't start its built-in agent and tells you the installed jake is looking after this PC. "Switch to the built-in agent" takes the installed jake down with its own uninstaller and switches to the app's agent. The hub, too, refuses a second install under the same name.

## The All-in-One desktop app

If you'd like BMO on your own PC straight away, without a coding agent, there is the **BMO All-in-One** app. It installs and runs the personal install (`personal`) on this PC and opens the console in the app's window. No separate server is needed.

- **Requirements:** Linux with 16 GB of memory and 60 GB of disk, or Windows with WSL 2. On Windows it runs inside a WSL 2 distribution named `BMO`.
- **First run:** it shows what will be installed where and asks for your consent, then goes one screen at a time: checking the computer, preparing, installing the programs it needs, your inputs, and the install. Administrator rights are asked for only through the operating system's own prompt.
- **While running:** the tray icon opens the console and shows its status. Quitting the app stops the BMO services too, and opening the app again starts them again.
- **Updates:** BMO's repositories get new versions through BMO's own deployment, just as on a server. The app itself follows "Desktop app updates" below.

If you already have a BMO server, use the **BMO Remote Controller** app instead. It opens your server's console in a window and joins this PC as a machine BMO can work on. Both apps are built in the [jake](https://github.com/ahas/jake) repository.

### Desktop app updates

- **Official builds come from GitHub releases.** The download page and the app's updates both read the [jake repository's releases](https://github.com/ahas/jake/releases), and an update is installed only if its signature checks out against the public key built into the app.
- **They install quietly.** The app checks for a new version at startup and every six hours, downloads it in the background, and installs it with no window or prompt when you quit the app or when the app is idle. The tray menu of the restarted app shows "Updated · v(version)". If the install fails, the app restarts on its original version and tries again at the next check.
- **Channel:** under "Desktop" in "Settings", choose the "Update channel" between "Stable (default)" and "Nightly". Nightly is a build made every day, so it may not work properly. Switching from nightly back to stable never moves you down to a version lower than the one already installed.
- On Linux, the AppImage replaces itself; an app installed from the deb package is updated by hand through the package manager or the download page.

## Good to know

- The original install runbook is [install.md](https://bmo.ahas.io/install.md), and the install kinds are in `presets.toml` in the [bmo repository](https://github.com/ahas/bmo).
- All settings and secrets live under one data folder (`~/.local/share/bmo/data`).
- Ports already used by other programs are skipped, and the next free one is used.
- The All-in-One app's Windows path is built, but according to its documentation it has not yet been run on a real Windows machine.
