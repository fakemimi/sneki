const routes = [
  {
    path: '/Login',
    component: () => import('layouts/LoginPageLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login/LoginIndex.vue') }
    ]
  },
  {
  path: '/Administration',
  component: () => import('layouts/AdministrationLayout.vue'),
  meta: { auth: true },
  children: [
    { path: '', meta: { auth: true }, component: () => import('pages/Administration/AccessoriesIndex.vue') },
    { path: 'Accessories', meta: { auth: true }, component: () => import('pages/Administration/AccessoriesIndex.vue') },
    { path: 'Products', meta: { auth: true }, component: () => import('pages/Administration/ProductsIndex.vue') }
  ]
},
  {
  path: '/',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/IndexPage.vue') }
  ]
},
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
export default routes
