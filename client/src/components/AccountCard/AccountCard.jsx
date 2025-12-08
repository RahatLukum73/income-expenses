// src/components/AccountCard/AccountCard.jsx
import styled from 'styled-components';
import { Button } from '../UI/Button/Button';

const Card = styled.div`
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	border-left: 6px solid ${props => props.$color || '#3B82F6'};
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}
`;

const CardHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
`;

const AccountInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const Icon = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 10px;
	background: ${props => props.$color}20;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	color: ${props => props.$color};
`;

const AccountDetails = styled.div`
	flex: 1;
`;

const AccountName = styled.h3`
	margin: 0 0 4px 0;
	font-size: 18px;
	font-weight: 600;
	color: #333;
`;

const AccountMeta = styled.div`
	display: flex;
	gap: 12px;
	font-size: 14px;
	color: #6c757d;
`;

const CurrencyBadge = styled.span`
	background: #f8f9fa;
	padding: 2px 8px;
	border-radius: 12px;
	font-weight: 500;
`;

const TransactionCount = styled.span`
	background: ${props => (props.$hasTransactions ? '#fff3cd' : '#d1ecf1')};
	color: ${props => (props.$hasTransactions ? '#856404' : '#0c5460')};
	padding: 2px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	cursor: ${props => (props.$hasTransactions ? 'help' : 'default')};
	position: relative;

	&:hover::after {
		content: ${props => (props.$hasTransactions ? '"Нажмите для просмотра транзакций"' : '""')};
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background: #333;
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		white-space: nowrap;
		z-index: 1000;
		margin-bottom: 4px;
	}
`;

const Balance = styled.div`
	text-align: right;
`;

const BalanceAmount = styled.div`
	font-size: 24px;
	font-weight: 700;
	color: #333;
	margin-bottom: 4px;
`;

const BalanceLabel = styled.div`
	font-size: 12px;
	color: #6c757d;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const CardActions = styled.div`
	display: flex;
	gap: 8px;
	margin-top: 16px;
	padding-top: 16px;
	border-top: 1px solid #e9ecef;
`;

const ActionButton = styled(Button)`
	flex: 1;
	font-size: 14px;
`;

const DeleteButton = styled(ActionButton)`
	background: #f8f9fa;
	color: #dc3545;
	border: 1px solid #dc3545;

	&:hover:not(:disabled) {
		background: #dc3545;
		color: white;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		position: relative;

		&::after {
			content: 'Нельзя удалить счет с транзакциями';
			position: absolute;
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
			background: #333;
			color: white;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: 12px;
			white-space: nowrap;
			z-index: 1000;
			margin-bottom: 4px;
			opacity: 0;
			transition: opacity 0.2s;
		}

		&:hover::after {
			opacity: 1;
		}
	}
`;

// Маппинг эмодзи для иконок
const iconEmojiMap = {
	wallet: '💰',
	'credit-card': '💳',
	bank: '🏦',
	cash: '💵',
	'piggy-bank': '🐷',
	mobile: '📱',
	card: '💳',
	savings: '📈',
	invest: '📊',
	loan: '🏦',
};

const AccountCard = ({ account, onEdit, onDelete, onViewTransactions, formatCurrency }) => {
	const { _id, name, balance, currency, color, icon, transactionCount = 0 } = account;

	const hasTransactions = transactionCount > 0;

	const formattedBalance = formatCurrency
		? formatCurrency(balance, currency)
		: `${balance.toLocaleString('ru-RU')} ${currency}`;

	const iconEmoji = iconEmojiMap[icon] || '📁';

	const getTransactionText = () => {
		if (transactionCount === 0) return 'Нет транзакций';
		if (transactionCount === 1) return '1 транзакция';
		if (transactionCount < 5) return `${transactionCount} транзакции`;
		return `${transactionCount} транзакций`;
	};

	const handleViewTransactions = () => {
		if (hasTransactions && onViewTransactions) {
			onViewTransactions(_id);
		}
	};

	return (
		<Card $color={color}>
			<CardHeader>
				<AccountInfo>
					<Icon $color={color}>{iconEmoji}</Icon>
					<AccountDetails>
						<AccountName>{name}</AccountName>
						<AccountMeta>
							<CurrencyBadge>{currency}</CurrencyBadge>
							<TransactionCount $hasTransactions={hasTransactions} onClick={handleViewTransactions}>
								{getTransactionText()}
							</TransactionCount>
						</AccountMeta>
					</AccountDetails>
				</AccountInfo>
				<Balance>
					<BalanceAmount>{formattedBalance}</BalanceAmount>
					<BalanceLabel>Баланс</BalanceLabel>
				</Balance>
			</CardHeader>

			<CardActions>
				<ActionButton $variant="secondary" onClick={() => onEdit(account)}>
					Редактировать
				</ActionButton>
				<DeleteButton
					$variant="secondary"
					onClick={e => {
						e.stopPropagation();
						onDelete(_id, hasTransactions);
					}}
					disabled={hasTransactions}
					title={hasTransactions ? 'Нельзя удалить счет с транзакциями' : 'Удалить счет'}
				>
					Удалить
				</DeleteButton>
			</CardActions>
		</Card>
	);
};

export default AccountCard;
