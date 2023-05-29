<template>
  <div class="canvas-container">
      <canvas ref="lineChartRef"  class="canva"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

const props = defineProps ({
  target: {
    type: String,
    required: true
  }
})
const lineChartRef = ref(null);
const datosPares = ref({});
let paresMonedas = 'EUR'
const endpoint = 'https://openexchangerates.org/api/historical/'
const appID = process.env.APP_ID
const cantidadDias = 7; // La cantidad de días que deseas generar
const fechas = [];
const fechaActual = new Date(); // Fecha actual

//Generamos la cantidad de dias desde la fecha actual -1, y por la cantidad de dias solicitados
for (let i = cantidadDias - 1; i >= 0; i--) {
  const fecha = new Date(fechaActual);
  fecha.setDate(fechaActual.getDate() - i)
  const formattedDate = fecha.toISOString().split('T')[0]
  fechas.push(formattedDate)
}
//Obtenemos los datos con las fechas solicitadas
const obtenerDatos = async (fecha) => {
  const url = `${endpoint}${fecha}.json?app_id=${appID}&base=USD`
  const response = await fetch(url)
  const data = await response.json()
  return data.rates
};

//reemplazamos el valor de la fecha actual para enviar al grafico solo el dia
const fechaGrafico = fechas.map(fecha => {
  const fechaObjeto = new Date(fecha)
  const dia = fecha.slice(-2)
  const mes = fechaObjeto.toLocaleString('default', { month: 'short' }).toUpperCase()

  return `${dia} ${mes}`//Array['22 MAY', '23 MAY']
})


const createChart = (datosPares) => {
  if (datosPares && paresMonedas in datosPares) {
    const ctx = lineChartRef.value.getContext('2d')

    // Destruir el gráfico existente si ya existe
    if (lineChartRef.value.chart) {
      lineChartRef.value.chart.destroy()
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, 700)
    gradient.addColorStop(0, 'rgba(235,241,253,1)') 
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    // Configuración del gráfico
    const chartConfig = {
      type: 'line',
      
      data: {
        labels: fechaGrafico,
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
        maintainAspectRatio: false,
    scales: {
      x: {
        display: true, // Oculta el eje x
        grid: {
          color: 'rgba(255, 255, 255, 1)',
          drawBorder: false,
          drawTicks: false,
        }
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
        },
  },
    };
    // Crear el gráfico
    lineChartRef.value.chart = new Chart(ctx, chartConfig)
  }
};

onMounted(async () => {
  const datosHistoricos = await Promise.all(fechas.map(obtenerDatos))
  // Pares de monedas que deseas almacenar
  const datosPares = {};
  if (paresMonedas in datosHistoricos[0]) {
    datosPares[paresMonedas] = datosHistoricos.map((datos) => datos[paresMonedas])
  }
  if (datosPares) {
  createChart(datosPares)
}
});
//Revisamos cambios en props.target y actualizamos el valor de paresMonedas
watch(() => props.target, async(newValue) => {
  paresMonedas = newValue // Actualizar paresMonedas con el nuevo valor de target.value
  createChart(datosPares.value) // Volver a generar la gráfica con los nuevos datos
});

onMounted(() => {
  Chart.register(...registerables)

const updateChart = async () => {
    const datosHistoricos = await Promise.all(fechas.map(obtenerDatos))

    if (paresMonedas in datosHistoricos[0]) {
      datosPares.value = { [paresMonedas]: datosHistoricos.map((datos) => datos[paresMonedas]) }
    } else {
      datosPares.value = {}
    }
    createChart(datosPares.value)
  };

  onMounted(async () => {
    const datosHistoricos = await Promise.all(fechas.map(obtenerDatos))
    if (paresMonedas in datosHistoricos[0]) {
      datosPares.value = { [paresMonedas]: datosHistoricos.map((datos) => datos[paresMonedas]) }
    }
    if (datosPares.value) {
      createChart(datosPares.value)
    }
  });

  watch(() => props.target, async (newValue) => {
    paresMonedas = newValue
    await updateChart()
  });
  window.addEventListener('resize', () => {
      if (lineChartRef.value && lineChartRef.value.chart) {
      lineChartRef.value.chart.resize()
      }
    });
});

</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 40vh; 
}
.canva {
  margin: 0;
}
</style>