import { db, auth } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
    name: string;
    phone: string;
    email: string;
}

// Get current user's profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to load profile');
    }
};

// Update user profile
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: new Date().getTime(),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update profile');
    }
};

// Update doctor profile
export const updateDoctorProfile = async (data: {
    about?: string;
    fees?: number;
    experience?: number;
}): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    try {
        const doctorRef = doc(db, 'doctors', user.uid);
        await updateDoc(doctorRef, {
            ...data,
            updatedAt: new Date().getTime(),
        });
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        throw new Error('Failed to update doctor profile');
    }
};
