import moment from 'moment/moment'
import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdDateRange } from 'react-icons/md'
import {DayPicker} from 'react-day-picker'

const DateSelector = ({date , setDate}) => {

  const [openDatePicker , setOpenDatePicker] = useState(false);

  const handleDateSelect = (selectedDate)=>{
    if(selectedDate){
      setDate(selectedDate);
    }
  }
  // The selectedDate parameter is passed automatically by the DayPicker component from react-day-picker library when user selects the date (selected date is passed as an argument)

  

  return (
    <div>
        <button 
        className='inline-flex items-center gap-2 text-[13px] font-medium text-blue-900 bg-sky-200/40 hover:bg-sky-200/70 rounded-sm px-2 py-1 cursor-pointer'
        onClick={()=>{setOpenDatePicker(true)}}>

          <MdDateRange 
          className='text-lg'/>

          {date ? moment(date).format('Do MMM YYYY'): moment().format('Do MMM YYYY')}

        </button>

        {/* Conditional rendering based on openDate state */}
        {openDatePicker && (
          <div className='overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9'>

            <button className='w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2'
            onClick={()=>{setOpenDatePicker(false)}}>

              <IoMdClose className='text-xl text-blue-900 cursor-pointer' />

            </button>

            <DayPicker 
            captionLayout='dropdown' 
            mode='single' 
            selected={date} 
            pagedNavigation 
            onSelect={handleDateSelect}/>
          </div>
        )}
    </div>
  )
}

export default DateSelector