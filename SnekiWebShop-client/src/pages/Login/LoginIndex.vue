<template>
  <q-page>
    <div class="q-pa-lg row justify-center">
      <div class="col" style="max-width: 400px">
        <q-form @submit="onLogin">
          <q-card>
            <q-card-section>
              <div class="text-h6">Login</div>
            </q-card-section>
            <q-card-section>
              <div class="q-gutter-md">
                <q-input
                  v-model="email"
                  type="email"
                  label="Your email *"
                  hint="Email to login"
                  lazy-rules
                  :rules="[val => emailPattern.test(val) || 'Please type valid email']"
                />
                <q-input
                  v-model="password"
                  type="password"
                  label="Password *"
                  hint="Password to login"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Please type password']"
                />
              </div>
            </q-card-section>
            <q-card-actions>
              <q-btn
                type="submit"
                color="primary"
                label="Login"
              />
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  name: 'LoginIndex',
  data() {
    return {
      emailPattern: /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/,
      email: null,
      password: null,
      auth: getAuth()
    }
  },
  mounted() {
    if (this.auth.currentUser) {
      this.$router.push('/Administration')
    }
  },
  methods: {
    onLogin() {
      const auth = this.auth
      if (this.email && this.password) {
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then(() => {
            this.$router.push('/Administration')
          })
          .catch((error) => {
            console.log(error)
            this.$q.notify({
              type: 'negative',
              message: 'Login failed.'
            })
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Please enter both email and password.'
        })
      }
    }
  }
}
</script>
