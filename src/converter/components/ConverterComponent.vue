<template>
    <div class="w-80 rounded-lg bg-white shadow-xl p-5 mt-8 lg:w-3/4 lg:p-8">
      <div class="lg:flex lg:justify-between lg:pb-5">
        <div class="py-2.5 lg:w-2/5">
          <label for="base" class="text-gray-text-conv text-xs">FROM</label>
          <div class="flex justify-between lg:pt-3">
            <FlagComponent :flag="base" />
            <select v-model="base" id="base" @change="convert">
              <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
            </select>
            <input @input="convert" type="number" id="amount" v-model="amount" placeholder="Enter here" class="text-right text-lgs text-blue-text focus:outline-none" />
          </div>
        </div>

        <div class="flex justify-center py-4">
          <button class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-900 relative" @click="goChange">
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-4 h-4 border-t-4 border-r-4 border-white transform rotate-45"></div>
              <div class="w-4 h-4 border-t-4 border-r-4 border-white transform -rotate-45 absolute left-0 top-0"></div>
            </div>
          </button>
        </div>

        <div class="py-2.5 lg:w-2/5">
          <label for="target" class="text-gray-text-conv text-xs">TO</label>
          <div class="flex justify-between lg:pt-3">
            <FlagComponent :flag="target" />
            <select v-model="target" id="target" @change="handleChangeTarget">
              <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
            </select>
            <input v-model="result" type="text" placeholder="000" class="text-right text-blue-text focus:outline-none" />
          </div>
        </div>
      </div>
      <div class="flex">
        <CanvasComponent :target="target" />
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2'

import CanvasComponent from './CanvasComponent.vue';
import FlagComponent from './FlagComponent.vue';

const apiKey = '7a5e9772f56f425eb07d84f9a8210312';
const apiUrl = 'https://openexchangerates.org/api/latest.json?';
const amount = ref('');
const base = ref('USD');
const target = ref('EUR');
const result = ref(null);
const currencies = ref([]);

axios
  .get(apiUrl, {
    params: {
      app_id: apiKey,
    },
  })
  .then(response => {
    currencies.value = Object.keys(response.data.rates);
  })
  .catch(error => {
    console.error('Error al obtener las tasas de cambio:', error);
  });

  const convert = () => {
  axios
    .get(apiUrl, {
      params: {
        app_id: apiKey,
        base: base.value,
      },
    })
    .then(response => {
      const rates = response.data.rates;
      if (target.value in rates) {
        result.value = (amount.value * rates[target.value]).toFixed(2);
      } else {
        result.value = 'Moneda objetivo no válida';
      }
    })
    .catch(error => {
      console.error('Error al convertir la moneda:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al convertir la moneda:',
        text:  target.value,
      })
    });
};
const handleChangeTarget = () => {
  convert(); // Realizar la conversión al cambiar la moneda objetivo
};
const goChange = () => {
  const temp = base.value;
  base.value = target.value;
  target.value = temp;
  result.value = null;
  convert();
};
</script>

