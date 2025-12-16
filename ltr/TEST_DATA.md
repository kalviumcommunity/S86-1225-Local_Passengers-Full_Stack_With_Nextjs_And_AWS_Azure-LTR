# Sample Test Data for Local Train Passengers API

## Test Users

### Admin User
```json
{
  "email": "admin@ltr.com",
  "password": "Admin@123",
  "name": "Admin User",
  "phone": "+919876543210",
  "role": "ADMIN"
}
```

### Project Manager
```json
{
  "email": "pm@ltr.com",
  "password": "PM@123456",
  "name": "Project Manager",
  "phone": "+919876543211",
  "role": "PROJECT_MANAGER"
}
```

### Team Lead
```json
{
  "email": "teamlead@ltr.com",
  "password": "Lead@123",
  "name": "Team Lead User",
  "phone": "+919876543212",
  "role": "TEAM_LEAD"
}
```

### Regular Users
```json
{
  "email": "user1@ltr.com",
  "password": "User@123",
  "name": "John Doe",
  "phone": "+919876543213",
  "role": "USER"
}
```

```json
{
  "email": "user2@ltr.com",
  "password": "User@456",
  "name": "Jane Smith",
  "phone": "+919876543214",
  "role": "USER"
}
```

```json
{
  "email": "user3@ltr.com",
  "password": "User@789",
  "name": "Raj Kumar",
  "phone": "+919876543215",
  "role": "USER"
}
```

---

## Sample Indian Train Data

### Popular Express Trains

#### 1. Howrah Rajdhani Express (12301/12302)
```json
{
  "trainId": "12301",
  "trainName": "Howrah Rajdhani Express",
  "trainNumber": "12301",
  "source": "New Delhi",
  "destination": "Howrah Junction",
  "departureTime": "16:55",
  "arrivalTime": "10:05",
  "duration": "17h 10m",
  "distance": "1447 km",
  "type": "Rajdhani",
  "frequency": "Daily",
  "classes": ["1A", "2A", "3A"],
  "stops": [
    "New Delhi",
    "Kanpur Central",
    "Allahabad Junction",
    "Mughal Sarai Junction",
    "Asansol Junction",
    "Howrah Junction"
  ]
}
```

#### 2. Bhopal Shatabdi (12001/12002)
```json
{
  "trainId": "12002",
  "trainName": "Bhopal Shatabdi",
  "trainNumber": "12002",
  "source": "New Delhi",
  "destination": "Bhopal Junction",
  "departureTime": "06:00",
  "arrivalTime": "13:40",
  "duration": "7h 40m",
  "distance": "708 km",
  "type": "Shatabdi",
  "frequency": "Daily except Wednesday",
  "classes": ["CC", "EC"],
  "stops": [
    "New Delhi",
    "Gwalior Junction",
    "Jhansi Junction",
    "Bhopal Junction"
  ]
}
```

#### 3. Mumbai Rajdhani (12951/12952)
```json
{
  "trainId": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "trainNumber": "12951",
  "source": "Mumbai Central",
  "destination": "New Delhi",
  "departureTime": "16:25",
  "arrivalTime": "08:35",
  "duration": "16h 10m",
  "distance": "1384 km",
  "type": "Rajdhani",
  "frequency": "Daily",
  "classes": ["1A", "2A", "3A"],
  "stops": [
    "Mumbai Central",
    "Vadodara Junction",
    "Ratlam Junction",
    "Kota Junction",
    "New Delhi"
  ]
}
```

#### 4. Gatimaan Express (12049/12050)
```json
{
  "trainId": "12049",
  "trainName": "Gatimaan Express",
  "trainNumber": "12049",
  "source": "Hazrat Nizamuddin",
  "destination": "Jhansi Junction",
  "departureTime": "08:10",
  "arrivalTime": "11:50",
  "duration": "3h 40m",
  "distance": "403 km",
  "type": "Express",
  "frequency": "Daily except Friday",
  "classes": ["CC", "EC"],
  "stops": [
    "Hazrat Nizamuddin",
    "Agra Cantt",
    "Gwalior Junction",
    "Jhansi Junction"
  ]
}
```

#### 5. Chennai Rajdhani (12433/12434)
```json
{
  "trainId": "12433",
  "trainName": "Chennai Rajdhani Express",
  "trainNumber": "12433",
  "source": "New Delhi",
  "destination": "Chennai Central",
  "departureTime": "15:55",
  "arrivalTime": "19:45",
  "duration": "27h 50m",
  "distance": "2194 km",
  "type": "Rajdhani",
  "frequency": "Daily",
  "classes": ["1A", "2A", "3A"],
  "stops": [
    "New Delhi",
    "Bhopal Junction",
    "Nagpur Junction",
    "Vijayawada Junction",
    "Chennai Central"
  ]
}
```

### Mumbai Local Trains

#### 6. Western Line Local
```json
{
  "trainId": "91001",
  "trainName": "Churchgate - Virar Local",
  "trainNumber": "91001",
  "source": "Churchgate",
  "destination": "Virar",
  "departureTime": "07:15",
  "arrivalTime": "09:10",
  "duration": "1h 55m",
  "distance": "58 km",
  "type": "Local",
  "frequency": "Daily",
  "classes": ["SL", "FC"],
  "stops": [
    "Churchgate", "Marine Lines", "Charni Road", "Grant Road",
    "Mumbai Central", "Mahalaxmi", "Lower Parel", "Elphinstone Road",
    "Dadar", "Matunga Road", "Mahim", "Bandra", "Khar Road",
    "Santacruz", "Vile Parle", "Andheri", "Jogeshwari", "Ram Mandir",
    "Goregaon", "Malad", "Kandivali", "Borivali", "Dahisar",
    "Mira Road", "Bhayandar", "Naigaon", "Vasai Road", "Nallasopara",
    "Virar"
  ]
}
```

#### 7. Central Line Local
```json
{
  "trainId": "92001",
  "trainName": "CSMT - Kalyan Local",
  "trainNumber": "92001",
  "source": "Chhatrapati Shivaji Maharaj Terminus",
  "destination": "Kalyan",
  "departureTime": "08:30",
  "arrivalTime": "10:15",
  "duration": "1h 45m",
  "distance": "54 km",
  "type": "Local",
  "frequency": "Daily",
  "classes": ["SL", "FC"],
  "stops": [
    "CSMT", "Masjid", "Sandhurst Road", "Byculla", "Chinchpokli",
    "Currey Road", "Parel", "Dadar", "Matunga", "Sion",
    "Kurla", "Vidyavihar", "Ghatkopar", "Vikhroli", "Kanjurmarg",
    "Bhandup", "Nahur", "Mulund", "Thane", "Diva", "Dombivli",
    "Kalyan"
  ]
}
```

#### 8. Harbour Line Local
```json
{
  "trainId": "93001",
  "trainName": "CSMT - Panvel Local",
  "trainNumber": "93001",
  "source": "Chhatrapati Shivaji Maharaj Terminus",
  "destination": "Panvel",
  "departureTime": "09:00",
  "arrivalTime": "11:00",
  "duration": "2h 0m",
  "distance": "55 km",
  "type": "Local",
  "frequency": "Daily",
  "classes": ["SL", "FC"],
  "stops": [
    "CSMT", "Vadala Road", "Guru Tegh Bahadur Nagar", "Chunabhatti",
    "Kurla", "Tilak Nagar", "Chembur", "Govandi", "Mankhurd",
    "Vashi", "Sanpada", "Juinagar", "Nerul", "Seawoods",
    "Belapur CBD", "Kharghar", "Mansarovar", "Khandeshwar", "Panvel"
  ]
}
```

---

## Sample Alert Data

### Alert for Rajdhani Express
```json
{
  "trainId": "12301",
  "trainName": "Howrah Rajdhani Express",
  "source": "New Delhi",
  "destination": "Howrah",
  "alertType": "all"
}
```

### Alert for Shatabdi Express
```json
{
  "trainId": "12002",
  "trainName": "Bhopal Shatabdi",
  "source": "New Delhi",
  "destination": "Bhopal",
  "alertType": "delay"
}
```

### Alert for Mumbai Local
```json
{
  "trainId": "91001",
  "trainName": "Churchgate - Virar Local",
  "source": "Churchgate",
  "destination": "Virar",
  "alertType": "cancellation"
}
```

---

## Sample Reroute Data

### Reroute due to Track Maintenance
```json
{
  "trainId": "12301",
  "reason": "Track maintenance work",
  "alternateRoute": "Via Allahabad instead of Kanpur",
  "affectedStations": ["Kanpur Central", "Fatehpur"],
  "estimatedDelay": 45,
  "startDate": "2025-12-20",
  "endDate": "2025-12-25"
}
```

### Reroute due to Natural Disaster
```json
{
  "trainId": "12951",
  "reason": "Flooding on main route",
  "alternateRoute": "Via Surat-Bharuch-Vadodara",
  "affectedStations": ["Valsad", "Navsari"],
  "estimatedDelay": 90,
  "startDate": "2025-12-16",
  "endDate": "2025-12-18"
}
```

### Reroute due to Technical Issues
```json
{
  "trainId": "12002",
  "reason": "Signal failure at junction",
  "alternateRoute": "Via alternate platform at Gwalior",
  "affectedStations": ["Gwalior Junction"],
  "estimatedDelay": 30,
  "startDate": "2025-12-16",
  "endDate": "2025-12-16"
}
```

---

## Testing Workflow

1. **Register Users**: Use the auth/register endpoints to create test users with different roles
2. **Login**: Use auth/login to get authentication tokens
3. **Create Alerts**: Use the alerts endpoints to save train alerts for users
4. **Test Train APIs**: Query trains with various filters (source, destination, train number)
5. **Test Reroutes**: Create and query reroutes for trains
6. **Test User Management**: Update and delete users (requires appropriate permissions)

---

## Quick Test Commands

### Using cURL

#### Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ltr.com","password":"Test@123","name":"Test User","role":"USER"}'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ltr.com","password":"Test@123"}'
```

#### Get all trains:
```bash
curl http://localhost:3000/api/trains
```

#### Create an alert (requires authentication):
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"trainId":"12301","trainName":"Howrah Rajdhani","source":"Delhi","destination":"Howrah","alertType":"all"}'
```
