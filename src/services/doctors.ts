import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    about?: string;
    education?: string[];
    experience?: number;
    fees?: number;
}

export const getDoctors = async (): Promise<Doctor[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const doctors: Doctor[] = [];
        querySnapshot.forEach((doc) => {
            doctors.push({ id: doc.id, ...doc.data() } as Doctor);
        });

        if (doctors.length === 0) {
            console.warn('No doctors found in Firestore. Please run the seed script.');
        }

        return doctors;
    } catch (error) {
        console.error('Error fetching doctors from Firestore:', error);
        throw new Error('Failed to load doctors. Please check your Firebase configuration.');
    }
};

// Real-time subscription for doctors
export const subscribeToDoctors = (onUpdate: (doctors: Doctor[]) => void, onError?: (error: Error) => void) => {
    try {
        const unsubscribe = onSnapshot(
            collection(db, 'doctors'),
            (snapshot) => {
                const doctors: Doctor[] = [];
                snapshot.forEach((doc) => {
                    doctors.push({ id: doc.id, ...doc.data() } as Doctor);
                });
                onUpdate(doctors);
            },
            (error) => {
                console.error('Error in doctors subscription:', error);
                if (onError) onError(error);
            }
        );
        return unsubscribe;
    } catch (error) {
        console.error('Error setting up doctors subscription:', error);
        if (onError) onError(error as Error);
        return () => { }; // Return no-op unsubscribe
    }
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
    try {
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Doctor;
        }

        console.warn(`Doctor with ID ${id} not found`);
        return null;
    } catch (error) {
        console.error('Error fetching doctor by ID:', error);
        throw new Error('Failed to load doctor details.');
    }
};

export const searchDoctors = async (searchQuery: string): Promise<Doctor[]> => {
    try {
        const doctors = await getDoctors();
        if (!searchQuery.trim()) return doctors;

        const query = searchQuery.toLowerCase();
        return doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(query) ||
            doctor.specialty.toLowerCase().includes(query)
        );
    } catch (error) {
        console.error('Error searching doctors:', error);
        return [];
    }
};
