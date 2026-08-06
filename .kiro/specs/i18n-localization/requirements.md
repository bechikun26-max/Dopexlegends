# Requirements Document

## Introduction

This feature adds internationalization (i18n) support to the DopexLegends application. The system auto-detects the user's browser language via `navigator.language` and displays all text content in Japanese when the browser language is Japanese, or in English for all other languages. There is no manual language switcher — detection is fully automatic on page load.

## Glossary

- **I18n_System**: The internationalization module responsible for detecting browser language and providing translated strings to the application.
- **Translation_File**: A JSON file containing key-value pairs mapping translation keys to localized text strings for a specific locale.
- **Locale**: A language identifier derived from the browser's `navigator.language` property (e.g., "ja", "en-US").
- **Translation_Hook**: A React hook that provides access to the current locale's translation function within components.
- **UI_String**: Any user-visible text rendered by the application, including labels, buttons, headings, error messages, and data display names.
- **Data_Name**: A display name for game entities such as legend names, weapon names, category names, ammo type names, and rule names stored in data files.

## Requirements

### Requirement 1: Browser Language Detection

**User Story:** As a user, I want the application to automatically detect my browser language, so that I see content in the appropriate language without manual configuration.

#### Acceptance Criteria

1. WHEN the application loads, THE I18n_System SHALL read the browser language from `navigator.language`.
2. WHEN `navigator.language` starts with "ja", THE I18n_System SHALL set the active locale to Japanese.
3. WHEN `navigator.language` does not start with "ja", THE I18n_System SHALL set the active locale to English.
4. THE I18n_System SHALL determine the active locale once on application initialization and maintain that locale for the duration of the session.

### Requirement 2: Translation File Structure

**User Story:** As a developer, I want translation files organized as JSON key-value pairs, so that adding and maintaining translations is straightforward.

#### Acceptance Criteria

1. THE I18n_System SHALL load translations from a Japanese translation file (`ja.json`) containing all UI_String values in Japanese.
2. THE I18n_System SHALL load translations from an English translation file (`en.json`) containing all UI_String values in English.
3. THE Translation_File SHALL use dot-notation namespaced keys to organize translations by component or domain (e.g., `legendGacha.execute`, `weapon.slot1`).
4. THE Translation_File SHALL contain entries for all UI labels, button text, headings, error messages, aria-labels, and placeholder text present in the application.

### Requirement 3: Translation Hook for Components

**User Story:** As a developer, I want a React hook that provides a translation function, so that components can retrieve localized strings in a consistent manner.

#### Acceptance Criteria

1. THE Translation_Hook SHALL return a translation function that accepts a translation key and returns the corresponding localized string for the active locale.
2. THE Translation_Hook SHALL return a translation function that accepts interpolation parameters for dynamic values within translated strings.
3. WHEN a translation key is not found in the active locale's Translation_File, THE Translation_Hook SHALL return the key itself as a fallback.
4. THE Translation_Hook SHALL be accessible from any component within the React component tree without prop drilling.

### Requirement 4: UI String Localization

**User Story:** As a user, I want all interface text displayed in my detected language, so that the entire application experience is consistent in one language.

#### Acceptance Criteria

1. WHILE the active locale is Japanese, THE I18n_System SHALL display all UI_String values in Japanese throughout the application.
2. WHILE the active locale is English, THE I18n_System SHALL display all UI_String values in English throughout the application.
3. THE I18n_System SHALL localize the following UI_String categories: page headings, section titles, button labels, toggle labels, error messages, placeholder text, aria-labels, and descriptive text.
4. THE I18n_System SHALL localize UI_String values in all application sections including LegendGacha, WeaponGacha, RuleRoulette, UserProfile, AdminLogin, and AdminPanel components.

### Requirement 5: Game Data Name Localization

**User Story:** As a user, I want legend names, weapon names, and rule names displayed in my detected language, so that game terminology matches my language preference.

#### Acceptance Criteria

1. WHILE the active locale is Japanese, THE I18n_System SHALL display legend names in Japanese (e.g., "バンガロール").
2. WHILE the active locale is English, THE I18n_System SHALL display legend names in English (e.g., "Bangalore").
3. WHILE the active locale is Japanese, THE I18n_System SHALL display weapon names in Japanese (e.g., "フラットライン").
4. WHILE the active locale is English, THE I18n_System SHALL display weapon names in English (e.g., "Flatline").
5. WHILE the active locale is Japanese, THE I18n_System SHALL display rule names in Japanese (e.g., "アサルトクラス縛り").
6. WHILE the active locale is English, THE I18n_System SHALL display rule names in English (e.g., "Assault Class Only").
7. THE I18n_System SHALL localize weapon category names (Shotgun, SMG, Pistol, AR, LMG, Marksman, Sniper) and ammo type names (Shotgun, Light, Heavy, Energy, Sniper, Arrow) according to the active locale.
8. THE I18n_System SHALL localize legend class names (Assault, Skirmisher, Recon, Support, Controller) according to the active locale.

### Requirement 6: HTML Language Attribute

**User Story:** As a user with assistive technology, I want the HTML document language attribute to match the displayed language, so that screen readers use correct pronunciation.

#### Acceptance Criteria

1. WHEN the active locale is Japanese, THE I18n_System SHALL set the `<html lang>` attribute to "ja".
2. WHEN the active locale is English, THE I18n_System SHALL set the `<html lang>` attribute to "en".

### Requirement 7: No Manual Language Switching

**User Story:** As a user, I want the language to be determined automatically without any manual toggle, so that the experience is seamless.

#### Acceptance Criteria

1. THE I18n_System SHALL provide no user-facing language selection control or switcher UI element.
2. THE I18n_System SHALL rely exclusively on `navigator.language` for locale determination.
