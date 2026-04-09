# TODO: Add vendorId to Product table

- [x] Step 1: Update prisma/schema.prisma with vendorId field, relation to User, and back-relation.
- [x] Step 2: Run `npx prisma migrate dev --name add_vendor_id_to_product` (ongoing)

- [x] Step 3: Run `npx prisma generate` (after cache clean)

- [x] Step 4: Review/update prisma/seed.js if needed for vendorIds (no change needed)

- [x] Step 5: Test schema with `npx prisma studio` (open http://localhost:5555)

- [ ] Step 6: Update any API code (e.g., index.js) for new field
- [ ] Complete
