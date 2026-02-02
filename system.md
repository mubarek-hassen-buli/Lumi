1. System Overview

This platform allows users to paste messy, unstructured client conversations such as chats, notes, or transcripts and converts them into professional business documents like contracts, proposals, or SOWs using AI.

High level flow:
User logs in → submits raw text → backend sends it to AI → AI returns structured legal style document → document is stored in database → user can view, edit, and export it.

Core transformation:
Unstructured text → structured meaning → formatted legal document.

2. Goals

The system should:

Convert informal text into professional documents

Support multiple document types
Contract
Proposal
SOW

Save generated documents per user

Be fast and simple to use

Require minimal user input

Allow users to regenerate or edit output

Be secure with authentication

Be scalable as a SaaS product

3. Non-Goals

The system should NOT:

Act as a real lawyer or provide legal advice

Guarantee legal validity in every country

Replace human review of contracts

Perform voice transcription itself

Handle payments or billing in MVP

Provide e-signature in MVP

Do real time collaboration

Detect fraud or verify identities

Automatically send contracts to clients

These can be future features, but not in MVP.

4. What each stack should do and should NOT do
Next.js (Frontend)

Should do:

Render UI pages

Handle routing

Display forms and editors

Show generated contracts

Manage user dashboard

Integrate with BetterAuth client

Call backend APIs

Should NOT do:

Talk directly to Gemini

Store secrets

Perform heavy business logic

Validate legal rules

Access database directly

Hono (Backend API)

Should do:

Expose API routes

Validate request input

Call Gemini AI

Format AI response

Save and fetch data from DB

Protect routes with auth middleware

Should NOT do:

Render UI

Store frontend state

Perform AI prompt UI logic

Handle session UI

Gemini 2.5 Flash (AI)

Should do:

Extract structured information

Generate professional documents

Rewrite informal text

Follow templates

Adjust tone per document type

Should NOT do:

Make legal guarantees

Store data

Authenticate users

Decide permissions

Replace human validation

Neon (Postgres Database)

Should do:

Store users

Store raw inputs

Store generated contracts

Store timestamps

Store document type

Store ownership relations

Should NOT do:

Generate documents

Authenticate users

Talk to AI

Store secrets in plaintext

Drizzle ORM

Should do:

Define schema

Query database safely

Enforce types

Migrate tables

Should NOT do:

Contain business logic

Perform auth

Generate AI output

BetterAuth (Authentication)

Should do:

Handle login

Handle register

Handle sessions

Protect routes

Provide user identity

Should NOT do:

Store contracts

Generate documents

Call AI

Control UI layout

Zustand (Client State)

Should do:

Store temporary UI state

Store current input

Store generated contract

Store loading flags

Should NOT do:

Fetch server data directly

Replace database

Handle authentication

Store secrets

TanStack Query

Should do:

Handle API requests

Cache responses

Manage loading and error state

Refetch automatically

Sync server data

Should NOT do:

Store UI only state

Generate documents

Replace Zustand

Manage sessions