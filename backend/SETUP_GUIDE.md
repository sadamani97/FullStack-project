# 🚀 Backend & Frontend Setup Guide

## Changes Made

### Backend Updates ✅

1. **New Weather Model** (`models/weather.model.js`)
   - Stores user weather data with location coordinates
   - Linked to User via userId (CASCADE delete)
   - Fields: name, temp, condition, humidity, windSpeed, description, latitude, longitude

2. **Weather Controller** (`controllers/weatherController.js`)
   - GET /api/weather - Fetch all user weather
   - GET /api/weather/:id - Fetch specific weather
   - POST /api/weather - Create new weather entry
   - PUT /api/weather/:id - Update weather entry
   - DELETE /api/weather/:id - Delete weather entry

3. **Weather Routes** (`routes/weather.routes.js`)
   - All routes protected with authentication middleware

4. **Seed Script** (`scripts/seedCountries.js`)
   - Populates 12 countries with state population data
   - Includes: USA, India, China, UK, Germany, France, Japan, Brazil, Russia, Canada, Australia, Mexico

### Frontend Updates ✅

1. **Weather Page Enhancement** (`pages/weather.jsx`)
   - Save weather to backend database
   - Fetch user's saved weather on page load
   - Add, Update, Delete weather with backend persistence
   - Display database countries with populations
   - Real-time sync with backend

2. **Countries Details Page** (`pages/countries.jsx`)
   - Removed weather section
   - Enlarged pie chart (600x500px)
   - Better visualization of state populations
   - Only shows country details & state breakdown

3. **CSS Updates** (`App.css`)
   - Enhanced weather card styling
   - Responsive design for all screen sizes
   - Better chart display with increased size
   - Mobile-friendly adjustments

---

## 🔧 Setup Instructions

### Step 1: Install Backend & Seed Data

```bash
cd backend
npm install
# Then run seed script
npm run seed
```

Expected output:
```
✅ Sample countries with state data added successfully!
```

### Step 2: Start Backend Server

```bash
npm run dev
# or
npm start
```

Expected output:
```
Server is running on port 5000
Database synced
```

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 API Endpoints

### Weather Endpoints (Protected)
```
GET    /api/weather              - Get all user weather
GET    /api/weather/:id          - Get specific weather
POST   /api/weather              - Create weather
PUT    /api/weather/:id          - Update weather
DELETE /api/weather/:id          - Delete weather
```

### Country Endpoints (Protected)
```
GET    /api/countries            - Get all countries
GET    /api/countries/:id        - Get specific country
POST   /api/countries            - Create country
PUT    /api/countries/:id        - Update country
DELETE /api/countries/:id        - Delete country
```

---

## 🎯 Features

### Weather Page
- ✅ Add country weather (saves to backend)
- ✅ View all saved weather with full details
- ✅ Update weather for a country
- ✅ Delete weather entries
- ✅ Search & filter weather
- ✅ Display database countries with populations
- ✅ Responsive grid layout

### Countries Page
- ✅ View all countries
- ✅ Filter by region
- ✅ Add/Edit/Delete countries
- ✅ Responsive country cards

### Country Details
- ✅ View country info & flag
- ✅ NO weather display (moved to weather page)
- ✅ Large pie chart (600x500px)
- ✅ State population distribution
- ✅ Better visibility with outside labels

---

## 🌍 Sample Countries Data

12 countries with state population details:
1. **United States** - 5 states (California, Texas, Florida, NY, Pennsylvania)
2. **India** - 5 states (Uttar Pradesh, Maharashtra, Bihar, West Bengal, Madhya Pradesh)
3. **China** - 5 provinces (Guangdong, Shandong, Henan, Sichuan, Jiangsu)
4. **United Kingdom** - 4 regions (England, Scotland, Wales, Northern Ireland)
5. **Germany** - 5 states (NRW, Bavaria, Baden-Württemberg, Lower Saxony, Hesse)
6. **France** - 5 regions (Île-de-France, PACA, Auvergne-Rhône-Alpes, Occitanie, Nouvelle-Aquitaine)
7. **Japan** - 5 prefectures (Tokyo, Kanagawa, Osaka, Aichi, Hyogo)
8. **Brazil** - 5 states (São Paulo, Minas Gerais, Rio de Janeiro, Bahia, Paraná)
9. **Russia** - 5 regions (Moscow Oblast, St. Petersburg, Krasnodar Krai, Tatarstan, Sverdlovsk)
10. **Canada** - 5 provinces (Ontario, Quebec, BC, Alberta, Manitoba)
11. **Australia** - 5 states (NSW, Victoria, Queensland, WA, SA)
12. **Mexico** - 5 states (Mexico City, State of Mexico, Veracruz, Jalisco, Puebla)

---

## 🐛 Troubleshooting

### Database not syncing?
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run seed
```

### Weather API not responding?
- Check backend is running on port 5000
- Verify token is saved in localStorage
- Check browser console for errors

### Pie chart not showing?
- Make sure country has states data
- Chart requires `state.states` array with at least 1 item

---

## 📱 Responsive Breakpoints

- **Desktop**: Full layout (1024px+)
- **Tablet**: Stacked layout (768px - 1024px)
- **Mobile**: Single column (< 768px)

---

## ✅ Testing Checklist

- [ ] Backend starts successfully
- [ ] Seed script runs and adds 12 countries
- [ ] Frontend connects to backend
- [ ] Can add weather entry (saves to DB)
- [ ] Can view saved weather (fetches from DB)
- [ ] Can update/delete weather
- [ ] Countries page displays all countries
- [ ] Country details shows enlarged pie chart (no weather)
- [ ] Weather page shows saved weather + countries database
- [ ] Mobile responsive styling works

---

Good luck! 🎉
