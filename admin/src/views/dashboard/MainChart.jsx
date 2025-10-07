import React, { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const random = (min = 0, max = 100) => Math.round(Math.random() * (max - min) + min)

  // Generate realistic data for the last 30 days
  const generateData = () => {
    const data = []
    let baseValue = 100
    for (let i = 0; i < 30; i++) {
      baseValue += random(-10, 15)
      data.push(Math.max(50, baseValue))
    }
    return data
  }

  const usersData = generateData()
  const revenueData = generateData().map(val => val * 45) // Revenue in dollars
  const ordersData = generateData().map(val => Math.round(val * 0.8)) // Orders count

  // Generate labels for last 30 days
  const labels = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  }

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Users',
              backgroundColor: `rgba(${getStyle('--cui-primary-rgb')}, .1)`,
              borderColor: getStyle('--cui-primary'),
              pointHoverBackgroundColor: getStyle('--cui-primary'),
              borderWidth: 2,
              data: usersData,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Revenue ($)',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-success'),
              pointHoverBackgroundColor: getStyle('--cui-success'),
              borderWidth: 2,
              data: revenueData,
              tension: 0.4,
            },
            {
              label: 'Orders',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              borderDash: [5, 5],
              data: ordersData,
              tension: 0.4,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                color: getStyle('--cui-body-color'),
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: getStyle('--cui-body-bg'),
              titleColor: getStyle('--cui-body-color'),
              bodyColor: getStyle('--cui-body-color'),
              borderColor: getStyle('--cui-border-color'),
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 10,
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 6,
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 3,
              hitRadius: 10,
              hoverRadius: 6,
              hoverBorderWidth: 2,
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        }}
      />
    </>
  )
}

export default MainChart
