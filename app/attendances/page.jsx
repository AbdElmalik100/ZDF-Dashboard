'use client'
import AttendanceCard from '@/components/AttendanceCard'
import NewAttendance from '@/components/NewAttendance'
import { getAttendances } from '@/store/slices/attendancesSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Attendances() {
    const { attendances } = useSelector(state => state.attendances)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getAttendances())
    }, [dispatch])
    return (
        <div className='flex flex-col gap-3 h-full'>
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase">Attendances</h2>
                <NewAttendance btnText="New attendance"></NewAttendance>
            </header>
            {
                attendances.length === 0
                    ?
                    <div className='h-full grid place-items-center flex-1'>
                        <div className='no-events wrapper'>
                            <img src="/images/correct.png" className='w-32 mx-auto mb-3' alt="Attendance image" />
                            <p className='text-neutral-400 w-3/4 text-center mx-auto'>There is no attendance tables yet, Create one now and make it done.</p>
                            <div className='grid place-items-center mt-8'>
                                <NewAttendance btnText="Create table"></NewAttendance>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='grid grid-cols-4 mt-10 gap-5'>
                        {
                            attendances &&
                            attendances.map((attendance, index) => (
                                <AttendanceCard key={index} attendance={attendance}></AttendanceCard>
                            ))
                        }
                    </div>
            }
        </div>
    )
}

export default Attendances