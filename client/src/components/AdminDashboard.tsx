
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import UploadContentTab from '@/components/admin/UploadContentTab';
import UpcomingContentTab from '@/components/admin/UpcomingContentTab';
import ManageContentTab from '@/components/admin/ManageContentTab';
import DemandsTab from '@/components/admin/DemandsTab';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-primary">StreamFlix</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Premium wave background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-dark-green/30 to-black opacity-60 wave-transition pointer-events-none" />
      
      <div className="pt-20 relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Admin Dashboard Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-br from-black/60 via-dark-green/10 to-black/60 backdrop-blur-sm border border-border/30">
              <TabsTrigger value="upload" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Upload Content</TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Upcoming Content</TabsTrigger>
              <TabsTrigger value="manage" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Manage Content</TabsTrigger>
              <TabsTrigger value="demands" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Demands</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-6">
              <div className="bg-gradient-to-br from-black/60 via-dark-green/10 to-black/60 backdrop-blur-sm border border-border/30 rounded-lg p-6 shadow-2xl shadow-primary/20">
                <UploadContentTab />
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-6">
              <div className="bg-gradient-to-br from-black/60 via-dark-green/10 to-black/60 backdrop-blur-sm border border-border/30 rounded-lg p-6 shadow-2xl shadow-primary/20">
                <UpcomingContentTab />
              </div>
            </TabsContent>
            
            <TabsContent value="manage" className="mt-6">
              <div className="bg-gradient-to-br from-black/60 via-dark-green/10 to-black/60 backdrop-blur-sm border border-border/30 rounded-lg p-6 shadow-2xl shadow-primary/20">
                <ManageContentTab />
              </div>
            </TabsContent>
            
            <TabsContent value="demands" className="mt-6">
              <div className="bg-gradient-to-br from-black/60 via-dark-green/10 to-black/60 backdrop-blur-sm border border-border/30 rounded-lg p-6 shadow-2xl shadow-primary/20">
                <DemandsTab />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
