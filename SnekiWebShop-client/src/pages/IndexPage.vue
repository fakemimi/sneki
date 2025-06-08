<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>SnekiWebshop</q-toolbar-title>
      <q-btn flat label="Home" to="/" />
      <q-btn flat label="Accessories" to="/Administration/Accessories" />
      <q-btn flat label="Products" to="/Administration/Products" />
    </q-toolbar>

    <div class="q-gutter-md q-mt-md row justify-center">
      <q-card v-for="product in products" :key="product.id" class="my-card col-12 col-sm-6 col-md-4 col-lg-3">
        <q-img :src="product.imageUrl || 'https://via.placeholder.com/300'" :alt="product.name" style="height: 200px;" />
        <q-card-section>
          <div class="text-h6">{{ product.name }}</div>
          <div class="text-subtitle2">Price: ${{ product.price }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from 'src/boot/firebase'

export default {
  name: 'HomePage',
  setup() {
    const products = ref([])

    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    onMounted(fetchProducts)

    return { products }
  }
}
</script>

<style scoped>
.my-card {
  max-width: 300px;
}
</style>
