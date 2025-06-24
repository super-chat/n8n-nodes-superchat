# n8n-nodes-superchat
![](./superchat.png)

This is an n8n community node. It lets you integrate **Superchat** into your n8n workflows.

**Superchat** is a unified messaging platform that enables sending and receiving messages across WhatsApp, Instagram Direct, Facebook Messenger, SMS, email, Live Chat, and more. Our Superchat app in n8n supports managing contacts, conversations, notes, files, channels, labels, and more.

[n8n](https://n8n.io/) is a [fair‑code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

---

## Operations

This node supports operations on the following six resources:

### User
- **Me** — Retrieve details about the authenticated Superchat user.

### Contact
- **Create** — Create a new contact.
- **Search** — Search for contacts by email, phone, or Instagram handle.
- **Update** — Update a contact's information.
- **Delete** — Delete a contact by its ID.
- **Get Conversations** — Fetch all conversations associated with a contact.

### Message
- **Send Message** — Send a text or media message to a contact.
- **Send Mail** — Send an email, with optional attachments, to a contact.
- **Send WhatsApp Template** — Send a pre-approved WhatsApp template message.

### Conversation
- **Get** — Retrieve a conversation by its ID.
- **Delete** — Delete a conversation by its ID.
- **Update Labels** — Update the labels for a conversation.
- **Update Status** — Update the status of a conversation (e.g., open, done, snoozed).
- **Update Assignees** — Update the users assigned to a conversation.

### Note
- **Create** — Add a new note to a conversation.
- **Get** — Retrieve a specific note from a conversation.
- **Delete** — Delete a specific note from a conversation.

### File
- **Create (upload)** — Upload a binary file to Superchat.
- **Download** — Download a file by its ID.
- **Delete** — Delete a file by its ID.

---

## Credentials

**Superchat API**

1. Log into your Superchat Account.
2. Go to Settings > Explore Integrations > Click the n8n card
3. Click 'Add' and copy the API key.
4. Add a n8n action or trigger and enter your Superchat API key in the credentials section.

---

## Compatibility

Tested with:
- **n8n v1.97.1**

---

## Usage

1. Install n8n-nodes-superchat via the community nodes installer.
2. Add the Superchat node to your n8n workflow.
3. Configure credentials using your Superchat API key.
4. Select a resource (User, Contact, Message, Conversation, Note, or File).
5. Choose the desired operation.
6. Fill in required fields (e.g. recipient info, message content).
7. Execute the workflow to send messages, manage contacts/conversations, and upload/download files.

---

## Resources

- [Superchat API Documentation](https://developers.superchat.com/) 
- [Getting Started Guide](https://developers.superchat.com/docs/getting-started-send-your-first-message)
- [Superchat Help Centre](https://help.superchat.com)

