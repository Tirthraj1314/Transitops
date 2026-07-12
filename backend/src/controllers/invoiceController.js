const Invoice = require('../models/Invoice');

// @desc  Get all invoices
// @route GET /api/invoices?status=
const getInvoices = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .populate('trip', 'source destination')
      .sort({ issuedAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Mark an invoice as paid
// @route PATCH /api/invoices/:id/pay
const markInvoicePaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    invoice.status = 'Paid';
    invoice.paidAt = new Date();
    await invoice.save();
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInvoices, markInvoicePaid };
