import React from 'react';

export type ServiceItem = {
  id: string;
  no: string;
  serviceName: string;
  category: string;
  duration: string;
  budget: string;
  revision: string;
  description?: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

interface ServiceTableBodyProps {
  services: ServiceItem[];
  categoryOptions: CategoryOption[];
  handleServiceChange: (index: number, field: keyof ServiceItem, value: string) => void;
}

const ServiceTableBody: React.FC<ServiceTableBodyProps> = ({ services, categoryOptions, handleServiceChange }) => {
  return (
    <div className="flex flex-col">
      {services.map((service: ServiceItem, index: number) => (
        <div key={service.id} className="grid grid-cols-1 md:grid-cols-[50px_2fr_1.5fr_1fr_1fr_1fr_40px] gap-4 p-4 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
          <div className="text-[#00664F] font-bold text-sm hidden md:block">{service.no}</div>
          
          <div>
            <span className="md:hidden text-[#00664F] font-bold text-sm mr-2">{service.no}</span>
            <input 
              type="text" 
              value={service.serviceName}
              onChange={(e) => handleServiceChange(index, "serviceName", e.target.value)}
              className="w-full bg-transparent border-b border-gray-400 focus:border-[#00664F] outline-none py-1 text-sm text-gray-800"
              placeholder="Service Name"
            />
          </div>

          <div>
            <select 
              value={service.category}
              onChange={(e) => handleServiceChange(index, "category", e.target.value)}
              className="w-full bg-[#E5F0ED] text-[#00664F] border-none rounded-full px-3 py-1.5 text-sm outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300664F\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
            >
              {categoryOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <input 
                type="text" 
                value={service.duration}
                onChange={(e) => handleServiceChange(index, "duration", e.target.value)}
                className="w-full bg-transparent outline-none px-3 py-1.5 text-sm text-gray-700 text-center"
                placeholder="Duration"
              />
            </div>
          </div>

          <div>
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <input 
                type="text" 
                value={service.budget}
                onChange={(e) => handleServiceChange(index, "budget", e.target.value)}
                className="w-full bg-transparent outline-none px-3 py-1.5 text-sm font-bold text-[#00664F] text-center"
                placeholder="Budget"
              />
            </div>
          </div>

          <div>
             <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <input 
                type="text" 
                value={service.revision}
                onChange={(e) => handleServiceChange(index, "revision", e.target.value)}
                className="w-full bg-transparent outline-none px-3 py-1.5 text-sm text-gray-700 text-center"
                placeholder="Revision"
              />
            </div>
          </div>

          <div className="flex justify-end md:justify-center cursor-move text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceTableBody;
