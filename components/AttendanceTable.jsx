import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Reorder } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '@/socket'
import { liveUpdateAttendance, updateAttendance } from '@/store/slices/attendancesSlice'


function AttendanceTable() {
    const { attendance } = useSelector(state => state.attendances)
    const [attendanceData, setAttendanceData] = useState({...attendance})
    const [filteredData, setFilteredData] = useState({...attendanceData})
    const [searchInput, setSearchInput] = useState("")
    const dispatch = useDispatch()

    const handleAttendace = (subscriptionObj) => {
        const updatedData = attendanceData.users.map(obj =>
            obj._id === subscriptionObj._id ? { ...obj, attendance: !obj.attendance } : obj
        );
        const sortedData = [...updatedData].sort((a, b) => b.attendance - a.attendance);
        setAttendanceData({...attendanceData, users: sortedData});
        setFilteredData({...attendanceData, users: sortedData});        
        dispatch(updateAttendance({...attendanceData, users: sortedData}))
    }


    const search = (e) => {
        const filtered = attendanceData.users.filter(obj => Object.values(obj).some(el => el.toString().toLowerCase().includes(e.target.value.toLowerCase())));
        setFilteredData({...attendanceData, users: filtered});
    }


    useEffect(() => {
        socket.on("recieve_attendance", userAttendanceData => {
            dispatch(liveUpdateAttendance(userAttendanceData))
        })
        return () => {
            socket.off("recieve_attendance")
        }
    }, [socket, attendance])


    useEffect(() => {        
        setAttendanceData({...attendance});
        setFilteredData({...attendance});
    }, [attendance])

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
                <span className='text-neutral-400'>Total {attendanceData.users.length}</span>
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
                    Attendance
                </span>
            </div>
            <Reorder.Group
                axis='y'
                values={attendanceData.users}
                onReorder={setAttendanceData}
                className='table-data'
            >
                {
                    filteredData.users.length > 0
                        ?
                        filteredData.users.map((obj, index) =>
                            <Reorder.Item
                                key={obj._id}
                                value={obj}
                                onClick={() => handleAttendace(obj)}
                            >
                                <div className={`data-row flex items-center mt-3 cursor-pointer transition-all ease-in-out hover:opacity-50 justify-between rounded-lg p-1.5 px-5 border ${obj.attendance ? "border-green-400" : "border-rose-400"}`}>
                                    <span className='id w-full'>#{obj.code}</span>
                                    <span className='name flex items-center gap-2 w-full'>
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={obj.avatar} />
                                            <AvatarFallback>ZDF</AvatarFallback>
                                        </Avatar>
                                        <span className='capitalize'>{obj.first_name}</span>
                                    </span>
                                    <span className='email w-full'>{obj.email}</span>
                                    <span className='phone-number w-full ms-10'>{obj.phone_number || "N/A"}</span>
                                    <span className='attendace w-full text-end'>
                                        <Checkbox checked={obj.attendance}  />
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


export default AttendanceTable