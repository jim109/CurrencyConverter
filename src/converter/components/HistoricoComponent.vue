<template>
    <div>
      <canvas ref="chart"></canvas>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  const chartRef = ref(null);
  const endpoint = 'https://openexchangerates.org/api/historical/';
  const appID = '7a5e9772f56f425eb07d84f9a8210312';
  
  const fechas = ['2023-05-13', '2023-05-14', '2023-05-15']; // Puedes agregar más fechas si lo deseas
  
  const obtenerDatos = async (fecha) => {
    const url = `${endpoint}${fecha}.json?app_id=${appID}&base=USD`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  };
  
  onMounted(async () => {
    if (!chartRef.value) {
    return;
  }
    const datosHistoricos = await Promise.all(fechas.map(obtenerDatos));
    
    const labels = fechas.map((fecha) => new Date(fecha).toLocaleDateString());

    const datasets = Object.keys(datosHistoricos[0].rates).map((currency) => {
      return {
        label: currency,
        data: datosHistoricos.map((datos) => datos.rates[currency]),
        fill: false,
      };
    });
    
     new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
    });
  });
  </script>
  
  <style>
  canvas {
    width: 100%;
    height: 400px;
  }
  </style>
  