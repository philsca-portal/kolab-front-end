"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Chart, { TooltipItem } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { useTheme } from 'next-themes';
import NoSchedule from './no-schedule';
import { format } from 'date-fns';

interface TimelineProps {
    date: string | undefined;
    data: {
        x: Date[];
        y: string;
        z: string;
    }[]
}

const Timeline: React.FC<TimelineProps> = ({
    date,
    data
}) => {

    const [filteredData, setFilteredData] = useState<{
        x: Date[];
        y: string;
        z: string;
    }[]>([]);

    useEffect(() => {
        if (date) {
            const filterData = data.filter((item) => format(item.x[0], "yyyy-MM-dd") === date);
            setFilteredData(filterData);
        }
    }, [data, date]);

    const { theme } = useTheme();

    const chartRef = useRef<HTMLCanvasElement>(null);

    const createChart = useCallback(() => {
        if (chartRef.current) {
            if ((chartRef.current as any).chart) {
                (chartRef.current as any).chart.destroy();
            }

            const context = chartRef.current.getContext('2d');
            if (context) {
                Chart.register({
                    id: 'todayLine',
                    afterDatasetsDraw: (chart: any, args: any, pluginOptions: any) => {
                        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
                        ctx.save();

                        ctx.beginPath();
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(x.getPixelForValue(new Date()), top);
                        ctx.lineTo(x.getPixelForValue(new Date()), bottom);
                        ctx.strokeStyle = 'rgb(107 114 128)';
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(x.getPixelForValue(new Date()), top, 4, 0, 2 * Math.PI);
                        ctx.fillStyle = 'rgb(107 114 128)';
                        ctx.fill();

                        ctx.restore();
                    }
                });

                const newChart = new Chart(context, {
                    type: 'bar',
                    data: {
                        datasets: [
                            {
                                data: filteredData,
                                backgroundColor: [
                                    `${theme === 'dark' ? 'rgba(255, 99, 132, 0.4)' : 'rgba(255, 99, 132, 0.6)'}`,
                                    `${theme === 'dark' ? 'rgba(255, 159, 64, 0.4)' : 'rgba(255, 159, 64, 0.6)'}`,
                                    `${theme === 'dark' ? 'rgba(255, 205, 86, 0.4)' : 'rgba(255, 205, 86, 0.6)'}`,
                                ],
                                borderSkipped: false,
                                borderWidth: 1,
                                borderRadius: 10,
                                barPercentage: 0.4,
                                hoverBackgroundColor: 'rgba(255, 99, 132)'
                            },
                        ],
                    },
                    options: {
                        animation: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    title: (ctx: TooltipItem<'bar'>[]) => {
                                        const startDate = new Date((ctx[0].raw as { x: string[] }).x[0]);
                                        const endDate = new Date((ctx[0].raw as { x: string[] }).x[1]);

                                        const formattedStartDate = startDate.toLocaleString([], {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        });

                                        const formattedEndDate = endDate.toLocaleString([], {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        });

                                        return `Meeting: ${formattedStartDate} - ${formattedEndDate}`;
                                    },
                                    label: (ctx: TooltipItem<'bar'>) => {
                                        return (ctx.raw as { x: Array<number>, y: string, z: string }).z;
                                    }
                                }
                            }
                        },
                        indexAxis: 'y',
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'hour',
                                },
                                min: `${date + 'T00:00:00'}`,
                                max: `${date + 'T23:59:59'}`,
                                grid: {
                                    color: `${theme === 'dark' ? 'rgb(30,41,59)' : 'rgba(0,0,0,0.1)'}`,
                                },
                                position: 'top',
                                border: {
                                    color: 'rgba(0, 0, 0, 0)'
                                },
                                ticks: {
                                    font: {
                                        family: "'__Inter_aaf875', '__Inter_Fallback_aaf875'",
                                        weight: 'bold'
                                    },
                                    padding: 20,
                                    stepSize: 2,
                                }
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0, 0, 0, 0)',
                                },
                                border: {
                                    color: 'rgba(0, 0, 0, 0)'
                                },
                                ticks: {
                                    display: false
                                }
                            },
                        },
                    },
                });

                (chartRef.current as any).chart = newChart;
            }
        }
    }, [chartRef, filteredData, date, theme]);

    useEffect(() => {
        if (data.length !== 0) {
            createChart();
        }
    }, [createChart, data.length, filteredData, date]);

    return (
        // Pertaing to the picked Date noSchedule
        <div className={`relative w-full ${filteredData.length === 0 ? 'h-full' : 'mb-10 h-[300px] md:mb-0 md:h-[600px]'}`}>
            {date && filteredData.some(item => new Date(date) > new Date(item.x[0])) || filteredData.length === 0 ?
                <NoSchedule />
                :
                <canvas ref={chartRef}></canvas>}
        </div>
    );
};

export default Timeline;
