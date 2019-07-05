import React from 'react';
import './TimeTable.css'

const TimeTable = (props) => {

  const convertDay = (weekDay) => {
    if (weekDay === 'MONDAY') return("monday");
    else if (weekDay === 'TUESDAY') return("tuesday");
    else if (weekDay === 'WEDNESDAY') return("wednesday");
    else if (weekDay === 'THURSDAY') return("thursday");
    else if (weekDay === 'FRIDAY') return("friday");
    else if (weekDay === 'SATURDAY') return("saturday");
    else return null;
  }

  const convertStartTime = (start_time) => {
    if (start_time === "09:00AM") return("nineOclock");
    else if (start_time === "10:00AM") return("tenOclock");
    else if (start_time === "11:00AM") return("elevenOclock");
    else if (start_time === "12:00PM") return("twelveOclock");
    else if (start_time === "01:00PM") return("oneOclock");
    else if (start_time === "02:00PM") return("twoOclock");
    else if (start_time === "03:00PM") return("threeOclock");
    else if (start_time === "04:00PM") return("fourOclock");
    else return null;
  } 

  const convertEndTime = (end_time) => {
    if (end_time === "10:00AM") return("endTenOclock");
    else if (end_time === "11:00AM") return("endElevenOclock");
    else if (end_time === "12:00PM") return("endTwelveOclock");
    else if (end_time === "01:00PM") return("endOneOclock");
    else if (end_time === "02:00PM") return("endTwoOclock");
    else if (end_time === "03:00PM") return("endThreeOclock");
    else if (end_time === "04:00PM") return("endFourOclock");
    else if (end_time === "05:00PM") return("endFiveOclock");
  } 

    const tableDataMainStyle = {
      // backgroundColor: `rgb(${props.color})`,
      fontSize: '10px'
    }
      return (
        <p style={tableDataMainStyle} 
          className={`tableElement ${convertDay(props.day)}
          ${convertStartTime(props.startTime)} 
          ${convertEndTime(props.endTime)}`}
        >
          {props.course} 
        </p>
      )
}

export default TimeTable;