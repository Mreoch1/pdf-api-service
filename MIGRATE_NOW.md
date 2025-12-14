# Run Database Migrations - Quick Guide

## ✅ Easiest Method: Supabase Dashboard (2 minutes)

1. **Open SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new

2. **Copy Migration SQL:**
   ```bash
   cd /Users/michaelreoch/pdf-api-service
   cat scripts/setup-migrations.sql
   ```
   - Copy ALL the output

3. **Paste and Run:**
   - Paste into the SQL Editor
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

4. **Verify:**
   - Go to "Table Editor" in Supabase
   - You should see: `api_keys`, `usage_logs`, `subscriptions`, `user_metadata`

## 🔧 Alternative: psql (if you have the correct password)

If you have the database password:

```bash
cd /Users/michaelreoch/pdf-api-service
./scripts/run-migrations-psql.sh
```

**Get your password from:**
https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/settings/database

---

**After migrations, you're ready to test!** 🚀

