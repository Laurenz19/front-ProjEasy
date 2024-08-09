<template>
  <div class="fit q-pt-xl q-px-sm" :class="props.classNames">
    <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" @click="redirect('/admin')">
      <q-icon size="22px" name="view_kanban" />
      <div class="GPL__side-btn__label">Handle tasks</div>
    </q-btn>
    <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" @click="redirect('/admin/manage-user')">
      <q-icon size="22px" name="people" />
      <div class="GPL__side-btn__label">Users</div>
    </q-btn>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  classNames: {
    type: String,
    required: false,
    default: 'column'
  }
})

function redirect(path) {
  router.push(path);
}
</script>
