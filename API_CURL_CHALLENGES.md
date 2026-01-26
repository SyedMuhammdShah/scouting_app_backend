# Challenge & Game API CURL Commands

**Base URL:** `http://localhost:5000/api`

---

## 1. Send a Challenge
Initiate a challenge from Player A to Player B.

```bash
curl --location 'http://localhost:5000/api/challenges' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <PLAYER_A_TOKEN>' \
--data '{
    "challengedId": "<PLAYER_B_USER_ID>",
    "type": "1v1",
    "locationPicker": "challenged",
    "notes": "Let'\''s play a quick match!",
    "timingWindow": {
        "start": "2026-01-25T10:00:00Z",
        "end": "2026-01-25T18:00:00Z"
    }
}'
```

---

## 2. Get My Challenges
List all incoming and outgoing challenges.

```bash
curl --location 'http://localhost:5000/api/challenges' \
--header 'Authorization: Bearer <YOUR_TOKEN>'
```

---

## 3. Respond to a Challenge     
Accept or Reject a pending challenge.

```bash
curl --location --request PATCH 'http://localhost:5000/api/challenges/<CHALLENGE_ID>/respond' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <PLAYER_B_TOKEN>' \
--data '{
    "status": "accepted"
}'
```

---

## 4. Finalize Challenge (Create Game)
Must be called by the user designated as `locationPicker`. Once finalized, a Game is automatically created.

```bash
curl --location --request PATCH 'http://localhost:5000/api/challenges/<CHALLENGE_ID>/finalize' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <PICKER_TOKEN>' \
--data '{
    "location": "Central Park Court 4",
    "date": "2026-01-25T16:00:00Z",
    "duration": 60
}'
```

---

## 5. Get Upcoming Games
View all scheduled games for the current user.

```bash
curl --location 'http://localhost:5000/api/games/upcoming' \
--header 'Authorization: Bearer <YOUR_TOKEN>'
```

---

## 6. Get Game Details

```bash
curl --location 'http://localhost:5000/api/games/<GAME_ID>' \
--header 'Authorization: Bearer <YOUR_TOKEN>'
```
