import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Filter, Layers, ArrowRight } from 'lucide-react';
import L from 'leaflet';
import { API_BASE_URL } from '../../config/api';

// Base map center (e.g. center of India or the specific city)
const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

// Status colors for markers
const getStatusColor = (status) => {
  switch (status) {
    case 'SUBMITTED': return '#3b82f6'; // blue
    case 'ASSIGNED': return '#eab308'; // yellow
    case 'IN_PROGRESS': return '#f97316'; // orange
    case 'RESOLVED': return '#22c55e'; // green
    default: return '#6b7280'; // gray
  }
};

// Custom SVG Marker icon factory
const createCustomIcon = (status) => {
  const color = getStatusColor(status);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
  
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width: 32px; height: 32px; filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

function MapBoundsFetcher({ setIssues }) {
  const map = useMapEvents({
    moveend: async () => {
      const bounds = map.getBounds();
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/issues/map?min_lat=${bounds.getSouth()}&max_lat=${bounds.getNorth()}&min_lng=${bounds.getWest()}&max_lng=${bounds.getEast()}`);
        const result = await res.json();
        if (result.success) {
          setIssues(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch map issues:', error);
      }
    },
  });
  return null;
}

export default function GlobalMapView() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Initial load
  useEffect(() => {
    const fetchInitialIssues = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/issues/map`);
        const result = await res.json();
        if (result.success) {
          setIssues(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialIssues();
  }, []);

  const filteredIssues = filterStatus 
    ? issues.filter(issue => issue.status === filterStatus)
    : issues;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden relative">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 z-10 relative">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Layers className="mr-2 text-blue-600" size={24} /> Civic Map
        </h2>
        
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500 dark:text-slate-400" />
          <select 
            className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <div className="flex-1 relative z-0">
        {loading && (
          <div className="absolute inset-0 z-[1000] bg-white/80 dark:bg-slate-900/80 flex items-center justify-center">
            <span className="text-blue-600 font-medium">Loading Map Data...</span>
          </div>
        )}
        
        <MapContainer 
          center={DEFAULT_CENTER} 
          zoom={DEFAULT_ZOOM} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <MapBoundsFetcher setIssues={setIssues} />

          {filteredIssues.map(issue => (
            <Marker 
              key={issue.id} 
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(issue.status)}
            >
              <Popup className="civic-popup">
                <div className="w-48">
                  {issue.images && issue.images.length > 0 && (
                    <img src={`${API_BASE_URL}${issue.images[0].url}`} alt="Issue" className="w-full h-24 object-cover rounded-md mb-2" />
                  )}
                  <div className="text-xs font-bold text-blue-600 mb-1">{issue.category?.name || 'General'}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{issue.title}</h3>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mb-3">{new Date(issue.created_at).toLocaleDateString()}</div>
                  <Link 
                    to={`/issues/${issue.id}`} 
                    className="block w-full text-center bg-blue-600 text-white text-xs font-medium py-1.5 rounded flex items-center justify-center hover:bg-blue-700"
                  >
                    View Details <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-2">Status Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Submitted</div>
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span> Assigned</div>
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span> In Progress</div>
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Resolved</div>
        </div>
      </div>
    </div>
  );
}



