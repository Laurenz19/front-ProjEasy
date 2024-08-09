<template>
  <q-page padding>
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="text-h6">Users List</div>
          <q-btn
            color="primary"
            icon="add"
            label="Add User"
            @click="openAddUserModal"
            unelevated
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="users"
          :columns="columns"
          row-key="email"
          :rows-per-page-options="[10, 20]"
        >
          <template v-slot:body-cell-initial="props">
            <q-td :props="props">
              <q-avatar size="md" color="primary" text-color="white">
                {{ ( props.row.name[0] +  props.row.lastname[0]).toUpperCase() }}
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td align="center" :props="props">
              <q-btn
                size="sm"
                color="primary"
                icon="edit"
                @click="openEditUserModal(props.row)"
                round
                dense
              />
              <q-btn
                size="sm"
                color="negative"
                icon="delete"
                @click="deleteUser(props.row.id)"
                round
                dense
                class="q-ml-sm"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              {{ props.row.name }}
            </q-td>
          </template>

          <template v-slot:body-cell-lastname="props">
            <q-td :props="props">
              {{ props.row.lastname }}
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              {{ props.row.email }}
            </q-td>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              {{ props.row.role }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>

    <q-dialog v-model="isUserModalOpen" persistent>
      <q-card class="modal-user">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEditMode ? 'Edit User' : 'Add New User' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit="handleSubmit">
            <q-input v-model="currentUser.lastname" label="Nom" required />
            <q-input v-model="currentUser.name" label="Prénom" required />
            <q-input v-model="currentUser.email" label="Email" type="email" required />
            <q-select
              v-model="currentUser.role"
              label="Rôle"
              :options="roles"
              emit-value
              map-options
              required
            />
            <div class="row justify-end q-gutter-sm q-mt-sm">
              <q-btn label="Cancel" color="negative" icon="cancel" flat @click="closeUserModal" />
              <q-btn :label="btnModalText.title" :icon="btnModalText.icon" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from 'stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const { getAllUser, addUser, updateUser, deleteUser } = userStore

onMounted(()=>{
  getAllUser()
})

const columns = [
  { name: "initial", label: "", align: "center", field: "initial" },
  { name: "name", label: "Firstaname", align: "left", field: "name" },
  { name: "lastname", label: "Lastname", align: "left", field: "lastname" },
  { name: "email", label: "Email", align: "left", field: "email" },
  { name: "role", label: "Role", align: "left", field: "role" },
  { name: "actions", label: "Actions", align: "center", field: "actions" }
];

const isUserModalOpen = ref(false)
const isEditMode = ref(false)
const btnModalText = computed(()=>isEditMode.value ? {title: 'Save', icon: 'save'} : {title: 'Add', icon: 'add'})
const currentUser = ref({
  name: "",
  lastname: "",
  email: "",
  password: "",
  role: ""
});

const roles = ref([
  { label: "Admin", value: "admin" },
  { label: "Normal", value: "normal" }
]);

function openAddUserModal() {
  resetCurrentUser();
  isEditMode.value = false;
  isUserModalOpen.value = true;
}

function openEditUserModal(user) {
  currentUser.value = { ...user };
  isEditMode.value = true;
  isUserModalOpen.value = true;
}

function closeUserModal() {
  isUserModalOpen.value = false;
}

function resetCurrentUser() {
  currentUser.value = {
    name: "",
    lastname: "",
    email: "",
    password: "",
    role: ""
  };
}

function handleSubmit(){
  const user = currentUser.value
  
  if(isEditMode.value){
    updateUser(user)
  }else {
    user.password = 'projeasy'
    addUser(user)
  } 
  closeUserModal()
}
</script>

<style scoped>
.text-h6 {
  font-weight: bold;
}
.q-ml-sm {
  margin-left: 8px;
}
.modal-user{
  width: 500px;
}
</style>
