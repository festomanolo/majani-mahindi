import { useI18n } from "@/lib/locale-context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

/** Language switcher pill — English / Kiswahili */
export function LangToggle({ className }: { className?: string }) {
  const { locale, changeLocale, strings } = useI18n();

  const OPTIONS: { value: Locale; label: string }[] = [
    { value: "en", label: strings.lang.en },
    { value: "sw", label: strings.lang.sw },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
        className,
      )}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => changeLocale(opt.value)}
          aria-pressed={locale === opt.value}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            locale === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
