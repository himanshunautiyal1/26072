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
