# Version v0.3.0

- Add support for note attachments.
- Allow `null` as a value for all contact attributes.

Internal changes:

- Migrate from tsup to tsdown for build tooling.

# Version v0.2.6

Updated the description of the Superchat Node.

# Version v0.2.5

- Update the names and placeholder values of some fields.
- Add `usableAsTool` to the Superchat Node.
- Implement the `continueOnFail` method.

Internal changes:

- Remove the usage of `process.env` and `process.define`.
- Use the `httpRequestWithAuthentication` method instead of the deprecated `requestWithAuthentication` method.

# Version v0.2.4

Move the `headerFileId` parameter of the `sendWhatsAppTemplate` operation.

# Version v0.2.3

Only allow selecting approved templates for the `sendWhatsAppTemplate` operation.

# Version v0.2.2

No public facing changes were made in this release.

Internal changes:

- Move code from src/ to root directory

# Version v0.2.1

No public facing changes were made in this release.

Internal changes:

- Remove `ts-pattern` dependency

# Version v0.2.0

Initial release of the Superchat node for n8n.

Operations:

- Retrieve details about the authenticated Superchat user.
- Create, search, update, and delete contacts.
- Fetch all conversations associated with a contact.
- Send text or media messages, emails (with optional attachments), and WhatsApp template messages.
- Retrieve, delete, and update conversations (labels, status, and assignees).
- Add, retrieve, and delete notes within conversations.
- Upload, download, and delete binary files.

Note: Version 0.1.0 was skipped because it was accidentally published to npm.

# Version v0.0.1-rc.2

Internal pre-release

# Version v0.0.1-rc.1

Internal pre-release

# Version v0.0.1-rc.0

Internal pre-release
