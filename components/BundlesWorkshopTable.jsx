import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import moment from 'moment'

function BundlesWorkshopTable({ bundle }) {
    return (
        <div className='bundle-workshops text-sm'>
            <h2 className='font-bold text-xl'>Workshops table</h2>
            <p className='text-neutral-500'>Here is all the workshops included to this bundle.</p>
            <div className='workshops-table border rounded-xl w-full mt-4'>
                <div className='table-header mb-2 border-b p-3 px-5 pb-2 flex items-center justify-between gap-2'>
                    <span className='w-full text-current'>Title</span>
                    <span className='w-full text-current text-end'>Location</span>
                    <span className='w-full text-current text-end'>Date</span>
                    <span className='w-full text-end text-current'>Time from</span>
                    <span className='w-full text-end text-current'>Time to</span>
                </div>
                {
                    bundle.workshops.map((workshop, index) => (
                        <div key={index} className='flex items-center p-3 px-5 justify-between gap-3 [&:not(:last-child)]:border-b'>
                            <span className='w-full capitalize flex items-center gap-3'>
                                <Avatar className="w-10 h-10">
                                    <AvatarImage className="object-cover object-top" src={workshop.image} />
                                    <AvatarFallback>ZDF</AvatarFallback>
                                </Avatar>
                                {workshop.title}
                            </span>
                            <span className='w-full text-end'>{workshop.location}</span>
                            <span className='w-full text-end'>{new Date(workshop.date).toLocaleDateString()}</span>
                            <span className='w-full text-end'>{moment(workshop.time_from, "HH:mm:ss").format("hh:mm A")}</span>
                            <span className='w-full text-end'>{moment(workshop.time_to, "HH:mm:ss").format("hh:mm A")}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default BundlesWorkshopTable