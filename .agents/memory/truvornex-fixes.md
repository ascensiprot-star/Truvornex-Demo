---
name: Truvornex import fix patterns
description: How to fix the broken data-fetching patterns caused by stripped Base44 API calls in the Truvornex/ServiceFlow project
---

## Rule
All data-fetching in this project was originally `Promise.all([API.Model.list(), ...])`. When imported, the API calls were stripped, leaving empty `Promise.all([])` or dangling `set*(undefinedVar)` patterns that crash at runtime.

**How to apply:** For any broken pattern, replace with empty-array/null initializers and setLoading(false):
- `Promise.all([]).then(([a, b]) => { setA(a); setB(b); })` → `setA([]); setB([]); setLoading(false);`
- `const [a, b] = await Promise.all([]);` → `const a = [], b = [];` or `setA([]); setB([]);`
- `setFoo(x);` where `x` is undefined → `setFoo([]);` or `setFoo(null);`
- Empty `useEffect(() => {}, [])` where state has `loading: true` → add `setFoo([]); setLoading(false);`

**Why:** Base44 platform API calls were removed during export/import, leaving syntactically-valid but semantically-broken JS that resolves to undefined destructuring.

Supabase must be configured via `.env.local` (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) for real data to flow.
