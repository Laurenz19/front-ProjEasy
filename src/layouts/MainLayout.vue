<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-toolbar-title shrink class="row items-center no-wrap">
          <span class="q-ml-sm">ProjEasy</span>
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="logout" @click="Logout">
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="GPL__page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { onMounted, onBeforeMount } from 'vue'
import { useTaskStore } from 'stores/task'
import { useUserStore } from 'stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const { getAllUsers, logout } = userStore

const Logout = ()=>{
  logout()
}

onMounted(()=>{
  getAllTasks()
})

</script>
