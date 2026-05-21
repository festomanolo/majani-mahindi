# Internationalisation (i18n)

Strings are defined in `en.ts` (English base) and translated in `sw.ts` (Swahili).

## Adding a new language

1. Copy `en.ts` to `<locale>.ts`
2. Translate all values (keep the keys identical)
3. Add the locale to the `locales` map in `index.ts`
4. Add the locale code to the `Locale` union type

## Usage

```ts
import { t, getLocale } from "@/i18n";
const strings = t(getLocale());
console.log(strings.dashboard.title);
```
