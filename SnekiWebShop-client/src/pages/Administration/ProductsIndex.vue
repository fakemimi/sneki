<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Products Management</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="addProduct">
          <div class="row q-col-gutter-md">
            <q-input v-model="newProduct.name" label="Name" class="col" required />
            <q-input v-model="newProduct.price" label="Price" type="number" class="col" required />
            <q-input v-model="newProduct.description" label="Description" class="col" />
            <q-btn label="Add" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :rows="products"
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
                @click="editProduct(props.row)"
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

    <!-- Edit dialog -->
    <q-dialog v-model="editDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Product</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editProductData.name" label="Name" required />
          <q-input v-model="editProductData.price" label="Price" type="number" required />
          <q-input v-model="editProductData.description" label="Description" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateProduct" />
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
          Are you sure you want to delete this product?
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
  name: 'ProductsIndex',
  setup () {
    const products = ref([])
    const newProduct = ref({ name: '', price: null, description: '' })
    const editDialog = ref(false)
    const editProductData = ref({ id: '', name: '', price: null, description: '' })

    const confirmDialog = ref(false)
    const itemToDelete = ref(null)

    const columns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'price', label: 'Price', field: 'price', align: 'right' },
      { name: 'description', label: 'Description', field: 'description', align: 'left' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
    ]

    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const addProduct = async () => {
      if (!newProduct.value.name || !newProduct.value.price) return
      await addDoc(collection(db, 'products'), {
        name: newProduct.value.name,
        price: Number(newProduct.value.price),
        description: newProduct.value.description || ''
      })
      newProduct.value = { name: '', price: null, description: '' }
      fetchProducts()
    }

    const confirmDelete = (id) => {
      itemToDelete.value = id
      confirmDialog.value = true
    }

    const performDelete = async () => {
      await deleteDoc(doc(db, 'products', itemToDelete.value))
      confirmDialog.value = false
      itemToDelete.value = null
      fetchProducts()
    }

    const editProduct = (row) => {
      editProductData.value = { ...row }
      editDialog.value = true
    }

    const updateProduct = async () => {
      const { id, name, price, description } = editProductData.value
      await updateDoc(doc(db, 'products', id), {
        name,
        price: Number(price),
        description: description || ''
      })
      editDialog.value = false
      fetchProducts()
    }

    onMounted(fetchProducts)

    return {
      products,
      newProduct,
      columns,
      addProduct,
      confirmDelete,
      performDelete,
      editProduct,
      editDialog,
      editProductData,
      updateProduct,
      confirmDialog
    }
  }
}
</script>
