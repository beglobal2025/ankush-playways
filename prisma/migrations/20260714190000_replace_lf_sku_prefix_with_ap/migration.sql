UPDATE "Product"
SET
  "code" = regexp_replace("code", '^LF', 'AP'),
  "slug" = regexp_replace("slug", '^lf', 'ap'),
  "name" = replace("name", 'LF', 'AP'),
  "specifications" = replace("specifications"::text, 'LF', 'AP')::jsonb,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" LIKE 'LF%';

UPDATE "ProductImage"
SET
  "alt" = replace("alt", 'LF', 'AP'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "alt" LIKE '%LF%';

UPDATE "ProductColorOption"
SET
  "imageAlt" = replace("imageAlt", 'LF', 'AP'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "imageAlt" LIKE '%LF%';
