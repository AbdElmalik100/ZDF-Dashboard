'use client'
import { LayoutDashboard, Theater, Tickets, Sheet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
    const pathname = usePathname()
    return (
        <aside className="w-[300px] p-8 py-14 flex flex-col gap-8 fixed">
            <div className="logo mx-auto">
                <img src="/images/ZDF - Z Dental Forum Black.png" className="w-32" alt="ZDF Logo" />
            </div>
            <ul className="links flex flex-col gap-2">
                <li>
                    <Link href='/' className={`flex p-2 px-3 rounded-lg items-center gap-2 w-full transition-all ease-in-out ${pathname === '/' ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}>
                        <LayoutDashboard></LayoutDashboard>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href='/events' className={`flex p-2 px-3 rounded-lg items-center gap-2 w-full transition-all ease-in-out ${pathname.includes('events') ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}>
                        <Tickets ></Tickets>
                        Events
                    </Link>
                </li>
                <li>
                    <Link href='/attendance' className={`flex p-2 px-3 rounded-lg items-center gap-2 w-full transition-all ease-in-out ${pathname.includes('attendance') ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}>
                        <Sheet></Sheet>
                        Attendance
                    </Link>
                </li>
                <li>
                    <Link href='/theatre' className={`flex p-2 px-3 rounded-lg items-center gap-2 w-full transition-all ease-in-out ${pathname.includes('theatre') ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}>
                        <Theater></Theater>
                        Theatre
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar