---
title: "The organisation screen"
description: "The organisation screen's tree (\"Me\", \"Whole platform\", companies and organisations) and its agents, supply, apps, tools and skills, secrets, org memory, permissions, security and mail server tabs."
order: 3
shots:
  - name: org
    alt: "The organisation screen: the tree of a company and its sub-organisations on the left, and on the right the agents tab with the BMO personalisation right, organisation instructions and persona settings"
---

## Who opens the organisation screen

The organisation screen is where you set up a company, the organisations inside it, its people, and those people's BMOs and agents. Organisation features come with the `team` and `operator` installs.

Open it with "Organization" under "System services" in the sidebar. The item is shown to the platform administrator, to heads of organisations, and to people given permission to write org memory. A member who leads no organisation can still see their own settings: clicking "Open" in "My agents", "Supply" or "My apps, tools & skills" under "Settings" opens this screen with "Me" selected.

## The tree on the left

The tree shows only the places you can set up.

- **"Me":** your own place. It sits at the top of the tree for everyone with an account.
- **"Whole platform":** the platform itself, above every company. Only the platform administrator sees it.
- **Companies and organisations:** companies show a building icon, and the organisations below them are nested with no icon, by name and indentation. Names such as division, centre, team or unit are just each organisation's name; if the company has set a "Type" for it, a small mark appears beside the name.

The search above the tree finds names or types, and the platform administrator creates a new company with "Add company" beside the search box. The place you pick is kept in the address, so a shared link opens the same place. On a phone, the button in front of the tab row opens the tree as a drawer from the bottom.

## The tabs on the right

Tabs open for the place you picked in the tree. Switching tabs keeps your place, and switching places keeps your tab, so you can read one setting down the tree.

| Tab | What it does | Who sees it |
|---|---|---|
| "Org chart" | View and change heads, acting heads, members and concurrent posts. "Add organization", "Move" | Administrators, heads |
| "Users" | Find people, see their account, membership, BMO, supply and activity, and take account actions such as a password reset | Administrators, company heads |
| "Positions & types" | The company's list of positions and organisation types | Administrators, company heads |
| "Invites" | Bring people into an organisation with "Create invite link" | Administrators, heads |
| "Agents" | The default BMO and "BMO settings permission", and every setting about the agents of the organisation's people. Under "Me", your BMO and your agents | Administrators, heads; "Me": everyone |
| "Apps, tools & skills" | Turning apps, skills and MCP servers on and off, recall, and the rules for personal apps | Everyone (at the places each can set up) |
| "Artifact storage" | Where the organisation's people's documents are kept | Administrators, heads |
| "Mail servers" | The incoming and outgoing servers the organisation's people pick from | Administrators, heads |
| "Secrets" | Secrets for that place, kept by name | Me: yourself; organisation: administrators and heads; platform: administrators |
| "Organization memory" | Memory shared by the whole organisation. Under "Whole platform", the global base and its "Review" | Administrators, heads, people given permission |
| "Permissions" | Which areas of the console each person can read and write | Administrators, heads |
| "Supply" | Supply policy, organisation supply and organisation supply keys, credits, usage this month, plans. Under "Me", your own supply | Administrators, credit and subscription managers, heads; "Me": everyone |
| "Security" | "Require two-step verification" | Administrators, heads |

When you have picked "Me" or "Whole platform", a tab with no settings for that place just says "This tab has no personal settings." or "This tab has no platform settings."

## The "Agents" tab

All the settings about the BMOs and agents of the organisation's people are gathered here. Beside each setting is a box for choosing how sub-organisations treat the value ("Follow parent", "Allow sub-organizations", "Lock sub-organizations"). These words are covered in detail in the “Organisations and the delegation chain” chapter.

- **"Default BMO":** the name, call names and picture the BMOs of the company's people use.
- **"BMO settings permission":** whether this organisation and each of its people may style their own BMO ("Allow", "Block", "Follow parent organization").
- **"Organization instructions":** instructions every agent that helps the organisation's people receives. If an organisation above also has instructions, it says "{count} instructions from the organizations above apply first."
- **"Persona":** whether agents use a persona ("Use the persona", "No persona").
- **"Signup setup":** how many agents of each role a person is given, and which provider and model each agent runs on.
- **"Personal changes":** whether people may "Add and turn off agents", "Choose provider · model" and write "My instructions" themselves.
- **"Organization repositories":** repositories that only the agents of this organisation's people work in, and whether "Manage repositories" is allowed.

### With "Me" picked

- **"My BMO":** if your organisation allows it, change your BMO's name, call names, persona, "Use the persona" and profile picture, and go back to the company's settings with "Reset".
- **"My agents":** your supervisors (your BMO at the top) and your agents by role. Each line says where it came from ("Received agent", "Set by you", "Added by you"), and you change its "Provider · model", turn it on or off, "Revert" it, or "Add agent". A supervisor's menu has "Hand over session" and "Reset session".
- **"Skills · MCP":** for each agent, choose which of your skills and MCP servers to attach. What you attach is used from that agent's next turn.
- **"Organization instructions" and "My instructions":** read the instructions of the organisations above, and write your own instructions for all agents and for each agent.

## The "Supply" tab

See the organisation's "Supply policy" (which supply sources to use and in what order) and each person's "Monthly cap", the switch that opens and closes "Organization supply", the "Organization supply keys" the organisation pays for itself, the organisation's "Credits" balance and "Grant credits", "Usage this month", and the "Applied plan" and "Visible plans". Payments are switched off, so credits only grow by being granted.

- **"Organization supply keys":** the Claude (Anthropic API key), Codex, DeepSeek and OpenRouter keys the organisation pays for. A key's value is entered only once, is stored only in the organisation's own secret space, and is never shown again.
- **Under "Me":** handle your own "Supply logins" (Claude sign-ins), "Supply keys", "Supply order" and "Usage this month".
- **Under "Whole platform":** handle the "Platform default policy", the "Conversion rate" and "Reservation credits", "Enforce supply limits", the "Ledger" and "Audit log", "Plans", "Platform supply keys" and "Claude accounts". The details are in the “Administration” chapter.

## The "Apps, tools & skills" tab

At the place you picked, choose "On", "Off" or "Follow parent organization" for each app and for each skill and MCP server shared in the company, and fix it for everyone below with "Lock for sub-organizations". With "Me" picked, you turn the apps offered to you on or off just for yourself. Choosing "On" for a shared item installs it on the PCs of everyone in that organisation, and "Recall" takes down every copy in that organisation. In the "Personal apps" group below, set making personal apps, requests to use the network and secrets, approving shared versions, installing shared apps, and who can be shared with. The details are in the “Apps and personal tools” chapter.

## The "Organization memory" tab

Write down facts that hold for the whole organisation, and every agent that helps the people of that organisation and its sub-organisations receives them.

- Under "This organization's memories", use "Add memory" to write the content, the people it concerns and its topic. If a sub-organisation writes the same topic again, its version takes priority.
- Turn on "Fixed" and sub-organisations can't override that topic. Turn on "Internal only" and it isn't used in rooms that have people from outside the company.
- What members leave gathers under "Suggestions", and a head chooses "Accept" or "Decline".
- With "Organization memory write access", heads can give people who aren't heads permission to write.
- "Parent organizations' memories" shows the memories of the organisations above, and says so when another organisation's memory takes the place of one on the same topic.
- In "Reading", set whether this organisation's people "Read the platform memory" and "Read the organisation memory".
- Picking "Whole platform" shows the **global base**, which applies to any agent. Only the platform administrator writes it, and in "Review" raises the candidates many brains have put forward with "Raise to the platform", leaves them in their original brain, or discards them.

Memories about a person hold only what the organisation may know, such as their role, what they look after and how they like to be contacted. Personal circumstances, health and the like are never written there.

## The "Artifact storage" tab

Choose where the organisation's people's documents are kept. If nothing is set, the "Storage location" is "This server"; you can also choose a SharePoint document library. A new location applies to documents kept after the change, and documents already kept stay where they were.

## The "Mail servers" tab

Once a company sets up its IMAP or POP3 incoming servers and SMTP outgoing servers, the people below only need to add their own address and password on the mail screen. Write the protocol, host, port and security (TLS, STARTTLS, no encryption) with "Add server", and check it with "Test connection". A server an account is using can't be deleted. The outgoing servers under "Whole platform" are also the servers the platform's system mail picks from. Where the mail service isn't installed, just one line says so.

## The "Permissions" tab

Find the organisation and the people below it by name and open one, and "Read" and "Write" switches appear for each area of the console. Heads can only pass on permissions they hold themselves, and a changed value applies from that person's next screen.

## The "Security" tab

Choose "Require two-step verification" from "Follow parent", "Required" and "Not required". In an organisation that requires it, people who don't have two-step verification yet are taken to set it up at their next sign-in. The details are in the “Account security” chapter.

## The "Secrets" tab

This is where secrets such as API keys, tokens and passwords are handed to agents and units without passing through a room or a record. Each place in the tree has one secret space.

- **"Me":** your own space. "Secrets" in "Settings" leads here too.
- **Companies and organisations:** that organisation's space, looked after by its heads and the platform administrator. Keys entered under "Organization supply keys" on the "Supply" tab are kept here by name as well.
- **"Whole platform":** where the secrets the whole deployment uses are kept. Only the platform administrator opens it.

Wherever you are, the list under "Stored secrets" shows only each secret's name, size and when it last changed; a value never appears again on any screen. Add a new secret with "Add secret", change its value with "Replace", and when you "Delete" one, its previous value is kept once more. Agents and settings are handed only a secret's name, so the value never ends up in a conversation.

## Good to know

- "Create invite link" makes a link with a name, organisation, role and expiry, and copies it at once. The person who receives it sets a name, ID and password at the link to create their account, and connects their own machine.
- Once the account is ready, that person's own BMO, private room and the agents given by the "Signup setup" are created automatically.
- A concurrent post doesn't pass that organisation's settings on to the person. Settings come down through the organisation they belong to.
