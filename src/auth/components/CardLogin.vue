<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import useAuth from '../composable/useAuth'
import Swal from 'sweetalert2'
import NavBar from '../../shared/components/NavBar.vue';
import FooterBar from '../../shared/components/FooterBar.vue';

const router = useRouter()
const { loginUser } = useAuth()

const correo = ref('');
const password = ref('');
const remember = ref(false);

const onSubmit = async () => {
  const user = {
    correo: correo.value,
    password: password.value
  }
  const { ok, message } = await loginUser(user)

  if (!ok) {
    Swal.fire('Error', message, 'error')
  } else {
    router.push({ name: 'converter' })
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen min-w-max">
    <div class="flex flex-grow flex-col w-full lg:w-1/2">
      <header class="lg:static lg:left-0 pl-5 ">
        <NavBar />
      </header>
    <div class="flex flex-grow flex-col justify-center text-center ">
      <div class="flex flex-col content-center flex-wrap" >
        <div class="flex flex-col items-center mb-1">
          <h1 class="text-3xl font-semibold mb-4">Login to account</h1>
          <p class="text-base text-gray-text mb-6 text-center">Enter your credentials to access your account</p>
        </div>
        <form @submit.prevent="onSubmit" class="w-full lg:w-2/3 flex flex-col">
          <div class="mb-4 text-center">
            <input v-model="correo" type="email" id="correo" name="correo" placeholder="Enter email" required class="w-80 lg:w-full px-4 py-2 border border-gray-line rounded-md bg-gray-box focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm">
          </div>
          <div class="mb-4">
            <input v-model="password" type="password" id="password" name="password" placeholder="Enter password" required class="w-80 lg:w-full px-4 py-2 border border-gray-line rounded-md bg-gray-box focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm">
          </div>
          <div class="mb-4">
            <input :checked="remember" type="checkbox" id="remember" name="remember" class="mr-2 border-gray-line shadow-sm">
            <label for="remember">Remember machine for 30 days</label>
          </div>
          <button type="submit" class="w-80 lg:w-full mx-auto bg-regal-blue hover:bg-blue-600 text-white font-medium py-2 rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
    <footer class="mt-auto w-full md:w-3/4 lg:w-3/4 mx-auto flex flex-col">
      <FooterBar />
    </footer>
    </div>
    <div>
      <img src="@/assets/imageLogin.png" alt="Background Image" class="hidden lg:block absolute top-0 right-0 h-full w-1/2 object-cover">
    </div>
  </div>
</template>

  
<style lang="scss" scoped>

</style>