# Implementation Plan: Nessie Easter Egg

## Overview

ネッシーイースターエッグ機能の実装。条件判定エンジン（純粋関数）、カスタムHook（状態管理）、アニメーションコンポーネント（CSS keyframes）を新規作成し、AppContentに統合する。既存コンポーネントへの変更は最小限に留める。

## Tasks

- [x] 1. Create the Nessie Easter Egg detection engine
  - [x] 1.1 Implement `src/engines/nessieEasterEggEngine.ts` with condition checking functions
    - Create `hasBallistic(partyResult)` function that checks if any legend in party has `hasThirdWeaponSlot === true`
    - Create `isAllWeaponsEnabled(slotChecks, carePackageFlags)` function that returns true when all non-care-package weapons are checked
    - Create `isSameWeaponAllSlots(slot1Result, slot2Result, slot3Result)` function that returns true when all three are non-null and share the same weapon ID
    - Create `checkNessieCondition(input: NessieConditionInput)` that combines all sub-conditions with AND logic
    - Export the `NessieConditionInput` interface
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x]* 1.2 Write property tests for `checkNessieCondition` in `src/engines/__tests__/nessieEasterEggEngine.test.ts`
    - **Property 1: Nessie condition is a biconditional**
    - Generate arbitrary party results, weapon check maps, care package flags, and weapon results using fast-check
    - Assert `checkNessieCondition` returns `true` iff all four sub-conditions hold simultaneously
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

  - [x]* 1.3 Write property test for statelessness in `src/engines/__tests__/nessieEasterEggEngine.test.ts`
    - **Property 2: Detection is stateless**
    - Call `checkNessieCondition` multiple times with the same input and assert identical results
    - Call with qualifying input after non-qualifying input and assert it still returns `true`
    - **Validates: Requirements 4.1**

  - [x]* 1.4 Write property test for `isAllWeaponsEnabled` in `src/engines/__tests__/nessieEasterEggEngine.test.ts`
    - **Property 3: All-weapons-enabled is invariant to weapon order and count**
    - Generate arbitrary weapon ID sets and check maps, assert `isAllWeaponsEnabled` returns `true` iff every non-care-package weapon is checked
    - **Validates: Requirements 1.1, 1.3**

- [x] 2. Create the Nessie Animation component and styles
  - [x] 2.1 Implement `src/components/shared/NessieAnimation.module.css`
    - Define `.nessieContainer` with `position: fixed`, `bottom: 0`, `left: 0`, `z-index: 9999`, `pointer-events: none`
    - Define `.nessieImage` with the `nessieWalk` animation (3s linear forwards)
    - Define `@keyframes nessieWalk` from `translateX(-100%)` to `translateX(100vw)`
    - _Requirements: 2.1, 2.2, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 2.2 Implement `src/components/shared/NessieAnimation.tsx`
    - Accept `NessieAnimationProps` with `isPlaying` and `onAnimationEnd`
    - Render nothing when `isPlaying` is `false`
    - When `isPlaying` is `true`, render the nessie.png image inside a fixed container with the CSS animation
    - Attach `onAnimationEnd` handler to detect animation completion
    - Use a `key` prop based on a counter/timestamp to force restart on re-trigger
    - Handle image load error gracefully (hide on error)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x]* 2.3 Write unit tests for `NessieAnimation` component
    - Test that img element is in the DOM when `isPlaying` is `true`
    - Test that nothing renders when `isPlaying` is `false`
    - Test that `onAnimationEnd` callback is invoked on animation end event
    - Test `position: fixed` and `pointer-events: none` for non-blocking behavior
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Create the `useNessieEasterEgg` hook
  - [x] 3.1 Implement `src/hooks/useNessieEasterEgg.ts`
    - Accept parameters: `partyResult`, `slot1Checks`, `slot2Checks`, `carePackageFlags`, `slot1Result`, `slot2Result`, `slot3Result`
    - Use `useEffect` to watch slot results and evaluate `checkNessieCondition` when all three slot results are non-null
    - Manage `isPlaying` state with `useState`
    - On condition met: set `isPlaying` to `true` and increment an animation key to force re-trigger
    - Implement `onAnimationEnd` to set `isPlaying` to `false`
    - Return `{ isPlaying, onAnimationEnd, animationKey }`
    - Handle re-trigger during active animation by resetting with new key
    - _Requirements: 1.1, 4.1, 4.2_

  - [x]* 3.2 Write unit tests for `useNessieEasterEgg` hook
    - Test that `isPlaying` becomes `true` when all conditions are satisfied
    - Test that `isPlaying` remains `false` when conditions are not met
    - Test re-trigger behavior: animation key increments on successive triggers
    - Test `onAnimationEnd` resets `isPlaying` to `false`
    - _Requirements: 1.1, 4.1, 4.2_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Integrate Easter Egg into AppContent
  - [x] 5.1 Wire `useNessieEasterEgg` hook and `NessieAnimation` component into `src/App.tsx`
    - Import `useNessieEasterEgg` and `NessieAnimation` in `AppContent`
    - Extract necessary state from `useAppContext()`: `legendGacha.partyResult`, `weaponGacha.slot1Checks`, `weaponGacha.slot2Checks`, `weaponGacha.carePackageFlags`, `weaponGacha.slot1Result`, `weaponGacha.slot2Result`, `weaponGacha.slot3Result`
    - Call `useNessieEasterEgg` with the extracted state
    - Render `<NessieAnimation isPlaying={isPlaying} onAnimationEnd={onAnimationEnd} key={animationKey} />` inside `AppContent`
    - Ensure placement does not affect existing layout (non-invasive, portal-style rendering)
    - _Requirements: 1.1, 2.1, 2.4, 4.1, 4.2_

  - [x]* 5.2 Write integration test for the Easter Egg flow
    - Test that `NessieAnimation` renders when all conditions are met in the full component tree
    - Test that animation does not render when any condition is not met
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1_

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The detection engine is pure functions with no side effects, making it highly testable
- The animation component uses `pointer-events: none` to ensure it never blocks user interaction (Requirement 2.4)
- Re-trigger is handled via React `key` prop change to force CSS animation restart (Requirement 4.2)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "2.2"] },
    { "id": 2, "tasks": ["2.3", "3.1"] },
    { "id": 3, "tasks": ["3.2"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2"] }
  ]
}
```
