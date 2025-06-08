<template>
  <q-page class="bg-grey-1">

    <!-- Toolbar -->
    <div class="toolbar-wrapper">
      <q-toolbar class="shadow-1 bg-white q-pa-md sticky-toolbar">
        <q-toolbar-title class="text-primary">SnekiWebshop</q-toolbar-title>
        <q-btn flat label="Home" to="/" class="q-mx-sm" />
        <q-btn flat label="Accessories" to="/Administration/Accessories" class="q-mx-sm" />
        <q-btn flat label="Products" to="/Administration/Products" class="q-mx-sm" />
      </q-toolbar>
    </div>

    <!-- Sekcija za pretraživanje i filtriranje -->
    <div class="q-mx-lg q-mt-lg row items-center q-gutter-md">
      <!-- Polje za pretraživanje proizvoda i dodataka -->
      <q-input
        filled
        v-model="searchTerm" 
        label="Search products or accessories"
        debounce="300"
        prepend-inner-icon="search"
        class="col-4"
      />

      <!-- Filter tipa proizvoda: svi, proizvodi ili dodaci -->
      <q-select
        v-model="typeFilter"
        :options="typeOptions"
        label="Show"
        class="col-3 type-filter-large"
        emit-value
        map-options
        dense
      />

      <!-- Sortiranje po cijeni (rastuce/padajuce) -->
      <q-select
        v-model="priceSort"
        :options="priceSortOptions"
        label="Sort by Price"
        class="col-3"
        emit-value
        map-options
        dense
      />
    </div>

    <!-- Glavna sekcija za prikaz proizvoda i dodataka -->
    <section class="products-section q-mx-lg">
      <!-- Dinamički naslov sekcije ovisno o odabranom filteru -->
      <h1 class="section-title text-primary">{{ sectionTitle }}</h1>
      <q-separator spaced />
      <div class="q-gutter-lg row justify-center">
        <!-- Karta za svaki proizvod/dodatak -->
        <q-card
          v-for="item in filteredItems"
          :key="item.type + '-' + item.id"
          class="product-card col-12 col-sm-6 col-md-5 col-lg-4"
          ripple
          clickable
        >
        <!-- Slika proizvoda/dodatka -->
          <q-img
            :src="item.imageUrl || 'https://via.placeholder.com/300'"
            :alt="item.name"
            style="height: 240px"
            class="card-img"
          />
          <!-- Sadržaj unutar karte -->
          <q-card-section>
            <div class="text-h6 text-weight-bold">{{ item.name }}</div>
            <div class="text-subtitle1 text-secondary mb-2">
              Price: <span class="text-positive">${{ item.price }}</span>
            </div>
            <div v-if="item.description" class="text-caption text-grey-7 mb-3">{{ item.description }}</div>
            <q-chip
              square
              :color="item.type === 'product' ? 'blue-8' : 'blue-3'"
              text-color="white"
              size="sm"
              class="q-mb-sm static-type-chip"
              style="pointer-events: none; user-select: none;"
            >
              {{ item.type === 'product' ? 'Product' : 'Accessory' }}
            </q-chip>
            <!-- Gumb za dodavanje u košaricu - NE RADI -->
            <q-btn color="primary" label="Add to Cart" size="sm" unelevated class="full-width-btn" />
          </q-card-section>
        </q-card>
      </div>
    </section>

<!-- Sekcija 'About Us' - informacije o trgovini -->
<section class="about-us-section">
  <div class="about-content">
    <h2>About SnekiWebshop</h2>
    <p>
      SnekiWebshop is your go-to destination for the coolest sneakers and
      accessories. We pride ourselves on offering top-quality products,
      exceptional customer service, and a passion for footwear culture.
      Whether you're looking for the latest trends or classic styles, we've
      got you covered.
    </p>
    <p>
      Founded in 2020, SnekiWebshop has quickly become a community favorite,
      dedicated to helping sneaker lovers express their unique style.
      Join us on our journey and step up your shoe game!
    </p>
  </div>
</section>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from 'src/boot/firebase'

export default {
  name: 'HomePage',
  setup() {
    const products = ref([])   // Lista proizvoda
    const accessories = ref([])  // Lista dodataka
    const searchTerm = ref('')  // Tekst za pretraživanje
    const typeFilter = ref('all')  // Filter za tip stavke: svi, proizvodi ili dodaci
    const priceSort = ref('asc')  // Sortiranje po cijeni: asc ili desc
        
    // Opcije za filter tipa
    const typeOptions = [
      { label: 'All', value: 'all' },
      { label: 'Products', value: 'product' },
      { label: 'Accessories', value: 'accessory' }
    ]
    
    // Opcije za sortiranje po cijeni
    const priceSortOptions = [
      { label: 'Price: Low to High', value: 'asc' },
      { label: 'Price: High to Low', value: 'desc' }
    ]
    
    // Funkcija za dohvat proizvoda iz Firestore baze
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'product'
      }))
    }

    const fetchAccessories = async () => {
      const querySnapshot = await getDocs(collection(db, 'accessories'))
      accessories.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'accessory'
      }))
    }
    // Kombinira proizvode i dodatke u jednu listu (computed jer ovisi o products i accessories)
    const combinedItems = computed(() => [...products.value, ...accessories.value])
    // Filtrira i sortira kombiniranu listu na osnovu unosa korisnika i odabranih filtera
    const filteredItems = computed(() => {
      let items = combinedItems.value.filter(item => {
        const matchesType = typeFilter.value === 'all' || item.type === typeFilter.value
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        return matchesType && matchesSearch
      })
      // Sortiranje po cijeni
      items = items.slice().sort((a, b) => {
        if (priceSort.value === 'asc') return a.price - b.price
        return b.price - a.price
      })
      return items
    })

    // Dinamički naslov sekcije koji ovisi o filteru
    const sectionTitle = computed(() => {
      if (typeFilter.value === 'product') return 'Products'
      if (typeFilter.value === 'accessory') return 'Accessories'
      return 'Products & Accessories'
    })
    // Kada se komponenta montira, dohvaća podatke iz Firestore
    onMounted(() => {
      fetchProducts()
      fetchAccessories()
    })
    // Vraća varijable i funkcije dostupne u template-u
    return {
      searchTerm,
      typeFilter,
      typeOptions,
      priceSort,
      priceSortOptions,
      filteredItems,
      sectionTitle
    }
  }
}
</script>

<style scoped>
.section-title {
  font-weight: 600;
  font-size: 1.8rem;
  margin-bottom: 16px;
  color: #222;
}

.product-card {
  max-width: 350px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  border: 2px solid #1976d2;
  background-color: #fff;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
  transform: translateY(-4px);
}

.card-img {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.text-primary {
  color: #1976d2;
}

.text-secondary {
  color: #555;
}

.text-positive {
  color: #2e7d32;
  font-weight: 600;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.full-width-btn {
  width: 100%;
}

.products-section {
  border: 2px solid #1976d2;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
  background-color: #ffffff;
}

.accessories-section {
  border: 2px solid #64b5f6;
  border-radius: 12px;
  padding: 24px;
  margin-top: 48px;
  background-color: #ffffff;
}

.about-us-section {
  background-color: #1976d2;
  color: white;
  padding: 40px 20px;
  border-radius: 8px;
  margin: 80px 0 40px 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.5);
  width: 100%;
}

.about-us-section h2 {
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.about-us-section p {
  max-width: 700px;
  margin: 0 auto 16px auto;
  line-height: 1.5;
  font-size: 1.1rem;
  color: #e3f2fd;
}

.about-content {
  max-width: none;
  width: 100%;
}

.toolbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  width: 100%;
}

.sticky-toolbar {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.static-type-chip {
  font-weight: bold;
  letter-spacing: 0.5px;
}

.type-filter-large .q-field__control {
  min-height: 56px;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
