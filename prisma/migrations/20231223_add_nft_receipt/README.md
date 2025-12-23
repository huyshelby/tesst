# Add NFT Receipt System

This migration adds support for NFT-based order receipts in the e-commerce system.

## Changes

1. Added `NFTReceipt` model with necessary fields and relationships
2. Created indexes for optimized queries
3. Added relations to existing `Order` and `User` models

## Migration Notes

- The `orderHash` field is stored as a string for compatibility with Prisma
- `tokenId` is stored as BigInt to support large token IDs
- All relevant fields are indexed for query performance

## Rollback

To rollback this migration, run:
```bash
npx prisma migrate down
```

## Verification

After migration, verify:
1. The `NFTReceipt` table is created with correct columns
2. Foreign key constraints are properly set up
3. Indexes are created for performance
4. Relations to `Order` and `User` tables work as expected
