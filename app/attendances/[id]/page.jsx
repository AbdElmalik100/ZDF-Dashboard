'use client'
import AttendanceTable from '@/components/AttendanceTable'
import BundlesWorkshopTable from '@/components/BundlesWorkshopTable'
import QRCode from '@/components/QRCode'
import { Badge } from '@/components/ui/badge'
import { getAttendance } from '@/store/slices/attendancesSlice'
import { formatCurrency } from '@/utils/formatter'
import { BadgePoundSterling, Calendar, Clock2, MapPin } from 'lucide-react'
import moment from 'moment'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function AttendanceDetails() {
    const dispatch = useDispatch()
    const params = useParams()
    const { attendance } = useSelector(state => state.attendances)

    useEffect(() => {
        dispatch(getAttendance(params.id))
    }, [params, dispatch])
    return (
        attendance &&
        <div className='attendance-details'>
            <header className="flex items-start justify-between">
                <h2 className="text-3xl font-bold capitalize">{attendance.title}</h2>
                <span className="text-neutral-300 text-xs">
                    Created {new Date(attendance.created_at).toLocaleString()}
                </span>
            </header>
            <div className='info mt-8 flex justify-between gap-2'>
                <div className="left-side">
                    {
                        attendance.event &&
                        <div className='event flex flex-col gap-2 w-1/2'>
                            <div className="image">
                                <img src={attendance.event.image} className='rounded-2xl object-cover' width={375} alt="Event image" />
                            </div>
                            <div className="info">
                                <h2 className='font-bold text-xl capitalize'>{attendance.event.title}</h2>
                                <p className='text-sm text-neutral-400'>{attendance.event.description}</p>
                                <ul className="sub-info mt-3 flex flex-col gap-3">
                                    <li className="flex items-center gap-2 capitalize">
                                        <MapPin size={18}></MapPin>
                                        <span>{attendance.event.venue}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Calendar size={18}></Calendar>
                                        <span>{new Date(attendance.event.date).toLocaleDateString()}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock2 size={18}></Clock2>
                                        <span>{moment(attendance.event.time_from, "HH:mm:ss").format("hh:mm A")} - {moment(attendance.event.time_to, "HH:mm:ss").format("hh:mm A")}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BadgePoundSterling size={18}></BadgePoundSterling>
                                        <span>{formatCurrency.format(attendance.event.ticket_price)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                    {
                        attendance.workshop &&
                        <div className='workshop flex flex-col gap-2 w-1/2'>
                            <div className="image relative">
                                <img src={attendance.workshop.image} className='rounded-2xl h-[250px] w-[250px] object-cover object-[50%,20%]' alt="Event image" />
                                {
                                    attendance.workshop.discount > 0 &&
                                    <Badge className={`absolute top-3 left-3 shadow-md flex rounded-full items-center gap-1 hover:bg-rose-500 bg-rose-500 text-white`}>
                                        Discount -{attendance.workshop.discount}%
                                    </Badge>
                                }
                            </div>
                            <div className="info">
                                <h2 className='font-bold text-xl capitalize'>{attendance.workshop.title}</h2>
                                <p className='text-sm text-neutral-400'>{attendance.workshop.description}</p>
                                <ul className="sub-info mt-4 flex flex-col gap-3">
                                    <li className="flex items-center gap-2 capitalize">
                                        <MapPin size={18}></MapPin>
                                        <span>{attendance.workshop.location}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Calendar size={18}></Calendar>
                                        <span>{new Date(attendance.workshop.date).toLocaleDateString()}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock2 size={18}></Clock2>
                                        <span>{moment(attendance.workshop.time_from, "HH:mm:ss").format("hh:mm A")} - {moment(attendance.workshop.time_to, "HH:mm:ss").format("hh:mm A")}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BadgePoundSterling size={18}></BadgePoundSterling>
                                        <div className='flex items-center gap-2'>
                                            <span>
                                                {formatCurrency.format(attendance.workshop.price - ((attendance.workshop.price * attendance.workshop.discount) / 100))}
                                            </span>
                                            {
                                                attendance.workshop.discount > 0 && <span className='mt-2 text-xs line-through text-neutral-400'>{formatCurrency.format(attendance.workshop.price)}</span>
                                            }
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                    {
                        attendance.bundle &&
                        <div className='bundle flex flex-col gap-2'>
                            <div className="image">
                                <img width={375} className='rounded-2xl' src={attendance.bundle.image} alt="Bundle image" />
                            </div>
                            <div>
                                <h2 className='font-bold text-2xl mb-2'>{attendance.bundle.title}</h2>
                                <span className='block font-bold'>{formatCurrency.format(attendance.bundle.price)}</span>
                            </div>
                        </div>
                    }
                </div>
                <QRCode QRCodeLink={attendance.qr_code} imageName={attendance.event ? "Event QR Code" : attendance.workshop ? "Workshop QR Code" : "Bundle QR Code"} desc={"QR code for assigning your attendance, Scan it now."}></QRCode>
            </div>
            <div className='bundles-table mt-12'>
                {
                    attendance.bundle && <BundlesWorkshopTable bundle={attendance.bundle}></BundlesWorkshopTable>
                }
            </div>
            <div className="attendance-table mt-20">
                <div className="table-header flex flex-col gap-1">
                    <h2 className="font-bold text-2xl">Attendance table</h2>
                    <p className="text-neutral-400">
                        These are all the users that subscribed to your service, You can take their attendance from here.
                    </p>
                </div>
                <div className="table mt-4 w-full">
                    <AttendanceTable></AttendanceTable>
                </div>
            </div>
        </div>
    )
}

export default AttendanceDetails