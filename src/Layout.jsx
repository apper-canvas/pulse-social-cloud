import { Outlet } from "react-router-dom";
import { useState } from "react";
import TrendingHashtags from "@/components/molecules/TrendingHashtags";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import Header from "@/components/organisms/Header";
import MobileNavigation from "@/components/organisms/MobileNavigation";
import DesktopSidebar from "@/components/organisms/DesktopSidebar";

const Layout = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header onCreatePost={() => setIsCreateModalOpen(true)} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <DesktopSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
{/* Right Sidebar for larger screens */}
        <aside className="hidden xl:block w-80 bg-surface/30 border-l border-gray-700 overflow-y-auto">
          <div className="p-6">
            <TrendingHashtags />
            
            <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl p-6">
              <h3 className="font-heading font-semibold text-lg mb-4">Suggested for you</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Alex Chen</p>
                    <p className="text-xs text-gray-400">@alexchen</p>
                  </div>
                  <button className="px-3 py-1 bg-primary hover:bg-primary/80 text-white text-xs rounded-full transition-colors">
                    Follow
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Maria Garcia</p>
                    <p className="text-xs text-gray-400">@mariagarcia</p>
                  </div>
                  <button className="px-3 py-1 bg-primary hover:bg-primary/80 text-white text-xs rounded-full transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Layout;