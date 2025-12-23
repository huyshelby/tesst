# Revenue Dashboard Quick Fix Checklist

## ⚡ Quick Diagnosis (1 minute)

```bash
cd backend
npm run debug-revenue
```

### ✅ If you see:
```
✅ DELIVERED Orders (last 30 days): 15
💰 Total Revenue (30 days): 45,000,000đ
```
→ **Data is OK!** Problem is in frontend. Go to [Frontend Checks](#frontend-checks)

### ❌ If you see:
```
⚠️ NO DELIVERED ORDERS IN LAST 30 DAYS!
```
→ **Data issue!** Go to [Quick Fix](#quick-fix)

---

## 🔧 Quick Fix (30 seconds)

```bash
npm run fix-revenue
```

**This will:**
1. Find recent paid orders
2. Update status to DELIVERED
3. Show total revenue

**Then refresh admin dashboard** → Revenue should display! 🎉

---

## 🔍 Frontend Checks

If data is OK but dashboard still shows 0:

### 1. Backend running?
```bash
# Terminal should show:
Server running on http://localhost:4000
```

### 2. Admin logged in?
- Open admin dashboard
- Should NOT redirect to /login
- Check localStorage for `auth_token`

### 3. API call succeeds?
- Open DevTools → Network tab
- Reload dashboard
- Look for: `GET /api/dashboard/stats`
- Status should be **200 OK**

### 4. Response has data?
Click the API call → Preview tab:
```json
{
  "revenue": {
    "total": 45000000  ← Should be > 0
  }
}
```

### 5. Environment variables?
Check `admin-dashboard/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🐛 Common Errors

### Error: "Token expired"
**Fix:** Re-login in admin dashboard

### Error: "CORS"
**Fix:** Check `backend/src/app.ts`:
```typescript
cors({
  origin: ["http://localhost:3000", "http://localhost:3001"]
})
```

### Error: "404 Not Found"
**Fix:** Backend not running or wrong API_URL

### Error: Data not updating
**Fix:** Hard refresh (Ctrl+Shift+R)

---

## 📋 Full Testing Steps

### Backend Test
```bash
cd backend

# 1. Debug
npm run debug-revenue

# 2. Fix if needed
npm run fix-revenue

# 3. Start server
npm run dev
```

### Frontend Test
```bash
cd admin-dashboard

# 1. Check env
cat .env.local  # or type .env.local on Windows

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3001

# 4. Login
# admin@example.com / admin123

# 5. Check Dashboard
# Revenue should display
```

---

## 📚 Documentation

- **Full Guide:** [REVENUE_DEBUG_GUIDE.md](REVENUE_DEBUG_GUIDE.md)
- **Summary:** [REVENUE_FIX_SUMMARY.md](REVENUE_FIX_SUMMARY.md)
- **API Tests:** [backend/test-revenue-debug.http](backend/test-revenue-debug.http)

---

## 🎯 Expected Result

### Dashboard should show:

```
┌────────────────────────┐
│ Doanh thu (30 ngày)    │
│ 45tr đ      ↗ +25.5%  │
└────────────────────────┘

Chart:
  ╱─╲
 ╱   ╲    ╱─╲
╱     ╲  ╱   ╲
       ╲╱     ╲
```

---

## ❓ Still Not Working?

Run full diagnostic:
```bash
cd backend
npm run debug-revenue > debug.txt
```

Share `debug.txt` + screenshot of:
1. Network tab (API call)
2. Console errors
3. Dashboard page
