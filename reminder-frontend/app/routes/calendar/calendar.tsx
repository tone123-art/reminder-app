import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useFetcher, useLoaderData} from "react-router";
import { useState} from "react";
export { default as action} from "./calendar.action"
export { default as loader} from "./calendar.loader"
import type {LoaderData ,Appt } from "~/lib/types/calendar";
import EditAppointmentModal from "../../components/calendar/EditAppointmentModal"
import NewAppointmentCard from "../../components/calendar/NewAppointmentCard";


export default function CalendarPage(){

  const {appointments }= useLoaderData() as LoaderData;
  const events = appointments.map(a =>({
        id: String(a.id),
        title: a.title,
        start: a.start_at,
        end: a.end_at ?? undefined,
        allDay: Boolean(a.all_day),
    }));

    const apptFetcher = useFetcher();
    const editFetcher = useFetcher();

    const [editing, setEditing] = useState<Appt | null> (null);
    const [showForm, setShowForm] = useState(false);

    const onEventClick = (id : number) => {
    const appt = appointments.find((a) => a.id === id);
    if (appt) setEditing(appt);
    };

  return(
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <div className="relative flex items-center mb-3">
        <h1 className=" headline sm:absolute sm:left-1/2 sm:-translate-x-1/2">Calendar</h1>
        <button
        type="button"
        onClick={() => setShowForm(true)}
        className="btn-add ml-auto"
    >
      New Appointment
    </button>
    </div>

  <NewAppointmentCard 
    fetcher={apptFetcher} 
    open={showForm} 
    onClose={()=> setShowForm(false)}
  />

  <EditAppointmentModal 
    fetcher={editFetcher} 
    appt={editing} 
    onClose={()=> setEditing(null)}
  />

  <div className="list-container">
  <FullCalendar 
    plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    headerToolbar={
   
    
       { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }
  }
    timeZone="local"
    events={events}
    selectable
    eventContent={(arg) => (
    <div className="fc-event-custom w-full bg-blue-900 px-2 hover:bg-blue-800">
         <div className="leading-tight">{arg.event.title}</div>
        <div className="leading-tight">{arg.timeText}</div>
    </div>
    )}     
    eventClick={(info) => onEventClick(Number(info.event.id))}
    />    
  </div>
  </div>   
)}


