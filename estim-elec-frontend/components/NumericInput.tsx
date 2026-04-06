"use client";

type NumericInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  buttonClassName?: string;
  size?: "default" | "compact";
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPrecision(step: number) {
  const stepAsString = String(step);
  const decimalPart = stepAsString.split(".")[1];
  return decimalPart ? decimalPart.length : 0;
}

function formatNumber(value: number, precision: number) {
  if (precision === 0) {
    return String(value);
  }

  return value.toFixed(precision).replace(/\.?0+$/, "");
}

export default function NumericInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  required,
  disabled,
  className,
  wrapperClassName,
  buttonClassName,
  size = "default",
}: NumericInputProps) {
  const precision = getPrecision(step);
  const inputMode = precision > 0 ? "decimal" : "numeric";
  const sizeClasses =
    size === "compact"
      ? {
          wrapper: "gap-1",
          button: "h-8 w-8 text-sm",
        }
      : {
          wrapper: "gap-2",
          button: "h-10 w-10 text-base",
        };

  function updateByStep(direction: -1 | 1) {
    const parsedValue = Number.parseFloat(value.replace(",", "."));
    const hasValue = Number.isFinite(parsedValue);

    let nextValue = hasValue
      ? parsedValue + direction * step
      : min ?? (direction > 0 ? step : 0);

    if (min != null) {
      nextValue = Math.max(min, nextValue);
    }

    if (max != null) {
      nextValue = Math.min(max, nextValue);
    }

    onChange(formatNumber(nextValue, precision));
  }

  return (
    <div className={joinClasses("flex items-center", sizeClasses.wrapper, wrapperClassName)}>
      <button
        type="button"
        onClick={() => updateByStep(-1)}
        disabled={disabled}
        className={joinClasses(
          "shrink-0 rounded border border-zinc-300 bg-white text-gray-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800",
          sizeClasses.button,
          buttonClassName,
        )}
        aria-label="Diminuer la valeur"
      >
        -
      </button>

      <input
        id={id}
        type="number"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        className={joinClasses("no-spinner text-center", className)}
      />

      <button
        type="button"
        onClick={() => updateByStep(1)}
        disabled={disabled}
        className={joinClasses(
          "shrink-0 rounded border border-zinc-300 bg-white text-gray-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800",
          sizeClasses.button,
          buttonClassName,
        )}
        aria-label="Augmenter la valeur"
      >
        +
      </button>
    </div>
  );
}