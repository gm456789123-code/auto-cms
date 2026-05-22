export interface PaymentSettings {
  promptpayId: string
  promptpayName: string
}

const KEY = "autoshop_payment_settings"

const DEFAULT: PaymentSettings = {
  promptpayId: "",
  promptpayName: "",
}

export function loadPaymentSettings(): PaymentSettings {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function savePaymentSettings(settings: PaymentSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(settings))
}
