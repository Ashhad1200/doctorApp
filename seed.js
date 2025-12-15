const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// 1. Load .env manually
const envPath = path.resolve(__dirname, '.env');
const envConfig = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envConfig[key.trim()] = value.trim();
        }
    });
}

const firebaseConfig = {
    apiKey: envConfig['EXPO_PUBLIC_FIREBASE_API_KEY'],
    authDomain: envConfig['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'],
    projectId: envConfig['EXPO_PUBLIC_FIREBASE_PROJECT_ID'],
    storageBucket: envConfig['EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: envConfig['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
    appId: envConfig['EXPO_PUBLIC_FIREBASE_APP_ID'],
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Firebase configuration is missing. Please check your .env file.');
    process.exit(1);
}

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test user credentials
const TEST_USER_EMAIL = "test@doctor.com";
const TEST_USER_PASSWORD = "password123";

// Doctors data to seed
const doctors = [
    {
        id: '1',
        name: 'Dr. John Doe',
        specialty: 'Cardiologist',
        rating: 4.8,
        reviews: 120,
        about: 'Expert cardiologist with over 15 years of experience in treating heart conditions.',
        experience: 15,
        fees: 150
    },
    {
        id: '2',
        name: 'Dr. Jane Smith',
        specialty: 'General Physician',
        rating: 4.9,
        reviews: 80,
        about: 'Compassionate general physician specializing in family medicine.',
        experience: 10,
        fees: 100
    },
    {
        id: '3',
        name: 'Dr. Mike Ross',
        specialty: 'Dentist',
        rating: 4.5,
        reviews: 45,
        about: 'Skilled dentist focused on cosmetic and restorative dentistry.',
        experience: 8,
        fees: 120
    },
    {
        id: '4',
        name: 'Dr. Sarah Johnson',
        specialty: 'Pediatrician',
        rating: 4.7,
        reviews: 95,
        about: 'Caring pediatrician with expertise in child healthcare.',
        experience: 12,
        fees: 110
    },
];

async function seed() {
    console.log("🌱 Starting database seed...\n");

    // 3. Create Test User
    try {
        console.log(`Creating test user: ${TEST_USER_EMAIL}...`);
        await createUserWithEmailAndPassword(auth, TEST_USER_EMAIL, TEST_USER_PASSWORD);
        console.log("✅ Test user created successfully!");
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("ℹ️  Test user already exists. Skipping creation.");
        } else {
            console.error("❌ Error creating test user:", error.message);
            console.error("   Please enable Email/Password authentication in Firebase Console");
        }
    }

    // 4. Seed Doctors
    console.log("\n📋 Seeding doctors collection...");
    let successCount = 0;
    let failCount = 0;

    for (const doctor of doctors) {
        try {
            await setDoc(doc(db, "doctors", doctor.id), {
                ...doctor,
                createdAt: Date.now()
            });
            console.log(`  ✅ Added: ${doctor.name} (${doctor.specialty})`);
            successCount++;
        } catch (e) {
            console.error(`  ❌ Failed to add ${doctor.name}:`, e.message);
            if (e.message.includes('Firestore API')) {
                console.error(`     Please enable Firestore in Firebase Console:`);
                console.error(`     https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
            }
            failCount++;
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Seeding Complete!");
    console.log("=".repeat(60));
    console.log(`✅ Successfully seeded: ${successCount} doctors`);
    if (failCount > 0) {
        console.log(`❌ Failed to seed: ${failCount} doctors`);
    }
    console.log("\n📱 Test Login Credentials:");
    console.log(`   Email: ${TEST_USER_EMAIL}`);
    console.log(`   Password: ${TEST_USER_PASSWORD}`);
    console.log("=".repeat(60) + "\n");

    process.exit(successCount > 0 ? 0 : 1);
}

seed().catch(error => {
    console.error("\n❌ Seeding failed with error:", error.message);
    process.exit(1);
});
