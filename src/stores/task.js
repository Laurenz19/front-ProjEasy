import { defineStore } from 'pinia'
import * as _ from "lodash"
import services from '../services'
import { useUserStore } from 'stores/user'
import { storeToRefs } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({
    columns: [],
    userColumns: []
  }),

  getters: {
    allStatus() {
      const data = [];

      this.columns.forEach((column, columnIndex) => {
        data.push({
          index: columnIndex,
          label: column.title
        });
      });

      return data;
    }
  },

  actions: {
    async getAllTasks(){
      const userStore = useUserStore()
      let id = userStore.isAdmin?'':userStore.connectedUser?.id
      const response = await services.getRecord(`tasks/board/${id}`)
      if(response.status == 200){
        this.columns = response.data
      }else{
        console.log(response.data)
      }
    },
    async getTaskByUser(id){
      const response = await services.getRecord(`tasks/board/${id}`)
      if(response.status == 200){
        this.userColumns = response.data
      }else{
        console.error(response.data)
      }
    },
    async addNewTask(columnIndex){
      
      const newTaskTitle = this.columns[columnIndex].newTaskTitle.trim()
      const status =  this.getStatus(columnIndex)

      if (newTaskTitle) {
        const newTask = {
          name: newTaskTitle,
          description: null,
          status: status,
          Pid_person: null
        }

        const response = await services.postRecord('tasks', newTask)
        if(response.status == 201){
          this.columns[columnIndex].tasks.push(response.data)
        }else{
          console.error(response.data)
        }

        this.columns[columnIndex].newTaskTitle = ''
        this.columns[columnIndex].showInput = false
      }      
    },
    getStatus(index){
      let status =  'To do'
      
      this.allStatus.forEach(elem=>{
        if(elem.index == index) status = elem.label
      })
      return status
    },
    getStatusIndex(label){
      let index =  0
      
      this.allStatus.forEach(elem=>{
        if(elem.label == label) index = elem.index
      })
      return index
    },
    getStatusObject(label){
      return this.allStatus.find(status => status.label === label) || null;
    },
    async updateStatus(oldStatus, newStatus, taskId){
      /*
        Update the tasks list. 
        Remove the task with the id taskId from the column fromColumnIndex, update the status of the task and push it to the
        column toColumnIndex
      */
      const oldIndex = this.getStatusIndex(oldStatus)
      const newIndex = this.getStatusIndex(newStatus)
      let tasksClone = _.cloneDeep(this.columns[oldIndex].tasks)
      tasksClone = tasksClone.filter(task => task.id != taskId)

      const response = await services.patchRecord(`tasks/${taskId}`, {status: newStatus})
      if(response.status == 200){
          let tasksClone2 = _.cloneDeep(this.columns[newIndex].tasks)
          tasksClone2.push(response.data)
          tasksClone2 = tasksClone2.filter(task => task.status == newStatus)
          this.columns[oldIndex].tasks = tasksClone
          this.columns[newIndex].tasks = tasksClone2
      }else{
          console.error(response.data)
      }
    },
    async updateAssignee(taskId, ownerId){
      const response = await services.patchRecord(`tasks/${taskId}`, {Pid_person: ownerId})
      if(response.status == 200){
          let task = response.data
          let index = this.getStatusIndex(task.status)
          let tasksClone = _.cloneDeep(this.columns[index].tasks)
          tasksClone = _.map(tasksClone, (elem)=>{
            if(elem.id==task.id) elem = task;
            return elem
          })
          this.columns[index].tasks = tasksClone
      }else{
          console.error(response.data)
      }
    },
    async updateTask(task){
      const index = this.getStatusIndex(task.status)
      const response = await services.patchRecord(`tasks/${task.id}`, task)

      if(response.status == 200){
          let tasksClone = _.cloneDeep(this.columns[index].tasks)
          tasksClone = _.map(tasksClone, (elem)=>{
            if(elem.id==task.id) elem = response.data;
            return elem
          })
          this.columns[index].tasks = tasksClone
      }else{
          console.error(response.data)
      }
    },
    async deleteTask(deletedTask){
      const index = this.getStatusIndex(deletedTask.status)
      let tasksClone = _.cloneDeep(this.columns[index].tasks)
      tasksClone = tasksClone.filter(task => task.id != deletedTask.id)
      this.columns[index].tasks = tasksClone
      await services.deleteRecord(`tasks/${deletedTask.id}`) 
    }
  }
})
