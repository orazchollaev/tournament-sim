// engine/index.ts
export { uid, shuffle, getRoundName } from "./utils"
export { simulateMatch, simulatePenaltyShootout } from "./simulation"
export {
  getWinnerId,
  propagateWinners,
  buildBracketRounds,
  buildEmptyBracketRounds,
  buildPureBracket,
} from "./bracket"
export {
  buildGroupFixture,
  recalcStandings,
  setGroupMatchResult,
  simulateGroupMatch,
  simulateGroup,
  simulateAllGroups,
  allGroupsDone,
} from "./groups"
export { createTournament, seedBracketFromGroups } from "./tournament"
