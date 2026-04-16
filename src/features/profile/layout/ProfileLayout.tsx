import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from '../components/ProfileSidebar';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer/Footer';

export function ProfileLayout() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Left Column */}
          <aside className="md:col-span-1">
            <ProfileSidebar />
          </aside>
          {/* Content - Right Column */}
          <div className="md:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
