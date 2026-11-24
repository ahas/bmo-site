---
title: "The organisation screen"
description: "The organisation screen's tree (\"Me\", \"Whole platform\", companies and organisations) and its agents, supply, apps and tools, secrets, org memory and artifact storage tabs."
order: 3
shots:
  - name: org
    alt: "The organisation screen: the tree of a company and its sub-organisations on the left, and on the right the agents tab with organisation instructions, persona and agent supply source settings"
---

## Who opens the organisation screen

The organisation screen is where you set up a company, the organisations inside it, its people, and those people's BMOs and agents. Organisation features come with the `team` and `operator` installs.

Open it with "Organization" under "System services" in the sidebar. The item is shown to the platform administrator, to heads of organisations, and to people given permission to write org memory. A member who leads no organisation can still see their own settings: clicking "Open" in "My apps & tools" under "Settings" opens this screen with "Me" selected.

## The tree on the left

The tree shows only the places you can set up.

- **"Me":** your own place. It sits at the top of the tree for everyone with an account.
- **"Whole platform":** the platform itself, above every company. Only the platform administrator sees it.
- **Companies and organisations:** companies show a building icon and organisations a people icon, with sub-organisations nested under their parents. Names such as division, centre, team or unit are just each organisation's name; if the company has set a "Type" for it, a small mark appears beside the name.

The search above the tree finds names or types, and the platform administrator creates a new company with "Add company" beside the search box. The place you pick is kept in the address, so a shared link opens the same place. On a phone, the button in front of the tab row opens the tree as a drawer from the bottom.

## The tabs on the right

Tabs open for the place you picked in the tree. Switching tabs keeps your place, and switching places keeps your tab, so you can read one setting down the tree.

| Tab | What it does | Who sees it |
|---|---|---|
| "Org chart" | View and change heads, acting heads, members and concurrent posts. "Add organization", "Move" | Administrators, heads |
| "Users" | Find people and see their account, membership, permissions, BMO, supply and activity | Administrators, company heads |
| "Positions & types" | The company's list of positions and organisation types | Administrators, company heads |
| "Invites" | Bring people into an organisation with "Create invite link" | Administrators, heads |
| "BMO" | The default BMO for the company's people, and "BMO settings permission" | Administrators, heads |
| "Agents" | Every setting about the agents of the organisation's people | Administrators, heads |
| "Apps & tools" | Which apps are on or off | Everyone (at the places each can set up) |
| "Artifact storage" | Where the organisation's people's documents are kept | Administrators, heads |
| "Secrets" | Secrets for that place, kept by name | Me: yourself; organisation: administrators and heads; platform: administrators |
| "Organization memory" | Memory shared by the whole organisation | Administrators, heads, people given permission |
| "Supply", "Plan" | Supply policy, credits and the plan in use | Administrators, credit and subscription managers, heads |

When you have picked "Me" or "Whole platform", a tab with no settings for that place just says "This tab has no personal settings." or "This tab has no platform settings."

## The "Agents" tab

All the settings about the agents of the organisation's people are gathered here. Beside each setting is a box for choosing how sub-organisations treat the value ("Follow parent", "Allow sub-organizations", "Lock sub-organizations"). These words are covered in detail in the “Organisations and the delegation chain” chapter.

- **"Organization instructions":** instructions every agent that helps the organisation's people receives. If an organisation above also has instructions, it says "{count} instructions from the organizations above apply first."
- **"Persona":** whether agents use a persona ("Use the persona", "No persona").
- **"Agent supply sources":** whether each of "Personal supply", "Organization supply" and "Platform supply" is open or closed in this organisation.
- **"Organization supply keys":** API keys and Claude accounts the organisation pays for itself. A key's value is entered only once, is stored only in the organisation's own secret space, and is never shown again.
- **"Signup setup":** how many agents of each role a new person is given.
- **"Personal changes":** whether people may "Add and turn off agents", "Choose provider · model" and write "My instructions" themselves.
- **"Organization repositories":** repositories that only the agents of this organisation's people work in, and whether "Manage repositories" is allowed.

## The "Supply" tab

See the organisation's "Supply policy" (which supply sources to use and in what order, and each person's monthly cap), the "Plan" in use, the organisation's "Credits" balance and "Grant credits", and "Usage this month". Payments are switched off, so credits only grow by being granted.

## The "Apps & tools" tab

At the place you picked, choose "On", "Off" or "Follow parent organization" for each app, and fix it for everyone below with "Lock for sub-organizations". With "Me" picked, you turn the apps offered to you on or off just for yourself. The details are in the “Apps and personal tools” chapter.

## The "Organization memory" tab

Write down facts that hold for the whole organisation, and every agent that helps the people of that organisation and its sub-organisations receives them.

- Under "This organization's memories", use "Add memory" to write the content, the people it concerns and its topic. If a sub-organisation writes the same topic again, its version takes priority.
- Turn on "Fixed" and sub-organisations can't override that topic. Turn on "Internal only" and it isn't used in rooms that have people from outside the company.
- What members leave gathers under "Suggestions", and a head chooses "Accept" or "Decline".
- With "Organization memory write access", heads can give people who aren't heads permission to write.

Memories about a person hold only what the organisation may know, such as their role, what they look after and how they like to be contacted. Personal circumstances, health and the like are never written there.

## The "Artifact storage" tab

Choose where the organisation's people's documents are kept. If nothing is set, the "Storage location" is "This server"; you can also choose a SharePoint document library. A new location applies to documents kept after the change, and documents already kept stay where they were.

## The "Secrets" tab

This is where secrets such as API keys, tokens and passwords are handed to agents and units without passing through a room or a record. Each place in the tree has one secret space.

- **"Me":** your own space. "Secrets" in "Settings" leads here too.
- **Companies and organisations:** that organisation's space, looked after by its heads and the platform administrator. Keys entered under "Organization supply keys" on the "Agents" tab are kept here by name as well.
- **"Whole platform":** where the secrets the whole deployment uses are kept. Only the platform administrator opens it.

Wherever you are, the list under "Stored secrets" shows only each secret's name, size and when it last changed; a value never appears again on any screen. Add a new secret with "Add secret", change its value with "Replace", and when you "Delete" one, its previous value is kept once more. Agents and settings are handed only a secret's name, so the value never ends up in a conversation.

## Good to know

- "Create invite link" makes a link with a name, organisation, role and expiry, and copies it at once. The person who receives it sets a name, ID and password at the link to create their account, and connects their own machine.
- Once the account is ready, that person's own BMO, private room and the agents given by the "Signup setup" are created automatically.
- A concurrent post doesn't pass that organisation's settings on to the person. Settings come down through the organisation they belong to.
