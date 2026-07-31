# Implementation Plan: Apex Gacha System

## Overview

Apex Legendsカスタムマッチ向けランダム選択支援Webアプリケーションの実装。React 18 + TypeScript + Viteで構築し、レジェンドガチャ、武器ガチャ、縛りルールルーレットの3機能を提供する。純粋関数エンジン＋React Context/useReducerによる状態管理で、fast-checkによるプロパティベーステストで正確性を担保する。

## Tasks

- [x] 1. Set up project structure and core types
  - [x] 1.1 Initialize Vite + React + TypeScript project and install dependencies
    - Initialize project with `npm create vite@latest` (React + TypeScript template)
    - Install dependencies: `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`
    - Configure `vitest.config.ts` with test path patterns for `.property.test.ts` and `.unit.test.ts`
    - Set up CSS Modules support in Vite config
    - _Requirements: 13.1, 14.1_

  - [x] 1.2 Define all TypeScript interfaces and type definitions
    - Create `src/types/index.ts` with all interfaces: `Legend`, `Weapon`, `Rule`, `LegendClass`, `WeaponCategory`, `AmmoType`, `RuleCategory`, `FilterResult`, `ValidationResult`, `LegendLineupState`, `WeaponLineupState`, `RouletteState`, `UserProfile`, `CarePackageState`, `PartyMember`, `PartyGachaResult`, `StoredState`
    - Export all types for use across the application
    - _Requirements: 13.1, 14.1_

  - [x] 1.3 Create static data files for legends, weapons, and rules
    - Create `src/data/legends.ts` with all 28 legends (5 Assault, 7 Skirmisher, 6 Recon, 6 Support, 4 Controller) including `hasThirdWeaponSlot: true` for Ballistic
    - Create `src/data/weapons.ts` with all 29 weapons including C.A.R. with dual ammo types `['Light', 'Heavy']` and `isCarePackage` flags
    - Create `src/data/rules.ts` with all 18 rules (5 LegendClass, 7 WeaponCategory, 6 AmmoType)
    - _Requirements: 9.2, 13.1, 13.2, 14.1, 14.2, 14.4_

- [x] 2. Implement utility layer
  - [x] 2.1 Create random utility module
    - Create `src/utils/random.ts` with `pickRandom<T>(array: T[]): T` and `pickMultipleUnique<T>(array: T[], count: number): T[]` functions
    - Ensure uniform distribution using `Math.random()`
    - _Requirements: 1.1, 4.1, 9.1_

  - [x] 2.2 Create localStorage utility module
    - Create `src/utils/storage.ts` with `saveState(key: string, state: unknown): void`, `loadState<T>(key: string): T | null`, and `clearState(key: string): void`
    - Handle serialization/deserialization with `Map` to `Record` conversion
    - Implement error handling: `console.warn` on read failure with fallback, toast notification on write failure
    - _Requirements: 12.5_

  - [x] 2.3 Create filter utility module
    - Create `src/utils/filter.ts` with `filterByClass(legends: Legend[], className: LegendClass): Legend[]`, `filterByCategory(weapons: Weapon[], category: WeaponCategory): Weapon[]`, `filterByAmmoType(weapons: Weapon[], ammoType: AmmoType): Weapon[]`
    - Ensure `filterByAmmoType` checks `weapon.ammoTypes.includes(ammoType)` to handle multi-ammo weapons like C.A.R.
    - _Requirements: 13.3, 13.4, 13.5, 14.3_

  - [ ]* 2.4 Write property tests for filter utilities
    - **Property 14: Ammo type filtering includes multi-ammo weapons**
    - **Property 15: Category and class filtering returns exact matches**
    - **Validates: Requirements 13.3, 13.4, 13.5, 14.3**

- [x] 3. Implement engine layer - Legend Gacha Engine
  - [x] 3.1 Implement legendGachaEngine
    - Create `src/engines/legendGachaEngine.ts`
    - Implement `pickOne(lineup: Legend[]): Legend` - random selection from lineup
    - Implement `getEffectiveLineup(hostLineup: Set<string>, userProfile: Set<string>, allLegends: Legend[]): Legend[]` - intersection of host lineup and user profile
    - Implement `pickParty(lineups: Legend[][], partySize: number): Legend[]` - unique selection across members
    - Implement `validateLegendGacha(lineup: Legend[]): ValidationResult` and `validatePartyGacha(lineups: Legend[][], partySize: number): ValidationResult`
    - _Requirements: 1.1, 3.1, 3.3, 12.3, 12.6, 12.7_

  - [ ]* 3.2 Write property tests for legendGachaEngine
    - **Property 1: Legend gacha returns lineup member**
    - **Property 2: Effective lineup is intersection of host lineup and user profile**
    - **Property 4: Party gacha returns unique members from effective lineups**
    - **Validates: Requirements 1.1, 3.1, 12.3, 12.4**

- [x] 4. Implement engine layer - Weapon Gacha Engine
  - [x] 4.1 Implement weaponGachaEngine
    - Create `src/engines/weaponGachaEngine.ts`
    - Implement `pickWeapon(lineup: Weapon[]): Weapon` - random selection from slot lineup
    - Implement `pickAllSlots(slot1Lineup: Weapon[], slot2Lineup: Weapon[]): [Weapon, Weapon]` - independent slot selection
    - Implement `getEffectiveWeaponLineup(slotChecks: Map<string, boolean>, carePackageFlags: Map<string, boolean>, allWeapons: Weapon[]): Weapon[]` - exclude care package weapons
    - Implement `validateWeaponGacha(slot1Lineup: Weapon[], slot2Lineup: Weapon[]): ValidationResult`
    - _Requirements: 4.1, 4.2, 5.2, 5.3, 8.3_

  - [ ]* 4.2 Write property tests for weaponGachaEngine
    - **Property 5: Weapon slot gacha independence**
    - **Property 6: Weapon slot lineup independence**
    - **Property 7: Care package exclusion from all lineups**
    - **Property 8: Care package removal adds weapon unchecked**
    - **Validates: Requirements 5.2, 5.3, 6.2, 6.3, 8.3, 8.4, 8.5**

- [x] 5. Implement engine layer - Roulette and Auto-Filter Engines
  - [x] 5.1 Implement rouletteEngine
    - Create `src/engines/rouletteEngine.ts`
    - Implement `spin(rules: Rule[]): Rule` - random selection from rule set
    - _Requirements: 9.1_

  - [x] 5.2 Implement autoFilterEngine
    - Create `src/engines/autoFilterEngine.ts`
    - Implement `applyRule(rule: Rule, legends: Legend[], weapons: Weapon[]): FilterResult`
    - For `LegendClass` rules: check only matching class legends, uncheck all others
    - For `WeaponCategory` rules: check only matching category weapons in Slot 1, leave Slot 2 unchanged
    - For `AmmoType` rules: check only matching ammo type weapons in Slot 1 (including multi-ammo like C.A.R.), leave Slot 2 unchanged
    - Implement `saveSnapshot`, `resetToSnapshot`, `toggleApply(on/off)` logic
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 5.3 Write property tests for rouletteEngine and autoFilterEngine
    - **Property 9: Roulette returns rule from rule set**
    - **Property 10: Auto-filter for legend class rule**
    - **Property 11: Auto-filter for weapon rule affects only Slot 1**
    - **Property 12: Roulette save/reset round-trip**
    - **Property 13: Roulette toggle off/on round-trip**
    - **Validates: Requirements 9.1, 10.1, 10.2, 10.3, 10.4, 11.2, 11.3, 11.4, 11.5**

- [x] 6. Checkpoint - Core engines verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement hook layer
  - [x] 7.1 Implement useLocalStorage hook
    - Create `src/hooks/useLocalStorage.ts`
    - Implement generic `useLocalStorage<T>(key: string, initialValue: T)` hook with automatic persistence
    - Handle serialization of `Map` types to plain objects for JSON storage
    - _Requirements: 12.5_

  - [ ]* 7.2 Write property test for localStorage serialization
    - **Property 16: Profile serialization round-trip**
    - **Validates: Requirements 12.5**

  - [x] 7.3 Implement useLegendGacha hook
    - Create `src/hooks/useLegendGacha.ts`
    - Manage legend lineup state with useReducer (checks Map, all checked initially)
    - Implement `toggleLegend`, `toggleClass`, `toggleAll`, `executeGacha`, `executePartyGacha`
    - Integrate with `legendGachaEngine` and `useLocalStorage` for persistence
    - Implement group toggle logic for class-based selection
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.3, 3.4_

  - [x] 7.4 Implement useWeaponGacha hook
    - Create `src/hooks/useWeaponGacha.ts`
    - Manage weapon lineup state per slot with useReducer (slot1/slot2/slot3 checks)
    - Implement `toggleWeapon(slot, weaponId)`, `toggleCategory(slot, category)`, `executeSlotGacha(slot)`, `executeAllSlotsGacha`
    - Integrate care package flag management with `toggleCarePackage(weaponId)`
    - Persist state via `useLocalStorage`
    - _Requirements: 4.1, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 7.5 Implement useRuleRoulette hook
    - Create `src/hooks/useRuleRoulette.ts`
    - Manage roulette state: currentResult, isApplied, preRouletteSnapshot
    - Implement `spinRoulette`, `resetRoulette`, `toggleApply`
    - On spin: save current checkbox snapshot, apply auto-filter
    - On reset: restore snapshot, clear result
    - On toggle off: restore snapshot, keep result
    - On toggle on: re-apply auto-filter from current result
    - Integrate with legend and weapon lineup state setters
    - _Requirements: 9.1, 9.4, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 7.6 Write property test for group toggle logic
    - **Property 3: Group toggle affects exactly group members**
    - **Validates: Requirements 2.3, 6.6**

- [x] 8. Implement shared UI components
  - [x] 8.1 Create shared CheckboxGroup component
    - Create `src/components/shared/CheckboxGroup.tsx` with CSS Module
    - Props: items array, checked state map, onChange handler, groupLabel
    - Render individual checkboxes with labels and images
    - _Requirements: 2.1, 6.1_

  - [x] 8.2 Create shared ClassGroupCheckbox component
    - Create `src/components/shared/ClassGroupCheckbox.tsx` with CSS Module
    - Props: groupName, memberIds, checked state map, onToggleGroup handler
    - Display group header with select-all checkbox for the group
    - Auto-compute indeterminate state when partial selection
    - _Requirements: 2.3, 6.6_

  - [x] 8.3 Create shared ErrorMessage component
    - Create `src/components/shared/ErrorMessage.tsx` with CSS Module
    - Props: message string, visible boolean
    - Display error messages for validation failures
    - _Requirements: 2.4, 3.3, 4.4, 6.5, 7.5_

- [x] 9. Implement Legend Gacha UI components
  - [x] 9.1 Create LegendLineup component
    - Create `src/components/legend/LegendLineup.tsx` with CSS Module
    - Display 28 legends grouped by class with ClassGroupCheckbox for each class
    - Include select-all checkbox at the top
    - Wire to useLegendGacha hook for state management
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 9.2 Create LegendResult component
    - Create `src/components/legend/LegendResult.tsx` with CSS Module
    - Display selected legend's name, image, and class
    - _Requirements: 1.2_

  - [x] 9.3 Create LegendGacha main component
    - Create `src/components/legend/LegendGacha.tsx` with CSS Module
    - Include gacha execute button, result display, and error messages
    - Wire validation to disable button when lineup is empty
    - _Requirements: 1.1, 1.3, 2.4_

  - [x] 9.4 Create PartyGacha component
    - Create `src/components/legend/PartyGacha.tsx` with CSS Module
    - Party size selector (1/2/3, default 3)
    - Display results per member with member labels
    - Error handling for insufficient lineup
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 10. Implement Weapon Gacha UI components
  - [x] 10.1 Create WeaponSlotLineup component
    - Create `src/components/weapon/WeaponSlotLineup.tsx` with CSS Module
    - Display weapons grouped by category with category toggle checkboxes
    - Accept slot number prop to handle Slot 1/2/3 independently
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

  - [x] 10.2 Create WeaponResult component
    - Create `src/components/weapon/WeaponResult.tsx` with CSS Module
    - Display weapon name, category, and ammo type for each slot
    - _Requirements: 4.3_

  - [x] 10.3 Create CarePackageManager component
    - Create `src/components/weapon/CarePackageManager.tsx` with CSS Module
    - Display care package weapons in a separate section with toggle UI
    - Wire to useWeaponGacha hook for flag management
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 10.4 Create WeaponGacha main component
    - Create `src/components/weapon/WeaponGacha.tsx` with CSS Module
    - All-slots gacha button plus individual slot buttons
    - Conditionally show Slot 3 when Ballistic is selected
    - Error messages for empty slot lineups
    - _Requirements: 4.1, 4.4, 5.1, 5.2, 5.3, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Implement Roulette UI components
  - [x] 11.1 Create RouletteResult component
    - Create `src/components/roulette/RouletteResult.tsx` with CSS Module
    - Display rule name and category
    - _Requirements: 9.3_

  - [x] 11.2 Create RouletteControls component
    - Create `src/components/roulette/RouletteControls.tsx` with CSS Module
    - Reset button and apply toggle (visible only when result exists)
    - _Requirements: 11.1, 11.3, 11.4, 11.5, 11.6_

  - [x] 11.3 Create RuleRoulette main component
    - Create `src/components/roulette/RuleRoulette.tsx` with CSS Module
    - Spin button, result display, and controls
    - Wire auto-filter application on spin
    - _Requirements: 9.1, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 12. Implement Profile UI component
  - [x] 12.1 Create UserProfile component
    - Create `src/components/profile/UserProfile.tsx` with CSS Module
    - Display 28 legends with individual checkboxes (all checked initially)
    - Group by class with class-level toggles
    - Persist to localStorage via useLocalStorage hook
    - _Requirements: 12.1, 12.2, 12.5_

- [x] 13. Checkpoint - All components implemented
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Wire application together
  - [x] 14.1 Create application context and state provider
    - Create `src/context/AppContext.tsx` with React Context + useReducer
    - Provide legend lineup, weapon lineup, roulette, profile, and care package states
    - Wire cross-cutting concerns: roulette auto-filter → legend/weapon state, profile → effective lineup
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 12.3, 12.4_

  - [x] 14.2 Create App component with page routing/navigation
    - Create `src/App.tsx` with tab/page navigation between Legend Gacha, Weapon Gacha, Rule Roulette, Profile, and Care Package pages
    - Wrap with AppContext provider
    - Style with CSS Modules for layout
    - _Requirements: All_

  - [x] 14.3 Create main entry point and initial render
    - Update `src/main.tsx` to render App with StrictMode
    - Ensure localStorage state is loaded on mount
    - _Requirements: 12.5_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (16 properties across 5 test files)
- Unit tests validate specific examples and edge cases
- All engines are pure functions, enabling straightforward property-based testing with fast-check
- The application is fully client-side with no backend dependencies

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "2.1", "2.2"] },
    { "id": 3, "tasks": ["2.3", "3.1", "5.1"] },
    { "id": 4, "tasks": ["2.4", "3.2", "4.1", "5.2"] },
    { "id": 5, "tasks": ["4.2", "5.3", "7.1"] },
    { "id": 6, "tasks": ["7.2", "7.3", "7.4", "7.5"] },
    { "id": 7, "tasks": ["7.6", "8.1", "8.2", "8.3"] },
    { "id": 8, "tasks": ["9.1", "9.2", "9.3", "9.4", "10.1", "10.2", "10.3", "10.4", "11.1", "11.2", "11.3", "12.1"] },
    { "id": 9, "tasks": ["14.1"] },
    { "id": 10, "tasks": ["14.2"] },
    { "id": 11, "tasks": ["14.3"] }
  ]
}
```
