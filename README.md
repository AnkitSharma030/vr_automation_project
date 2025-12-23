# Smart Lead Automation System

A full-stack Next.js application that processes lead names through the Nationalize.io API to enrich them with nationality detection, applies business logic based on confidence scores, and runs automated background tasks for CRM synchronization.

## 🎯 Features

- **Batch Lead Processing**: Submit multiple names at once for automatic enrichment
- **AI-Powered Nationality Detection**: Integrates with Nationalize.io API to predict nationality
- **Intelligent Status Assignment**: Automatically categorizes leads as "Verified" (>60% confidence) or "To Check"
- **Real-time Dashboard**: View all processed leads with live filtering
- **Background Automation**: Scheduled task that syncs verified leads every 5 minutes
- **Idempotent Design**: Ensures each lead is only synced once to prevent duplicates
- **Modern UI**: Beautiful dark-themed interface with smooth animations

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **External API**: Nationalize.io for nationality detection
- **Background Jobs**: node-cron for scheduling
- **Styling**: Vanilla CSS with modern design patterns

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB database (Atlas)
- npm package manager



## �️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AnkitSharma030/vr_automation_project.git
cd vr_automation_test1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string
```

**Getting MongoDB URI:**
- Sign up for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Click "Connect" → "Connect your application"
- Copy the connection string and replace `<password>` with your database password

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The background sync will automatically start running in the background as long as the dashboard tab is open.

## �📐 Architecture Overview

### Batch API Request Handling

The system uses **concurrent processing** to handle batch API requests efficiently:

1. **Input Parsing**: User submits comma-separated names via the frontend form
2. **Deduplication**: Backend removes duplicate names and filters empty entries
3. **Concurrent Enrichment**: Uses `Promise.all()` to call Nationalize.io API for all names **simultaneously**
4. **Business Logic**: Applies status rules based on probability scores (>60% = Verified)
5. **Batch Storage**: Saves all enriched leads to MongoDB in parallel

**Why Promise.all()?**
- **Speed**: All API calls execute concurrently rather than sequentially
- **Efficiency**: Completes batch processing in ~1-2 seconds instead of N * request_time
- **Reliability**: Individual failures don't block other requests
- **Scale**: Handles batches of 10-50 names without timeout issues

### Idempotency Strategy for Background Sync

To prevent duplicate CRM syncs, the system implements a **boolean flag pattern**:

1. **Database Field**: Each lead has a `synced` field (default: `false`)
2. **Query Filter**: Background job queries: `{ status: "Verified", synced: false }`
3. **Atomic Update**: Immediately after logging, updates `synced: true` for each lead
4. **Guarantee**: Once a lead is synced, it never appears in subsequent queries

**Benefits:**
- ✅ Simple and reliable
- ✅ No additional timestamp checks needed
- ✅ Easy to reset for testing (just set `synced: false`)

### System Flow Diagram

```
User Input → Frontend Form → API Route (/api/leads)
                                    ↓
                          Concurrent API Calls (Nationalize.io)
                                    ↓
                          Business Logic (>60% check)
                                    ↓
                            MongoDB Storage (synced: false)
                                    ↓
                          ← Return Results to Frontend
                                    ↓
                            Display in Table

Every 5 minutes:
Background Job → API Route (/api/sync)
                       ↓
              Find { status: "Verified", synced: false }
                       ↓
              Log to Console (CRM Simulation)
                       ↓
              Update { synced: true }
```

## 📡 API Endpoints

### POST /api/leads
Process a batch of names.

**Request:**
```json
{
  "names": ["Peter", "Aditi", "Ravi", "Satoshi"]
}
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "leads": [
    {
      "name": "Peter",
      "country": "DE",
      "probability": 0.75,
      "status": "Verified",
      "synced": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /api/leads
Retrieve all leads with optional filtering.

**Query Parameters:**
- `status`: Filter by "Verified" or "To Check"

**Example:**
```bash
GET /api/leads?status=Verified
```

## 🗄️ Database Schema

### Lead Collection

```javascript
{
  name: String,          // Lead's first name
  country: String,       // ISO country code (e.g., "US", "IN")
  probability: Number,   // Confidence score (0.0 - 1.0)
  status: String,        // "Verified" or "To Check"
  synced: Boolean,       // Idempotency flag for CRM sync
  createdAt: Date        // Timestamp
}
```

## 🎨 UI Features

- **Form Section**: Submit batch names with real-time validation
- **Filter Bar**: Quick toggle between All, Verified, and To Check leads
- **Results Table**: 
  - Visual confidence bars (green for >60%, yellow for ≤60%)
  - Color-coded status badges
  - Responsive design for mobile devices
- **Loading States**: Smooth spinners during API calls
- **Empty States**: Helpful messages when no data exists

## 🧪 Testing

### Manual Testing

1. **Submit Names:**
   - Enter: "Peter, Aditi, Ravi, Satoshi"
   - Click "Process Names"
   - Verify results appear in table

2. **Test Filtering:**
   - Click "Verified" filter
   - Verify only high-confidence leads show
   - Click "To Check" filter
   - Verify only low-confidence leads show

3. **Test Background Sync:**
   - Wait 5 minutes 
   - Check terminal logs for: `[CRM Sync] Sending verified lead...`
   - Run again and verify no duplicate logs

### API Testing with cURL

```bash
# Test batch processing
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"names": ["Peter", "Aditi"]}'

# Test filtering
curl http://localhost:3000/api/leads?status=Verified


## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── leads/route.js     # Lead processing endpoints
│   │   └── sync/route.js      # Background sync endpoint
│   ├── page.js                # Main dashboard
│   └── globals.css            # Styling
├── components/
│   ├── LeadForm.jsx           # Input form
│   ├── FilterBar.jsx          # Status filter
│   └── LeadsTable.jsx         # Results table
├── lib/
│   ├── mongodb.js             # Database connection
│   └── nationalize.js         # API integration
└── models/
    └── Lead.js                # Mongoose schema

```

### Adding New Features

**Add a new field to leads:**
1. Update `src/models/Lead.js` schema
2. Modify `src/lib/nationalize.js` to include data
3. Update `src/components/LeadsTable.jsx` to display
4. Update database migration if needed


Created for VR Automations Developer Test

---

**Live URLs:**
- Project Link: https://vr-automation-project.vercel.app/
- GitHub: https://github.com/AnkitSharma030/vr_automation_project.git
