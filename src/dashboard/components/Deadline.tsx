import StatusBadge from './StatusBadge'; 
import Avatar from '../../components/common/Avatar'; 

interface DeadlineProps { 
  heading: string; 
  paragraph: string; 
  status: string; 
  name: string; 
  date: string;
  statusColor: string; // New prop for the indicator dot color
}

function Deadline({ heading, paragraph, status, name, date, statusColor }: DeadlineProps) { 
  return ( 
    <div className="w-full flex justify-between items-center border-t border-t-gray-100 py-4 px-6 transition hover:bg-slate-50"> 
      
      {/* Left side: Status dot and text info */}
      <div className="flex items-center gap-4">
        {/* Status indicator dot */}
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusColor}`}></span>
        
        <div> 
          <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">{paragraph}</h1> 
          <p className="text-sm text-gray-400 mt-0.5">{heading}</p> 
        </div> 
      </div>

      {/* Right side: Avatar, date, and badge */}
      <div className="flex gap-4 items-center"> 
        <Avatar name={name} /> 
        <p className="hidden sm:flex text-gray-400 text-sm font-medium">{date}</p> 
        <StatusBadge status={status} /> 
      </div> 
      
    </div> 
  ); 
}

export default Deadline;
