'use client';

import React, { useState } from 'react';
import { useWalletStore } from '../../state/wallet';
import { useProjectsStore, Project, Milestone } from '../../state/projects';
import { StellarService } from '../../services/stellar';
import { Wallet, Shield, PlusCircle, Check, Award, ArrowUpRight, Coins, ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const { isConnected, publicKey, userRole, balance } = useWalletStore();
  const { projects, totalTreasuryBalance } = useProjectsStore();

  // Donor states
  const [donateAmount, setDonateAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);

  // Admin states
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjBeneficiary, setNewProjBeneficiary] = useState('');
  const [newProjBudget, setNewProjBudget] = useState('');
  const [isAdminCreating, setIsAdminCreating] = useState(false);

  // Milestone management state
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneAmount, setNewMilestoneAmount] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState('');

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donateAmount || isNaN(Number(donateAmount))) return;
    setIsDonating(true);
    setStatusMessage('');
    try {
      await StellarService.donate(Number(donateAmount));
      setDonateAmount('');
      setStatusMessage('Donation successfully processed!');
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsDonating(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjBeneficiary || !newProjBudget) return;
    setIsAdminCreating(true);
    setStatusMessage('');
    try {
      // Whitelist beneficiary first automatically in mock mode for UX flow
      useProjectsStore.getState().addActivity({
        type: 'beneficiary_added',
        details: `Beneficiary ${newProjBeneficiary.slice(0, 8)}... whitelisted by Admin.`
      });
      
      await StellarService.createProject(
        newProjTitle,
        newProjDesc,
        newProjBeneficiary,
        Number(newProjBudget)
      );
      setNewProjTitle('');
      setNewProjDesc('');
      setNewProjBeneficiary('');
      setNewProjBudget('');
      setStatusMessage('Project successfully created!');
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsAdminCreating(false);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newMilestoneTitle || !newMilestoneAmount) return;
    setIsAddingMilestone(true);
    try {
      useProjectsStore.getState().addMilestone(
        selectedProject.id,
        newMilestoneTitle,
        Number(newMilestoneAmount)
      );
      useProjectsStore.getState().addActivity({
        type: 'milestone_approved',
        details: `New milestone "${newMilestoneTitle}" added to project "${selectedProject.title}" with amount ${Number(newMilestoneAmount).toLocaleString()} XLM.`,
        amount: Number(newMilestoneAmount)
      });
      // Refresh local selection
      const updated = useProjectsStore.getState().projects.find(p => p.id === selectedProject.id);
      if (updated) setSelectedProject(updated);
      
      setNewMilestoneTitle('');
      setNewMilestoneAmount('');
      setStatusMessage('Milestone added successfully!');
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const handleApproveMilestone = async (projId: number, mId: number) => {
    try {
      await StellarService.approveMilestone(projId, mId);
      setStatusMessage('Milestone approved! Ready for payout.');
      if (selectedProject) {
        const updated = useProjectsStore.getState().projects.find(p => p.id === selectedProject.id);
        if (updated) setSelectedProject(updated);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReleaseFunds = async (projId: number, mId: number) => {
    try {
      await StellarService.releaseMilestoneFunds(projId, mId);
      setStatusMessage('Funds successfully released to beneficiary!');
      if (selectedProject) {
        const updated = useProjectsStore.getState().projects.find(p => p.id === selectedProject.id);
        if (updated) setSelectedProject(updated);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="p-4 bg-surface-card border border-hairline mb-6">
          <Wallet className="h-10 w-10 text-mute" />
        </div>
        <h2 className="font-sans text-2xl text-white font-bold uppercase tracking-tight mb-4">Connect Wallet Profile</h2>
        <p className="font-sans text-sm text-body-text mb-8 leading-relaxed font-light">
          Please select a wallet profile from the navbar header to access the Creda Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-hairline pb-6 gap-4">
        <div>
          <h1 className="font-sans text-4xl text-white font-bold uppercase tracking-tight">Creda Dashboard</h1>
          <p className="font-sans text-xs text-mute uppercase tracking-widest mt-1">Active Profile: {userRole}</p>
        </div>
        {statusMessage && (
          <div className="border border-hairline bg-surface-card px-4 py-2 text-xs font-mono text-accent-green uppercase tracking-wide">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-hairline bg-surface-card p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-mute font-sans text-[10px] font-bold uppercase tracking-wider">
            <span>Treasury Pool</span>
            <Coins className="h-4 w-4 text-accent-red" />
          </div>
          <div className="font-sans text-3xl font-bold text-white">{totalTreasuryBalance.toLocaleString()} XLM</div>
          <span className="text-[10px] text-mute uppercase tracking-wider">Locked in Escrow Smart Contract</span>
        </div>

        <div className="border border-hairline bg-surface-card p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-mute font-sans text-[10px] font-bold uppercase tracking-wider">
            <span>Personal Balance</span>
            <Wallet className="h-4 w-4 text-accent-blue" />
          </div>
          <div className="font-sans text-3xl font-bold text-white">{parseFloat(balance).toLocaleString()} XLM</div>
          <span className="text-[10px] text-mute uppercase tracking-wider truncate block">{publicKey?.slice(0, 15)}...{publicKey?.slice(-15)}</span>
        </div>

        <div className="border border-hairline bg-surface-card p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-mute font-sans text-[10px] font-bold uppercase tracking-wider">
            <span>Active Projects</span>
            <ListTodo className="h-4 w-4 text-accent-green" />
          </div>
          <div className="font-sans text-3xl font-bold text-white">{projects.length}</div>
          <span className="text-[10px] text-mute uppercase tracking-wider">Milestone-linked initiatives</span>
        </div>
      </div>

      {/* Main Content Split based on Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Projects Board */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-sans text-2xl text-white font-bold uppercase tracking-tight">Active Initiatives</h2>
          
          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`border p-6 transition-all cursor-pointer ${
                  selectedProject?.id === project.id 
                    ? 'border-white bg-surface-elevated' 
                    : 'border-hairline bg-surface-card hover:bg-surface-elevated/50'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-sans text-lg font-bold uppercase text-white tracking-wide">{project.title}</h3>
                  <span className="font-mono text-xs text-mute bg-canvas px-2.5 py-1 border border-hairline uppercase">
                    Budget: {project.totalBudget.toLocaleString()} XLM
                  </span>
                </div>
                <p className="font-sans text-sm text-body-text font-light leading-relaxed mb-4">{project.description}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-mute border-t border-hairline/50 pt-4 uppercase tracking-wider">
                  <span>Beneficiary: {project.beneficiary.slice(0, 16)}...</span>
                  <span>Milestones: {project.milestones.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Dynamic Controls (Donor vs Admin vs Beneficiary) */}
        <div className="space-y-8">
          
          {/* DONOR PANEL */}
          {userRole === 'donor' && (
            <div className="border border-hairline bg-surface-card p-6 space-y-6">
              <h3 className="font-sans text-xl font-bold uppercase text-white tracking-wider">Contribute Funds</h3>
              <p className="font-sans text-xs text-body-text font-light leading-relaxed">
                Provide secure donations directly into the Creda Treasury. Funds remain locked until charity admins release validated milestones.
              </p>
              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-2">
                    Amount (XLM)
                  </label>
                  <input
                    type="number"
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    placeholder="e.g. 100"
                    disabled={isDonating}
                    required
                    className="w-full h-10 border border-hairline bg-surface-deep px-4 font-mono text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isDonating}
                  className="w-full h-10 flex items-center justify-center border border-white bg-transparent font-sans text-xs font-bold uppercase tracking-[1.5px] text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
                >
                  {isDonating ? 'Signing Transaction...' : 'Donate Funds'}
                </button>
              </form>
            </div>
          )}

          {/* ADMIN PANELS */}
          {userRole === 'admin' && (
            <div className="space-y-8">
              {/* Project Creator */}
              <div className="border border-hairline bg-surface-card p-6 space-y-6">
                <h3 className="font-sans text-xl font-bold uppercase text-white tracking-wider">Launch Initiative</h3>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-1.5">Project Title</label>
                    <input
                      type="text"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="e.g. Solar Upgrades"
                      className="w-full h-10 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-1.5">Description</label>
                    <textarea
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="Project details..."
                      rows={3}
                      className="w-full p-3 border border-hairline bg-surface-deep text-xs text-white focus:outline-none focus:border-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-1.5">Beneficiary PublicKey</label>
                    <input
                      type="text"
                      value={newProjBeneficiary}
                      onChange={(e) => setNewProjBeneficiary(e.target.value)}
                      placeholder="GDW..."
                      className="w-full h-10 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-mute font-sans font-bold uppercase tracking-wider mb-1.5">Total Budget (XLM)</label>
                    <input
                      type="number"
                      value={newProjBudget}
                      onChange={(e) => setNewProjBudget(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full h-10 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 flex items-center justify-center border border-white bg-transparent text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-white hover:text-black transition-all"
                  >
                    Create Project
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* BENEFICIARY PANEL */}
          {userRole === 'beneficiary' && (
            <div className="border border-hairline bg-surface-card p-6 space-y-6">
              <h3 className="font-sans text-xl font-bold uppercase text-white tracking-wider">Beneficiary Portal</h3>
              <p className="font-sans text-xs text-body-text font-light leading-relaxed">
                You are registered as a receiver of milestone payouts. Coordinate with admins to approve milestones and release locked funds.
              </p>
              <div className="border border-hairline bg-surface-deep p-4 font-mono text-xs text-white break-all uppercase tracking-wide">
                <span className="text-[10px] text-mute block mb-1">Your Key</span>
                {publicKey}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Project Milestone Detail Board */}
      {selectedProject && (
        <div className="border-t border-hairline pt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase text-accent-red tracking-widest font-bold">Active Project Milestones</span>
              <h2 className="font-sans text-2xl text-white font-bold uppercase tracking-tight">{selectedProject.title} Board</h2>
            </div>
            {userRole === 'admin' && (
              <form onSubmit={handleAddMilestone} className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Milestone title"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="h-10 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (XLM)"
                  value={newMilestoneAmount}
                  onChange={(e) => setNewMilestoneAmount(e.target.value)}
                  className="h-10 w-24 border border-hairline bg-surface-deep px-3 text-xs text-white focus:outline-none focus:border-white"
                  required
                />
                <button
                  type="submit"
                  className="h-10 border border-white bg-transparent px-4 font-sans text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-white hover:text-black transition-all flex items-center space-x-1"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </form>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedProject.milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className="border border-hairline bg-surface-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-mute">Milestone #{milestone.id}</span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono border uppercase tracking-wider font-bold ${
                      milestone.status === 'Paid' 
                        ? 'border-accent-green text-accent-green' 
                        : milestone.status === 'Approved' 
                        ? 'border-accent-blue text-accent-blue' 
                        : 'border-hairline text-mute'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <h4 className="font-sans text-[15px] font-bold text-white uppercase tracking-wide mb-2">{milestone.title}</h4>
                  <p className="font-sans text-lg text-white font-bold">{milestone.amount.toLocaleString()} XLM</p>
                </div>

                {/* Admin Actions */}
                {userRole === 'admin' && (
                  <div className="border-t border-hairline/50 pt-4 mt-6">
                    {milestone.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveMilestone(selectedProject.id, milestone.id)}
                        className="w-full h-10 flex items-center justify-center border border-accent-blue bg-transparent hover:bg-accent-blue hover:text-white text-xs font-bold uppercase tracking-[1.5px] text-accent-blue transition-all"
                      >
                        Approve Milestone
                      </button>
                    )}
                    {milestone.status === 'Approved' && (
                      <button
                        onClick={() => handleReleaseFunds(selectedProject.id, milestone.id)}
                        className="w-full h-10 flex items-center justify-center border border-accent-green bg-transparent hover:bg-accent-green hover:text-white text-xs font-bold uppercase tracking-[1.5px] text-accent-green transition-all"
                      >
                        Release Funds
                      </button>
                    )}
                    {milestone.status === 'Paid' && (
                      <div className="flex items-center justify-center space-x-1.5 py-1 text-xs text-mute font-mono uppercase tracking-wider">
                        <Check className="h-4 w-4 text-accent-green" />
                        <span>Transferred</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
