# TransitOps — Complete Role-Based Access Control (RBAC) Specification

**Project Name:** TransitOps — Smart Transport Operations Platform (enterprise-grade TMS)

> Supersedes the earlier 5-role draft of this spec. Every role has its own dashboard, sidebar,
> permissions, workflow, and UI. Users only see the modules assigned to their role. Unauthorized
> routes must be inaccessible both in the UI and the backend APIs.

## Project Goal

A modern SaaS web application for transport companies to manage the complete lifecycle of fleet
operations, replacing Excel sheets and paper logs: vehicles, drivers, trips, maintenance, fuel,
expenses, reports, analytics, and user roles — all automated with proper validations.

## User Roles

There are **6** user roles: **Super Admin**, **Fleet Manager**, **Dispatcher / Operations Manager**,
**Safety Officer**, **Finance Manager**, **Driver**.

---

### 1. Super Admin

Manages the complete application.

**Dashboard cards:** Total Companies, Total Users, Total Vehicles, Total Drivers, Active Trips,
Vehicles in Maintenance, Monthly Revenue, Monthly Expenses, Fleet Utilization %, System Health

**Dashboard charts:** Revenue vs Expense, Trips Per Month, Fleet Utilization, Vehicle Status, Driver Status

**Sidebar:** Dashboard, Companies, Users, Roles & Permissions, Vehicles, Drivers, Trips,
Maintenance, Fuel Logs, Expenses, Reports, Notifications, Audit Logs, Settings, Profile

**Can create:** Company, User, Role, Vehicle, Driver, Trip, Maintenance, Fuel Log, Expense

**Can edit:** Everything **Can delete:** Everything except System Roles **Can view:** Everything

**Features:** Manage Companies, Manage Users, Assign Roles, Manage Permissions, Reset Password,
Activate/Deactivate User, View Audit Logs, System Settings, Backup Database, Notification
Management, Analytics

---

### 2. Fleet Manager

Responsible for fleet and vehicle management.

**Dashboard cards:** Available Vehicles, Vehicles On Trip, Vehicles In Maintenance, Retired
Vehicles, Upcoming Service, Fleet Utilization

**Dashboard charts:** Vehicle Usage, Maintenance Cost, Vehicle Type Distribution

**Sidebar:** Dashboard, Vehicles, Maintenance, Vehicle Documents, Trip History, Reports, Profile

**Vehicle module — can:** Add/Edit/Delete Vehicle, Upload RC, Upload Insurance, Upload PUC,
Upload Fitness Certificate, Upload Images, Update Odometer, Retire Vehicle, Schedule Maintenance

**Vehicle Details fields:** Registration Number, Vehicle Name, Model, Manufacturer, Year, Fuel
Type, Vehicle Type, Capacity, Mileage, Purchase Cost, Purchase Date, Insurance Expiry, Fitness
Expiry, PUC Expiry, Odometer, GPS Device, Status, Images, Documents

**Maintenance:** Create Maintenance, Update Maintenance, Close Maintenance, Upload Bills, Assign
Mechanic

**Cannot:** Manage Users, Financial Reports, Role Management

---

### 3. Dispatcher / Operations Manager

Responsible for creating and managing trips.

**Dashboard cards:** Today's Trips, Pending Trips, Running Trips, Completed Trips, Available
Vehicles, Available Drivers, Delayed Trips

**Sidebar:** Dashboard, Trips, Drivers, Vehicles, Live Tracking, Trip History, Reports, Profile

**Trip module — can:** Create/Edit Trip, Dispatch Trip, Complete Trip, Cancel Trip, Assign
Vehicle, Assign Driver, Track Trip

**Trip form fields:** Customer, Pickup Location, Destination, Vehicle, Driver, Cargo Type, Cargo
Weight, Distance, Estimated Time, Priority, Notes, Expected Cost, Expected Revenue

**Validation rules:** Vehicle Available, Driver Available, License Valid, Insurance Valid, Vehicle
Not In Maintenance, Vehicle Not Retired, Cargo Within Capacity

**Status workflow:** Draft → Scheduled → Dispatched → In Progress → Completed **or** Cancelled

**Automatic changes —**
- On Dispatch: Vehicle → On Trip, Driver → On Trip
- On Complete: Vehicle → Available, Driver → Available, Trip → Completed

**Cannot:** Delete Vehicles, Manage Users, Financial Reports

---

### 4. Safety Officer

Responsible for driver compliance and safety.

**Dashboard cards:** Expired Licenses, Licenses Expiring Soon, Suspended Drivers, Safety Score,
Incidents, Violations

**Sidebar:** Dashboard, Drivers, Compliance, Incidents, Safety Reports, Profile

**Driver module — can:** Add/Edit Driver, Suspend Driver, Activate Driver, Upload Driving
License, Upload Medical Certificate, Upload Police Verification, Update Safety Score

**Driver Details fields:** Name, Photo, DOB, Phone, Address, Emergency Contact, Blood Group,
License Number, License Category, License Expiry, Medical Expiry, Experience, Safety Score,
Driving History, Incident History, Documents

**Compliance:** License Expiry Alert, Medical Expiry Alert, Driver Blacklist, Suspension, Incident
Report

**Cannot:** Financial Reports, Trip Dispatch, Vehicle Purchase

---

### 5. Finance Manager

Responsible for all financial activities.

**Dashboard cards:** Today's Fuel Cost, Monthly Fuel Cost, Maintenance Cost, Revenue, Profit,
Pending Expenses

**Dashboard charts:** Monthly Expense, Fuel Trend, Profit Trend, Vehicle ROI, Cost Breakdown

**Sidebar:** Dashboard, Fuel Logs, Expenses, Revenue, Invoices, Reports, Analytics, Profile

**Fuel module — can:** Add/Edit/Delete Fuel Entry, Upload Fuel Bill

**Fuel fields:** Vehicle, Trip, Fuel Station, Quantity, Price Per Liter, Total Cost, Date, Invoice

**Expense fields:** Expense Type, Vehicle, Trip, Vendor, Amount, GST, Invoice, Remarks, Date

**Expense types:** Fuel, Repair, Maintenance, Insurance, Tyres, Battery, Permit, Toll, Parking,
Fine, Miscellaneous

**Reports:** Fuel Efficiency, Cost Per KM, Vehicle ROI, Profit Report, Monthly Expense, Revenue
Report

**Cannot:** Assign Trips, Manage Users, Delete Vehicles

---

### 6. Driver

Performs assigned deliveries.

**Dashboard cards:** Assigned Trips, Completed Trips, Upcoming Trips, Assigned Vehicle, Safety Score

**Sidebar:** Dashboard, My Trips, Trip History, Documents, Notifications, Profile

**Can:** View Assigned Trips, Accept Trip, Reject Trip, Start Trip, Update Trip Status, Upload
Delivery Proof, Upload Customer Signature, Upload Photos, Report Breakdown, Report Accident,
Complete Trip, Enter Final Odometer, Enter Fuel Used

**Cannot:** Create Trips, Assign Vehicles, Manage Drivers, Financial Reports, Vehicle Management,
User Management

---

## Common Business Rules

1. Vehicle Registration Number must be unique.
2. Driver License must be valid.
3. Expired License → Cannot Assign Trip.
4. Suspended Driver → Cannot Assign Trip.
5. Vehicle In Maintenance → Cannot Dispatch.
6. Retired Vehicle → Cannot Dispatch.
7. Vehicle Already On Trip → Cannot Assign Again.
8. Driver Already On Trip → Cannot Assign Again.
9. Cargo Weight cannot exceed Vehicle Capacity.
10. Dispatch Trip automatically changes Vehicle → On Trip, Driver → On Trip.
11. Complete Trip automatically changes Vehicle → Available, Driver → Available.
12. Maintenance Started → Vehicle → In Maintenance.
13. Maintenance Completed → Vehicle → Available.

## Role Permission Matrix

| Module | Super Admin | Fleet Manager | Dispatcher | Safety Officer | Finance | Driver |
|---|---|---|---|---|---|---|
| Dashboard | Full | Fleet | Operations | Safety | Finance | Personal |
| Users | CRUD | No | No | No | No | No |
| Roles | CRUD | No | No | No | No | No |
| Vehicles | CRUD | CRUD | View | View | View | Assigned Only |
| Drivers | CRUD | View | View | CRUD | View | Self |
| Trips | CRUD | View | CRUD | View | View | Assigned Only |
| Maintenance | CRUD | CRUD | View | View | View | No |
| Fuel Logs | CRUD | View | View | No | CRUD | Own |
| Expenses | CRUD | View | No | No | CRUD | No |
| Reports | All | Fleet | Operations | Safety | Finance | Personal |
| Settings | Full | No | No | No | No | No |
| Audit Logs | Full | No | No | No | No | No |

## UI Requirements (every role)

Separate dashboard, sidebar, navigation, statistics, permissions, and API authorization per role;
responsive design; dark mode; search; filters; sorting; pagination; export CSV; export PDF;
notification center; profile management; role badge; activity timeline. Each dashboard only shows
information relevant to that role.

## Status Enums

- **Vehicle status:** Available, Reserved, On Trip, Maintenance, Retired
- **Driver status:** Available, On Trip, Off Duty, Suspended, Leave
- **Trip status:** Draft, Scheduled, Dispatched, In Progress, Completed, Cancelled
- **Maintenance status:** Pending, In Progress, Completed, Cancelled

## Database Tables

Users, Roles, Companies, Vehicles, VehicleDocuments, Drivers, DriverDocuments, Trips, TripStops,
Maintenance, MaintenanceParts, FuelLogs, Expenses, Revenue, Notifications, AuditLogs, Settings,
Permissions, ActivityLogs

## Dashboard Charts (reference set)

Fleet Utilization, Revenue, Monthly Trips, Vehicle Usage, Fuel Consumption, Maintenance Cost,
Expense Breakdown, Driver Safety Score, Trip Success Rate, Vehicle ROI

## Notifications

License Expiry, Insurance Expiry, Maintenance Due, Trip Started, Trip Completed, Vehicle
Breakdown, Fuel Added, Expense Added, New User, Password Changed
