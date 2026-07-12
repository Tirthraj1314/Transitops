require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

const vehicleRoutes = require('./src/routes/vehicleRoutes');
app.use('/api/vehicles', vehicleRoutes);

const driverRoutes = require('./src/routes/driverRoutes');
app.use('/api/drivers', driverRoutes);

const tripRoutes = require('./src/routes/tripRoutes');
app.use('/api/trips', tripRoutes);

const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
app.use('/api/maintenance', maintenanceRoutes);

const fuelRoutes = require('./src/routes/fuelRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
app.use('/api/fuel', fuelRoutes);
app.use('/api/expenses', expenseRoutes);

const dashboardRoutes = require('./src/routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const reportRoutes = require('./src/routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const invoiceRoutes = require('./src/routes/invoiceRoutes');
app.use('/api/invoices', invoiceRoutes);

const notificationRoutes = require('./src/routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const auditLogRoutes = require('./src/routes/auditLogRoutes');
app.use('/api/audit-logs', auditLogRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TransitOps API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});