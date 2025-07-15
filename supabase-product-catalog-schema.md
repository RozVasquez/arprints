# Supabase Product Catalog Schema & Setup

## 1. SQL Schema for `products` Table

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  types jsonb not null, -- Array of types, each with type name, quantities, and image paths
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_products_updated_at
before update on products
for each row
execute procedure update_updated_at_column();
```

### Field Explanations
- `id`: Unique identifier (UUID).
- `name`: Product name (e.g., "Photo card").
- `types`: JSONB array, e.g.:

```json
[
  {
    "type": "3D",
    "quantities": [
      { "quantity": 9, "price": 90 },
      { "quantity": 18, "price": 140 }
    ],
    "images": [
      "Photo card/3D/img1.jpg",
      "Photo card/3D/img2.jpg"
    ]
  },
  {
    "type": "Matte",
    "quantities": [
      { "quantity": 9, "price": 80 }
    ],
    "images": [
      "Photo card/Matte/img1.jpg"
    ]
  }
]
```
- `created_at`, `updated_at`: Timestamps for record keeping.

---

## 2. Supabase Storage Bucket Setup

- **Bucket name:** `product-catalog`
- **Folder structure:**  
  `product-catalog/{Product Name}/{Type Name}/{image files}`

**Example:**  
`product-catalog/Photo card/3D/img1.jpg`

### How to Set Up in Supabase

1. **Create the storage bucket:**
   - Go to Supabase dashboard → Storage → Create bucket → Name: `product-catalog` (public or with RLS as needed).

2. **Run the SQL above** in the SQL editor to create the `products` table.

---

## 3. (Optional) RLS (Row Level Security) & Policies
- Enable RLS on the `products` table and set policies as needed for your app.
- Set public/private access on the `product-catalog` bucket as needed.

---

## 4. Example Insert

```sql
insert into products (name, types) values (
  'Photo card',
  '[{"type": "3D", "quantities": [{"quantity": 9, "price": 90}, {"quantity": 18, "price": 140}], "images": ["Photo card/3D/img1.jpg"]}, {"type": "Matte", "quantities": [{"quantity": 9, "price": 80}], "images": ["Photo card/Matte/img1.jpg"]}]'
);
```

---

## 5. Querying Example

- To get all products:
  ```sql
  select * from products;
  ```
- To filter by type or quantity, use JSONB operators in SQL or filter in your app code.

---

## 6. Notes
- The `types` field is flexible and can be expanded to include more fields as needed.
- Images are referenced by their storage path in the bucket.
- Adjust RLS and storage policies for your security needs. 

---

## **1. Confirm RLS is Enabled**
Run this in the Supabase SQL editor:
```sql
alter table products enable row level security;
```

---

## **2. Add a Public Insert Policy (for Testing)**
This policy allows anyone (including your frontend) to insert rows:

```sql
create policy "Allow public insert for products"
on products
for insert
to public
using (true);
```

---

## **3. Check for Other Policies**
- If you have other policies (especially more restrictive ones), they may override or block access.
- You can list all policies for the table:
  ```sql
  select * from pg_policies where tablename = 'products';
  ```

---

## **4. Make Sure You’re Using the Correct API Key**
- If you’re using the anon/public key in your frontend, the policy must allow the `public` role.
- If you want to restrict to authenticated users, use:
  ```sql
  create policy "Authenticated insert"
  on products
  for insert
  to authenticated
  using (auth.role() = 'authenticated');
  ```

---

## **5. Try Disabling RLS Temporarily (for Debugging)**
**Not recommended for production, but useful for debugging:**
```sql
alter table products disable row level security;
```
- If inserts work with RLS disabled, the issue is definitely with your policies.

---

## **6. Double-Check Table Name and Policy Application**
- Make sure you’re applying the policy to the correct table (`products`).
- If you renamed the table or are using a different schema, adjust accordingly.

---

## **7. Example: Full Setup for Public Insert**
```sql
<code_block_to_apply_changes_from>
```

---

## **8. After Policy Change:**
- Refresh your Supabase dashboard.
- Try your insert again from your app.

---

## **If It Still Fails:**
- Double-check for typos in table or policy names.
- Make sure your Supabase client is pointing to the correct project.
- Check the Supabase logs for more detailed error messages.

---

**Let me know if you want a more secure policy, or if you want to restrict inserts to authenticated users only! If you paste the exact error message, I can help debug further.** 