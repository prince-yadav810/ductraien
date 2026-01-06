// Firebase Data Reset Script - Delete ALL documents
import { db } from './firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function resetAllData() {
    console.log('⚠️  RESETTING ALL FIREBASE DATA...\n');

    try {
        const collectionsToReset = [
            'completedTasks',
            'testScores',
            'stats',
            'notes',
            'questionLogs',
            'focusSessions',
            'timerState'
        ];

        for (const collectionName of collectionsToReset) {
            console.log(`🗑️  Deleting ALL documents in ${collectionName}...`);
            const ref = collection(db, collectionName);
            const snapshot = await getDocs(ref);

            let deleteCount = 0;
            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, collectionName, docSnap.id));
                deleteCount++;
            }
            console.log(`   ✓ Deleted ${deleteCount} documents`);
        }

        console.log('\n✅ All data has been reset successfully!');
        console.log('   Refresh your browser to see the changes.\n');
        return true;
    } catch (error) {
        console.error('\n❌ Reset failed:');
        console.error('Error:', error.message);
        return false;
    }
}

// Run the reset
resetAllData();
