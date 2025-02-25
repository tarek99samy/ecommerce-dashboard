import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'primereact/chart';
import '../styles/components/Statistics.scss';

export default function Statistics({ title, values, labels }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = { labels, datasets: [{ data: values }] };
    setChartData(data);
  }, [values, labels]);

  return (
    <div>
      <span>{title}</span>
      <div className='card flex justify-content-center'>
        <Chart type='pie' data={chartData} options={chartOptions} className='w-full md:w-30rem' />
      </div>
    </div>
  );
}
