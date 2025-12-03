import {
  Check,
  Award,
  Shield,
  Activity,
  BarChart3,
  Stethoscope,
} from "lucide-react";
import fluoride from "../assets/images/fluoride.png";
import cavity from "../assets/images/cavity.png";
import whitening from "../assets/images/whitening.png";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Clock,
  Star,
  CreditCard,
  Settings,
  UserCircle,
  UserCheck,
} from "lucide-react";

export const roles = [
  {
    id: "0",
    label: "Patient",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    id: "1",
    label: "Doctor",
    icon: Stethoscope,
    color: "bg-green-500",
  },
];
export const gallaryData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop",
    title: "Modern Reception Area",
    category: "Facility",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop",
    title: "Treatment Room",
    category: "Facility",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop",
    title: "Advanced Equipment",
    category: "Technology",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop",
    title: "Dental Consultation",
    category: "Services",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&h=600&fit=crop",
    title: "Sterilization Area",
    category: "Safety",
  },
  {
    id: 6,
    url: "https://plus.unsplash.com/premium_photo-1682130157004-057c137d96d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2FpdGluZyUyMHJvb218ZW58MHx8MHx8fDA%3D",
    title: "Waiting Lounge",
    category: "Facility",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop",
    title: "Dental Instruments",
    category: "Technology",
  },
  {
    id: 8,
    url: "https://plus.unsplash.com/premium_photo-1661775601929-8c775187bea6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UGF0aWVudCUyMENhcmV8ZW58MHx8MHx8fDA%3D",
    title: "Patient Care",
    category: "Services",
  },
];

export const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer comprehensive dental care including teeth examinations, cavity filling, dental implants, teeth whitening, orthodontics, root canal treatment, and preventive care. Our experienced team uses the latest technology to ensure the best outcomes.",
  },
  {
    question: "How often should I visit the dentist?",
    answer:
      "We recommend visiting the dentist every 6 months for regular check-ups and cleanings. However, if you have specific dental issues or concerns, more frequent visits may be necessary. Regular visits help prevent serious problems and maintain optimal oral health.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Yes, we accept most major dental insurance plans. Our team will work with your insurance provider to maximize your benefits. We also offer flexible payment plans for treatments not covered by insurance. Contact us to verify your specific insurance coverage.",
  },
  {
    question: "What should I do in a dental emergency?",
    answer:
      "For dental emergencies, contact us immediately at +880 1234-56789. We provide emergency dental services for issues like severe toothaches, broken teeth, knocked-out teeth, or lost fillings. If it's after hours, we have an emergency hotline available.",
  },
  {
    question: "Is teeth whitening safe?",
    answer:
      "Yes, professional teeth whitening is safe when performed by our trained dental professionals. We use approved whitening agents and follow strict safety protocols. The procedure is minimally invasive and provides excellent results that can last for years with proper care.",
  },
  {
    question: "How long does a typical appointment take?",
    answer:
      "A routine check-up and cleaning typically takes 45-60 minutes. More complex procedures like fillings or root canals may require 1-2 hours. We always provide estimated appointment times when you book and strive to stay on schedule.",
  },
];

export const reviewsData = [
  {
    id: 1,
    name: "Win Son Herr",
    review:
      "Outstanding dental care! The team made me feel comfortable throughout my treatment.",
    location: "California",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
  },
  {
    id: 2,
    name: "Bsh Sen",
    review:
      "Best dental experience I've ever had. Friendly staff and modern facility!",
    location: "California",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
  },
  {
    id: 3,
    name: "John Mall",
    review:
      "Professional and caring service. They explained every step thoroughly!",
    location: "California",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
  },
];

export const features = [
  { icon: Check, text: "Quick and painless procedures" },
  { icon: Check, text: "Experienced dental professionals" },
  { icon: Check, text: "State-of-the-art equipment" },
  { icon: Check, text: "Flexible scheduling options" },
];

export const stats = [
  { number: "500+", label: "Happy Patients", icon: Award },
  { number: "50k+", label: "Procedures", icon: Shield },
  { number: "4.9★", label: "Patient Rating", icon: Award },
];
export const serviceData = [
  {
    id: 1,
    serviceName: "Fluoride Treatment",
    description:
      "Fluoride treatments are a great way to prevent more cavities in patients who are already prone to them.",
    icon: fluoride,
  },
  {
    id: 2,
    serviceName: "Cavity Filling",
    description:
      "A cavity filling is when the dentist fills the opening in your tooth with some kind of material.",
    icon: cavity,
  },
  {
    id: 3,
    serviceName: "Teeth Whitening",
    description:
      "Teeth Whitening is a quick and painless in-office whitening system that provides dramatic results",
    icon: whitening,
  },
];

export const dentistMenuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { path: "/dashboard/my-patients", label: "Patients List", icon: Users },
  { path: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
  { path: "/dashboard/schedule", label: "Schedule", icon: Clock },
  { path: "/dashboard/reviews", label: "Reviews", icon: Star },
  { path: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
  { path: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export const patientMenuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "my-appointments", label: "My Appointments", icon: Calendar },
  { path: "my-prescriptions", label: "My Prescriptions", icon: FileText },
  { path: "profile", label: "My Profile", icon: UserCircle },
];

export const adminMenuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Dentist Verification",
    path: "doctor-verification",
    icon: UserCheck,
  },
  { path: "admin-dentists", label: "Dentists List", icon: Users },
  { path: "patients", label: "Patients Lists", icon: Activity },
  { path: "admin-appointments", label: "All Appointments", icon: Calendar },
  { path: "admin-revenue", label: "Revenue", icon: BarChart3 },
  { path: "reports", label: "Reports", icon: FileText },
  { path: "admin-reviews", label: "Reviews & Feedback", icon: Star },
  { path: "profile", label: "My Profile", icon: UserCircle },
];
