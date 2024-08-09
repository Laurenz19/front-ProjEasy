<template>
  <q-dialog v-model="showModalComputed">
    <q-card class="bg-white modalPhone mobile-stepper" style="width: 50%; min-height: 300px; position: relative;">
      <div class="modal-header q-pa-md">
        <div style="width: 350px;" v-if="isEditing">
          <q-input v-model="task.name" label="Task Name" dense />
        </div>
        <div v-else class="text-h6">{{ task.name }}</div>
        <q-btn
          style="width: 25px; position: absolute; top: 0px; right: 0px; cursor: pointer; z-index: 999"
          color="primary"
          icon="close"
          @click="closeModal"
        />
      </div>
      
      <div class="modal-content" style="overflow-y: auto;">
        <!-- <q-card-section class="q-pa-md"> -->
          <div class="q-pa-md" v-if="isEditing">
            <q-editor
              v-model="task.description"
              flat
              content-class="bg-amber-3"
              toolbar-text-color="white"
              toolbar-bg="primary"
              :toolbar="[
                ['bold', 'italic', 'underline'],
                [{
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
                }]
              ]"
              style="width: 350px;"
            />
          </div>
          <div class="q-pa-md" v-else style="border: 1px solid #ccc; padding: 16px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-color: #f9f9f9; margin-left: 20px; width: 350px; height: 200px">
            <div>{{ task.description }}</div>
          </div>
        <!-- </q-card-section> -->
        
        <q-card-section class="actions" style="width: 200px;">
          <q-select
            standout
            v-model="selectedOwner"
            :options="owners"
            :dense="dense"
            :options-dense="dense"
            label="Assign to"
            option-value="lastname"
            option-label="lastname"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item clickable @click="onItemClick(scope.opt)">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ (scope.opt.name[0] + scope.opt.lastname[0]).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }} {{ scope.opt.lastname }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            standout
            v-model="selectedStatus"
            :options="allStatus"
            :dense="dense"
            :options-dense="dense"
            label="Move to"
            option-value="label"
            option-label="label"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item clickable @click="onItemStatusClick(scope.opt.label)">
                <q-item-section>
                  <q-item-label> {{ scope.opt.label }} </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-btn v-if="isAdmin" @click="editTask" :icon="isEditing?'save':'edit'" color="primary" label="" />
          <!-- <q-btn v-if="isAdmin && isEditing" @click="saveTask" icon="save" color="positive" label="Save" /> -->
          <q-btn v-if="isAdmin" @click="deleteTask(task)" icon="delete" color="negative" label="" />
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { useTaskStore } from 'stores/task'
import { useUserStore } from 'stores/user'
import { storeToRefs } from 'pinia'

const props = defineProps({
  showModal: Boolean,
  task: Object
})

const taskStore = useTaskStore()
const userStore = useUserStore()
const { allStatus } = storeToRefs(taskStore)
const { updateStatus, updateTask, deleteTask, updateAssignee } = taskStore
const { isAdmin, owners } = storeToRefs(userStore)
const dense = ref(false)

const emit = defineEmits(['update:showModal', 'update:task'])
const isEditing = ref(false)

const showModalComputed = computed({
  get() {
    return props.showModal
  },
  set(value) {
    emit('update:showModal', value)
  }
})

const task = ref(props.task)
const selectedOwner = ref(task.value.owner)
const selectedStatus = ref(task.value.status)

// watch(() => props.task, (newTask) => {
//   task.value = newTask;
//   selectedOwner.value = newTask.owner.id;
// })

const closeModal = () => {
  showModalComputed.value = false;
}

const saveChanges = () => {
  task.value.owner.id = selectedOwner.value
  emit('update:task', task.value)
  closeModal()
}

const onItemClick = (owner) =>{
    selectedOwner.value = owner;
    updateAssignee(task.value.id, owner.id)
}

const onItemStatusClick = (status) =>{
    updateStatus(selectedStatus.value, status, task.value.id)
    selectedStatus.value = status;
}

const editTask = () => {
  isEditing.value = !isEditing.value
  console.log(task.value)
  if(isEditing.value == false){
    updateTask(task.value)
  }
}

const saveTask = () => {
  // add edit logic here
  closeModal()
}

</script>

<style scoped>
.task-container {
  width: 50%;
  position: relative;
}

.modal-content {
  display:flex;
  justify-content: space-between; 
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px; 
  padding: 16px;
}

.q-btn {
  width: 100%; 
}

.modal-header{
  display:flex;
  justify-content: space-between; 
}
</style>



