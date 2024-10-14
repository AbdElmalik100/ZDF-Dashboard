'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { RefreshCw, ImageUp, Trash, X, Pencil } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Progress } from "@/components/ui/progress"
import { formatByte } from "@/lib/formatter"
import { getWorkshops } from "@/store/slices/workshopsSlice"
import { updateBundle } from "@/store/slices/bundlesSlice"

function EditBundle({ bundleData }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.workshops)
    const [openDialog, setOpenDialog] = useState(false)
    const { workshops } = useSelector(state => state.workshops)
    const [selectImage, setSelectImage] = useState({
        link: "",
        file: ""
    })
    const [bundle, setBundle] = useState({...bundleData})
    const [progress, setProgress] = useState(0)
    const [openSelect, setOpenSelect] = useState(false)


    const handleSelection = (workshop) => {
        const bundleWorkshops = [...bundle.workshops]
        bundleWorkshops.push(workshop)
        setBundle({...bundle, workshops: bundleWorkshops})
    }
    const deleteWorkshop = (workshopId) => {
        const bundleWorkshops = bundle.workshops.filter(workshop => workshop._id !== workshopId)        
        setBundle({...bundle, workshops: bundleWorkshops})
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setBundle({ ...bundle, [name]: value })
    }

    const handleSelectImage = (e) => {
        const inputFile = e.target.files[0]
        setSelectImage({
            ...selectImage,
            file: inputFile,
            link: URL.createObjectURL(inputFile),
        })
        setBundle({
            ...bundle,
            image: inputFile
        })
    }
    const deleteImage = () => {
        setSelectImage({ file: null, link: null })
        setBundle({
            ...bundle,
            image: bundleData.image
        })
    }

    const submitUpdate = () => {
        const bundleFormation = { ...bundle, workshops: bundle.workshops.map(el => el._id) }
        console.log(bundleFormation);
        
        dispatch(updateBundle({ bundleData: bundleFormation, setProgress: setProgress }))
            .then(response => {
                if (!response.payload.status) setOpenDialog(false)
            })
    }

    useEffect(() => {
        dispatch(getWorkshops())
    }, [dispatch])

    useEffect(() => {
        return () => {
            setSelectImage({
                file: "",
                link: "",
            })
            setProgress(0)
            setBundle({
                ...bundle,
                image: bundleData.image
            })
        }
    }, [openDialog])


    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <div className='flex items-center gap-2 transition-all ease-in-out hover:bg-neutral-100 text-neutral-950 p-1 px-2 rounded'>
                    <Pencil size={18} />
                    Edit
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] overflow-auto">
            <DialogHeader>
                    <DialogTitle>Update bundle</DialogTitle>
                    <DialogDescription>
                        Update the information of the bundle with seamless.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                {
                        selectImage.file
                            ?
                            <div className="event-image col-span-2 ">
                                <div className="selected-image w-full h-full flex items-start justify-between gap-3">
                                    <img className="w-20 h-20 object-cover rounded-xl" src={selectImage.link} alt="uploaded image" />
                                    <div className="flex items-start flex-col flex-1 h-full">
                                        <div className="info flex flex-col gap-1 text-xs h-full">
                                            <span >{selectImage.file?.name}</span>
                                            <span className="font-bold">{formatByte.format(selectImage.file?.size)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 w-full">
                                            <span className="text-sm percentage">{progress}%</span>
                                            {
                                                loading
                                                    ?
                                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                                    :
                                                    <Trash size={18} className="text-rose-600 transition-all ease-in-out hover:text-rose-400 cursor-pointer" onClick={deleteImage}></Trash>
                                            }
                                        </div>
                                        <Progress value={progress} className="mt-1"></Progress>
                                    </div>
                                </div>
                            </div>
                            :
                            <label className="event-image group rounded-3xl overflow-hidden max-h-[200px] w-fit relative col-span-2 flex gap-2 cursor-pointer items-start justify-start">
                                <input id="image-file" onChange={handleSelectImage} type="file" accept="image/*" className="hidden" />
                                <img src={bundleData.image} className="w-48 object-cover object-[50%,10%]" alt="event image" />
                                <div className="overlay w-full h-full group-hover:opacity-100 opacity-0 transition-all ease-in-out left-0 top-0 absolute bg-black/75 grid place-items-center">
                                    <label htmlFor="image-file" className="p-1.5 flex-col text-xs bg-primary cursor-pointer rounded-lg transition-all ease-in-out flex items-center hover:bg-primary/90 text-white px-3">
                                        <ImageUp size={15} className="me-1" />
                                        Change image
                                    </label>
                                </div>
                            </label>
                    }
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Bundle title</span>
                            <Input name="title" placeholder="e.g. ZDF package" value={bundle.title} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Bundle workshops</span>
                            <div className="select-multiple rounded-lg border flex items-center gap-2 relative hover:border-black p-2 px-3" onClick={() => setOpenSelect(prev => !prev)}>
                                {
                                    bundle.workshops.length > 0 
                                        ?
                                        <div className="flex flex-wrap text-xs gap-1">
                                            {
                                                bundle.workshops.map((workshop, index) => (
                                                    <span key={index} className="p-1 px-2 rounded-full border capitalize flex items-center gap-1">
                                                        {workshop.title}
                                                        <X size={12} className="cursor-pointer" onClick={() => deleteWorkshop(workshop._id)}></X>
                                                    </span>
                                                ))
                                            }
                                        </div>
                                        :
                                        <span className="text-sm text-neutral-500">Select workshops</span>
                                }
                                {
                                    openSelect &&
                                    <div className="menu bg-white shadow-md rounded-lg p-1 absolute flex flex-col gap-1 border left-0 top-11 w-full h-[150px] overflow-auto">
                                        {
                                            
                                            workshops.map((workshop, index) => (
                                                <span key={index} onClick={() => handleSelection(workshop)} className="p-1.5 px-2 cursor-pointer rounded text-sm hover:bg-neutral-100 capitalize">{workshop.title}</span>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </label>
                        <label>
                            <span className="block mb-1">Bundle description</span>
                            <Textarea name="description" placeholder="Bundle description" rows={3} value={bundle.description} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Price</span>
                            <Input type="number" name="price" placeholder="e.g. 800" value={bundle.price} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitUpdate} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Updating...
                                </>
                                :
                                "Save changes"
                        }
                    </Button>
                    <DialogClose>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditBundle