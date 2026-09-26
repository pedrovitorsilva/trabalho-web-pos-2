function digitsOnly(value) {
    return String(value ?? "").replace(/\D/g, "");
}

export function normalizePhone(value) {
    return digitsOnly(value);
}

export function formatPhone(value) {
    const digits = normalizePhone(value);
    if (digits.length > 11) return digits;
    if (digits.length <= 2) return digits;

    const areaCode = digits.slice(0, 2);
    const subscriber = digits.slice(2);
    const splitAt = digits.length === 11 ? 5 : 4;
    const prefix = subscriber.slice(0, splitAt);
    const suffix = subscriber.slice(splitAt);

    return `(${areaCode}) ${prefix}${suffix ? `-${suffix}` : ""}`;
}

export function normalizeCpf(value) {
    return digitsOnly(value);
}

export function formatCpf(value) {
    const digits = normalizeCpf(value);
    if (digits.length > 11) return digits;

    const first = digits.slice(0, 3);
    const second = digits.slice(3, 6);
    const third = digits.slice(6, 9);
    const final = digits.slice(9, 11);

    return (
        [first, second, third].filter(Boolean).join(".") +
        (final ? `-${final}` : "")
    );
}

export function isValidCpf(value) {
    return /^\d{11}$/.test(normalizeCpf(value));
}
