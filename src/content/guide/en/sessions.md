---
title: "Sessions"
description: "The sessions BMO keeps conversations going in, what happens when the conversation window fills up (compaction and handoff), and how a session reset works."
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

The turn that writes the handoff note leaves nothing in the room. People in the room just see the conversation carry on.

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

## Session reset

A reset is a **request** to start an agent's session afresh. The platform administrator (the owner) makes it, and the request is kept on record.

- **It doesn't cut a turn short.** If a conversation or work is running in that session, it waits for it to finish and takes effect when the next turn starts.
- **Only one request waits per session.** If a request is already waiting, a new one counts as the same request.
- **The old session isn't deleted.** The old session's record and conversation turns are kept as they were, and the new session starts after the last message received, without sending the earlier conversation again.

How a reset happens depends on the kind of session.

| Session | On reset |
|---|---|
| Your BMO's single session | It takes a handoff note and opens a new session with it |
| A session kept per room | That room's session writes a handoff note and a new generation begins |
| A role agent's session | The session record is dropped so the next run starts in a new session |

When you change and save a supervisor's generation parameters, you are told before saving that "{n} room sessions will start fresh from the next turn."

## Starting a supervisor over

Far bigger than a session reset is a **reset** that returns a supervisor to its starting state. Only the owner can do it.

- **Conversation scope:** deletes the supervisor's room sessions, their records and its run logs. The rooms themselves and their messages stay.
- **Memory scope:** takes down the supervisor's whole brain, so nothing it remembered comes back.
- You can choose either or both, and preview what will be deleted first.
- Once started, it runs to the end. A turn running at that moment stops, and what the reset deleted is never written again. Settings, the provider and model, and the rooms stay as they are.

## Good to know

- "Reset" in "My BMO" under "Settings" is not a session reset. It clears the name, call names, picture and persona you set and goes back to the company's settings.
- The platform administrator can open "Session info" from a room's "Room info" to see the session and model of the agent answering in that room, and how full its conversation window is.
- A service or deployment restarting does not, by itself, change a session.
