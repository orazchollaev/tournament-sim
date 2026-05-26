// engine/monteCarlo.ts
// Runs N tournament simulations on a snapshot of the current state (existing results
// kept fixed) and returns championship win probabilities per team.
import type { Tournament, Match } from "../modules/tournament/types"
import type { Team } from "../modules/teams/types"
import {
  simulateMatch,
  simulatePenaltyShootout,
  propagateWinners,
  getWinnerId,
  simulateAllGroups,
  seedBracketFromGroups,
} from "./index"

function cloneTournament(t: Tournament): Tournament {
  return JSON.parse(JSON.stringify(t))
}

function simOnce(clone: Tournament, teams: Team[]): string | null {
  // If groups aren't done yet, simulate them and seed the bracket.
  if (clone.format === "group+bracket" && !clone.groupsDone) {
    simulateAllGroups(clone, teams)
    seedBracketFromGroups(clone, teams, clone.playoffSeedMode ?? "cross")
  }

  // Simulate all bracket rounds (keep already-played matches as-is).
  for (let r = 0; r < clone.rounds.length; r++) {
    propagateWinners(clone.rounds, teams)
    for (const match of clone.rounds[r].matches) {
      if (!match.homeId || !match.awayId || match.result) continue
      if (match.leg2Result !== undefined) {
        simDoubleLeg(match, teams)
      } else {
        const result = simulateMatch(match, teams)
        match.result =
          result.home === result.away
            ? { ...result, ...simulatePenaltyShootout(match, teams) }
            : result
      }
    }
  }

  propagateWinners(clone.rounds, teams)
  const final = clone.rounds[clone.rounds.length - 1]?.matches[0]
  return final ? getWinnerId(final) : null
}

function simDoubleLeg(match: Match, teams: Team[]) {
  if (!match.homeId || !match.awayId) return
  if (!match.result) {
    match.result = simulateMatch(match, teams)
  }
  if (match.leg2Result === null) {
    const leg2Sim = { id: match.id, homeId: match.awayId, awayId: match.homeId }
    const r2 = simulateMatch(leg2Sim as any, teams)
    const aggHome = match.result!.home + r2.away
    const aggAway = match.result!.away + r2.home
    if (aggHome !== aggAway) {
      match.leg2Result = r2
    } else {
      const pen = simulatePenaltyShootout(leg2Sim as any, teams)
      match.leg2Result = { ...r2, penHome: pen.penHome, penAway: pen.penAway }
    }
  }
}

export function runMonteCarlo(
  tournament: Tournament,
  teams: Team[],
  iterations = 5000
): Record<string, number> {
  const counts: Record<string, number> = {}

  for (let i = 0; i < iterations; i++) {
    const clone = cloneTournament(tournament)
    // Monte Carlo uses base team powers — form deltas are not carried over.
    clone.formDeltas = {}
    const winner = simOnce(clone, teams)
    if (winner) counts[winner] = (counts[winner] ?? 0) + 1
  }

  const probs: Record<string, number> = {}
  for (const [id, count] of Object.entries(counts)) {
    probs[id] = count / iterations
  }
  return probs
}
