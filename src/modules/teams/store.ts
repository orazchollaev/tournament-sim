import { defineStore } from "pinia"
import { ref } from "vue"
import type { Team } from "./types"

const COLORS = [
  "#e63946",
  "#457b9d",
  "#2a9d8f",
  "#e9c46a",
  "#f4a261",
  "#264653",
  "#6a4c93",
  "#1982c4",
  "#8ac926",
  "#ff595e",
]

export const useTeamsStore = defineStore("teams", () => {
  const teams = ref<Team[]>([
    { id: "1", name: "Galatasaray", color: "#e63946", power: 82 },
    { id: "2", name: "Fenerbahçe", color: "#e9c46a", power: 80 },
    { id: "3", name: "Beşiktaş", color: "#264653", power: 75 },
    { id: "4", name: "Trabzonspor", color: "#1982c4", power: 72 },
  ])

  function add(name: string, color: string, power: number) {
    if (teams.value.length >= 16) return
    teams.value.push({ id: Date.now().toString(), name, color, power })
  }

  function remove(id: string) {
    teams.value = teams.value.filter((t) => t.id !== id)
  }

  function update(id: string, data: Partial<Omit<Team, "id">>) {
    const t = teams.value.find((t) => t.id === id)
    if (t) Object.assign(t, data)
  }

  return { teams, add, remove, update, COLORS }
})
