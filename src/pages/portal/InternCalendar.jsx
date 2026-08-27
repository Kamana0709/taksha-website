import React from 'react';
import SEO from '../../components/SEO/SEO';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './InternCalendar.css';

export default function InternCalendar() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Hardcoded dummy data for calendar prototype
  const currentMonth = "May 2026";
  const emptyDays = 5; // Friday starts the month
  const totalDays = 31;
  
  const events = {
    4: [{ type: 'task', title: 'Navbar Due' }],
    8: [{ type: 'meeting', title: 'Mentor Sync 1:1' }],
    15: [{ type: 'task', title: 'API Integration' }],
    22: [{ type: 'holiday', title: 'Company Holiday' }]
  };

  const renderDays = () => {
    let cells = [];
    
    // Empty cells before start of month
    for (let i = 0; i < emptyDays; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day calendar-day--empty"></div>);
    }
    
    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const isToday = d === 12; // Pretend today is the 12th
      const dayEvents = events[d] || [];
      
      cells.push(
        <div key={`day-${d}`} className={`calendar-day ${isToday ? 'calendar-day--today' : ''}`}>
          <span className="calendar-date">{d}</span>
          {dayEvents.map((evt, idx) => (
            <div key={idx} className={`calendar-event calendar-event--${evt.type}`}>
              {evt.title}
            </div>
          ))}
        </div>
      );
    }
    
    // Empty cells to complete the grid row
    const totalCells = cells.length;
    const remainder = totalCells % 7;
    if (remainder > 0) {
      for (let i = 0; i < (7 - remainder); i++) {
        cells.push(<div key={`empty-end-${i}`} className="calendar-day calendar-day--empty"></div>);
      }
    }
    
    return cells;
  };

  return (
    <>
      <SEO title="Calendar | Taksha Workspace" />
      <div className="intern-calendar">
        <header className="calendar-header">
          <div>
            <h1 className="intern-tasks__title" style={{ margin: 0 }}>Schedule</h1>
            <p className="intern-tasks__subtitle" style={{ margin: 0 }}>Important dates and task deadlines.</p>
          </div>
          
          <div className="calendar-nav">
            <button className="calendar-nav-btn"><ChevronLeft /></button>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', minWidth: '150px', textAlign: 'center' }}>
              {currentMonth}
            </h2>
            <button className="calendar-nav-btn"><ChevronRight /></button>
          </div>
        </header>

        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {renderDays()}
        </div>
      </div>
    </>
  );
}
