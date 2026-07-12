# TransitOps — Master Project Specification

**Project Name:** TransitOps — Smart Transport Operations Platform

## Project Goal

A modern SaaS web application for transport companies to manage the complete lifecycle of fleet operations, replacing Excel sheets and paper logs. Covers:

- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel
- Expenses
- Reports
- Analytics
- User Roles

Everything automated with proper validations.

## User Roles

There are 5 user roles: **Super Admin**, **Fleet Manager**, **Dispatcher**, **Safety Officer**, **Finance Manager**.

---

### 1. Super Admin

Highest authority. No restrictions.

**Can:** Manage users, manage roles, view all companies, system settings, reports, dashboard, backup, audit logs.

**Sidebar:** Dashboard, Companies, Users, Roles, Fleet, Drivers, Trips, Maintenance, Fuel, Expenses, Reports, Settings, Audit Logs, Profile

**Dashboard widgets:** Total Companies, Total Vehicles, Active Trips, Maintenance, Revenue, Expenses, Fleet Utilization, Charts

---

### 2. Fleet Manager

Responsible for vehicles.

**Can:** Add/Edit/Delete Vehicle, Vehicle Documents, Maintenance, Assign Vehicles, Vehicle Analytics

**Cannot:** Financial Settings, Manage Users

**Sidebar:** Dashboard, Vehicles, Maintenance, Documents, Trips, Reports, Profile

**Dashboard widgets:** Available Vehicles, Vehicles on Trip, Maintenance Vehicles, Retired Vehicles, Vehicle Utilization, Recent Trips, Upcoming Maintenance

**Vehicle Details Page fields:** Registration Number, Model, Vehicle Type, Manufacturer, Year, Color, Insurance, PUC, Fitness Certificate, Registration Date, Purchase Cost, Current Value, Load Capacity, Fuel Type, Mileage, Status, Location, GPS, Documents, Images, Service History, Trip History, Fuel History, Expenses

**Buttons:** Edit, Delete, Upload Documents, View Trips, Schedule Maintenance, Retire Vehicle

---

### 3. Dispatcher

Creates trips.

**Can:** Create Trip, Assign Vehicle, Assign Driver, Track Trip, Complete Trip, Cancel Trip

**Cannot:** Edit Vehicle, Delete Drivers, Financial Reports

**Sidebar:** Dashboard, Trips, Vehicles, Drivers, Map, Reports, Profile

**Dashboard widgets:** Today's Trips, Pending Trips, Completed Trips, Delayed Trips, Vehicle Availability, Driver Availability

**Trip Creation Screen fields:** Source, Destination, Customer, Vehicle, Driver, Cargo Weight, Distance, Expected Time, Trip Start, Trip End, Cargo Type, Priority, Special Notes

**Buttons:** Save Draft, Dispatch, Cancel

**Automatic validation on dispatch:** vehicle available, driver available, license valid, vehicle not in maintenance, cargo within limit, driver not suspended, vehicle not retired

**Trip status flow:** Draft → Scheduled → Dispatched → In Progress → Completed / Cancelled

- **On Dispatch:** Vehicle Available → On Trip; Driver Available → On Trip
- **On Complete:** Vehicle → Available; Driver → Available; Trip → Completed

---

### 4. Safety Officer

Responsible for compliance.

**Can:** View Drivers, Update Safety Score, View Incidents, License Expiry, Compliance Reports

**Cannot:** Financial Data, Vehicle Purchase

**Sidebar:** Dashboard, Drivers, Compliance, Incidents, Reports, Profile

**Dashboard widgets:** Expiring Licenses, Suspended Drivers, Accidents, Safety Score Average

**Driver Profile fields:** Name, Photo, License, Expiry, Phone, Emergency Contact, Experience, Blood Group, Safety Score, Medical Certificate, Driving Category, Address, Past Trips, Incidents, Documents

**License expiry alerts:** 30 days, 15 days, 7 days, Expired

---

### 5. Finance Manager

Responsible for money.

**Can:** Fuel, Expenses, Revenue, Profit, Reports

**Cannot:** Assign Trips, Manage Drivers, Delete Vehicles

**Sidebar:** Dashboard, Fuel, Expenses, Revenue, Reports, Analytics, Invoices, Profile

**Dashboard widgets:** Today's Fuel, Monthly Fuel, Maintenance Cost, Trip Revenue, Profit, Expenses, Charts

**Fuel Entry fields:** Vehicle, Trip, Date, Fuel Quantity, Price Per Liter, Total Cost, Fuel Station, Bill Upload

**Expense Entry fields:** Vehicle, Trip, Expense Type, Amount, Vendor, Bill Upload, Remarks

**Expense types:** Fuel, Maintenance, Repair, Insurance, Tyre, Permit, Fine, Toll, Parking, Miscellaneous

**Reports:** Fuel Efficiency, Cost per KM, Vehicle ROI, Profit, Monthly Expense, Revenue, Vehicle Comparison

---

## Common Features (all roles)

Login, Forgot Password, Change Password, Notifications, Profile, Dark Mode, Search / Global Search, Filters, Sorting, Pagination, Export CSV, Export PDF, Print

## Status Enums

- **Vehicle status:** Available, Reserved, On Trip, Maintenance, Retired
- **Driver status:** Available, On Trip, Off Duty, Suspended, Leave
- **Trip status:** Draft, Scheduled, Dispatched, In Progress, Completed, Cancelled
- **Maintenance status:** Pending, In Progress, Completed, Cancelled

## Business Rules

- Registration number must be unique
- Driver license is mandatory
- Expired license → cannot assign to a trip
- Retired vehicle → cannot dispatch
- Vehicle in maintenance → cannot dispatch
- Cargo weight over vehicle capacity → reject
- Driver already on a trip → reject new assignment
- Vehicle already on a trip → reject new assignment
- Trip completes → vehicle becomes available, driver becomes available
- Maintenance starts → vehicle goes into shop (unavailable)
- Maintenance ends → vehicle becomes available

## Database Tables

Users, Roles, Companies, Vehicles, VehicleDocuments, Drivers, DriverDocuments, Trips, TripStops, Maintenance, MaintenanceParts, FuelLogs, Expenses, Revenue, Notifications, AuditLogs, Settings, Permissions, ActivityLogs

## Dashboard Charts

Fleet Utilization, Revenue, Monthly Trips, Vehicle Usage, Fuel Consumption, Maintenance Cost, Expense Breakdown, Driver Safety Score, Trip Success Rate, Vehicle ROI

## Notifications

License Expiry, Insurance Expiry, Maintenance Due, Trip Started, Trip Completed, Vehicle Breakdown, Fuel Added, Expense Added, New User, Password Changed
