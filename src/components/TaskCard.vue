<template>
  <q-card
    class="task-card"
    flat
    @click="openModal(task)"
  >
    <q-card-section class="q-pa-sm">
      <div class="task-card-header flex">
        <q-avatar size="25px" color="primary" text-color="white">{{ getOwnerInitials(props.task.owner) }}</q-avatar>
        <div class="owner-name">
          {{ props.task.owner ? task.owner.name : 'No Owner' }}
        </div>
      </div>
      <div class="task-name q-mt-sm">
        {{ props.task.name }}
      </div>
    </q-card-section>
    <TaskInfoModal :showModal="showModal" :task="task" @update:task="updateTask" @update:showModal="closeModal"/>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import TaskInfoModal from 'components/TaskInfoModal.vue'
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const showModal = ref(false)

const getOwnerInitials = (owner) => {
  if (owner && owner.name) {
    const names = owner.name.split(' ')
    return names.map((name) => name.charAt(0)).join('').toUpperCase()
  }
  return '?'
}

const openModal = (task) => {
  showModal.value = true;
}

const updateTask = () => {
	// logic to update task
}

const closeModal = () => {
  showModal.value = false
}

</script>

<style scoped>
.task-card {
  max-width: 300px;
}

.task-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.owner-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border-radius: 50%;
}

.task-name {
  font-size: 14px;
  font-weight: bold;
}
</style>