import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Checkbox } from './ui/checkbox'
import { formatCurrency } from '@/utils/formatter'
import { Input } from './ui/input'
import { Reorder } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { liveUpdateSubscriptions, updateSubscription } from '@/store/slices/subscriptionsSlice'
import { socket } from '@/socket'


function SubscriptionTable() {
    const { subscriptions } = useSelector(state => state.subscriptions)
    const [subscriptionsData, setSubscriptionsData] = useState([...subscriptions])
    const [filteredData, setFilteredData] = useState([...subscriptionsData])
    const [searchInput, setSearchInput] = useState("")
    const dispatch = useDispatch()

    const handleAttendace = (subscriptionObj) => {
        const updatedData = subscriptionsData.map(obj =>
            obj._id === subscriptionObj._id ? { ...obj, attendance: !obj.attendance } : obj
        );
        const sortedData = [...updatedData].sort((a, b) => b.attendance - a.attendance);
        setSubscriptionsData(sortedData);
        setFilteredData(sortedData);
        dispatch(updateSubscription(subscriptionObj))
    }

    const searchInObject = (obj, searchTerm) => {
        searchTerm = searchTerm.toLowerCase();

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    if (value.toString().toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
                if (typeof value === 'object' && value !== null) {
                    if (searchInObject(value, searchTerm)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };


    const search = (e) => {
        const filtered = subscriptionsData.filter(obj => searchInObject(obj, e.target.value));
        setFilteredData(filtered);
    }


    useEffect(() => {
        socket.on("recieve_event_attendance", userSubscriptionData => {
            console.log(userSubscriptionData);
            dispatch(liveUpdateSubscriptions(userSubscriptionData.updatedSubscription))
        })

        return () => {
            socket.off("recieve_event_attendance")
        }
    }, [socket, subscriptions])


    useEffect(() => {
        if (subscriptions.length > 0) {
            setSubscriptionsData(subscriptions);
            setFilteredData(subscriptions);
        }
    }, [subscriptions])

    return (
        <div className='table rounded-lg w-full'>
            <div className='search-input w-full mb-4 flex items-center justify-between gap-3'>
                <Input type="text"
                    name="search"
                    placeholder='Search...'
                    className='p-2 px-3 rounded-lg w-1/3'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onInput={search}
                />
                <span className='text-neutral-400'>Total {subscriptions.length}</span>
            </div>
            <div className='table-header border-b p-3 px-5 flex items-center justify-between'>
                <span className='font-medium text-neutral-400 capitalize w-full'>
                    ID
                </span>
                <span className='font-medium text-neutral-400 capitalize w-full'>
                    Name
                </span>
                <span className='font-medium text-neutral-400 capitalize w-full'>
                    Email
                </span>
                <span className='font-medium text-neutral-400 capitalize w-full ms-10'>
                    Phone Number
                </span>
                <span className='font-medium text-neutral-400 capitalize w-full text-end'>
                    Amount
                </span>
                <span className='font-medium text-neutral-400 capitalize w-full text-end'>
                    Attendance
                </span>
            </div>
            <Reorder.Group
                axis='y'
                values={subscriptionsData}
                onReorder={setSubscriptionsData}
                className='table-data'
            >
                {
                    filteredData.length > 0
                        ?
                        filteredData.map((obj, index) =>
                            <Reorder.Item
                                key={obj._id}
                                value={obj}
                                onClick={() => handleAttendace(obj)}
                            >
                                <div className={`data-row flex items-center mt-4 cursor-pointer transition-all ease-in-out hover:opacity-50 justify-between rounded-lg p-1.5 px-5 border ${obj.attendance ? "border-green-400" : "border-rose-400"}`}>
                                    <span className='id w-full'>#{obj.code}</span>
                                    <span className='name flex items-center gap-2 w-full'>
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={obj.user?.avatar} />
                                            <AvatarFallback>ZDF</AvatarFallback>
                                        </Avatar>
                                        <span className='capitalize'>{obj.user?.first_name}</span>
                                    </span>
                                    <span className='email w-full'>{obj.user?.email}</span>
                                    <span className='phone-number w-full ms-10'>{obj.user?.phone_number || "N/A"}</span>
                                    <span className='amount font-medium w-full text-end'>{formatCurrency.format(obj.amount)}</span>
                                    <span className='attendace w-full text-end'>
                                        <Checkbox checked={obj.attendance} onCheckedChange={() => handleAttendace(obj)} />
                                    </span>
                                </div>
                            </Reorder.Item>
                        )
                        :
                        <div className='w-full h-[150px] grid place-items-center text-neutral-500'>
                            No results.
                        </div>
                }
            </Reorder.Group>
        </div>
    )
}


export default SubscriptionTable