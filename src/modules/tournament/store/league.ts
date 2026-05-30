import type { Ref } from "vue"
import type { Tournament } from "../types"
import type { Team } from "@/modules/teams/types"
import {
  setLeagueMatchResult,
  simulateLeagueMatch,
  simulateLeagueMatchday,
  simulateAllLeague,
  allLeagueDone,
  getLeagueWinner,
  setTierMatchResult,
  simulateTierMatch,
  simulateTierMatchday,
  simulateAllTier,
  simulateAllTiers,
  allTiersDone,
  getTiersWinner,
} from "@/engine"

export function useLeagueActions(tournaments: Ref<Tournament[]>, getTeams: () => Team[]) {
  function getT(id: string) {
    return tournaments.value.find((t) => t.id === id)
  }

  // ── Single-tier ──────────────────────────────────────────────────

  function setLeagueResult(
    tournamentId: string,
    matchdayIdx: number,
    matchIdx: number,
    home: number,
    away: number
  ) {
    const t = getT(tournamentId)
    if (!t) return
    setLeagueMatchResult(t, matchdayIdx, matchIdx, home, away)
    if (allLeagueDone(t)) t.winnerId = getLeagueWinner(t)
  }

  function simLeagueMatch(tournamentId: string, matchdayIdx: number, matchIdx: number) {
    const t = getT(tournamentId)
    if (!t) return
    simulateLeagueMatch(t, matchdayIdx, matchIdx, getTeams())
    if (allLeagueDone(t)) t.winnerId = getLeagueWinner(t)
  }

  function simLeagueMatchday(tournamentId: string, matchdayIdx: number) {
    const t = getT(tournamentId)
    if (!t) return
    simulateLeagueMatchday(t, matchdayIdx, getTeams())
    if (allLeagueDone(t)) t.winnerId = getLeagueWinner(t)
  }

  function simAllLeague(tournamentId: string) {
    const t = getT(tournamentId)
    if (!t) return
    simulateAllLeague(t, getTeams())
    if (allLeagueDone(t)) t.winnerId = getLeagueWinner(t)
  }

  // ── Multi-tier ───────────────────────────────────────────────────

  function setTierResult(
    tournamentId: string,
    tierIdx: number,
    matchdayIdx: number,
    matchIdx: number,
    home: number,
    away: number
  ) {
    const t = getT(tournamentId)
    if (!t) return
    setTierMatchResult(t, tierIdx, matchdayIdx, matchIdx, home, away)
    if (allTiersDone(t)) t.winnerId = getTiersWinner(t)
  }

  function simTierMatch(
    tournamentId: string,
    tierIdx: number,
    matchdayIdx: number,
    matchIdx: number
  ) {
    const t = getT(tournamentId)
    if (!t) return
    simulateTierMatch(t, tierIdx, matchdayIdx, matchIdx, getTeams())
    if (allTiersDone(t)) t.winnerId = getTiersWinner(t)
  }

  function simTierMatchday(tournamentId: string, tierIdx: number, matchdayIdx: number) {
    const t = getT(tournamentId)
    if (!t) return
    simulateTierMatchday(t, tierIdx, matchdayIdx, getTeams())
    if (allTiersDone(t)) t.winnerId = getTiersWinner(t)
  }

  function simAllTierAction(tournamentId: string, tierIdx: number) {
    const t = getT(tournamentId)
    if (!t) return
    simulateAllTier(t, tierIdx, getTeams())
    if (allTiersDone(t)) t.winnerId = getTiersWinner(t)
  }

  function simAllTiersAction(tournamentId: string) {
    const t = getT(tournamentId)
    if (!t) return
    simulateAllTiers(t, getTeams())
    if (allTiersDone(t)) t.winnerId = getTiersWinner(t)
  }

  return {
    setLeagueResult,
    simLeagueMatch,
    simLeagueMatchday,
    simAllLeague,
    setTierResult,
    simTierMatch,
    simTierMatchday,
    simAllTier: simAllTierAction,
    simAllTiers: simAllTiersAction,
  }
}
