export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    SplashScreen: undefined;
    DoctorLogin: undefined;
    DoctorRegistration: undefined;
    DoctorPanel: undefined;
    AboutDoctor: { doctorId: string };
    Appointment: { appointmentId: string };
    Booking: { doctorId: string; slot?: string };
    Checkout: { bookingId: string };
    Confirm: { bookingId: string };
    ChatBot: undefined;
    DietPlan: undefined;
    MedicalAppointment: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Appointments: undefined;
    Profile: undefined;
    DoctorProfile: undefined;
};
