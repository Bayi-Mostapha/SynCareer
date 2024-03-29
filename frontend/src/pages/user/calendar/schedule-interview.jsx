import React, { useRef, useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { axiosClient } from '@/api/axios';

function ScheduleInterview() {
    const [selectedDays, setSelectedDays] = useState([]);
    const [reservedSlots, setReservedSlots] = useState([]);

    const calendarRef = useRef(null);

    const fetchReservedSlots = async () => {
        try {
            const response = await axiosClient.get('/getCalendar/1');
           console.log(response.data);
        } catch (error) {
            console.error('Error fetching reserved slots:', error);
            // Handle error
        }
    };

    useEffect(() => {
        
        
        fetchReservedSlots()
        
    }, []);

    const handleSlotSelection = () => {
        // Handle slot selection logic here
        console.log(selectedDays);
    };

    return (
        <div className="ml-20 mt-24">
            <Label htmlFor="inputDays" className='py-2 px-4 border border-gray-100 rounded-md'>Select Days</Label>
            <Input id="inputDays" type="text" ref={calendarRef} className="hidden" />
            <Button onClick={handleSlotSelection}>Select Slot</Button>
        </div>
    );
}

export default ScheduleInterview;
