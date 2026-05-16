import type { Team } from "../modules/teams/types"
import type { Match, Round, Tournament } from "../modules/tournament/types"

function uid() {
  return Math.random().toString(36).slice(2)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createTournament(name: string, teams: Team[]): Tournament {
  const count = teams.length
  // Pad to next power of 2
  const size = Math.pow(2, Math.ceil(Math.log2(count)))
  const shuffled = shuffle(teams)
  const byes = size - count

  // First round matches (some may be byes)
  const firstMatches: Match[] = []
  let teamIdx = 0
  for (let i = 0; i < size / 2; i++) {
    const home = shuffled[teamIdx++] ?? null
    const away = byes > 0 && i < byes ? null : (shuffled[teamIdx++] ?? null)
    firstMatches.push({
      id: uid(),
      homeId: home?.id ?? null,
      awayId: away?.id ?? null,
      result: null,
    })
  }

  // Auto-resolve bye matches
  firstMatches.forEach((m) => {
    if (m.homeId && !m.awayId) m.result = { home: 1, away: 0 }
    if (!m.homeId && m.awayId) m.result = { home: 0, away: 1 }
  })

  const rounds: Round[] = [{ name: getRoundName(size / 2), matches: firstMatches }]

  // Create subsequent empty rounds
  let prev = firstMatches.length
  while (prev > 1) {
    const next = prev / 2
    const matches: Match[] = Array.from({ length: next }, () => ({
      id: uid(),
      homeId: null,
      awayId: null,
      result: null,
    }))
    rounds.push({ name: getRoundName(next), matches })
    prev = next
  }

  // Propagate known winners from bye rounds
  propagateWinners(rounds, teams)

  return {
    id: uid(),
    name,
    teamIds: teams.map((t) => t.id),
    rounds,
    winnerId: null,
    createdAt: Date.now(),
  }
}

function getRoundName(matchCount: number): string {
  if (matchCount === 1) return "Final"
  if (matchCount === 2) return "Semi-Finals"
  if (matchCount === 4) return "Quarter-Finals"
  return `Round of ${matchCount * 2}`
}

export function getWinnerId(match: Match): string | null {
  if (!match.result) return null
  if (match.result.home > match.result.away) return match.homeId
  if (match.result.away > match.result.home) return match.awayId
  return null // draw — shouldn't happen in knockout, but handle later
}

export function propagateWinners(rounds: Round[], teams: Team[]) {
  for (let r = 0; r < rounds.length - 1; r++) {
    const curr = rounds[r]
    const next = rounds[r + 1]
    curr.matches.forEach((match, i) => {
      const winnerId = getWinnerId(match)
      const slot = Math.floor(i / 2)
      const isHome = i % 2 === 0
      if (winnerId) {
        if (isHome) next.matches[slot].homeId = winnerId
        else next.matches[slot].awayId = winnerId
      }
    })
  }
}

export function simulateMatch(match: Match, teams: Team[]): { home: number; away: number } {
  const home = teams.find((t) => t.id === match.homeId)
  const away = teams.find((t) => t.id === match.awayId)
  const hp = home?.power ?? 50
  const ap = away?.power ?? 50
  function goals(power: number) {
    const base = Math.random() * (power / 20)
    return Math.floor(base)
  }
  let h = goals(hp),
    a = goals(ap)
  if (h === a) {
    if (hp >= ap) h += 1
    else a += 1
  }
  return { home: h, away: a }
}
