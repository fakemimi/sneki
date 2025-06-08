<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Accessories Management</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="addAccessory">
          <div class="row q-col-gutter-md">
            <q-input v-model="newAccessory.name" label="Name" class="col" required />
            <q-input v-model="newAccessory.price" label="Price" type="number" class="col" required />
            <q-btn label="Add" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :rows="accessories"
          :columns="columns"
          row-key="id"
          flat
        >
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn
                size="sm"
                color="blue"
                icon="edit"
                flat
                @click="editAccessory(props.row)"
              />
              <q-btn
                size="sm"
                color="red"
                icon="delete"
                flat
                @click="confirmDelete(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Accessory</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editAccessoryData.name" label="Name" required />
          <q-input v-model="editAccessoryData.price" label="Price" type="number" required />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateAccessory" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Potvrda brisanja -->
    <q-dialog v-model="confirmDialog" persistent transition-show="fade" transition-hide="fade">
      <q-card>
        <q-card-section class="text-h6">
          Confirm Deletion
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete this accessory?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="red" @click="performDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from 'src/boot/firebase'

export default {
  name: 'AccessoriesIndex',
  setup () {
    const accessories = ref([])
    const newAccessory = ref({ name: '', price: null })
    const editDialog = ref(false)
    const editAccessoryData = ref({ id: '', name: '', price: null })

    const confirmDialog = ref(false)
    const itemToDelete = ref(null)

    const columns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'price', label: 'Price', field: 'price', align: 'right' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
    ]

    const fetchAccessories = async () => {
      const querySnapshot = await getDocs(collection(db, 'accessories'))
      accessories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const addAccessory = async () => {
      if (!newAccessory.value.name || !newAccessory.value.price) return
      await addDoc(collection(db, 'accessories'), {
        name: newAccessory.value.name,
        price: Number(newAccessory.value.price)
      })
      newAccessory.value = { name: '', price: null }
      fetchAccessories()
    }

    const confirmDelete = (id) => {
      itemToDelete.value = id
      confirmDialog.value = true
    }

    const performDelete = async () => {
      await deleteDoc(doc(db, 'accessories', itemToDelete.value))
      confirmDialog.value = false
      itemToDelete.value = null
      fetchAccessories()
    }

    const editAccessory = (row) => {
      editAccessoryData.value = { ...row }
      editDialog.value = true
    }

    const updateAccessory = async () => {
      const { id, name, price } = editAccessoryData.value
      await updateDoc(doc(db, 'accessories', id), { name, price: Number(price) })
      editDialog.value = false
      fetchAccessories()
    }

    onMounted(fetchAccessories)

    return {
      accessories,
      newAccessory,
      columns,
      addAccessory,
      confirmDelete,
      performDelete,
      editAccessory,
      editDialog,
      editAccessoryData,
      updateAccessory,
      confirmDialog
    }
  }
}
</script>
