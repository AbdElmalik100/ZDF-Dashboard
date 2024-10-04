'use client'
import Sidebar from "@/components/Sidebar";
import "./globals.scss";
import { Jost } from 'next/font/google'
import { Provider } from 'react-redux'
import { store } from "@/store";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner"

const jost = Jost({ subsets: ['latin'] })
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={jost.className}
      >
        <Provider store={store}>
          <Toaster richColors closeButton></Toaster>
          <main className="min-h-screen flex">
            <Sidebar></Sidebar>
            <div className="w-full m-5 flex-1 rounded-3xl shadow-lg bg-white ms-[300px] p-10">
              {children}
            </div>
          </main>
        </Provider>
      </body>
    </html>
  );
}
