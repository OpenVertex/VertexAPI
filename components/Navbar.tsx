'use client';

import React from 'react';
import { Activity, LayoutDashboard, Settings, Github, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

interface NavbarProps {
  onLogout?: () => void;
  isAdmin?: boolean;
}

export default function Navbar({ onLogout, isAdmin = false }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 mb-8 glass rounded-[1.5rem] shadow-lg border border-white/40">
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2 group">
          <Logo size={42} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500">
            Vertex <span className="text-sakura-dark">Status</span>
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-2">
        <NavLink href="/" icon={<Home size={18} />} label="主页" active={!isAdmin} />
        {isAdmin && <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="控制台" active={isAdmin} />}
      </div>

      <div className="flex items-center space-x-3">
        <a 
          href="https://github.com" 
          target="_blank" 
          className="p-2.5 hover:bg-white/40 rounded-xl transition-all text-gray-500 hover:text-gray-800"
          title="GitHub Source"
        >
          <Github size={20} />
        </a>
        
        {onLogout ? (
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold transition-all text-sm"
          >
            <LogOut size={16} />
            <span>退出</span>
          </button>
        ) : (
          <Link 
            href="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-xl font-bold transition-all text-sm shadow-md"
          >
            <Settings size={16} />
            <span>管理</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all
        ${active 
          ? 'bg-sakura/10 text-sakura-dark shadow-sm' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-white/30'}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
