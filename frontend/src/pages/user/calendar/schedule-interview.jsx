import React, { useRef, useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { axiosClient } from '@/api/axios';
import { useParams } from 'react-router-dom';

function ScheduleInterview() {
  const { cid } = useParams()
  const [selectedDays, setSelectedDays] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [days, setdays] = useState([]);
  const [times, setTimes] = useState([]);
  const [flag, setFlag] = useState(true);

  const calendarRef = useRef(null);
  const selectOption = useRef();

  const fetchReservedSlots = async () => {
    try {
      const response = await axiosClient.get(`/getCalendar/${cid}`);
      console.log(response.data)
      setdays(response.data.days);
      setReservedSlots(response.data.calendar);
    } catch (error) {
      console.error('Error fetching reserved slots:', error);
    }
  };
  useEffect(() => {
    fetchReservedSlots()
  }, [flag]);

  const initializeFlatpickr = () => {
    if (calendarRef.current) {
      flatpickr(calendarRef.current, {
        mode: 'single',
        dateFormat: 'Y-m-d',
        enable: days,
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
  }, [days]);

  const sendCalendarData = () => {
    axiosClient.post('/schedule-interview', {
      slotId: selectOption.current.value,
    })
      .then(response => {
        console.log('Request sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending request:', error);
      });
  };
  const handleNextClick1 = () => {
    sendCalendarData();
  };
  useEffect(() => {
    if (selectedDays !== '') {
      const newOptions = [];
      const filteredReservedSlots = reservedSlots.filter(slot => slot.day === selectedDays[0].day);
      filteredReservedSlots.forEach(slot => {
        slot.slots.forEach(part => {
          const startTime = part.starttime;
          const endTime = part.endtime;
          const id = part.id;
          const optionText = `${startTime} - ${endTime}`;
          newOptions.push({ optionText, id });
        })
      });
      setTimes(newOptions);
    } else {
      setTimes([]);
    }
  }, [selectedDays]);
  return (
    <div className="ml-20 mt-24">
      <div className={`mb-5 `}>
        <Label htmlFor="inputDays" className='py-2 px-4 border border-gray-100 rounded-md'>Select Days</Label>
        <Input id="inputDays" type="text" ref={calendarRef} className="hidden" />
      </div>
      <div className="flex flex-col ">

        <div className='flex items-center '>
          <select
            id="starttimes"
            ref={selectOption}
            className="basis-2/5 mr-2 mb-5  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Choose a slot</option>
            {times?.map((slot, index) => (
              <option key={index} value={slot.id}>{slot.optionText}</option>
            ))}
          </select>
        </div>
      </div>
      <div className=''>
        <Button onClick={handleNextClick1} className={``}>Next</Button>
      </div>
    </div>
  );
}
export default ScheduleInterview;