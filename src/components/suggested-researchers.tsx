import { UserPlus, Check } from "lucide-react";

const SUGGESTED = [
  { id: "1", name: "David Martinez", dept: "Machine Learning", univ: "Tech University", followers: 1567, avatar: "D" },
  { id: "2", name: "Lisa Anderson", dept: "Data Science", univ: "Tech University", followers: 2134, avatar: "L" },
  { id: "3", name: "Robert Wilson", dept: "Computer Science", univ: "Global Univ", followers: 892, avatar: "R" },
];

export function SuggestedResearchers() {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="text-primary" size={20} />
        <h2 className="text-lg font-bold text-text-primary">Suggested Researchers</h2>
      </div>
      
      <p className="text-xs text-text-secondary mb-6">Discover researchers in your field</p>

      <div className="space-y-6">
        {SUGGESTED.map((person) => (
          <div key={person.id} className="group">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {person.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer">
                    {person.name}
                  </h3>
                  <p className="text-[10px] text-text-muted leading-none mt-1">{person.dept}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{person.univ}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] font-medium text-text-secondary px-1">
              <span>{Math.floor(person.followers / 200)} thesis</span>
              <span>{person.followers.toLocaleString()} views</span>
            </div>

            <button className="w-full mt-3 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary-hover transition-all shadow-sm active:scale-95">
              Follow
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-2.5 border border-border rounded-xl text-xs font-bold text-text-secondary hover:bg-background transition-colors">
        View More
      </button>
    </div>
  );
}
