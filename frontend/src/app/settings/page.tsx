'use client';

import React, { useState } from 'react';
import { useWalletStore, WalletNetwork } from '../../state/wallet';
import { Shield, Network, Database } from 'lucide-react';

export default function SettingsPage() {
  const { userRole, setRole, network, setNetwork } = useWalletStore();
  const [rpcUrl, setRpcUrl] = useState('https://soroban-testnet.stellar.org');
  const [treasuryAddr, setTreasuryAddr] = useState('CDDONORSECURETREASURY777KEY');
  const [distributionAddr, setDistributionAddr] = useState('CDDISTRIBUTIONRBACPAYOUTS777KEY');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-hairline pb-6 flex justify-between items-center">
        <div>
          <h1 className="font-sans text-4xl text-white font-bold uppercase tracking-tight">Settings</h1>
          <p className="font-sans text-sm text-mute uppercase tracking-widest mt-1">
            Configure Stellar/Soroban RPC parameters and client preferences.
          </p>
        </div>
        {isSaved && (
          <span className="font-mono text-xs text-accent-green border border-accent-green px-3 py-1 uppercase tracking-wider font-bold">
            Configuration Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Connected Profile Role */}
        <div className="border border-hairline bg-surface-card p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-accent-red" />
            <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wide">Active Profile Role</h3>
          </div>
          <p className="font-sans text-xs text-body-text font-light leading-relaxed">
            Select the profile role you would like to act as on the Dashboard (Donor, Charity Admin, or Beneficiary). This determines the dashboard features and control panels visible to you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['donor', 'admin', 'beneficiary'] as const).map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setRole(role)}
                className={`border p-4 text-left transition-all capitalize ${
                  userRole === role 
                    ? 'border-white bg-surface-elevated' 
                    : 'border-hairline bg-surface-soft hover:bg-surface-elevated/80'
                }`}
              >
                <div className="font-sans text-sm font-bold text-white uppercase tracking-wide mb-1">{role}</div>
                <p className="font-sans text-xs text-body-text leading-relaxed font-light">
                  {role === 'admin' && 'Allows whitelisting beneficiaries, launching initiatives, and releasing milestone payouts.'}
                  {role === 'donor' && 'Allows contributing capital directly to the secure charity escrow treasury.'}
                  {role === 'beneficiary' && 'Allows tracking assigned projects, requesting milestone reviews, and receiving payouts.'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Contract Address Mapping */}
        <div className="border border-hairline bg-surface-card p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-accent-blue" />
            <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wide">Contract Deployments</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-2">
                Treasury Contract Address
              </label>
              <input
                type="text"
                value={treasuryAddr}
                onChange={(e) => setTreasuryAddr(e.target.value)}
                className="w-full h-10 border border-hairline bg-surface-deep px-4 font-mono text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-2">
                Distribution Contract Address
              </label>
              <input
                type="text"
                value={distributionAddr}
                onChange={(e) => setDistributionAddr(e.target.value)}
                className="w-full h-10 border border-hairline bg-surface-deep px-4 font-mono text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Soroban RPC Endpoint */}
        <div className="border border-hairline bg-surface-card p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-accent-green" />
            <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wide">Soroban Network Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-1.5">RPC Endpoint</label>
              <input
                type="url"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="w-full h-10 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-1.5">Target Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as WalletNetwork)}
                className="w-full h-10 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white bg-transparent"
              >
                <option value={WalletNetwork.TESTNET}>Stellar Testnet</option>
                <option value={WalletNetwork.PUBLIC}>Stellar Public Mainnet</option>
                <option value={WalletNetwork.STANDALONE}>Local Standalone Sandbox</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 flex items-center justify-center border border-white bg-transparent font-sans text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-white hover:text-black transition-all"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}
