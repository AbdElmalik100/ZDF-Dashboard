'use client'

import { getTheatre, liveUpdateSeats } from "@/store/slices/theatreSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { QRCodeSVG } from 'qrcode.react';
import { useClickAway } from "@uidotdev/usehooks"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Armchair, Calendar, Clock2, Columns3, Grid3X3, MapPin, Rows3, Ticket } from "lucide-react"
import moment from "moment"
import { formatCurrency } from "@/utils/formatter"
import { socket } from "@/socket"
import QRCode from "@/components/QRCode"

function TheatreDetails() {
    const params = useParams()
    const dispatch = useDispatch()
    const { theatre, loading } = useSelector(state => state.theatres)

    useEffect(() => {
        socket.on("recieve_seat", seatData => {
            dispatch(liveUpdateSeats(seatData))
        })
        return () => {
            socket.off("recieve_seat")
        }
    }, [socket, theatre])


    useEffect(() => {
        dispatch(getTheatre(params.id))
    }, [params, dispatch])
    return (
        theatre &&
        <div className='theatre-details'>
            <header className="flex items-start justify-between">
                <h2 className="text-3xl font-bold capitalize">{theatre.title}</h2>
                <span className="text-neutral-300 text-xs">
                    Created {new Date(theatre.created_at).toLocaleString()}
                </span>
            </header>
            <div className="info flex justify-between mt-10 h-full items-start gap-8">
                <div className="event-image flex flex-col gap-2 w-1/4">
                    <img src={theatre.event?.image} className="rounded-3xl w-96 object-cover" alt="" />
                    <div>
                        <h3 className="text-xl font-bold capitalize">{theatre.event?.title}</h3>
                        <p className="text-neutral-400 mt-1">{theatre.event?.description}</p>
                        <span className="text-xl flex items-center gap-2 font-bold mt-5">
                            <Ticket className="rotate-45" />
                            {formatCurrency.format(theatre.event?.ticket_price)}
                        </span>
                    </div>
                </div>
                <div className="theatre-info text-center grid grid-cols-3 gap-5 flex-1 justify-items-center">
                    <div className="w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="rounded-2xl w-fit p-5 text-white bg-gradient-to-tr from-black to-neutral-600 grid place-items-center">
                                <Columns3 size={22} />
                            </div>
                            <span>{theatre.columns} Columns</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="rounded-2xl w-fit p-5 text-white bg-gradient-to-tr from-black to-neutral-600 grid place-items-center">
                                <Rows3 size={22} />
                            </div>
                            <span>{theatre.rows} Rows</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="rounded-2xl w-fit p-5 text-white bg-gradient-to-tr from-black to-neutral-600 grid place-items-center">
                                <Grid3X3 size={22} />
                            </div>
                            <span>{theatre.columns * theatre.rows} Total seats</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="rounded-2xl w-fit p-5 text-white bg-gradient-to-tr from-black to-neutral-600 grid place-items-center">
                                <MapPin size={22} />
                            </div>
                            <span>{theatre.event?.venue}</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="rounded-2xl w-fit p-5 text-white bg-gradient-to-tr from-black to-neutral-600 grid place-items-center">
                                <Calendar size={22} />
                            </div>
                            <span>{new Date(theatre.event?.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="rounded-2xl w-fit p-5 text-white bg-gradient-to-tr from-black to-neutral-600 grid place-items-center">
                                <Clock2 size={22} />
                            </div>
                            <span>{moment(theatre.event?.time_from, "HH:mm:ss").format("hh:mm A")} - {moment(theatre.event?.time_to, "HH:mm:ss").format("hh:mm A")}</span>
                        </div>
                    </div>
                </div>
                <QRCode QRCodeLink={theatre.qr_code} imageName={"Theatre QR Code"} desc={"QR code for assigning your seat, Scan it now."}></QRCode>
            </div>
            <div className="mt-10 w-1/3">
                <h3 className="text-2xl font-bold uppercase">Hall seats</h3>
                <p className="text-neutral-400 mt-1 text-sm">Here is all the seats of the hall with their numbers, Just hover your mouse on any of these circles then you can see the information of this seat</p>
            </div>
            <div
                style={{ gridTemplateColumns: `repeat(${theatre.columns}, 1fr)`, gridTemplateRows: `repeat(${theatre.rows}, 1fr)` }}
                className={`seats justify-items-center grid gap-8 mt-4 w-full h-full rounded-2xl border p-5`}>
                {
                    theatre.seats.map((seat, index) => (
                        <HoverCard key={index}>
                            <HoverCardTrigger asChild>
                                <span className={`w-5 h-5 cursor-pointer rounded-full relative before:absolute before:w-full before:h-full before:rounded-full before:left-0 before:top-0 transition-all ease-in-out ${seat.is_active ? 'bg-green-600 before:bg-green-400 pingo hover:bg-green-400' : 'bg-rose-600 hover:bg-rose-400'}`}></span>
                            </HoverCardTrigger>
                            <HoverCardContent className="min-w-[400px]">
                                <div className="flex justify-between space-x-4">
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage className="" src={seat.user?.avatar} />
                                        <AvatarFallback>ZDF</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1 flex-1">
                                        <h4 className="text-sm font-semibold capitalize">@{seat.user?.first_name ? seat.user.first_name : 'Empty seat'}</h4>
                                        <p className="text-sm">
                                            {seat.user?.email}
                                        </p>
                                        <div className="flex items-center pt-2">
                                            <Armchair size={20} className="mr-1 opacity-75" />
                                            <span className="text-xs text-muted-foreground">
                                                Seat number #{seat.code}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shadow-md p-2 border-primary border rounded-xl">
                                        <QRCodeSVG value={theatre.qr_code} size={80} />
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    ))
                }
            </div>
        </div>
    )
}

export default TheatreDetails