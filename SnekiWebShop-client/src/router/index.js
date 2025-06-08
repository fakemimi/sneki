import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function isUserLoggedIn() {
  return new Promise((resolve) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, user => {
      resolve(user)
      unsubscribe()
    }, () => {
      resolve(null)
      unsubscribe()
    })
  })
}

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta && record.meta.auth)) {
      const user = await isUserLoggedIn()
      if (user) {
        next()
      } else {
        next('/Login')
      }
    } else {
      next()
    }
  })

  return Router
})
