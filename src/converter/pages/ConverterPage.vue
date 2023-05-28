<template>
  <div class="flex flex-col items-center min-h-min">
    <div class="w-80 px-2 pt-5 text-center lg:w-3/4">
      <p class="text-xs">FAST MONEY</p>
      <h1 class="text-3xl py-3 black-text-title lg:text-7xl">Currency converter</h1>
      <p class="black-text-min">Convert popular currencies from around the world with updated exchange rates using our calculator.</p>
    </div>

    <div class="w-80 rounded-lg bg-white shadow-xl p-5 mt-8 lg:w-3/4 lg:p-8">
      <ConverterComponent />
    </div>

    <div class="w-96 px-4 pt-5 pb-8 text-center lg:w-4/5">
      <p class="text-sm">Currency calculation tools use reference exchange rates obtained from major market data sources</p>
    </div>
  </div>
  
</template>

<script setup>
import ConverterComponent from '../components/ConverterComponent.vue';
</script>

