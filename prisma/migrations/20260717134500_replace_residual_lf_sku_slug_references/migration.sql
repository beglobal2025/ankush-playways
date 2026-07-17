UPDATE "Product"
SET
  "slug" = replace(
    replace(
      replace(
        replace("slug", 'lfo', 'apo'),
        'lft', 'apt'
      ),
      'lfp', 'app'
    ),
    'lf', 'ap'
  ),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" ~ '(^|-)lf(t|p|o)?(-|[0-9])';
