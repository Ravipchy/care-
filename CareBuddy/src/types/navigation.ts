export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
  Family: undefined;
  MedicalHistory: undefined;
  LabTest: undefined;
  Ambulance: undefined;
  HomeCare: undefined;
  AboutUs: undefined;
  Telemedicine: undefined;
  Pharmacy: undefined;
  Cart: { cart: any[] };
  NearbyDoctors: undefined;
  Reports: undefined;
  Messages: undefined;
  Settings: undefined;
  EditProfile: undefined;
  UploadPrescription: undefined;
  RescheduleAppointment: { appointmentId: string };
  Appointments: undefined;
  DoctorProfile: { doctorId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Doctors: undefined; // Now points to NearbyDoctorsScreen
  Pharmacy: undefined;
  Appointments: undefined;
  Reports: undefined;
  Messages: undefined;
  Settings: undefined;
};

