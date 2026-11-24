---
title: "Sessions"
description: "The sessions BMO keeps conversations going in, compaction and handoff, handing over and resetting a session from the console, the nightly sleep, and the rest taken when usage limits are hit."
order: 9
shots: []
---

## What a session is

A session is one ongoing conversation BMO has with a model. Because BMO keeps using the same session, it answers with what was said earlier still in mind. The session remembers the flow of the conversation, and the brain remembers the facts worth keeping for a long time. The two are different things.

How sessions are divided differs from agent to agent.

- **Your BMO:** uses one session across every room. What you said in your private room and what you said in a group room are part of one flow.
- **Supervisors that keep a session per room:** keep a separate session for each room.
- **Role agents:** agents that take on work keep separate sessions per role, working path, provider and model. On the agency screen, you can choose for each role agent whether its "Session" is kept ("Keep") or opened fresh each time ("New").

## It carries on through restarts

Sessions don't break when a new version of BMO is deployed or a service restarts. A conversation turn that was in progress is taken over by the next server and answered to the end, and the next turn continues in the same session. Work that was running carries on through the restart as well.

## When the window fills up: compaction

The conversation window a model can read at once has a limit. When a conversation grows long and the session passes a set share of it, BMO tidies the session up.

- That share is the "Compaction threshold", set per supervisor and role. If none is set, the value the provider states is used, and failing that, 85%.
- While it compacts, the agent's status shows "Compacting".

## Handoff: a note passed to the next session

With some providers, instead of folding the session up, BMO **hands it off**. It asks the current session for one more turn to write a handoff note itself, and the new session starts with that note at the very front. The system doesn't summarise the conversation separately; the note is written by the session itself, with the whole conversation in front of it.

**Before a handoff, the session sleeps and tidies its memories.** Before writing the note, it reads the episodes not yet tidied and writes them into the brain as facts, so what it learned stays even when the session changes.

The turn that writes the handoff note leaves no answer in the room. Instead, the room gets one system line saying BMO is going to sleep to tidy its memories and will wake in a new session (see “The line left in the room” below).

### When a session changes

Besides the window filling up, a session is replaced when:

- the documents that make up BMO's system prompt change
- the provider or model in use changes
- the session it was continuing can no longer be reopened
- the owner asks for a fresh start

In every case, **nothing changes between a question and its answer.** When a change is due, the current turn is answered to the end in the original session, and the handoff happens once the agent has gone quiet. If new words arrive in a room during the change, that room is told once that BMO will answer when the tidying is done, and the new session answers everything.

Your BMO can also ask for a handoff itself when it needs one. The request takes effect on the next turn.

### If the handoff fails

If the old session couldn't write a note or couldn't be asked, the new session receives the record of the answers BMO has sent to rooms instead. If even that is missing, it starts by saying it couldn't recover its memory and lets the owner know. Information about people is read again from the brain, so it isn't lost when the session changes.

## Handing over and resetting a session

From the console you can hand over a supervisor's session or start it afresh yourself. Both deal only with the session: none of the room's messages, files, minutes or records are deleted or hidden.

**Where to do it**

- **The room's menu:** for each supervisor answering in that room that you may manage, there are "Hand over session" and "Reset session". If there are several, you pick one in a window.
- **"Me" on the organisation screen's "Agents" tab:** each supervisor of your account (your BMO at the top) has both in its menu. "My agents" under "Settings" leads here.
- **The agency screen's "Agents" tab:** the platform administrator does it from the menu of any supervisor's line in the deployment.

**Who can do it**

The platform administrator can manage every supervisor, a person the supervisors of their own account, and a head the supervisors of the people in their organisation and the organisations below it. To anyone else, the answer is as if the agent didn't exist. Role agents open a separate session for each run, so they have neither.

**How the two differ**

| | Hand over session | Reset session |
|---|---|---|
| What it asks | One short line of reason (up to 200 characters, required) | Confirmation of what goes and what stays |
| Tidying memories | Sleeps and tidies its memories | Sleeps and tidies its memories |
| Handoff note | Written. The new session reads the note and starts | Not written. The new session takes nothing from the old one |
| What stays | Conversation history, files, BMO's memories | Conversation history, files, BMO's memories |

For a supervisor that keeps a session per room, the target is that room's session, or, if you asked from its line rather than a room, every room session that supervisor holds. When the request is accepted, a notice appears at the top of the screen. A handover happens after the current turn ends, and a reset starts with a new session from the next turn. If there is no session to hand over, you are told so, and the next turn opens a new session anyway.

**How a request is handled**

- **It doesn't cut a turn short.** If a conversation or work is running in that session, it waits for it to finish and takes effect when the next turn starts.
- **Only one request waits per session.** If a request is already waiting, a new one counts as the same request, and a reset request turns the waiting request into a reset.
- **The old session isn't deleted.** The old session's record and conversation turns are kept as they were, and the new session starts after the last message received, without sending the earlier conversation again.

When you change and save a supervisor's generation parameters, you are told before saving that "{n} room sessions will start fresh from the next turn."

### The line left in the room

When a session is handed over or reset, whoever asked for it (the console, a chat command, or BMO itself), one system line is left in the room. The line stays only in the room's record and is not sent to the chat service.

- Handover: "(name) went to sleep to tidy its memories and wakes in a fresh session"
- Reset: "(name)'s session slept to tidy its memories and started afresh. The conversation history stays as it is"

After it comes the reason the requester wrote, or, if there is none, a cause such as "its context was full", "its provider · model changed" or "its instructions changed", followed by "asked by (name)".

## Nightly sleep

Every supervisor with a brain, BMO included, **sleeps** once a day at a quiet hour. Sleep is one run of the supervisor's own that belongs to no room, and it tidies the memories piled up that day.

- **What it does:** it reads every episode not yet tidied and writes it down as fact, merges memories that say the same thing into one or keeps the more detailed one as a new version, and of memories that contradict each other keeps the newer or better-grounded one. "State", "Follow-up" and "Promise" memories whose end condition has been met are moved to ended. Nothing is deleted.
- **It says nothing in rooms.** It doesn't touch conversation sessions either.
- **It sleeps only when there is something to sleep on.** If there are neither episodes to tidy nor newly written memories since the last sleep, that day counts as slept. If the GPU cards are busy with other work it waits for the next hour, and a failed sleep is tried again an hour later.
- **Record:** what it learned, merged and ended is left in the brain as a one-line "Sleep" summary.

### Last night's sleep

When sleep ends, one record-only system line is left in the private room of that supervisor's owner. It is not sent to the chat service.

> (name) slept on the night of November 23 and tidied its memories · learned 12 · merged 3 · closed 2

### Sleep settings

Open a supervisor's "Settings" on the agency screen's "Agents" tab, and under "Sleep" turn "Sleep every night" on or off and pick the "Sleep hour" (0–23, with the default marked). Below it you see "Last slept: the night of (date)" or "It has not slept yet." If nothing is set, every supervisor with a brain sleeps at the default hour.

## Rest

When all of the platform's own Claude sign-ins hit their usage limits, or a provider has an outage, the whole deployment goes into **rest**.

- **Agents that rest:** only supervisors and role agents running on the platform's supply rest. Agents running on other supply, such as your own Claude sign-in or key, keep answering.
- **What rooms are told:** when rest begins, a line in the room says until when, such as "(BMO's name) used way too much brainpower today... going to rest a bit until 15:00." If the end isn't known, it says "going to rest a bit and be back soon."
- **Words received while resting:** they aren't dropped; they are gathered and answered in order once the rest lifts.
- **On screen:** resting agents on the agency screen's "Agents" tab are marked "Resting · until 15:00", and a banner reading "Usage limit" or "Provider outage" appears at the top of the tab.
- **Ending the rest:** the platform administrator can end the rest at once with "End rest" on that banner. Confirm "End the rest?" and the platform's sign-ins answer again straight away; if a sign-in is still at its limit, it rests again at the next usage check.
- **Notifications:** turning off "Rest notices" under "Notifications" in "Platform settings" stops the owner's private room being told when rest starts and ends.

## Starting a supervisor over

Far bigger than a session reset is a **reset** that returns a supervisor to its starting state. Only the owner can do it.

- **Conversation scope:** deletes the supervisor's room sessions, their records and its run logs. The rooms themselves and their messages stay.
- **Memory scope:** takes down the supervisor's whole brain, so nothing it remembered comes back.
- You can choose either or both, and preview what will be deleted first.
- Once started, it runs to the end. A turn running at that moment stops, and what the reset deleted is never written again. Settings, the provider and model, and the rooms stay as they are.

## Good to know

- "Reset" in "My BMO" under "Me" on the organisation screen's "Agents" tab is not a session reset. It clears the name, call names, picture and persona you set and goes back to the company's settings.
- The platform administrator can open "Session info" from a room's "Room info" to see the session and model of the agent answering in that room, and how full its conversation window is.
- A service or deployment restarting does not, by itself, change a session.
