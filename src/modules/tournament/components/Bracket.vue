<template>
  <div class="bracket">
    <div class="round-col" v-for="(round, ri) in tournament.rounds" :key="ri">
      <div class="round-title">{{ round.name }}</div>
      <div class="matches-col">
        <div
          class="match-card"
          v-for="(match, mi) in round.matches"
          :key="match.id"
          :style="{
            marginTop: getTopMargin(ri, mi) + 'px',
            marginBottom: getBottomMargin(ri, mi) + 'px',
          }"
        >
          <div class="match-row" :class="{ winner: isWinner(match, match.homeId) }">
            <TeamBadge :teamId="match.homeId" :teams="teams" />
            <span class="score" v-if="match.result !== null">{{ match.result.home }}</span>
            <span class="score empty" v-else>-</span>
          </div>
          <div class="match-row" :class="{ winner: isWinner(match, match.awayId) }">
            <TeamBadge :teamId="match.awayId" :teams="teams" />
            <span class="score" v-if="match.result !== null">{{ match.result.away }}</span>
            <span class="score empty" v-else>-</span>
          </div>
          <!-- Manual result entry -->
          <div class="match-actions" v-if="match.homeId && match.awayId">
            <template v-if="editingMatch === match.id">
              <input v-model.number="editHome" type="number" min="0" style="width: 36px" />
              <span>–</span>
              <input v-model.number="editAway" type="number" min="0" style="width: 36px" />
              <button
                class="primary"
                style="font-size: 11px; padding: 2px 6px"
                @click="saveResult(ri, mi, match)"
              >
                OK
              </button>
              <button style="font-size: 11px; padding: 2px 4px" @click="editingMatch = null">
                ✕
              </button>
            </template>
            <template v-else>
              <button style="font-size: 11px; padding: 2px 6px" @click="startEdit(match)">
                {{ match.result ? "Edit" : "Set score" }}
              </button>
              <button style="font-size: 11px; padding: 2px 6px" @click="emit('sim-match', ri, mi)">
                🎲
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Tournament, Match } from "../types"
import type { Team } from "@/modules/teams/types"
import TeamBadge from "@/modules/teams/components/TeamBadge.vue"
import { getWinnerId } from "@/engine/logic"

const props = defineProps<{ tournament: Tournament; teams: Team[] }>()
const emit = defineEmits<{
  "set-result": [round: number, match: number, home: number, away: number]
  "sim-match": [round: number, match: number]
}>()

const editingMatch = ref<string | null>(null)
const editHome = ref(0)
const editAway = ref(0)

function startEdit(match: Match) {
  editingMatch.value = match.id
  editHome.value = match.result?.home ?? 0
  editAway.value = match.result?.away ?? 0
}

function saveResult(ri: number, mi: number, match: Match) {
  if (editHome.value === editAway.value) return // no draws
  emit("set-result", ri, mi, editHome.value, editAway.value)
  editingMatch.value = null
}

function isWinner(match: Match, teamId: string | null) {
  if (!match.result || !teamId) return false
  return getWinnerId(match) === teamId
}

// Vertical spacing to align matches visually between rounds
function getTopMargin(roundIdx: number, matchIdx: number) {
  if (roundIdx === 0) return 4
  const factor = Math.pow(2, roundIdx)
  return matchIdx === 0 ? (factor - 1) * 28 : (factor - 1) * 56
}
function getBottomMargin(roundIdx: number, _matchIdx: number) {
  return roundIdx === 0 ? 4 : 0
}
</script>

<style scoped>
.bracket {
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding-bottom: 8px;
}
.round-col {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}
.round-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  padding: 4px 8px 8px;
  text-align: center;
}
.matches-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 6px;
}
.match-card {
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 12px;
}
.match-row {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-bottom: 1px solid var(--border-light);
  gap: 4px;
}
.match-row:last-of-type {
  border-bottom: none;
}
.match-row.winner {
  background: #f0f9f0;
  font-weight: 700;
}
.score {
  margin-left: auto;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
}
.score.empty {
  color: var(--text-muted);
  font-weight: normal;
}
.match-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 3px 6px;
  border-top: 1px solid var(--border-light);
  background: var(--bg);
}
</style>
