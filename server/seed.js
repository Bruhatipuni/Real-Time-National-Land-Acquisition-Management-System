import { connectDB } from './db.js';
import Project from './models/Project.js';
import Parcel from './models/Parcel.js';
import LegalCase from './models/LegalCase.js';
import AuditLog from './models/AuditLog.js';
import { 
  PROJECTS_DATA, 
  PARCELS_DATA, 
  LEGAL_CASES_DATA, 
  RECENT_AUDIT_LOGS 
} from '../src/data/mockData.js';

async function seedDatabase() {
  console.log('[Seed] Starting MongoDB database seeding...');
  const connected = await connectDB();
  
  if (!connected) {
    console.error('[Seed] Failed to connect to MongoDB. Make sure MongoDB daemon is running locally (mongodb://127.0.0.1:27017) or set MONGODB_URI.');
    process.exit(1);
  }

  try {
    console.log('[Seed] Clearing existing collections...');
    await Project.deleteMany({});
    await Parcel.deleteMany({});
    await LegalCase.deleteMany({});
    await AuditLog.deleteMany({});

    console.log(`[Seed] Seeding ${PROJECTS_DATA.length} Projects...`);
    await Project.insertMany(PROJECTS_DATA);

    console.log(`[Seed] Seeding ${PARCELS_DATA.length} Parcels...`);
    await Parcel.insertMany(PARCELS_DATA);

    console.log(`[Seed] Seeding ${LEGAL_CASES_DATA.length} Legal Cases...`);
    await LegalCase.insertMany(LEGAL_CASES_DATA);

    console.log(`[Seed] Seeding ${RECENT_AUDIT_LOGS.length} Audit Logs...`);
    await AuditLog.insertMany(RECENT_AUDIT_LOGS);

    console.log('✅ [Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed] Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
