---
title: "Brain (memory)"
description: "What BMO remembers and how, the three layers of your BMO, your organisation and the platform, and how people view and correct memories."
order: 7
shots:
  - name: brain
    alt: "The brain screen: people and rooms by subject on the left, a table of memories and a person's profile in the middle, and on the right the selected memory with Correct, Done, Not correct and Retract buttons"
---

## The brain is BMO's long-term memory

The brain is one agent's long-term memory. Apart from the conversation itself, BMO reads everything it knows about the world from its brain. What happened, facts, people's names, room rules and the persona are all kept there as memories, one row at a time.

- **Every agent has its own brain.** Even two agents on the same account don't see each other's memories, and another account's brain is even further out of reach.
- **Versions are kept, never deleted.** Editing a memory creates a new version, and a memory that no longer holds is closed and hidden, never deleted. You can read who changed what and when through its versions.
- **Nothing is forgotten because of age.** A memory doesn't fade for being old or unused. It ends only when its end condition is met, when it is corrected, or when a person ends it.

## What it remembers

| Type | Meaning |
|---|---|
| "Episode" | What happened, as it was said. Material to be turned into facts later |
| "Fact" | Something confirmed to be true |
| "Hearsay" | Something heard from someone else, or a guess. It never overrides a fact |
| "Situation rule" | What to do when a certain situation comes up |
| "Room rule" | A rule allowed in one room |
| "Name" | What a person or thing is called |
| "Persona" | A piece of BMO's tone and character |
| "Lore", "Knowledge" | Settings and knowledge read for reference |

There are also types BMO decides on and uses itself, such as "Promise", "Follow-up", "Tip" and "Check".

### How BMO writes memories

BMO decides what to remember as it reads the conversation, on the spot.

- **What people say about themselves becomes fact straight away.** What a person says about themselves, and what the owner instructs, is written as fact at once, closing any older fact that contradicts it.
- **Other people's stories and guesses stay as "Hearsay".** They become fact once the person concerned confirms them or another source agrees.
- **It looks for similar memories before writing.** If the content is the same, it only confirms it rather than writing anew; if it adds something, it writes a new version; if it contradicts, it closes the old one and writes a new one.
- **Memories are stored in English.** Whatever language was spoken in the room, the memory itself is written in English.
- **What is said in a room stays as that room's memory.** BMO doesn't bring it up carelessly in other rooms.

### How it recalls during a conversation

BMO doesn't read every memory on every turn. It picks the memories relevant to the conversation at hand and receives them as a short bundle. If a memory says "when it is needed" and "when it ends", it comes up when that situation arrives and drops away when the ending situation comes.

## Three layers

When BMO reads memories, it looks at three layers, nearest first.

1. **Your BMO's brain:** always read.
2. **Org memory:** the memories of the organisations you belong to, the nearest organisation's first.
3. **Global memory:** tips and knowledge useful to any agent in any organisation.

When several layers hold the same topic, the nearer layer wins. For example, a team's working hours take priority over the company's. But a topic an organisation above has marked "Fixed" can't be overridden by an organisation below. Whether org memory and global memory are read is decided by the platform and organisations through delegation chain settings.

Org memory holds only what applies to the whole organisation and, about people, only what the organisation may know, such as their role, what they look after and how they like to be contacted. Personal circumstances, health, what you said in your own conversations, and judgements about people stay only in each person's own BMO brain. Org memory is used only within one company.

## Where to view and correct memories

### "My information shared with the organization"

This is under "Account" in "Settings". It shows what the memories of your organisations hold about you; write down information about yourself the organisation may know with "Add information", or take it down with "Delete information".

### The "Organization memory" tab

Heads, and people given write permission, add and edit the organisation's memories on the "Organization memory" tab of the organisation screen. What members leave doesn't apply at once: it gathers under "Suggestions" and becomes fact once a head clicks "Accept". Memories managed by other services can't be edited here; the tab only shows where they came from.

### The "Brain" screen

The platform administrator sees every brain under "Brain" in "System services" in the sidebar.

- Pick a brain at the very top, then narrow it down on the left by "Layers", "Subjects" and "Type". Pick a person and their "Profile" appears too.
- Open a memory to see its status, layer, subjects, version history, how much it has been used and who wrote it on the right.
- Confirm it with "Correct", close it with "Done" or "Not correct", or turn it into something that was never true with "Retract". A closed memory comes back with "Restore".
- "Edit" creates a new version. If BMO changed it first in the meantime, the new version is shown and what you were writing is kept.
- Choose "Teach" in "Add memory or layer", and you are shown similar memories so you can decide whether yours is a duplicate, an addition, a contradiction or something new, and teach it accordingly.
- "Translate" lets you read memories in your own language. Text written in Korean is shown translated into English before it is saved, for you to confirm.

Only the platform administrator writes global memory. Candidates are picked from the tips and knowledge many BMOs have learned, and the administrator goes through them one by one in "Review", raising each with "Make global", leaving it in its original brain, or discarding it.

## Good to know

- The brain does nothing by itself. BMO and the screens write and read memories; the brain keeps them as versions.
- The persona is read from the brain's "Persona" layer and placed in BMO's system prompt. Changing a piece makes the prompt cache built on top of it start afresh once.
- The brain repository and its design documents are at [bmo-brain](https://github.com/ahas/bmo-brain).
