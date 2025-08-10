# QMS Frontend

This repository contains the **frontend web application** for the **QMS (Quality Management System)**, designed for managing both **Finished Fabric Inspection** and **Greige Fabric Inspection** processes.

Inspection activities are primarily performed in the mobile application. After inspections are completed, the collected data is displayed, managed, and processed in this web application.

---

## Features

### Finished Fabric Inspection
- View the status of each roll.
- Edit inspection results for rolls.
- Delete all inspection data at once.
- Permanently delete a roll.
- Place rolls on hold to exclude them from the final report.
- Add excess rolls found beyond the initial planning data from the SQ planning application.
- Add **GSM** values to rolls.
- Assign **shades** to rolls.
- Record the number of high defects.
- Review and override the **pass/fail decision** (automatically determined, but users can add comments and see full details in one place).
- Access various reports.

#### Reports for Finished Fabric
1. 4-Point Inspection by Batch
2. 4-Point Inspection by Roll
3. Machine-wise Report
4. GSM Report
5. Roll-wise Final Inspection Report (without excess)
6. Roll-wise Final Inspection Report (with excess)

---

### Greige Fabric Inspection
- Add **GSM** values.
- View roll status.
- Access related reports.

---

### Configuration
- Add new users.
- Register machines in the system.
- Assign user permissions for specific screens (pages without permission remain inaccessible even after login).

---

## Purpose
This frontend ensures that inspection data is easily accessible, editable, and reportable, while providing configuration tools for admins to manage users, machines, and access rights effectively.

