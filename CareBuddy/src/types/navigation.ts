export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
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
  BookAppointment: undefined;
  RescheduleAppointment: { appointmentId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Doctors: undefined;
  Pharmacy: undefined;
  Appointments: undefined;
  Reports: undefined;
  Messages: undefined;
  Settings: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Profile: undefined;
  MedicalHistory: undefined;
  LabTest: undefined;
  Ambulance: undefined;
  HomeCare: undefined;
  AboutUs: undefined;
  Telemedicine: undefined;
  Pharmacy: undefined;
  Logout: undefined;
};
