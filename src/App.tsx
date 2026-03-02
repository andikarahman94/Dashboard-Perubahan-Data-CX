import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Store, 
  MapPin, 
  Filter, 
  RefreshCw,
  ChevronRight,
  Search
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface RequestData {
  timestamp: string;
  site_store: string;
  nama_store: string;
  nomor_receipt: string;
  nama_customer: string;
  kategori_request: string;
  booking_dari: string;
  update_cx: string;
  tanggal_jam_proses: string;
  keterangan_cx: string;
  dc_pool: string;
  update_dc_pool: string;
  jam_proses_dc_pool: string;
  store: string;
  kota: string;
}

// --- Mock Data (Based on the image) ---
const MOCK_DATA: RequestData[] = [
  {
    timestamp: "2/24/2026 10:43:55",
    site_store: "J498",
    nama_store: "Head Office",
    nomor_receipt: "U25.5.20260224.4",
    nama_customer: "",
    kategori_request: "Perubahan Jalur Pengiriman",
    booking_dari: "NDC Cikupa",
    update_cx: "Done",
    tanggal_jam_proses: "2/25/2026 11:03:05",
    keterangan_cx: "Sudah direschedule",
    dc_pool: "NDC Cikupa",
    update_dc_pool: "Done",
    jam_proses_dc_pool: "2/25/2026 11:03:08",
    store: "Head Office",
    kota: "Jakarta"
  },
  {
    timestamp: "2/24/2026 18:11:08",
    site_store: "J300",
    nama_store: "Head Office",
    nomor_receipt: "U02.2.20260224.1",
    nama_customer: "",
    kategori_request: "Perubahan Jalur Pengiriman",
    booking_dari: "NDC Cikupa",
    update_cx: "Done",
    tanggal_jam_proses: "2/25/2026 11:03:08",
    keterangan_cx: "Sudah direschedule",
    dc_pool: "NDC Cikupa",
    update_dc_pool: "Done",
    jam_proses_dc_pool: "2/25/2026 11:27:35",
    store: "Head Office",
    kota: "Jakarta"
  },
  {
    timestamp: "2/25/2026 10:01:15",
    site_store: "J302",
    nama_store: "ST HCIR GALAXY 1 SBY",
    nomor_receipt: "U33.3.202520202",
    nama_customer: "",
    kategori_request: "Perubahan Jalur Pengiriman",
    booking_dari: "NDC Cikupa",
    update_cx: "Done",
    tanggal_jam_proses: "2/25/2026 11:27:35",
    keterangan_cx: "Sudah direschedule",
    dc_pool: "NDC Cikupa",
    update_dc_pool: "Done",
    jam_proses_dc_pool: "2/25/2026 11:23:51",
    store: "ST HCIR GALAXY 1 SBY",
    kota: "Surabaya"
  },
  {
    timestamp: "2/25/2026 11:18:16",
    site_store: "J302",
    nama_store: "MAG",
    nomor_receipt: "U02.2.20260224.6",
    nama_customer: "Rian",
    kategori_request: "Perubahan Jalur Pengiriman",
    booking_dari: "NDC Cikupa",
    update_cx: "Done",
    tanggal_jam_proses: "2/25/2026 11:23:51",
    keterangan_cx: "Sudah direschedule",
    dc_pool: "NDC Cikupa",
    update_dc_pool: "Done",
    jam_proses_dc_pool: "2/25/2026 11:47:20",
    store: "MAG",
    kota: "Jakarta"
  },
  {
    timestamp: "2/25/2026 11:34:36",
    site_store: "J303",
    nama_store: "MAG",
    nomor_receipt: "U33.3.20252021",
    nama_customer: "Rian",
    kategori_request: "Percepatan Kirim",
    booking_dari: "NDC Jababeka",
    update_cx: "Request Ditolak",
    tanggal_jam_proses: "2/25/2026 11:47:20",
    keterangan_cx: "",
    dc_pool: "NDC Jababeka",
    update_dc_pool: "Request Ditolak",
    jam_proses_dc_pool: "2/25/2026 17:15:24",
    store: "MAG",
    kota: "Jakarta"
  },
  {
    timestamp: "2/25/2026 11:43:56",
    site_store: "ee",
    nama_store: "ee",
    nomor_receipt: "U25.5.20260223",
    nama_customer: "",
    kategori_request: "Perubahan Jalur Instal",
    booking_dari: "NDC Cikupa",
    update_cx: "Done",
    tanggal_jam_proses: "2/25/2026 17:15:24",
    keterangan_cx: "Sudah direschedule",
    dc_pool: "NDC Cikupa",
    update_dc_pool: "Done",
    jam_proses_dc_pool: "2/25/2026 11:47:24",
    store: "ee",
    kota: "Jakarta"
  },
  {
    timestamp: "2/25/2026 11:46:24",
    site_store: "J300",
    nama_store: "Head Office",
    nomor_receipt: "U02.2.20260224.1",
    nama_customer: "aaa",
    kategori_request: "Remark Pengiriman",
    booking_dari: "NDC Cikupa",
    update_cx: "Done",
    tanggal_jam_proses: "2/25/2026 11:47:24",
    keterangan_cx: "Sudah direschedule",
    dc_pool: "NDC Cikupa",
    update_dc_pool: "Done",
    jam_proses_dc_pool: "2/26/2026",
    store: "Head Office",
    kota: "Jakarta"
  }
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function App() {
  const [data, setData] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Simulate fetching data from Google Apps Script
  const fetchData = () => {
    setLoading(true);
    // In a real GAS environment, we would use:
    // google.script.run.withSuccessHandler(setData).getSheetData();
    
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Derived Data ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.nama_store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nomor_receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || item.update_cx === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = data.length;
    const done = data.filter(d => d.update_cx === 'Done').length;
    const rejected = data.filter(d => d.update_cx === 'Request Ditolak').length;
    const pending = total - done - rejected;
    return { total, done, rejected, pending };
  }, [data]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.kategori_request] = (counts[item.kategori_request] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.kota] = (counts[item.kota] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const [selectedItem, setSelectedItem] = useState<RequestData | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Store Request</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Dashboard</p>
          </div>
        </div>
        <button 
          onClick={fetchData}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          disabled={loading}
        >
          <RefreshCw className={cn("w-5 h-5 text-slate-600", loading && "animate-spin")} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Total Request" 
            value={stats.total} 
            icon={<Store className="w-4 h-4" />}
            color="bg-slate-100 text-slate-700"
          />
          <StatCard 
            label="Done" 
            value={stats.done} 
            icon={<CheckCircle2 className="w-4 h-4" />}
            color="bg-emerald-100 text-emerald-700"
          />
          <StatCard 
            label="Pending" 
            value={stats.pending} 
            icon={<Clock className="w-4 h-4" />}
            color="bg-amber-100 text-amber-700"
          />
          <StatCard 
            label="Rejected" 
            value={stats.rejected} 
            icon={<XCircle className="w-4 h-4" />}
            color="bg-rose-100 text-rose-700"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              Kategori Request
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Sebaran Kota
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Store, Receipt, atau Customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'Done', 'Request Ditolak'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                  filterStatus === status 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Data List (Mobile Optimized) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">Recent Requests</h3>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              {filteredData.length} Items
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div key={index}>
                  <RequestCard item={item} onClick={() => setSelectedItem(item)} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400">
                Data tidak ditemukan
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-xl">Request Detail</h2>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <DetailRow label="Timestamp" value={selectedItem.timestamp} />
              <DetailRow label="Store" value={`${selectedItem.site_store} - ${selectedItem.nama_store}`} />
              <DetailRow label="Receipt" value={selectedItem.nomor_receipt} />
              <DetailRow label="Customer" value={selectedItem.nama_customer || '-'} />
              <DetailRow label="Category" value={selectedItem.kategori_request} />
              <DetailRow label="Booking Dari" value={selectedItem.booking_dari} />
              <DetailRow label="Update CX" value={selectedItem.update_cx} isStatus />
              <DetailRow label="Keterangan CX" value={selectedItem.keterangan_cx || '-'} />
              <DetailRow label="DC / Pool" value={selectedItem.dc_pool} />
              <DetailRow label="Update DC" value={selectedItem.update_dc_pool} isStatus />
              <DetailRow label="Kota" value={selectedItem.kota} />
            </div>
            <div className="p-6 bg-slate-50">
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, isStatus }: { label: string, value: string, isStatus?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={cn(
        "text-sm font-medium text-slate-700",
        isStatus && value === 'Done' && "text-emerald-600",
        isStatus && value === 'Request Ditolak' && "text-rose-600"
      )}>
        {value}
      </span>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", color)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function RequestCard({ item, onClick }: { item: RequestData, onClick: () => void }) {
  const isDone = item.update_cx === 'Done';
  const isRejected = item.update_cx === 'Request Ditolak';

  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-all group cursor-pointer active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{item.site_store}</span>
            <h4 className="font-bold text-slate-800 line-clamp-1">{item.nama_store}</h4>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {item.kota}
          </p>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          isDone ? "bg-emerald-100 text-emerald-700" : 
          isRejected ? "bg-rose-100 text-rose-700" : 
          "bg-amber-100 text-amber-700"
        )}>
          {item.update_cx}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Receipt</span>
          <span className="font-medium text-slate-700">{item.nomor_receipt}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Category</span>
          <span className="font-medium text-slate-700">{item.kategori_request}</span>
        </div>
        {item.nama_customer && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Customer</span>
            <span className="font-medium text-slate-700">{item.nama_customer}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium">
          {item.timestamp.split(' ')[0]}
        </span>
        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Details <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
