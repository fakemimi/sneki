<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu" aria-label="Menu" />
        <q-toolbar-title>
          SnekiWebshop Administration
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/Administration/Accessories">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Accessories</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/Administration/Products">
          <q-item-section avatar>
            <q-icon name="shopping_bag" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Products</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="goHome">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LogOut</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

export default {
  name: 'AdministrationLayout',
  setup() {
    const leftDrawerOpen = ref(false)
    const router = useRouter()
    const auth = getAuth()
    const logout = () => {
      signOut(auth).then(() => {
        router.push('/')
      })
    }
    const goHome = () => {
      router.push('/')
    }
    return {
      leftDrawerOpen,
      logout,
      goHome
    } 
  } 
}
</script>


