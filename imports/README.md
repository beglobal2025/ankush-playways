# Bulk imports

## Category import

The indoor category CSV is:

```txt
imports/indoor-categories.csv
```

Optional category images go here:

```txt
imports/category-images/
```

Image filenames must match the `imageFile` column in the CSV, for example:

```txt
imports/category-images/classroom-furniture.jpg
imports/category-images/play-equipment.jpg
imports/category-images/slides-swings.jpg
```

Run a dry run first:

```bash
npm run import:categories -- --dry-run
```

Run the actual import without images:

```bash
npm run import:categories
```

Upload images during import only when the image files are ready:

```bash
npm run import:categories -- --with-images
```

The script upserts categories by `slug`, so it is safe to rerun. Existing rows are updated instead of duplicated.

If `imageFile` is filled in and `--with-images` is used, the script uploads that file to Supabase Storage and saves the public URL in `Category.imageSrc`.

Required environment variables:

```env
DATABASE_URL="..."
NEXT_PUBLIC_SUPABASE_URL="..."
SUPABASE_SERVICE_ROLE_KEY="..."
SUPABASE_STORAGE_BUCKET="ankushplayways_storage"
SUPABASE_STORAGE_PREFIX="uploads"
```

`SUPABASE_SERVICE_ROLE_KEY` is only for trusted server/local scripts. Never expose it in browser code and never prefix it with `NEXT_PUBLIC_`.
