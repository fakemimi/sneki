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
                @click="deleteProduct(props.row.id)"
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

    const columns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'price', label: 'Price', field: 'price', align: 'right' },
      { name: 'description', label: 'Description', field: 'description', align: 'left' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
    ]

    // Fetch products from Firestore
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    // Add new product
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

    // Delete product
    const deleteProduct = async (id) => {
      await deleteDoc(doc(db, 'products', id))
      fetchProducts()
    }

    // Edit product
    const editProduct = (row) => {
      editProductData.value = { ...row }
      editDialog.value = true
    }

    // Update product
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
      deleteProduct,
      editProduct,
      editDialog,
      editProductData,
      updateProduct
    }
  }
}
</script>
