import { defineStore } from 'pinia'
import * as _ from "lodash"
import services from '../services'

export const useUserStore = defineStore('user', {
  state: () => ({
    connectedUser: null,
    users: []
  }),

  getters: {
    isAdmin(){
      return this.connectedUser?.role == 'admin'
    },
    owners(){
      return this.users
    }
  },

  actions: {
    async login(email, password){
      const response = await services.login(email, password)
      if (response.status == 200) {
        this.connectedUser = response.data['user']
        const path = this.connectedUser.role == 'admin' ? '/admin': '/' 
        this.router.push(path)
      }else{
        console.error(response.data)
      }
    },
    logout(){
      this.connectedUser = null
      services.logout()
      this.router.push('/authentication')
    },
    async getAllUser(){  
      const response = await services.getRecord('users')
      if(response.status == 200){
        this.users = response.data
      }
    },
    async addUser(user){
      const response = await services.postRecord('register', user)

      if(response.status == 201){
        let usersClone = _.cloneDeep(this.users)
        usersClone.push(response.data)
        this.users = usersClone
      }else{
        console.error(response.data)
      }
    },
    async updateUser(user){
      const { id, ...data } = user
      const response = await services.patchRecord(`users/${id}`, data)
      if(response.status == 200){
         let usersClone = _.cloneDeep(this.users)
          this.users  = _.map(usersClone, (elem)=>{
            if(elem.id== id) elem = response.data;
            return elem
          })
      }else{
        console.error(response.data)
      }
    },
    async deleteUser(id){
      this.users = this.users.filter(user => user.id != id)
      await services.deleteRecord(`users/${id}`)
    }
  },
  persist: {
    paths: ['connectedUser'],
  }
})
