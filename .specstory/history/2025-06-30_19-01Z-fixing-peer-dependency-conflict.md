<!-- Generated by SpecStory -->

# Fixing peer dependency conflict (2025-06-30 19:01Z)

_**User**_

fix error

---

_**Assistant**_

The error is caused by a peer dependency conflict:  
- Your project uses `react@19.x`  
- `@testing-library/react@13.x` requires `react@^18.0.0` as a peer dependency.

This means `@testing-library/react@13.x` does not officially support React 19 yet.

**How to fix:**

### Option 1: Downgrade React to v18
- This is the most stable solution if you need to use `@testing-library/react` for tests.

### Option 2: Upgrade `@testing-library/react` (if possible)
- Check if a newer version supports React 19. (As of now, React 19 is not officially released, so this is unlikely.)

### Option 3: Use `--legacy-peer-deps` or `--force`
- This will install dependencies ignoring peer conflicts, but may cause runtime issues.

### Option 4: Remove or temporarily comment out `@testing-library/react` and related testing packages
- If you don't need them right now, you can remove them from `devDependencies`.

---

**Recommended: Downgrade React to v18**

1. Change your `package.json`:
   - Set `"react": "^18.0.0"` and `"react-dom": "^18.0.0"` in both `dependencies` and `devDependencies` (if present).
2. Run:
   ```sh
   npm install
   ```

Would you like me to update your `package.json` to use React 18, or do you prefer another solution?

---

