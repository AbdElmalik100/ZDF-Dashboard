'use client'
import { getEvent, updateEvent } from "@/store/slices/eventsSlice"
import { useParams } from "next/navigation"
import { useEffect, } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/utils/formatter"
import moment from "moment"
import { BadgePoundSterling, Calendar, Clock2, MapPin } from "lucide-react"
import SubscriptionTable from "@/components/SubscriptionTable"
import QRCode from "@/components/QRCode"
import { getSubscriptions } from "@/store/slices/subscriptionsSlice"


function EventDetails() {
    const params = useParams()
    const dispatch = useDispatch()
    const { event, eventToggle } = useSelector(state => state.events)
    const toggleEvent = () => {
        dispatch(updateEvent({ eventData: { ...event, is_available: !eventToggle } }))
    }


    useEffect(() => {
        dispatch(getEvent(params.id))
    }, [params, dispatch])

    useEffect(() => {
        if (event) dispatch(getSubscriptions(event._id))
    }, [event])
    return (
        event &&
        <div className="event-details">
            <header className="flex items-start justify-between">
                <h2 className="text-3xl font-bold capitalize">{event.title}</h2>
                <span className="text-neutral-300 text-xs">
                    Created {new Date(event.created_at).toLocaleString()}
                </span>
            </header>
            <div className={`event-toggle flex items-center gap-2 justify-between p-4 px-3 rounded-xl mt-4 border ${eventToggle ? "text-green-500 border-green-500" : "text-rose-500 border-rose-500"}`}>
                <div>
                    <h2 className="font-bold">
                        {eventToggle ? "Event is now available" : "Event is currently unavailable"}
                    </h2>
                    <p className=" text-sm">
                        {eventToggle ? "This event is available and users can book the ticket from ZDF website." : "This event is no longer accept books from users."}
                    </p>
                </div>
                <Switch
                    checked={eventToggle}
                    onCheckedChange={toggleEvent}
                />
            </div>
            <div className="flex items-start mt-10 gap-10">
                <div className="event-image w-3/4">
                    <img src={event.image} className="w-full shadow-lg rounded-2xl h-full object-cover" alt="Event Image" />
                </div>
                <div className="info w-1/2 capitalize flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-2xl">{event.title}</h3>
                        <p className="text-xl">{event.description}</p>
                    </div>
                    <ul className="sub-info flex flex-col gap-2 ">
                        <li className="flex items-center gap-2">
                            <MapPin size={22}></MapPin>
                            <span>{event.venue}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Calendar size={22}></Calendar>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Clock2 size={22}></Clock2>
                            <span>{moment(event.time_from, "HH:mm:ss").format("hh:mm A")} - {moment(event.time_to, "HH:mm:ss").format("hh:mm A")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <BadgePoundSterling size={22}></BadgePoundSterling>
                            <span>{formatCurrency.format(event.ticket_price)}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="subscription-table mt-12">
                <div className="table-header flex items-end justify-between gap-5">
                    <div className="left-side">
                        <h2 className="font-bold text-2xl">Event subscriptions</h2>
                        <p className="text-neutral-400">
                            These are all the users that subscribed to your event, You can check their information.
                        </p>
                    </div>
                    <div className="right-side">
                        <QRCode QRCodeLink={event.qr_code} imageName={"Event QR Code"} desc={"QR code for approve your attendance, Scan it now."}></QRCode>
                    </div>
                </div>
                <div className="table mt-4 w-full">
                    <SubscriptionTable></SubscriptionTable>
                </div>
            </div>
        </div>
    )
}

export default EventDetails