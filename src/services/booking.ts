import { db, auth } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, orderBy, onSnapshot } from 'firebase/firestore';

export interface BookingData {
    id?: string;
    userId: string;
    doctorId: string;
    doctorName?: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: number;
}

export const createBooking = async (booking: Omit<BookingData, 'id' | 'userId' | 'status' | 'createdAt'>) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const newBooking: Omit<BookingData, 'id'> = {
            ...booking,
            userId: user.uid,
            status: 'pending',
            createdAt: Date.now(),
        };

        const docRef = await addDoc(collection(db, "bookings"), newBooking);
        return docRef.id;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
};

export const getMyBookings = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const bookings: BookingData[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as BookingData);
        });
        return bookings;
    } catch (error) {
        console.error('Error getting my bookings:', error);
        throw error;
    }
};

// Real-time subscription for user's bookings
export const subscribeToMyBookings = (
    onUpdate: (bookings: BookingData[]) => void,
    onError?: (error: Error) => void
) => {
    const user = auth.currentUser;
    if (!user) {
        if (onError) onError(new Error("User not authenticated"));
        return () => { };
    }

    try {
        const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const bookings: BookingData[] = [];
                snapshot.forEach((doc) => {
                    bookings.push({ id: doc.id, ...doc.data() } as BookingData);
                });
                // Sort manually since we can't use orderBy with where
                bookings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                onUpdate(bookings);
            },
            (error) => {
                console.error('Error in bookings subscription:', error);
                if (onError) onError(error);
            }
        );

        return unsubscribe;
    } catch (error) {
        console.error('Error setting up bookings subscription:', error);
        if (onError) onError(error as Error);
        return () => { };
    }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, { status: 'cancelled' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};
