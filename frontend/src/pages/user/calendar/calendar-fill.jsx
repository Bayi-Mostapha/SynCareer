import React, { useRef, useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { axiosClient } from '@/api/axios';

function MyDatePicker() {
  const [selectedDays, setSelectedDays] = useState([]);
  const calendarRef = useRef(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [inputHidden, setInputHidden] = useState(false); 
  const [flag, setFlag] = useState(false); 
  const [startTime, setStartTime] = useState(null); 
  const [endTime, setEndTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [reservedSlotsForCurrentDay,setReservedSlotsForCurrentDay] = useState(null)
  const [allDaysSelected, setAllDaysSelected] = useState(false);

  const startTimeRef = useRef();
  const endTimeRef = useRef();

  const fetchReservedSlots = async () => {
    try {
        const response = await axiosClient.get('/reserved-slots');
        setReservedSlots(response.data);
    } catch (error) {
        console.error('Error fetching reserved slots:', error);
    }
  };
  const initializeFlatpickr = () => {
    if (calendarRef.current) {
      flatpickr(calendarRef.current, {
        mode: 'multiple', 
        dateFormat: 'Y-m-d',
         disable: reservedSlots,
        clickOpens: true,
        onChange: (selectedDates) => {
          const localSelectedDates = selectedDates.map(date => {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return {
              day: localDate.toISOString().slice(0, 10),
              slots: []
            };
          });
          setSelectedDays(localSelectedDates); 
        }
      });
    }
  }; 

  useEffect(() => {  
    fetchReservedSlots();
  }, []);

  useEffect(() => {  
    initializeFlatpickr();
  }, [flag,reservedSlots]);

  useEffect(() => {
    if (selectedDays[currentSection]) {
      const currentDay = selectedDays[currentSection].day;
      const startTime = 8;
      const endTime = 20;
      const newTimes = [];
      for (let i = startTime; i < endTime; i++) {
        const time = `${i}:00`;
        newTimes.push(time);
      }
      setTimes(newTimes);
    }
  }, [currentSection,inputHidden]);

  useEffect(() => {
    console.log(selectedDays);
  }, [selectedDays]);

  const handleNextClick = () => {
    setInputHidden(true); 
  };
  const sendCalendar = async () => {
    try {
      const response = await axiosClient.post('/send-calendar',{
        selectedDays: selectedDays, 
    } );
  
    if (response.status >= 200 && response.status < 300) {
      toast.success('Calendar created successfully');
    } else {
      toast.error('Failed to create calendar');
    }
    } catch (error) {
      console.error('Error sending request to the backend:', error);
      toast.error('An error occurred while creating the calendar');
    }
  };
  
  const handleNextClick1 = () => {
    if(currentSection +1  >= selectedDays.length){
      sendCalendar();
      setInputHidden(false); 
      setSelectedDays([]);
      setCurrentSection(0);
      calendarRef.current.value = ''; 
      setFlag(true); 
    } else {
      setCurrentSection(currentSection + 1);
    }
  };
  

  
 const handleAddClick = () => {
  const selectedDay = selectedDays[currentSection];
  if (!startTime || !endTime) {
    toast.error('Please select both start and end times.');
    return;
  }
  const overlappingSlots = selectedDay.slots.filter(slot => {
    const slotStartHour = parseInt(slot.startTime.split(':')[0], 10);
    const slotEndHour = parseInt(slot.endTime.split(':')[0], 10);
    const newStartHour = parseInt(startTime.split(':')[0], 10);
    const newEndHour = parseInt(endTime.split(':')[0], 10);

    const startTimeOverlap = newStartHour >= slotStartHour && newStartHour < slotEndHour;

    const endTimeOverlap = newEndHour > slotStartHour && newEndHour <= slotEndHour;

    const completeOverlap = newStartHour <= slotStartHour && newEndHour >= slotEndHour;

    return startTimeOverlap || endTimeOverlap || completeOverlap;
});
 
  if (overlappingSlots.length > 0) {
    toast.error('slot time overlap.');
    return;
  }

  const updatedSlots = [...selectedDay.slots, { startTime: startTime, endTime: endTime }];
  const updatedSelectedDays = [...selectedDays];
  updatedSelectedDays[currentSection] = { ...selectedDay, slots: updatedSlots };
  setSelectedDays(updatedSelectedDays);
  setStartTime(null);
  setEndTime(null);
  
  startTimeRef.current.selectedIndex = 0;
  endTimeRef.current.selectedIndex = 0;
};

const handleDeleteSlot = (index) => {
  const selectedDay = selectedDays[currentSection];
  const updatedSlots = selectedDay.slots.filter((slot, idx) => idx !== index);
  const updatedSelectedDays = [...selectedDays];
  updatedSelectedDays[currentSection] = { ...selectedDay, slots: updatedSlots };
  setSelectedDays(updatedSelectedDays);
};
const handleBackClick = () => {
  setCurrentSection(currentSection - 1);
};

const handleCheckboxChange = () => {
  setAllDaysSelected(!allDaysSelected);
  if (allDaysSelected) {
    const updatedSelectedDays = selectedDays.map(day => ({
      ...day,
      slots: []
    }));
    setSelectedDays(updatedSelectedDays);
  } else {
    if (selectedDays.length > 0) {
      const selectedDaySlots = selectedDays[0].slots; // Assuming slots are stored in the first selected day
      const updatedSelectedDays = selectedDays.map(day => ({
        ...day,
        slots: selectedDaySlots
      }));
      setSelectedDays(updatedSelectedDays);
    }
  }
};
  return (
    <div className="ml-20 mt-24 py-10 px-5 ">
      <div className={`mb-5 ${inputHidden ? 'hidden' : ''}`}>
        <Label htmlFor="inputDays" className='py-2 px-4 border border-gray-100 rounded-md'>Select Days</Label>
        <Input id="inputDays" type="text" ref={calendarRef} className="hidden" />
      </div>
      <div className={`${!inputHidden ? 'hidden' : ''} flex flex-col `}>
          <p className='font-medium '>Day {currentSection + 1}: {selectedDays[currentSection]?.day}</p>
           <div className='flex items-center '>
           <select
              ref={startTimeRef}
              id="starttimes" 
              defaultValue={times[0]}
              className="basis-2/5 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setStartTime(e.target.value)}>
              <option selected disabled value={""}>Choose a start time</option>
              {times.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
            <select  
              ref={endTimeRef} 
              id="endtimes" 
              className="basis-2/5 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)} 
            >
              <option selected disabled>Choose an end time</option>
              {times.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
            <button onClick={handleAddClick} className="py-2 px-5 rounded-md bg-white text-black border border-black hover:bg-black hover:text-white">ADD</button>
           </div>
           <div className="my-3">
            <div className="font-medium">Selected slots:</div>
              {selectedDays[currentSection]?.slots.map((slot, index) => (
                <div key={index} className="flex items-center my-1">
                  <div>{slot.startTime} - {slot.endTime}</div>
                  <button onClick={() => handleDeleteSlot(index)} className="ml-2 py-1 px-3 rounded-md bg-red-500 text-white">Delete</button>
                </div>
              ))}
            </div>
           <div className={` flex items-center my-3 ${currentSection > 0 ? 'hidden' : ''}`}>
              <input id="link-checkbox" 
              type="checkbox" value=""  checked={allDaysSelected}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">apply to all days.</label>
           </div>
      </div>
    <div className=''>
      <Button onClick={handleBackClick} className={`${!inputHidden || currentSection < 1 ? 'hidden' : ''}`}>Back</Button>
      <Button onClick={handleNextClick} className={`${inputHidden ? 'hidden' : ''}`}>Next</Button>
      <Button onClick={handleNextClick1} className={`${!inputHidden ? 'hidden' : ''}`}>Next</Button>
    </div>
</div>
);
}

export default MyDatePicker;
