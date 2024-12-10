// AnimatedDoughnutPlugin.js
export const AnimatedDoughnutPlugin = {
    id: 'animatedDoughnutPlugin',
    beforeDraw: (chart) => {
      const { ctx, chartArea: { width, height }, config: { options: { animation: { currentStep, totalSteps }, targetPercentage } } } = chart;
  
      if (currentStep === undefined || totalSteps === undefined) {
        return;
      }
  
      const percentage = Math.round((currentStep / totalSteps) * targetPercentage);
  
      ctx.save();
      ctx.font = 'bold 30px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, width / 2, height / 2 - 10);
  
      ctx.font = '16px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(`${chart.config.data.label}`, width / 2, height / 2 + 20);
      ctx.restore();
    }
  };
  