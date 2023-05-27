<template>
  <div class="flex flex-col items-center h-screen">
    <div class="w-80 px-2 pt-5 text-center lg:w-4/5">
      <p class="text-xs">FAST MONEY</p>
      <h1 class="text-3xl py-3 black-text-title lg:text-7xl">Currency converter</h1>
      <p class=" black-text-min">Convert popular currencies from around the world with updated exchange rates using our calculator.</p>
    </div>

    <div class="w-80 rounded-lg bg-white shadow-xl p-5 mt-8 lg:w-4/5 lg:p-8 ">
      <div class="lg:flex flex-row lg:justify-between lg:pb-5">
        <div class="py-2.5 lg:w-2/5">
        <label for="base" class="text-gray-text-conv text-xs">FROM</label>
        <div class="flex justify-between lg:pt-3">
          <UsdFlag />
          <select v-model="base" id="base" @change="convert">
            <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
          </select>
          <input @input="convert" type="number" id="amount" v-model="amount" placeholder="Enter here" class="text-right text-lgs text-blue-text focus:outline-none" />
        </div>
      </div>

      <div class="flex justify-center py-4">
        <button class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-900 relative" @click="goLeft">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-4 h-4 border-t-4 border-r-4 border-white transform rotate-45"></div>
            <div class="w-4 h-4 border-t-4 border-r-4 border-white transform -rotate-45 absolute left-0 top-0"></div>
          </div>
        </button>
      </div>

      <div class="py-2.5 lg:w-2/5">
        <label for="target" class="text-gray-text-conv text-xs">TO</label>
        <div class="flex justify-between lg:pt-3">
          <UsdFlag />
          <select v-model="target" id="target" @change="handleChangeTarget">
            <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
          </select>
          <input v-model="result" type="text" placeholder="000" class="text-right text-blue-text focus:outline-none" />
        </div>
      </div>
      </div>
      <div>
        <canvas ref="lineChartRef" style="width: 100%; height: 381px;" class="canva"></canvas>
      </div>
      
    </div>
    <div class="w-96 px-4 pt-5 pb-8 text-center lg:w-4/5">
      <p class="text-sm">Currency calculation tools use reference exchange rates obtained from major market data sources</p>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import UsdFlag from '../components/icons/UsdFlag.vue';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2'

const apiKey = '7a5e9772f56f425eb07d84f9a8210312';
const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=7a5e9772f56f425eb07d84f9a8210312';

const amount = ref('');
const base = ref('USD');
const target = ref('EUR');
const result = ref(null);
const currencies = ref([]);
const lineChartRef = ref(null);
const datosPares = ref({});


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
      console.log(response.data);
      const rates = response.data.rates;
      
      if (target.value in rates) {
        result.value = (amount.value * rates[target.value]).toFixed(2);
        console.log(result.value);
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
  createChart(datosPares.value); // Volver a generar la gráfica con los nuevos datos
};
const goLeft = () => {
  const temp = base.value;
  base.value = target.value;
  target.value = temp;
  result.value = null;
  convert();
};

const endpoint = 'https://openexchangerates.org/api/historical/';
const appID = '7a5e9772f56f425eb07d84f9a8210312';

const cantidadDias = 7; // La cantidad de días que deseas generar

const fechas = [];
const fechaActual = new Date(); // Fecha actual

for (let i = cantidadDias - 1; i >= 0; i--) {
  const fecha = new Date(fechaActual);
  fecha.setDate(fechaActual.getDate() - i);
  const formattedDate = fecha.toISOString().split('T')[0];
  fechas.push(formattedDate);
}

const obtenerDatos = async (fecha) => {
  const url = `${endpoint}${fecha}.json?app_id=${appID}&base=USD`;
  const response = await fetch(url);
  const data = await response.json();
  return data.rates;
};


let paresMonedas = target.value

onMounted(async () => {
  const datosHistoricos = await Promise.all(fechas.map(obtenerDatos))
  // Pares de monedas que deseas almacenar
  const datosPares = {};

  if (paresMonedas in datosHistoricos[0]) {
    datosPares[paresMonedas] = datosHistoricos.map((datos) => datos[paresMonedas]);
  }

  if (datosPares) {
  createChart(datosPares);
}
});

watch(() => target.value, async(newValue) => {
  paresMonedas = newValue; // Actualizar paresMonedas con el nuevo valor de target.value
  createChart(datosPares.value); // Volver a generar la gráfica con los nuevos datos
});



////////////////////////////////////



onMounted(() => {
  Chart.register(...registerables);
  createChart();
});

const createChart = (datosPares) => {
  if (datosPares && paresMonedas in datosPares) {
    const ctx = lineChartRef.value.getContext('2d');
console.log(ctx);
    // Destruir el gráfico existente si ya existe
    if (lineChartRef.value.chart) {
      lineChartRef.value.chart.destroy();
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, 700);
    gradient.addColorStop(0, 'rgba(235,241,253,1)');   
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    // Configuración del gráfico
    const chartConfig = {
      type: 'line',
      
      data: {
        labels: fechas,
        datasets: [
          {
            label: `From US Dollar to ${paresMonedas}`,
            data: datosPares[paresMonedas],
            fill: true, // Deshabilita el relleno del área bajo la línea
            borderColor: 'rgba(23, 81, 208, 1)', // Color de la línea
            tension: 0, // Líneas rectas en lugar de curvas > numero da curva
            backgroundColor: gradient,
            borderWidth: 2, // Ancho de la línea
            pointRadius: 0, // Elimina los puntos circulares
            pointHoverRadius: 0, // Elimina los puntos circulares al pasar el ratón
          },
        ],
      },
      options: {
    scales: {
      x: {
        display: false, // Oculta el eje x
      },
      y: {
        display: true, // Oculta el eje y
        grid: {
          color: 'rgba(239, 240, 242, 1)',
          borderWidth: 1,
          drawBorder: false,
          drawTicks: false,
        },
      },
    },
    plugins: {
          legend: {
            borderColor: 'rgba(0, 0, 0, 0)', // Oculta la línea de borde del elemento de leyenda
          },
        },
  },
    };

    // Crear el gráfico
    lineChartRef.value.chart = new Chart(ctx, chartConfig);
    console.log(chartConfig);
  }
};
watch(() => target.value, async (newValue) => {
  paresMonedas = newValue; // Actualizar paresMonedas con el nuevo valor de target.value
  const datosHistoricos = await Promise.all(fechas.map(obtenerDatos));

  if (paresMonedas in datosHistoricos[0]) {
    datosPares.value = { [paresMonedas]: datosHistoricos.map((datos) => datos[paresMonedas]) };
  } else {
    datosPares.value = {};
  }

  createChart(datosPares.value); // Volver a generar la gráfica con los nuevos datos
});

</script>
<style scoped>
.canva {
  width: 100vw;
  height: 60vh; /* Ajusta la altura según tus necesidades */
}

</style>
