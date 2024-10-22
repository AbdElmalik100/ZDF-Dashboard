'use client'
import SubscriptionTable from '@/components/SubscriptionTable'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { getSubscriptions } from '@/store/slices/subscriptionsSlice'
import { getWorkshop, updateWorkshop } from '@/store/slices/workshopsSlice'
import { formatCurrency } from '@/utils/formatter'
import { BadgePoundSterling, Calendar, Clock2, MapPin, UsersRound } from 'lucide-react'
import moment from 'moment'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function WorkshopDetails() {
    const params = useParams()
    const dispatch = useDispatch()
    const { workshop, workshopToggle } = useSelector(state => state.workshops)

    const toggleWorkshop = () => {
        dispatch(updateWorkshop({ workshopData: { ...workshop, is_available: !workshopToggle } }))
    }


    useEffect(() => {
        dispatch(getWorkshop(params.id))
    }, [params, dispatch])

    useEffect(() => {
        if (workshop && workshop._id) dispatch(getSubscriptions({ workshopId: workshop._id }))
    }, [workshop, dispatch])

    return (
        workshop &&
        <div className='workshop-details'>
            <header className="flex items-start justify-between">
                <h2 className="text-3xl font-bold capitalize">{workshop.title}</h2>
                <span className="text-neutral-300 text-xs">
                    Created {new Date(workshop.created_at).toLocaleString()}
                </span>
            </header>
            <div className={`event-toggle flex items-center gap-2 justify-between p-4 px-3 rounded-xl mt-4 border ${workshopToggle ? "text-green-500 border-green-500" : "text-rose-500 border-rose-500"}`}>
                <div>
                    <h2 className="font-bold">
                        {workshopToggle ? "Workshop is now available" : "Workshop is currently unavailable"}
                    </h2>
                    <p className=" text-sm">
                        {workshopToggle ? "This workshop is available and users can book a seat from ZDF website." : "This workshop is no longer accept books from users."}
                    </p>
                </div>
                <Switch
                    checked={workshopToggle}
                    onCheckedChange={toggleWorkshop}
                />
            </div>
            <div className="flex items-start mt-10 gap-10">
                <div className="workshop-image w-1/3 relative">
                    <img src={workshop.image} className='rounded-2xl w-full object-cover shadow-lg' alt="Workshop image" />
                    {
                        workshop.discount > 0 &&
                        <Badge className={`absolute top-3 left-3 shadow-md flex rounded-full items-center gap-1 hover:bg-rose-500 bg-rose-500 text-white`}>
                            Discount -{workshop.discount}%
                        </Badge>
                    }
                </div>
                <div className='info w-full'>
                    <div>
                        <span className='text-xs text-neutral-400 mb-2 block'>{workshop.lecturer}</span>
                        <h2 className='text-xl font-bold capitalize'>{workshop.title}</h2>
                        <p className='capitalize mt-1'>{workshop.description}</p>
                    </div>
                    <div className='sub-info flex items-start justify-between w-full gap-3 mt-8'>
                        <ul className="flex flex-col gap-3 w-full">
                            <li className="flex items-center gap-2">
                                <MapPin size={22}></MapPin>
                                <span>{workshop.location}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Calendar size={22}></Calendar>
                                <span>{new Date(workshop.date).toLocaleDateString()}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock2 size={22}></Clock2>
                                <span>{moment(workshop.time_from, "HH:mm:ss").format("hh:mm A")} - {moment(workshop.time_to, "HH:mm:ss").format("hh:mm A")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <UsersRound size={22}></UsersRound>
                                <span>{workshop.limit} Limited seats</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <BadgePoundSterling size={22}></BadgePoundSterling>
                                <div className='flex items-center gap-2'>
                                    <span>
                                        {formatCurrency.format(workshop.price - ((workshop.price * workshop.discount) / 100))}
                                    </span>
                                    {
                                        workshop.discount > 0 && <span className='mt-2 text-xs line-through text-neutral-400'>{formatCurrency.format(workshop.price)}</span>
                                    }
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="subscription-table mt-20">
                <div className="table-header flex flex-col gap-1">
                    <h2 className="font-bold text-2xl">Workshop subscriptions</h2>
                    <p className="text-neutral-400">
                        These are all the users that subscribed to your workshop, You can check their information.
                    </p>
                </div>
                <div className="table mt-4 w-full">
                    <SubscriptionTable></SubscriptionTable>
                </div>
            </div>
        </div>
    )
}

export default WorkshopDetails