require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const accountRoutes = require('./routes/accounts');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const summaryRoutes = require('./routes/summary');
const chalk = require('chalk');

const port = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/^\/(?!api).*/, (req, res, next) => {
	if (req.path.startsWith('/api')) {
		return next();
	}
	if (req.path.includes('.')) {
		return next();
	}
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use('/api', routes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/summary', summaryRoutes);

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		app.listen(port, () => {
			console.log(chalk.green(`Server started on port ${port}...`));
		});
	})
	.catch(error => console.error(chalk.bgRed('Could not connect to MongoDB...'), error));
