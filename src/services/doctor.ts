import { db, auth } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { BookingData } from './booking';

// Real-time subscription for doctor's appointments
export const subscribeToDoctorAppointments = (
    onUpdate: (appointments: BookingData[]) => void,
    onError?: (error: Error) => void
) => {
    const user = auth.currentUser;
    if (!user) {
        if (onError) onError(new Error('Not authenticated'));
        return () => { };
    }

    try {
        const q = query(
            collection(db, 'bookings'),
            where('doctorId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const appointments: BookingData[] = [];
                snapshot.forEach((doc) => {
                    appointments.push({ id: doc.id, ...doc.data() } as BookingData);
                });
                // Sort manually in JavaScript instead of Firestore
                appointments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                onUpdate(appointments);
            },
            (error) => {
                console.error('Error in doctor appointments subscription:', error);
                if (onError) onError(error);
            }
        );

        return unsubscribe;
    } catch (error) {
        console.error('Error setting up doctor appointments subscription:', error);
        if (onError) onError(error as Error);
        return () => { };
    }
};

export const getDoctorAppointments = async (): Promise<BookingData[]> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('Not authenticated');
    }

    try {
        // Query bookings where doctorId matches current user's ID
        // Note: Removed orderBy to avoid requiring composite index
        // You can add it back once you create the Firestore index
        const q = query(
            collection(db, 'bookings'),
            where('doctorId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        const appointments: BookingData[] = [];
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() } as BookingData);
        });

        // Sort manually in JavaScript instead of Firestore
        appointments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        if (appointments.length === 0) {
            console.log('No appointments found for this doctor.');
        }

        return appointments;
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        throw new Error('Failed to load appointments. Please check your Firebase configuration.');
    }
};

export const updateAppointmentStatus = async (bookingId: string, status: 'confirmed' | 'cancelled'): Promise<void> => {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, { status });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
    }
};
