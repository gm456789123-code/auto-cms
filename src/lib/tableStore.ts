import { Table } from "@/types/pos"

const KEY = "autoshop_tables"

const DEFAULT_TABLES: Table[] = [
  { id: 1, number: 1, status: "available" },
  { id: 2, number: 2, status: "available" },
  { id: 3, number: 3, status: "available" },
  { id: 4, number: 4, status: "available" },
]

export function loadTables(): Table[] {
  if (typeof window === "undefined") return DEFAULT_TABLES
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : DEFAULT_TABLES
  } catch {
    return DEFAULT_TABLES
  }
}

export function saveTables(tables: Table[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(tables))
}

export function addTable(tables: Table[]): Table[] {
  const maxId = tables.reduce((m, t) => Math.max(m, t.id), 0)
  const maxNumber = tables.reduce((m, t) => Math.max(m, t.number), 0)
  const next: Table = { id: maxId + 1, number: maxNumber + 1, status: "available" }
  const updated = [...tables, next]
  saveTables(updated)
  return updated
}

export function deleteTable(tables: Table[], id: number): Table[] {
  const updated = tables.filter(t => t.id !== id)
  saveTables(updated)
  return updated
}
