'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '../state/wallet';
import { useTxStore } from '../state/tx';
import { StellarService } from '../services/stellar';
import { Wallet, Menu, X, Shield, Award, User, RefreshCw, Copy, Check } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { publicKey, isConnected, userRole, disconnect, setRole } = useWalletStore();
  const { transactions } = useTxStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pendingCount = transactions.filter((t) => t.status === 'pending' || t.status === 'processing').length;

  const navLinks = [
    { label: 'DASHBOARD', href: '/dashboard' },
    { label: 'ACTIVITY FEED', href: '/activity' },
    { label: 'TRANSACTION CENTER', href: '/tx-center' },
    { label: 'ANALYTICS', href: '/analytics' },
    { label: 'SETTINGS', href: '/settings' }
  ];

  const handleConnect = async (role: 'admin' | 'donor' | 'beneficiary') => {
    try {
      await StellarService.connectWallet(role);
      setRoleSelectOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-canvas/90 backdrop-blur-md border-b border-hairline">
      {/* 4px M-Stripe at the top of Navbar */}
      <div className="m-stripe" />
      
      <nav className="h-16 w-full flex items-center justify-between px-6">
        {/* Left Group: Logo & Navigation links */}
        <div className="flex items-center space-x-10 h-full">
          <Link href="/" className="flex items-center space-x-2 select-none">
            <span className="font-sans text-2xl font-bold tracking-tight text-white uppercase">
              CREDA
            </span>
            <span className="bg-surface-card px-2 py-0.5 font-mono text-[10px] text-mute border border-hairline">
              v1.0
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 h-full">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-[12px] font-bold tracking-[1.5px] uppercase transition-colors py-5 ${
                    active 
                      ? 'text-white border-b-2 border-accent-blue' 
                      : 'text-mute hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Wallet Connection & Stats */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Pending Tx Badge */}
          {pendingCount > 0 && (
            <Link
              href="/tx-center"
              className="flex items-center space-x-1.5 bg-accent-blue-glow/10 px-3 py-1 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue-glow/20 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span className="font-mono text-[11px] font-medium">{pendingCount} ACTIVE</span>
            </Link>
          )}

          {isConnected && (
            <span className="flex items-center space-x-1 bg-surface-card px-2.5 py-1 text-[11px] border border-hairline font-sans font-bold uppercase tracking-wider text-body-text">
              {userRole === 'admin' && <Shield className="mr-1 h-3 w-3 text-accent-red" />}
              {userRole === 'beneficiary' && <Award className="mr-1 h-3 w-3 text-accent-green" />}
              {userRole === 'donor' && <User className="mr-1 h-3 w-3 text-accent-blue" />}
              {userRole}
            </span>
          )}

          <div className="relative flex items-center space-x-3 bg-surface-card border border-hairline px-3.5 py-1.5">
            <span className="font-sans text-xs font-semibold text-body-text select-none uppercase tracking-[0.5px]">
              {isConnected ? (
                <span className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-green mr-2 animate-pulse" />
                  {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                </span>
              ) : (
                "Connect Wallet"
              )}
            </span>

            {isConnected && (
              <button
                onClick={async () => {
                  if (publicKey) {
                    await navigator.clipboard.writeText(publicKey);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }
                }}
                className="flex items-center justify-center p-1 text-mute hover:text-ink hover:bg-surface-elevated transition-all border border-hairline"
                title="Copy Address"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-accent-green" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            {isConnected ? (
              <button 
                onClick={disconnect}
                className="bg-accent-red px-3 py-1 font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-white hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                className="bg-white px-3 py-1 font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-black hover:bg-white/80 transition-colors"
              >
                Connect
              </button>
            )}

            {roleSelectOpen && !isConnected && (
              <div className="absolute right-0 top-full mt-2 w-48 border border-hairline-strong bg-surface-elevated p-1 shadow-2xl z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-mute border-b border-hairline mb-1 select-none">
                  Select Profile
                </div>
                <button
                  onClick={() => handleConnect('donor')}
                  className="flex w-full items-center px-3 py-2 text-left font-sans text-xs font-semibold text-body-text hover:bg-surface-card hover:text-ink uppercase tracking-wider"
                >
                  Donor
                </button>
                <button
                  onClick={() => handleConnect('admin')}
                  className="flex w-full items-center px-3 py-2 text-left font-sans text-xs font-semibold text-body-text hover:bg-surface-card hover:text-ink uppercase tracking-wider"
                >
                  Admin
                </button>
                <button
                  onClick={() => handleConnect('beneficiary')}
                  className="flex w-full items-center px-3 py-2 text-left font-sans text-xs font-semibold text-body-text hover:bg-surface-card hover:text-ink uppercase tracking-wider"
                >
                  Beneficiary
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          {pendingCount > 0 && (
            <Link
              href="/tx-center"
              className="flex items-center space-x-1 bg-accent-blue-glow/10 px-2.5 py-0.5 border border-accent-blue/30 text-accent-blue text-xs font-mono mr-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-blue animate-ping" />
              <span>{pendingCount}</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-mute hover:text-white transition-colors p-1"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t border-hairline bg-canvas px-6 py-4 flex flex-col space-y-4 shadow-xl">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-sans text-[12px] font-bold tracking-[1.5px] uppercase transition-colors ${
                  active ? 'text-white' : 'text-mute hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-hairline pt-4 flex flex-col space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-body-text select-none uppercase tracking-[0.5px]">
                {isConnected ? (
                  <span className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green mr-2 animate-pulse" />
                    {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                  </span>
                ) : (
                  "Connect Wallet"
                )}
              </span>

              <div className="flex items-center space-x-3">
                {isConnected && (
                  <button
                    onClick={async () => {
                      if (publicKey) {
                        await navigator.clipboard.writeText(publicKey);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }
                    }}
                    className="flex items-center justify-center p-1 text-mute hover:text-white transition-all border border-hairline"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-accent-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}

                {isConnected ? (
                  <button 
                    onClick={() => {
                      disconnect();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-accent-red px-3 py-1 font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-white hover:bg-red-700 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                    className="bg-white px-3 py-1 font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-black hover:bg-white/80 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {isConnected && (
              <div className="flex items-center space-x-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-mute bg-surface-card border border-hairline px-3 py-1.5 select-none">
                {userRole === 'admin' && <Shield className="h-3 w-3 text-accent-red" />}
                {userRole === 'beneficiary' && <Award className="h-3 w-3 text-accent-green" />}
                {userRole === 'donor' && <User className="h-3 w-3 text-accent-blue" />}
                <span>Role: {userRole}</span>
              </div>
            )}

            {roleSelectOpen && !isConnected && (
              <div className="w-full mt-2 border border-hairline-strong bg-surface-elevated p-1 shadow-2xl z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-mute border-b border-hairline mb-1 select-none">
                  Select Profile
                </div>
                <button
                  onClick={() => {
                    handleConnect('donor');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left font-sans text-xs font-semibold text-body-text hover:bg-surface-card hover:text-ink uppercase tracking-wider"
                >
                  Donor
                </button>
                <button
                  onClick={() => {
                    handleConnect('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left font-sans text-xs font-semibold text-body-text hover:bg-surface-card hover:text-ink uppercase tracking-wider"
                >
                  Admin
                </button>
                <button
                  onClick={() => {
                    handleConnect('beneficiary');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left font-sans text-xs font-semibold text-body-text hover:bg-surface-card hover:text-ink uppercase tracking-wider"
                >
                  Beneficiary
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
