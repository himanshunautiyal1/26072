# Stage 1

## Goal

Design simple REST APIs for a campus notifications platform so a frontend app can show notifications to logged-in users. Include request/response formats

## Base URL

`/api`

## Common Headers

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`

## Data Shape (Notification)

json
{
"id": "123",
"title": "Placement drive update",
"message": "Company ABC shortlists are out.",
"category": "placements",
"createdAt": "2026-05-04T10:15:00Z",
"read": false
}

## Endpoints

### 1) Get notifications

GET -> `/notifications`

Response (200):
json
{
{
"id": "123",
"title": "Placement drive update",
"message": "Company ABC shortlists are out.",
"category": "placements",
"createdAt": "2026-05-04T10:15:00Z",
"read": false
}

}

### 2) Mark one notification as read

PATCH -> `/notifications/{id}/read`

Request body:
json
{
"read": true
}

Response (200):
json
{
"id": "123",
"read": true
}

### 3) Mark all as read

PATCH -> `/notifications/read-all`

Request body:
json
{
"read": true
}

Response (200):
json
{
"updated": 12
}

### 4) Create notification (admin/system use)

POST -> `/notifications`

Request body:
json
{
"title": "Event reminder",
"message": "Hackathon starts at 9 AM tomorrow.",
"category": "events"
}

Response (201):
json
{
"id": "456",
"title": "Event reminder",
"message": "Hackathon starts at 9 AM tomorrow.",
"category": "events",
"createdAt": "2026-05-04T11:10:00Z",
"read": false
}

# Stage 2

## DB choice

I suggest PostgreSQL. It is reliable, easy to query, and good for structured data with filters like category, read, and time.

## Schema (simple)

Table: notifications

- id (text, primary key)
- user_id (text)
- title (text)
- message (text)
- category (text)
- created_at (timestamp)
- read (boolean)

Indexes:

- index on (user_id, created_at desc)
- index on (user_id, read)
- index on (user_id, category)

## Problems with large data

- Queries can become slow without good indexes.
- Table size will grow fast over semesters.
- Pagination can become heavy if using large offsets.

## How to solve

- Add indexes.
- Delete old notifications after a month

## Sample SQL

Create notification (POST /notifications):

sql--
INSERT INTO notifications (id, user_id, title, message, category, created_at, read)
VALUES ('456', 'user_1', 'Event reminder', 'Hackathon starts at 9 AM tomorrow.', 'events', NOW(), false);

Get notifications (GET /notifications):

sql--
SELECT id, title, message, category, created_at, read
FROM notifications
WHERE user_id = 'user_1'
ORDER BY created_at DESC
LIMIT 10 ;

Mark one as read (PATCH /notifications/{id}/read):

sql--
UPDATE notifications
SET read = true
WHERE id = '123' AND user_id = 'user_1';

Mark all as read (PATCH /notifications/read-all):

sql
UPDATE notifications
SET read = true
WHERE user_id = 'user_1' AND read = false;

Filter by category (GET /notifications?category=events):

sql
SELECT id, title, message, category, created_at, read
FROM notifications
WHERE user_id = 'user_1' AND category = 'events'
ORDER BY created_at DESC
LIMIT 10 ;
