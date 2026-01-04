// Firebase Connection Test Script
import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

async function testFirebaseConnection() {
    console.log('🔍 Testing Firebase Connection...\n');

    try {
        // Test 1: Check Firestore Instance
        console.log('✓ Step 1: Firestore instance initialized');
        console.log('  Database:', db ? 'Connected' : 'Not Connected');

        // Test 2: Try to read from a collection
        console.log('\n✓ Step 2: Testing Read Operation...');
        const testCollection = collection(db, 'connectionTest');
        const snapshot = await getDocs(testCollection);
        console.log(`  Successfully queried collection (${snapshot.size} documents found)`);

        // Test 3: Try to write to Firestore
        console.log('\n✓ Step 3: Testing Write Operation...');
        const testDoc = {
            message: 'Firebase connection test',
            timestamp: new Date().toISOString(),
            test: true
        };
        const docRef = await addDoc(collection(db, 'connectionTest'), testDoc);
        console.log('  Successfully wrote test document with ID:', docRef.id);

        // Test 4: Clean up test document
        console.log('\n✓ Step 4: Testing Delete Operation...');
        await deleteDoc(doc(db, 'connectionTest', docRef.id));
        console.log('  Successfully deleted test document');

        // Test 5: Check existing data
        console.log('\n✓ Step 5: Checking Existing Collections...');
        const collections = ['completedTasks', 'testScores', 'stats', 'notes', 'questionLogs'];
        for (const collectionName of collections) {
            const ref = collection(db, collectionName);
            const snap = await getDocs(ref);
            console.log(`  - ${collectionName}: ${snap.size} documents`);
        }

        console.log('\n✅ All Firebase tests passed! Connection is working perfectly.\n');
        return true;
    } catch (error) {
        console.error('\n❌ Firebase connection test failed:');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        return false;
    }
}

// Run the test
testFirebaseConnection();
