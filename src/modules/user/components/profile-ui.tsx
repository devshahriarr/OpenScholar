import { Eye, Download, Users, FileText, Camera, ChevronDown } from "lucide-react";

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  iconColor = "text-primary",
  bgColor = "bg-primary-light"
}: { 
  icon: any, 
  label: string, 
  value: string | number,
  iconColor?: string,
  bgColor?: string
}) {
  return (
    <div className={`card-premium p-4 flex flex-col items-center justify-center text-center gap-1 group ${bgColor}`}>
      <div className={`${iconColor} transition-transform group-hover:scale-110`}>
        <Icon size={22} />
      </div>
      <span className="text-2xl font-bold text-text-primary mt-1">{value}</span>
      <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function ProfileHeader({ user, isEditing, onEdit }: { user: any, isEditing: boolean, onEdit: () => void }) {
  return (
    <div className="bg-surface rounded-2xl shadow-premium overflow-hidden mb-8 border border-border">
      {/* Banner */}
      <div className="h-48 md:h-56 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full bg-surface border-[6px] border-surface shadow-lg flex items-center justify-center text-5xl font-bold text-primary">
                {user.name[0]}
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-primary text-white rounded-full shadow-md border-2 border-surface hover:bg-primary-hover transition-all">
                <Camera size={18} />
              </button>
            </div>
            
            {/* Name and Info */}
            <div className="mb-2">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{user.name}</h1>
              <div className="w-full h-1 bg-primary/20 mt-1 mb-2 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary"></div>
              </div>
              <p className="text-text-secondary font-semibold text-sm">{user.department?.name || "No Department"}</p>
            </div>
          </div>

          {!isEditing && (
            <button 
              onClick={onEdit}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md mb-2 active:scale-95"
            >
              <FileText size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PasswordSection() {
  return (
    <div className="card-premium p-6 mt-8 flex items-center justify-between cursor-pointer hover:bg-background/50 transition-colors">
      <h3 className="text-lg font-bold text-text-primary">Change Password</h3>
      <ChevronDown size={20} className="text-text-secondary" />
    </div>
  );
}
