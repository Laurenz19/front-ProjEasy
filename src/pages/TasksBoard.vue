<template>
  <q-page class="page-container">
    <div class="board flex">
      <div
        class="column"
        v-for="(column, index) in columns"
        :key="index"
      >
        <h2>{{ column.title }}</h2>
        <div class="draggable-container" :data-column-index="index">
        	<VueDraggableNext
	          v-model="column.tasks"
	          :group="{ name: 'tasks', pull: true, put: true }"
	          :animation="200"
	          @end="onDragEnd"
	        >
	          <div
	            v-for="task in column.tasks"
	            :key="task.id"
	            class="task"
              :data-id="task.id"
	          >
	          	<TaskCard :task="task"/>
	          </div>
	        </VueDraggableNext>
        </div>
        <div v-if="isAdmin" style="footer">
            <q-btn
              v-if="!column.showInput"
              class="add-card-btn"
              label="Add a ticket"
              color="primary"
              style="width: 100%;"
              @click="showInputField(index)"
            />
            <div v-else class="input-container">
              <q-input
                v-model="column.newTaskTitle"
                label="Task Title"
                @keyup.enter="addNewTask(index)"
              />
              <q-btn
                label="Save ticket"
                color="primary"
                style="width: 100%;"
                @click="addNewTask(index)"
              />
            </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import TaskCard from 'components/TaskCard.vue'
import { useTaskStore } from 'stores/task'
import { useUserStore } from 'stores/user'
import { storeToRefs } from 'pinia'

const taskStore = useTaskStore()
const userStore = useUserStore()
const { columns, userColumns } = storeToRefs(taskStore)
const { addNewTask, updateStatus, getStatus } = taskStore
const { isAdmin } = storeToRefs(userStore)

const onDragEnd = (event) => {
  const { item, from, to } = event;
  const oldStatus = getStatus(from.parentElement.dataset.columnIndex)
  const newStatus = getStatus(to.parentElement.dataset.columnIndex)
  const taskId = item.dataset.id
  
  /*
    Update the tasks list. 
    Remove the task with the id taskId from the column fromColumnIndex, update the status of the task and push it to the
    column toColumnIndex
  */
  updateStatus(oldStatus, newStatus, taskId)
}

const showInputField = (columnIndex) => {
  columns.value[columnIndex].showInput = true
};

</script>

<style scoped>
.board {
  display: flex;
  justify-content: center;
  gap: 50px;
  width:100%;
}

.column {
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  margin: 10px;
  border-radius: 8px;
  width: 350px;
  min-height: 550px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.task {
  background-color: #fff;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.column h2 {
  font-size: 25px;
  margin: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.draggable-container {
  flex: 1;
  overflow-y: auto;
}

</style>
