# Documentation Rules for Landing V2 Monorepo

## Documentation Location

All documentation files (`.md` files) should be placed in the appropriate `docs/` directory within each app or package:

- **Ekza app**: `apps/ekza/docs/` - All Ekza-specific documentation goes here
- **Wotori app**: `apps/wotori/docs/` - All Wotori-specific documentation goes here
- **Shared packages**: `packages/<package-name>/docs/` - Package-specific documentation

## Rules

1. **Never place documentation in project root** - Always use the `docs/` subdirectory
2. **Use descriptive filenames** - Use kebab-case (e.g., `newsletter-setup.md`, `api-integration.md`)
3. **Write in English** - This is an international repository
4. **Include README.md** - Each `docs/` directory should have a README.md explaining its contents
5. **Update references** - When moving documentation, update all references in code and other docs

## Examples

✅ **Correct:**
- `apps/ekza/docs/newsletter-setup.md`
- `apps/wotori/docs/deployment.md`
- `packages/ui/docs/component-guidelines.md`

❌ **Incorrect:**
- `apps/ekza/NEWSLETTER_SETUP.md` (in root)
- `NEWSLETTER_SETUP.md` (in monorepo root)
- `apps/ekza/src/docs/setup.md` (mixed with source code)

## When Creating Documentation

When asked to create documentation:

1. Check if a `docs/` directory exists in the target app/package
2. If not, create it
3. Place the documentation file in `docs/`
4. Update the `docs/README.md` to reference the new file
5. Use relative paths when referencing other files (e.g., `../supabase/migrations/...`)
