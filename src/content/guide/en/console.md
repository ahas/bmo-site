---
title: "A tour of the console"
description: "A walk through the screens you meet first in the web console: the sidebar, rooms and room info, system lines, the TODO panel and the settings window."
order: 2
shots:
  - name: console-room
    alt: "BMO's room in the console: the room list in the left sidebar, a conversation with BMO in the middle and the TODO panel on the right"
  - name: console-room-phone
    alt: "BMO's room at phone width: chat bubbles and the Talk to BMO input box at the bottom"
---

## The console has three columns

When you sign in to the console with the name and password you chose during the install, the screen is split into three columns.

- **The left sidebar:** your way to screens, rooms and agents.
- **The middle:** the screen or room you have open.
- **The TODO panel on the right:** where the work you hand to BMO piles up as items. It is in the platform administrator's console.

The platform administrator's home screen shows at a glance what rooms and agents are doing right now, and a member's home screen is their list of rooms. On a phone, the sidebar opens as a drawer, and the TODO panel opens with "Open TODO" in the top bar.

## The sidebar

- **"Search":** the search at the very top opens from anywhere with Ctrl+K (⌘K on a Mac). It finds screens and their tabs, rooms and agents, and people in your organisation by name.
- **Screen groups:** the screens are split into three groups.
  - "System services": the admin screens that look after the deployment, the screens heads of organisations use, and the "Store" everyone opens. "Organization", "Platform settings", "Agency", "Brain" and others are here, and everyone with an account sees at least the "Store" in this group.
  - "Applications": screens for everyday use, such as "Notes", "Calendar", "Artifacts" and "Mail".
  - "My apps": the screens of personal apps your BMO made for you. If an app's name isn't written in your language, it is shown translated, with the original name in a tooltip.
- **"Rooms":** your list of rooms. Pinned rooms stay at the top, and when a new message arrives the room moves up and shows an unread count.
- **"Agents":** the list of supervisors, roles and repositories, shown to the platform administrator.
- **The user menu at the bottom:** click your name for "Settings", the desktop app download, the display mode (light, dark or system) and "Sign out".

The sidebar shows only the screens you can open. A group with no screens in it doesn't show even its title.

## Rooms

Rooms are where BMO and people talk.

- **Your private room with BMO:** a conversation for just you and your BMO. Write in the input box at the bottom ("Talk to BMO") and BMO answers. You can attach files with the paperclip button too.
- **Group rooms:** create one from "New chat" beside the rooms heading in the sidebar: choose "Create console room" and enter a "Room name". It is a room used only inside the console, with no chat service, and the BMO of the person who created it answers.
- **Adding members:** the person who opened the room, or their head of organisation, can bring in people or whole organisations at once with "Add members" on the "Members" tab of "Room info".
- **Any member of the room can call their own BMO:** people who joined from the console, and members of the chat service linked to their account alike, call their own BMO into the room by name. There is no separate allow list: the ability comes when you join and goes when you leave.
- **"Talk to my BMO privately":** in a group room's menu. The group room stays as it is while a panel opens beside it for a one-to-one talk with your BMO. Nothing you say there goes out to the group room.
- **"Find in conversation" and pinning:** the room's menu lets you search the conversation, and pin or unpin the room.
- **"Hand over session" and "Reset session":** if you may manage the BMO answering in that room, the room's menu has both. The “Sessions” chapter covers them in detail.

Telegram and Discord rooms you add to the console appear in the same room list. Your private room with BMO is always in the list.

### Room info

Click the room's name at the top of the room, and "Room info" opens beside it on a wide screen, or from the bottom on a phone. It has the "Members", "Media", "Files", "Links", "Music", "Voice" and "Situation" tabs; the platform administrator also has "Session info", and a room you may change also has "Chat service" and "Tone".

- **"Chat service":** only shows the chat service that carries this room, without changing it. A room's chat service is set when the room is added or created, and stays as it is.
- **"Avatar mode":** a switch that appears only in added rooms whose chat service supports it. On means "In this room, BMO answers for you as your account"; off means "Only records, and doesn't answer".

### System lines

Notices that are nobody's words, from no agent, appear not as speech bubbles but as one faint centred line. With no picture and no name, they don't read as something BMO said. Notices when a service stops for a deployment or restart, people joining and leaving, a session handed over or reset, and a rest beginning all appear this way. Their wording comes from the console's language pack, so you read them in your own language.

## The TODO panel

When you hand BMO a piece of work, such as "fix this bug", BMO files it as a TODO item. The panel's tabs sort items by status, such as "Waiting" and "In progress", and clicking an item shows the original request, its progress and its work log. Each item carries a small mark showing the model that will take the work.

## The settings window

"Settings" in the user menu opens as a large window over the current screen. Sections are on the left and their contents on the right, and changes apply at once.

| Section | What it does |
|---|---|
| "Account" | Sign-in details and your profile (name, title and so on), "My information shared with the organization", "Show my presence", "Show getting started again", and "Security" (email verification, two-step verification, signed-in devices, sign-in history) |
| "My agents", "Supply", "My apps, tools & skills" | Doors that open the organisation screen's "Agents", "Supply" and "Apps, tools & skills" tabs with "Me" picked |
| "Machine" | The machines linked to your account and their status, and "Disconnect device" |
| "Desktop" | App settings and the "Update channel", shown only when the console is opened inside the desktop app |
| "Secrets" | Where you leave API keys or passwords without putting them in a conversation |
| "My personal apps", "My skills" | The apps and MCP servers BMO made for you, and the skills you made or installed from the store |
| "Theme", "Rooms" | Language, display mode, auto-translate, theme and room colours |

The platform administrator also has "Notifications" and "Voice briefing".

### My BMO

Your BMO is under "My BMO" at the very top when you pick "Me" on the organisation screen's "Agents" tab. It is shown only to people their organisation allows. There you can change the name, the "Call names" and the "Persona". Under each line it says whether the value is "Set by you" or "Set by company". Turning off "Use the persona" keeps BMO's name and picture but drops the instructions about its tone and character. "Reset" clears the name, call names, picture and persona you set yourself and goes back to the company's settings.

## Good to know

- If you have never picked a display mode, the console opens in dark mode.
- Members see only their own rooms and the screens they are allowed to read. Other people's rooms and agents don't appear in any list.
- Whether you can write in a room depends on your account's permissions. People allowed only to read have no input box.
- Changes in the "Settings" window apply straight away, with no save button. Only forms you open separately, such as the password form, have their own "Save" button.
