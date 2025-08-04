import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Unfold Tribe</h1>
          <p className="text-white/80">Connect, Grow, Collaborate</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-strong">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;