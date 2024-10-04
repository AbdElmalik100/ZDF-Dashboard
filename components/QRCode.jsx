import React, { useState, useRef } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { Download, Link } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import domtoimage from 'dom-to-image';
import { Button } from './ui/button';

function QRCode({ QRCodeLink, imageName, desc }) {
    const [openQr, setOpenQr] = useState(false);
    const hiddenQRRef = useRef(null);
    const QRref = useClickAway(() => {
        setOpenQr(false);
    });


    const copyLink = (event, QRLink) => {
        event.stopPropagation();
        navigator.clipboard.writeText(QRLink);
        toast.message("QR Code link copied to clipboard");
    };

    const downloadQRCode = (event) => {
        event.stopPropagation();
        
        const qrBox = document.querySelector(".qr-box-actual").cloneNode(true);
        qrBox.querySelector('.actions').remove();
        
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(qrBox);
        document.body.appendChild(tempContainer);

        const scale = 10; 
        const options = {
            width: qrBox.offsetWidth * scale,  
            height: qrBox.offsetHeight * scale, 
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${qrBox.offsetWidth}px`,  
                height: `${qrBox.offsetHeight}px`, 
            },
            quality: 1,
        };

        domtoimage.toPng(qrBox, options)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = imageName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); 
                document.body.removeChild(tempContainer); 
            })
            .catch(function (error) {
                console.error('Oops, something went wrong!', error);
            });
    };


    return (
        <div className='qr-code'>
            <div
                className="qr-box-actual bg-white rounded-3xl relative border cursor-pointer p-4 w-[250px] shadow-lg hover:shadow-xl transition-all ease-in-out h-auto flex flex-col justify-center items-center"
                onClick={() => setOpenQr(true)}>
                <div className='actions flex absolute top-3 right-2 items-center gap-1 justify-end w-full mb-2'>
                    <Button
                        className='flex items-center gap-1 text-xs p-2 h-auto rounded-lg text-white transition-all ease-in-out'
                        title='Download'
                        onClick={downloadQRCode}>
                        <Download size={15}></Download>
                    </Button>
                    <Button
                        variant={"secondary"}
                        className='flex items-center gap-1 text-xs p-2 h-auto rounded-lg text-neutral-950 transition-all ease-in-out'
                        title='Copy link'
                        onClick={(event) => copyLink(event, QRCodeLink)}>
                        <Link size={15}></Link>
                    </Button>
                </div>
                <div className="shadow-md p-4 rounded-2xl">
                    <QRCodeSVG value={QRCodeLink} />
                </div>
                <span className="font-bold text-center text-sm my-3">{desc}</span>
                <img src="/images/ZDF - Z Dental Forum Black.png" className="w-24" alt="ZDF Logo" />
            </div>
            <div
                className={`overlay fixed top-0 left-0 w-full h-full z-50 transition-all ease-in-out bg-black/75 grid place-items-center ${openQr ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div
                    ref={QRref}
                    className="qr-box-modal bg-white scale-150 rounded-3xl border p-4 w-[250px] shadow-lg h-auto flex flex-col justify-center items-center">
                    <div className="shadow-lg p-4 rounded-2xl">
                        <QRCodeSVG value={QRCodeLink} />
                    </div>
                    <span className="font-bold text-center text-sm my-3">{desc}</span>
                    <img src="/images/ZDF - Z Dental Forum Black.png" className="w-24" alt="ZDF Logo" />
                </div>
            </div>
        </div>
    );
}

export default QRCode;
