# Implementation Plan: i18n-localization

## Overview

Implement a lightweight custom internationalization (i18n) system for the DopexLegends application. The system uses React Context to provide a `useTranslation` hook, auto-detects browser language via `navigator.language`, and serves all UI text and game data names in Japanese or English. No external i18n libraries are used.

## Tasks

- [x] 1. Create i18n module foundation
  - [x] 1.1 Create TypeScript types and locale detection
    - Create `src/i18n/types.ts` with `Locale`, `TranslationParams`, `TranslationDictionary`, and `LocaleContextValue` types
    - Create `src/i18n/detectLocale.ts` implementing browser language detection (returns `'ja'` if `navigator.language` starts with "ja", otherwise `'en'`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Create the translate function
    - Create `src/i18n/translate.ts` with the core `translate(dictionary, key, params?)` function
    - Implement dot-notation key lookup against a flat dictionary
    - Implement `{{paramName}}` interpolation replacement
    - Return key itself as fallback when key is not found
    - _Requirements: 3.1, 3.2, 3.3_

  - [x]* 1.3 Write property tests for locale detection (Property 1)
    - **Property 1: Locale Detection Correctness**
    - Use `fast-check` to generate arbitrary strings and verify `detectLocale()` returns `'ja'` iff input starts with "ja", `'en'` otherwise
    - Mock `navigator.language` with generated values
    - **Validates: Requirements 1.2, 1.3**

  - [x]* 1.4 Write property tests for translate function (Properties 4, 5, 6)
    - **Property 4: Key Lookup Correctness** — for any existing key, `translate` returns the dictionary value
    - **Property 5: Interpolation Replacement** — for templates with `{{param}}` placeholders and matching params, output contains no placeholders and contains all param values
    - **Property 6: Missing Key Fallback** — for any key not in dictionary, `translate` returns the key unchanged
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 2. Create translation files
  - [x] 2.1 Create English translation file
    - Create `src/i18n/locales/en.json` with all UI strings and game data names in English
    - Include all namespaces: `app.*`, `common.*`, `legendGacha.*`, `weaponGacha.*`, `roulette.*`, `profile.*`, `admin.*`, `legends.*`, `weapons.*`, `rules.*`, `categories.*`, `ammoTypes.*`, `classes.*`, `errors.*`
    - Include entries for all 28 legend names, 29 weapon names, 18 rule names, 7 weapon categories, 6 ammo types, 5 legend classes
    - _Requirements: 2.2, 2.3, 2.4, 5.2, 5.4, 5.6, 5.7, 5.8_

  - [x] 2.2 Create Japanese translation file
    - Create `src/i18n/locales/ja.json` with all UI strings and game data names in Japanese
    - Ensure key set is identical to `en.json`
    - Use existing Japanese strings from current components and data files as reference
    - _Requirements: 2.1, 2.3, 2.4, 5.1, 5.3, 5.5, 5.7, 5.8_

  - [x]* 2.3 Write property tests for translation file structure (Properties 2, 3, 7, 8)
    - **Property 2: Translation Key Format** — all keys match dot-notation pattern
    - **Property 3: Translation File Symmetry** — en.json and ja.json have identical key sets
    - **Property 7: Game Data Name Coverage** — every legend id, weapon id, and rule id has a corresponding non-empty translation in both files
    - **Property 8: Game Enum Coverage** — every WeaponCategory, AmmoType, and LegendClass value has a corresponding non-empty translation in both files
    - **Validates: Requirements 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8**

- [x] 3. Create React context and provider
  - [x] 3.1 Create LocaleProvider and useTranslation hook
    - Create `src/i18n/context.tsx` with `LocaleProvider` component and `useTranslation` hook
    - Import translation JSON files statically
    - Set `document.documentElement.lang` attribute based on detected locale
    - Memoize the `t` function and context value
    - Throw error if `useTranslation` is used outside `LocaleProvider`
    - _Requirements: 3.4, 6.1, 6.2_

  - [x] 3.2 Create public index export
    - Create `src/i18n/index.ts` exporting `LocaleProvider`, `useTranslation`, and `Locale` type
    - _Requirements: 3.4_

  - [x]* 3.3 Write unit tests for LocaleProvider
    - Test that `document.documentElement.lang` is set to 'ja' when locale is Japanese
    - Test that `document.documentElement.lang` is set to 'en' when locale is English
    - Test that `useTranslation` throws when used outside `LocaleProvider`
    - Test that locale is determined once and doesn't change on re-render
    - **Validates: Requirements 1.4, 6.1, 6.2**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Integrate LocaleProvider into app entry point
  - [x] 5.1 Wrap application with LocaleProvider
    - Modify `src/main.tsx` to wrap the app with `LocaleProvider` above `StrictMode` or at app root level
    - Ensure `LocaleProvider` wraps everything so all components can access translations
    - _Requirements: 1.4, 3.4, 7.1_

- [x] 6. Migrate UI strings in core components
  - [x] 6.1 Migrate App.tsx and header UI strings
    - Replace hardcoded Japanese strings in `App.tsx` with `t()` calls
    - Migrate title, season badge, profile button labels, and overlay text
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 6.2 Migrate LegendGacha component
    - Replace hardcoded strings in `LegendGacha.tsx` with `t()` calls
    - Migrate headings, button labels, error messages, and aria-labels
    - Replace `legend.name` display with `t(`legends.${legend.id}`)` pattern
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2_

  - [x] 6.3 Migrate LegendLineup and LegendResult components
    - Replace hardcoded strings in `LegendLineup.tsx` and `LegendResult.tsx` with `t()` calls
    - Replace legend name display with translation key lookup
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2_

  - [x] 6.4 Migrate PartyGacha component
    - Replace hardcoded strings in `PartyGacha.tsx` with `t()` calls
    - Migrate party member labels and result display
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 6.5 Migrate WeaponGacha component
    - Replace hardcoded strings in `WeaponGacha.tsx` (and related sub-components) with `t()` calls
    - Migrate slot labels, button text, and weapon name displays
    - Replace `weapon.name` display with `t(`weapons.${weapon.id}`)` pattern
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.3, 5.4_

  - [x] 6.6 Migrate RuleRoulette and RouletteControls/RouletteResult components
    - Replace hardcoded strings in roulette components with `t()` calls
    - Replace `rule.name` display with `t(`rules.${rule.id}`)` pattern
    - Migrate spin buttons, section titles, and result display
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.5, 5.6_

  - [x] 6.7 Migrate UserProfile component
    - Replace hardcoded strings in `UserProfile.tsx` with `t()` calls
    - Migrate profile settings labels and legend/class names
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.8_

  - [x] 6.8 Migrate AdminLogin and AdminPanel components
    - Replace hardcoded strings in admin components with `t()` calls
    - Migrate login form labels, admin panel headings, and control labels
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.9 Migrate shared components (CheckboxGroup, ClassGroupCheckbox, etc.)
    - Replace hardcoded strings in shared components with `t()` calls
    - Migrate category names, class names, and ammo type displays using translation keys
    - _Requirements: 4.1, 4.2, 4.3, 5.7, 5.8_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final verification and cleanup
  - [x] 8.1 Verify no manual language switcher exists
    - Confirm no language selection UI element exists in any component
    - Ensure locale determination relies exclusively on `navigator.language`
    - _Requirements: 7.1, 7.2_

  - [x]* 8.2 Write integration tests for localized rendering
    - Test that LegendGacha renders all text in English when locale is 'en'
    - Test that components render text in Japanese when locale is 'ja'
    - Test that legend/weapon names display from translation files correctly
    - **Validates: Requirements 4.4, 5.1, 5.2, 5.3, 5.4**

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The project uses `vitest` with `fast-check` already in devDependencies
- Translation files use flat JSON with dot-notation keys (no nested objects)
- Game entity names (legends, weapons, rules) are looked up by id from translation files using `t(`namespace.${entity.id}`)` pattern
- Existing Japanese strings in data files and components serve as the source for `ja.json`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.3"] },
    { "id": 2, "tasks": ["1.4", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "6.8", "6.9"] },
    { "id": 6, "tasks": ["8.1", "8.2"] }
  ]
}
```
