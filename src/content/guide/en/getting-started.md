---
title: "Getting started"
description: "Install BMO by handing one line to a coding agent, and choose the right path among the three install kinds and the All-in-One desktop app."
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

## The All-in-One desktop app

If you'd like BMO on your own PC straight away, without a coding agent, there is the **BMO All-in-One** app. It installs and runs the personal install (`personal`) on this PC and opens the console in the app's window. No separate server is needed.

- **Requirements:** Linux with 16 GB of memory and 60 GB of disk, or Windows with WSL 2. On Windows it runs inside a WSL 2 distribution named `BMO`.
- **First run:** it shows what will be installed where and asks for your consent, then goes one screen at a time: checking the computer, preparing, installing the programs it needs, your inputs, and the install. Administrator rights are asked for only through the operating system's own prompt.
- **While running:** the tray icon opens the console and shows its status. Quitting the app stops the BMO services too, and opening the app again starts them again.
- **Updates:** the app updates itself through its own update feature, and BMO's repositories get new versions through BMO's own deployment, just as on a server.

If you already have a BMO server, use the **BMO Remote Controller** app instead. It opens your server's console in a window and joins this PC as a machine BMO can work on. Both apps are built in the [jake](https://github.com/ahas/jake) repository.

## Good to know

- The original install runbook is [install.md](https://bmo.ahas.io/install.md), and the install kinds are in `presets.toml` in the [bmo repository](https://github.com/ahas/bmo).
- All settings and secrets live under one data folder (`~/.local/share/bmo/data`).
- Ports already used by other programs are skipped, and the next free one is used.
- The All-in-One app's Windows path is built, but according to its documentation it has not yet been run on a real Windows machine.
