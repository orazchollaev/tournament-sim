<script setup lang="ts">
import { useTeamsStore } from "../store"
import { useTeamForm } from "../composables/useTeamForm"

const store = useTeamsStore()
const {
  newName,
  newColor,
  newPower,
  addTeam,
  editing,
  editName,
  editColor,
  editPower,
  startEdit,
  saveEdit,
} = useTeamForm()
</script>

<template>
  <div class="page">
    <!-- Add Team -->
    <div class="section-box">
      <h2>Add Team</h2>
      <div :class="['section-body', { 'is-disabled': store.teams.length >= 16 }]">
        <div class="flex">
          <input
            v-model="newName"
            :placeholder="store.teams.length >= 16 ? 'Team limit reached (16)' : 'Team name'"
            class="name-input"
            :disabled="store.teams.length >= 16"
            @keyup.enter="addTeam"
          />
          <input
            v-model="newColor"
            type="color"
            class="color-input"
            :disabled="store.teams.length >= 16"
          />
          <label class="field-label">Power</label>
          <input
            v-model.number="newPower"
            type="number"
            min="1"
            max="100"
            class="power-input"
            :disabled="store.teams.length >= 16"
          />
          <button
            class="primary"
            :disabled="!newName.trim() || store.teams.length >= 16"
            @click="addTeam"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Teams list -->
    <div class="section-box">
      <h2>
        Teams
        <span class="count">{{ store.teams.length }}/16</span>
      </h2>
      <div class="section-body" style="padding: 0">
        <table v-if="store.teams.length">
          <thead>
            <tr>
              <th class="col-color"></th>
              <th>Name</th>
              <th class="col-power">Power</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in store.teams" :key="team.id">
              <td class="cell-center">
                <span class="color-dot" :style="{ background: team.color }" />
              </td>
              <td>
                <input v-if="editing === team.id" v-model="editName" class="edit-input" />
                <span v-else>{{ team.name }}</span>
              </td>
              <td>
                <input
                  v-if="editing === team.id"
                  v-model.number="editPower"
                  type="number"
                  min="1"
                  max="100"
                  class="power-input"
                />
                <span v-else>{{ team.power }}</span>
              </td>
              <td>
                <div class="row-actions">
                  <template v-if="editing === team.id">
                    <input v-model="editColor" type="color" class="color-input-sm" />
                    <button class="primary sm" @click="saveEdit(team.id)">Save</button>
                    <button class="sm" @click="editing = null">Cancel</button>
                  </template>
                  <template v-else>
                    <button class="sm" @click="startEdit(team)">Edit</button>
                    <button class="danger sm" @click="store.remove(team.id)">✕</button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty-text">No teams yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.name-input {
  width: 160px;
}
.power-input {
  width: 60px;
}
.color-input {
  width: 32px;
  height: 28px;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
}
.color-input-sm {
  width: 28px;
  height: 24px;
  padding: 1px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
}
.field-label {
  font-size: 12px;
  color: var(--text-muted);
}
.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Header count badge */
.count {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: normal;
  color: var(--text-muted);
  margin-left: 6px;
}

/* Table columns */
.col-color {
  width: 36px;
}
.col-power {
  width: 70px;
}
.col-actions {
  width: 150px;
}
.cell-center {
  text-align: center;
}

.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--border-light);
  vertical-align: middle;
}
.edit-input {
  width: 140px;
}
.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}

/* Small button variant */
.sm {
  font-size: 12px;
  padding: 2px 8px;
}

.empty-text {
  color: var(--text-muted);
  padding: 12px;
  font-size: 13px;
}
</style>
