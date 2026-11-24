---
title: "Account security"
description: "Password recovery, email verification, two-step verification, signed-in devices and sign-in protection, account actions by administrators and heads, and the platform's system mail."
order: 11
shots: []
---

## What protects your account

Besides your password, several safeguards protect your account. You see and manage your own status for all of them in "Security" under "Account" in "Settings".

| Item | What it does |
|---|---|
| "Email verification" | Confirms the email in your profile is yours by sending a link to it. Reset links and security notices go only to a verified email |
| "Two-step verification" | Asks for a six-digit code from an authenticator app after your password when you sign in |
| "Signed-in devices" | The list of browsers signed in right now, and signing them out |
| "Sign-in history" | Your last 20 sign-in attempts and their results |

Features that need mail send it only when the platform administrator has set up system mail (see "System mail" below).

## If you forget your password

Click "Forgot your password?" on the sign-in screen, write your "ID or email", and click "Send reset link".

- If the account has a verified email, the link goes out by mail. The link can be used once, within 30 minutes.
- The screen shows the same single line whether or not the account exists, so it can't be used to find out whose accounts exist. People without an email ask an administrator.
- At the link, write a new password (8 characters or more) twice and click "Change password": every device that was signed in is signed out, and a mail says the password was changed.

## Two-step verification

- **Turning it on:** click "Set up" at "Two-step verification" in "Security", and a QR code appears with its secret value below it. Register it in your authenticator app, enter the six-digit "Verification code" and "Confirm", and ten recovery codes are shown, once only. Keep them with "Copy" or "Download". The server makes the QR code itself, so the secret value never goes to another site.
- **Signing in:** once the password is right, the same screen asks for the "Verification code". Turn on "Remember this device (30 days)" and that browser won't ask for a code for 30 days; if you don't have your phone, use one recovery code with "Use a recovery code".
- **Managing it:** while it is on, the menu has "New recovery codes" and "Turn off". Turning it off asks for your password again.
- **When your organisation requires it:** people in an organisation with "Require two-step verification" turned on, on the organisation screen's "Security" tab, can't turn it off, and if they don't have it yet they are taken straight to set it up after signing in.

## Signed-in devices

"Signed-in devices" shows, line by line, the browser and operating system, the address with only its first part visible, and "Last active". The device you are using is marked "This device"; end other devices one at a time with "Sign out", or all at once with "Sign out all other devices". Changing your password signs out every device except the current one.

## Sign-in protection

- **Repeated failures mean waiting.** From the third failure with the same ID within 15 minutes, you have to wait a growing time before the next try, such as 2, 4 or 8 seconds, and at the tenth failure the account is locked for 15 minutes. The screen shows "Try again in a moment" or "The account is locked for a while" with the time left. Many failures piling up from the same address are blocked the same way.
- **You are told by mail.** When the account is locked, and when you sign in from a new browser that has never signed in before, a notice goes to your verified email.
- **Nothing leaks.** A nonexistent ID and a wrong password get the same answer, so the sign-in screen can't be used to find out whether an account exists.
- Sign-in attempts are kept for 90 days, and you see your own in "Sign-in history".

## What administrators and heads do

Open a person on the organisation screen's "Users" tab, and "Security" under "Account" shows that person's email verification, two-step verification and whether they can sign in. The menu offers the following.

- **"Reset password":** done by administrators and the person's head. Nobody sets or sees the password. A one-time link (24 hours) is made and sent to the verified email; where mail can't be used, the link is shown once to be handed over directly. All of that person's sessions end.
- **"Reset two-step verification":** for someone who lost their phone, clears their two-step verification, recovery codes and remembered browsers. The person registers again.
- **"Disable account" and "Enable account":** for administrators only. A disabled account can't sign in, and all its sessions end.

Every action is kept in the person's history.

## System mail

Reset links, email verification and security notices go out as **system mail** the platform sends itself. The platform administrator sets the outgoing server, the from address and name, and the name of the server's sign-in secret on the "Mail" tab of "Platform settings". The server password is only in the secret store, and the mail service reads it by name. Mail goes out in the language the recipient uses in the console.

## Good to know

- Changing your email removes its verification, and a verification mail goes out again to the new address.
- Administrators who can reach the server directly can also set a password again with the account command of [bmo-web](https://github.com/ahas/bmo-web).
