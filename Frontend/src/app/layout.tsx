import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AllContexts from "./AllContexts/AllContexts";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow — Full Stack Task Management Platform",
  description: `Built secure JWT authentication with HTTP-only cookies.
Implemented email verification and OTP-based password reset using Redis.
Developed complete CRUD operations with pagination and search.
Integrated Cloudinary for profile image uploads.
Added Redis caching to reduce database queries.
Responsive light/dark UI using Tailwind CSS.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* <AllContexts>
          <Navbar /> */}
        {children}
        {/* <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AllContexts> */}
      </body>
    </html>
  );
}
