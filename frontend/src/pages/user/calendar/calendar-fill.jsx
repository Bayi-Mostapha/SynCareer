import React, { useRef, useState ,useEffect} from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function MyDatePicker() {
  const [isVisible, setIsVisible] = useState(false);
  const calendarRef = useRef(null);
  const hiddenInputRef = useRef(null);

//   const toggleVisibility = () => {
//     setIsVisible(!isVisible);
//   };

  const handleDateClick = () => {
//     setIsVisible(true);
  };

  useEffect(() => {
    if (calendarRef.current) {
      flatpickr(calendarRef.current, {
        mode: 'multiple', // Enable multiple date selection
        dateFormat: 'Y-m-d', // Date format
        // Add any other Flatpickr options as needed
       // Close Flatpickr when clicking outside the calendar
      });
    }
  }, []);

//   useEffect(() => {
//     // Focus on the hidden input field when it becomes visible
//     if (isVisible && hiddenInputRef.current) {
//       hiddenInputRef.current.focus();
//     }
//   }, [isVisible]);

  return (
    <div className="ml-20 mt-24">
      <input
        type="text"
        ref={calendarRef}
        onClick={handleDateClick}
        readOnly // Prevent editing the input directly
      />
      {/* <input
          type="text"
          ref={hiddenInputRef}
          placeholder="Select days..."
          onBlur={toggleVisibility}
        />
      {isVisible && (
        
      )} */}
    </div>
  );
}

export default MyDatePicker;
