const Company = require('../models/Company');
const { logAudit } = require('../utils/audit');

// @desc  Create a company
// @route POST /api/companies
const createCompany = async (req, res) => {
  try {
    const { name, contactEmail, contactPhone, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Company.findOne({ name });
    if (existing) return res.status(400).json({ message: 'A company with this name already exists' });

    const company = await Company.create({ name, contactEmail, contactPhone, address });
    logAudit(req, 'CREATE_COMPANY', 'Company', company._id, company.name);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all companies
// @route GET /api/companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a company
// @route PUT /api/companies/:id
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    Object.assign(company, req.body);
    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a company
// @route DELETE /api/companies/:id
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    await company.deleteOne();
    logAudit(req, 'DELETE_COMPANY', 'Company', company._id, company.name);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCompany, getCompanies, updateCompany, deleteCompany };
