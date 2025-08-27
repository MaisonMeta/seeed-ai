import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 py-2">
    <div className="text-brand-accent">{icon}</div>
    <div className="flex-grow">
      <span className="font-semibold text-brand-text">{label}:</span>
      <span className="text-brand-text-secondary ml-2">{value}</span>
    </div>
  </div>
);

const AccountPage: React.FC = () => {
  const { session, user, signInWithGoogle } = useAuth();

  if (!session || !user) {
    return (
       <div className="p-4 sm:p-8 max-w-2xl mx-auto animate-fadeIn text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-4">My Account</h1>
        <p className="text-brand-text-secondary mb-6 max-w-md">Please sign in to view your account details and manage your subscription.</p>
        <button
          onClick={signInWithGoogle}
          className="bg-brand-accent text-white font-bold rounded-lg py-3 px-6 hover:opacity-90 transition text-base"
        >
          Sign In
        </button>
      </div>
    );
  }

  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto animate-fadeIn">
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-6">My Account</h1>
      
      <div className="bg-brand-secondary p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.user_metadata.avatar_url || `https://www.gravatar.com/avatar/${user.id}?d=mp&f=y`}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-4 border-brand-primary"
          />
          <div>
            <h2 className="text-2xl font-semibold text-brand-text">{user.user_metadata.full_name || 'User Profile'}</h2>
            <p className="text-brand-text-secondary">{user.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <InfoRow 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
            label="Joined"
            value={joinedDate}
          />
        </div>
        
        <hr className="my-6 border-brand-border" />

        <h2 className="text-2xl font-semibold mb-4 text-brand-text">Credits & Subscription</h2>
        <div className="space-y-1">
          <InfoRow 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
            label="Current Plan"
            value="Pro Tier (mocked)"
          />
           <InfoRow 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zm-1 6a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm1 3a1 1 0 00-1 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 00-1-1 1 1 0 110-2 1 1 0 001 1z" clipRule="evenodd" /></svg>}
            label="Credits Remaining"
            value="4,200 (mocked)"
          />
           <InfoRow 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
            label="Next Renewal"
            value="July 31, 2024 (mocked)"
          />
        </div>

        <button className="mt-6 w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
          Manage Subscription
        </button>
      </div>
    </div>
  );
};

export default AccountPage;