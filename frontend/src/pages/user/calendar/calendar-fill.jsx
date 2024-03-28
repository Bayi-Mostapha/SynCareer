import React, { useRef, useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'

function MyDatePicker() {
  const [selectedDays, setSelectedDays] = useState([]);
  const calendarRef = useRef(null);

  const [nbrDays, setNbrDays] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [inputHidden, setInputHidden] = useState(false); 

  const [startTime, setStartTime] = useState(null); // Initialize with null instead of an empty string
const [endTime, setEndTime] = useState(null);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (calendarRef.current) {
      flatpickr(calendarRef.current, {
        mode: 'multiple', 
        dateFormat: 'Y-m-d',
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
          setNbrDays(localSelectedDates.length);
        }
      });
    }
  }, []);

  useEffect(() => {
    const startTime = 1;
    const endTime = 23;
    const newTimes = [];
    for (let i = startTime; i <= endTime; i++) {
      newTimes.push(`${i}:00`);
    }
    setTimes(newTimes);
  }, [currentSection]);
  useEffect(() => {
    console.log(selectedDays);
  }, [selectedDays]);

  const handleNextClick = () => {
    setInputHidden(true); 
  };

  const handleNextClick1 = () => {
    if(currentSection +1  >= selectedDays.length){
      toast.success('calendar created succesfully');
    }
    setCurrentSection(currentSection + 1);
  };
  const startTimeRef = useRef();
  const endTimeRef = useRef();


 const handleAddClick = () => {
  const selectedDay = selectedDays[currentSection];
 

  // Check if both start and end times are selected
  if (!startTime || !endTime) {
    toast.error('Please select both start and end times.');
    return;
  }

  // Find overlapping slots
  const overlappingSlots = selectedDay.slots.filter(slot => {
    return (startTime >= slot.startTime && startTime <= slot.endTime) ||
           (endTime >= slot.startTime && endTime <= slot.endTime) ||
           (startTime <= slot.startTime && endTime >= slot.endTime);
  });

 
  if (overlappingSlots.length > 0) {
    toast.error('slot time overlap.');
    return;
  }


  // Add the new time slot (either the original one or the merged one) to the filtered slots
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
           <div class="flex items-center my-3">
              <input id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
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
