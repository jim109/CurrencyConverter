
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
  //Revisamos cambios en props.target y actualizamos el valor de paresMonedas
  watch(() => props.target, async(newValue) => {
    paresMonedas = newValue; // Actualizar paresMonedas con el nuevo valor de target.value
    console.log(paresMonedas);
    createChart(datosPares.value); // Volver a generar la gráfica con los nuevos datos
  });
  
  

const useCreateChart = (datosPares) => {
    if (datosPares && paresMonedas in datosPares) {
      const ctx = lineChartRef.value.getContext('2d');
  
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
  
      window.addEventListener('resize', () => {
        if (lineChartRef.value && lineChartRef.value.chart) {
        lineChartRef.value.chart.resize();
        }
      });
    }
    return {
        createChart,
    }
  };

  export default useCreateChart