import { createRouter, createWebHashHistory } from "vue-router"

import TeamsPage from "../modules/teams/pages/TeamsPage.vue"
import TournamentsPage from "../modules/tournament/pages/TournamentsPage.vue"
import TournamentDetailPage from "../modules/tournament/pages/TournamentDetailPage.vue"

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/teams" },
    { path: "/teams", component: TeamsPage },
    { path: "/tournaments", component: TournamentsPage },
    { path: "/tournaments/:id", component: TournamentDetailPage },
  ],
})
