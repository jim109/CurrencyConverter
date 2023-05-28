<template>
    <img :src="`https://api.iconify.design/circle-flags:${flag}.svg`" alt="">
  </template>
  
  <script setup>
  import { defineProps, watch, ref } from 'vue';
  
  const props = defineProps({
    flag: {
      type: String,
      required: true
    }
  });
  
  const flag = ref(props.flag.slice(0, 2).toLowerCase());
  
  watch(() => props.flag, (newFlag) => {
    flag.value = newFlag.slice(0, 2).toLowerCase();
  });
  </script>
  
  <style scoped>
  img {
    width: 46px;
    height: 46px;
  }
  </style>
  