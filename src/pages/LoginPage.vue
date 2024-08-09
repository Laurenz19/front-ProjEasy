<template>
  <q-page class="flex flex-center">
    <q-card class="q-mx-auto q-my-auto" style="max-width: 400px; width: 100%;">
      <q-card-section>
        <div class="text-h5 text-center">Authentication</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="submitLogin">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => val && val.length > 0 || 'Email is required']"
            dense
            autofocus
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => val && val.length > 0 || 'Password is required']"
            dense
            class="q-mt-md"
          />
          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width q-mt-md"
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const { login } = userStore

defineOptions({
  name: 'LoginPage'
})

const email = ref('');
const password = ref('');
const router = useRouter();

function submitLogin() {
  if (email.value && password.value) {
   login(email.value, password.value)
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
  padding: 20px;
}
</style>

