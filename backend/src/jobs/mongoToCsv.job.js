import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import { exportToCSV } from '../utils/csvExporter.js';
import { uploadToDrive } from './uploadToDrive.js';

import ParkingEntry from '../models/ParkingEntry.js';
import Vehicle from '../models/Vehicle.js';
import Owner from '../models/Owner.js';
import Driver from '../models/Driver.js';
import VehicleAssignment from '../models/VehicleAssignment.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

async function backupCollection(name, model) {
  const data = await model.find().lean();
  if (!data.length) return;

  const headers = Object.keys(data[0]).map(k => ({
    id: k,
    title: k
  }));

  const filePath = path.join(
    BACKUP_DIR,
    `${name}_${Date.now()}.csv`
  );

  await exportToCSV(filePath, headers, data);
  await uploadToDrive(filePath);
}

export function startBackupJob() {
  cron.schedule('0 12,19 * * *', async () => {
    try {
      await backupCollection('parking_entries', ParkingEntry);
      await backupCollection('vehicles', Vehicle);
      await backupCollection('owners', Owner);
      await backupCollection('drivers', Driver);
      await backupCollection('vehicle_assignments', VehicleAssignment);
      await backupCollection(
        'users',
        User.select('-passwordHash')
      );
      await backupCollection('audit_logs', AuditLog);
      console.log('Backup completed');
    } catch (err) {
      console.error('Backup failed', err);
    }
  });
}