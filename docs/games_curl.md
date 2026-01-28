# Games Module API cURL Commands

Base URL: `http://localhost:5000/api/games`

> [!NOTE]
> Replace `YOUR_TOKEN_HERE` with a valid JWT token obtained from the Auth Login endpoint.
> Replace `:id`, `:userId` with actual IDs from database responses.

## 1. List Games
Fetch a list of games with optional filters.

```bash
curl --location --request GET 'http://localhost:5000/api/games?status=OPEN' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## 2. Create Game
Create a new game with all details.

```bash
curl --location --request POST 'http://localhost:5000/api/games' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE' \
--data-raw '{
    "quickSetup": {
        "isPrivate": false,
        "enableChat": true,
        "enablePayment": true,
        "copyPreviousGame": false,
        "backgroundImage": "https://example.com/image.jpg"
    },
    "details": {
        "title": "Sunday League Match",
        "description": "Friendly match for everyone",
        "location": "Central Park",
        "coordinates": {
            "lat": 40.785091,
            "long": -73.968285
        }
    },
    "schedule": {
        "date": "2023-12-25",
        "time": "18:00",
        "duration": "90 mins",
        "playersNeeded": 10
    },
    "rules": {
        "groundType": "Turf",
        "matchFormat": "5v5",
        "gender": "Mix",
        "ageRange": {
            "from": 18,
            "to": 40
        }
    },
    "payment": {
        "level": "Amateur",
        "option": "Cash",
        "price": 0,
        "currency": "USD"
    }
}'
```

## 3. Get Game Details
Get information about a specific game.

```bash
curl --location --request GET 'http://localhost:5000/api/games/:id' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## 4. Request to Join Game
Send a request to join a specific game.

```bash
curl --location --request POST 'http://localhost:5000/api/games/:id/join' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## 5. List Join Requests
**Host Only**: View all pending requests for a game.

```bash
curl --location --request GET 'http://localhost:5000/api/games/:id/requests' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## 6. Respond to Join Request
**Host Only**: Accept or reject a user's request.

**Accept:**
```bash
curl --location --request PATCH 'http://localhost:5000/api/games/:id/requests/:userId' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE' \
--data-raw '{
    "action": "accept"
}'
```

**Reject:**
```bash
curl --location --request PATCH 'http://localhost:5000/api/games/:id/requests/:userId' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE' \
--data-raw '{
    "action": "reject"
}'
```
