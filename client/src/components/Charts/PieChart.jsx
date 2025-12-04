// components/Charts/PieChart.jsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import FloatingActionButton from '../UI/FloatingActionButton/FloatingActionButton';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartContainer = styled.div`
	background: white;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	margin-bottom: 24px;
	text-align: right;
`;

const ChartTitle = styled.h3`
	margin: 0 0 20px 0;
	color: #333;
	font-size: 18px;
	font-weight: 600;
	text-align: center;
`;

const NoDataMessage = styled.div`
	text-align: center;
	color: #6c757d;
	padding: 40px;
	font-size: 16px;
`;

const PieChart = ({ data, type, title, activeTab }) => {
	const navigate = useNavigate();

	// Если нет данных, показываем сообщение
	if (!data || data.length === 0) {
		return (
			<ChartContainer>
				<ChartTitle>{title}</ChartTitle>
				<NoDataMessage>
					{type === 'income' ? 'Нет данных о доходах' : 'Нет данных о расходах'}
				</NoDataMessage>
				<FloatingActionButton transactionType={activeTab} />
			</ChartContainer>
		);
	}

	// Подготавливаем данные для Chart.js
	const chartData = {
		labels: data.map(item => item.categoryName),
		datasets: [
			{
				data: data.map(item => item.amount),
				backgroundColor: data.map(item => item.color),
				borderColor: data.map(item => item.color),
				borderWidth: 2,
				hoverOffset: 8,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					padding: 20,
					usePointStyle: true,
					pointStyle: 'circle',
					font: {
						size: 12,
						family: "'Inter', sans-serif",
					},
					generateLabels: chart => {
						const datasets = chart.data.datasets;
						return chart.data.labels.map((label, i) => {
							const value = datasets[0].data[i];
							const total = datasets[0].data.reduce((a, b) => a + b, 0);
							const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

							return {
								text: `${label} - ${percentage}%`,
								fillStyle: datasets[0].backgroundColor[i],
								strokeStyle: datasets[0].borderColor[i],
								lineWidth: datasets[0].borderWidth,
								pointStyle: datasets[0].pointStyle,
								hidden: false,
								index: i,
							};
						});
					},
				},
			},
			tooltip: {
				callbacks: {
					label: context => {
						const label = context.label || '';
						const value = context.parsed;
						const total = context.dataset.data.reduce((a, b) => a + b, 0);
						const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

						return `${label}: ${value.toLocaleString('ru-RU')} ₽ (${percentage}%)`;
					},
				},
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				titleFont: {
					size: 14,
				},
				bodyFont: {
					size: 13,
				},
				padding: 12,
				cornerRadius: 8,
			},
		},
		onClick: (event, elements) => {
			if (elements.length > 0) {
				const index = elements[0].index;
				const categoryId = data[index].categoryId;
				// Переход на страницу категории
				navigate(`/category/${categoryId}`);
			}
		},
		cutout: '50%', // Для doughnut chart, для обычного pie - убрать эту строку
	};

	return (
		<ChartContainer>
			<ChartTitle>{title}</ChartTitle>
			<div style={{ height: '400px', position: 'relative' }}>
				<Pie data={chartData} options={options} />
			</div>
			<FloatingActionButton transactionType={activeTab} />
		</ChartContainer>
	);
};

export default PieChart;
