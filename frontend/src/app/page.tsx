'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, CheckCircle, Eye, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6">
      
      {/* 1. Hero Photo Band */}
      <div className="relative w-full h-[550px] bg-canvas border border-hairline overflow-hidden flex flex-col justify-end p-8 md:p-16">
        {/* Full-bleed automotive background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/creda_hero.png"
            alt="Creda Motorsport Performance Hero"
            fill
            className="object-cover opacity-80"
            priority
          />
          {/* Subtle gradient overlay to fade to true black canvas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl space-y-6">
          <span className="font-mono text-xs font-bold tracking-[2px] text-accent-blue uppercase bg-black/60 px-3 py-1 border border-accent-blue/30 inline-block">
            Milestone Escrow & Distribution
          </span>
          <h1 className="font-sans text-[42px] md:text-[68px] font-bold leading-[1.0] tracking-[-1px] text-white uppercase max-w-3xl">
            PERFORMANCE-DRIVEN INTEGRITY. THE ULTIMATE ESCROW.
          </h1>
          <p className="font-sans text-sm md:text-base text-body-text max-w-2xl font-light leading-relaxed">
            Creda is an engineering-grade decentralized charity treasury management platform. Built on the Stellar network using decoupled Soroban smart contracts, donor capital remains locked securely until milestone validations are met.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex h-12 items-center justify-center border border-white bg-white px-8 font-sans text-xs font-bold tracking-[1.5px] uppercase text-black hover:bg-transparent hover:text-white transition-all w-full sm:w-auto"
            >
              LAUNCH INTERFACE <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/tx-center"
              className="flex h-12 items-center justify-center border border-hairline bg-transparent px-8 font-sans text-xs font-bold tracking-[1.5px] uppercase text-white hover:bg-surface-card transition-all w-full sm:w-auto"
            >
              MONITOR TELEMETRY
            </Link>
          </div>
        </div>
      </div>

      {/* M-Stripe Divider */}
      <div className="m-stripe" />

      {/* 2. Interactive Code Telemetry & Feature Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* Left Side: Code Mockup representing Soroban Contract Interface */}
        <div className="border border-hairline bg-surface-deep p-6 font-mono text-[13px] leading-relaxed text-body-text shadow-2xl relative">
          <div className="flex space-x-2 mb-4">
            <span className="h-3 w-3 bg-accent-red" />
            <span className="h-3 w-3 bg-accent-yellow" />
            <span className="h-3 w-3 bg-accent-blue" />
          </div>
          <div className="border-b border-hairline pb-2 mb-4 flex justify-between items-center text-mute text-xs">
            <span>distribution_contract.rs</span>
            <span className="font-sans font-bold text-accent-orange uppercase tracking-wider text-[10px]">Soroban SDK v22</span>
          </div>
          <pre className="overflow-x-auto text-[11px] md:text-[13px]">
            <code className="text-mute">
              {`#[contractimpl]
impl DistributionContract {
    pub fn release_milestone_funds(env: Env, project_id: u32, milestone_id: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth(); // RBAC verification

        let mut milestone: Milestone = env.storage().persistent().get(&m_key).unwrap();
        assert_eq!(milestone.status, 1); // Must be approved

        milestone.status = 2; // Marked Paid
        env.storage().persistent().set(&m_key, &milestone);

        // C2C cross-contract call to Treasury contract
        let treasury: Address = env.storage().instance().get(&DataKey::Treasury).unwrap();
        let client = TreasuryClient::new(&env, &treasury);
        client.release_funds(&project.beneficiary, &milestone.amount);
    }
}`}
            </code>
          </pre>
        </div>

        {/* Right Side: Visual Benefits with Motorsport Theme */}
        <div className="flex flex-col space-y-8">
          <h2 className="font-sans text-[28px] md:text-[40px] font-bold leading-tight tracking-tight uppercase text-white">
            ENGINEERED WITH ZERO DEVIATION
          </h2>
          
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-surface-card border border-hairline text-accent-red">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-wider mb-2">Escrow-Locked Treasury</h3>
              <p className="font-sans text-sm text-body-text leading-relaxed font-light">
                Donor capital is locked directly in the immutable `treasury` contract. There is no middle-man and no alternative pathway for withdrawal.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-surface-card border border-hairline text-accent-green">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-wider mb-2">Milestone-Bound Releases</h3>
              <p className="font-sans text-sm text-body-text leading-relaxed font-light">
                Payments release only after verified proof of achievement. The system enforces program parameters down to the individual block.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-surface-card border border-hairline text-accent-blue">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-wider mb-2">Immutable Real-Time Auditing</h3>
              <p className="font-sans text-sm text-body-text leading-relaxed font-light">
                Every transaction, milestone approval, and payout emits a Soroban event. Donors track their dollar's impact with maximum precision.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 2-Up Editorial Image Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto pt-8">
        
        {/* Card 1 */}
        <div className="border border-hairline bg-surface-card flex flex-col">
          <div className="relative h-64 w-full">
            <Image
              src="/images/creda_detail.png"
              alt="Carbon fiber detail representation"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 space-y-4">
            <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-accent-orange uppercase">
              STRUCTURE & INTEGRITY
            </span>
            <h3 className="font-sans text-xl font-bold text-white uppercase">
              DECOUPLED LOGICAL ARCHITECTURE
            </h3>
            <p className="font-sans text-sm text-body-text font-light leading-relaxed">
              We separate security layers. The Treasury contract handles raw asset locking and withdrawals, while the Distribution contract processes complex business configurations and RBAC access parameters.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-hairline bg-surface-card flex flex-col">
          <div className="relative h-64 w-full">
            <Image
              src="/images/creda_cockpit.png"
              alt="Racing cockpit layout representation"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 space-y-4">
            <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-accent-blue uppercase">
              PILOT TELEMETRY
            </span>
            <h3 className="font-sans text-xl font-bold text-white uppercase">
              REAL-TIME OPERATIONAL METRICS
            </h3>
            <p className="font-sans text-sm text-body-text font-light leading-relaxed">
              Control panels update dynamically with current ledger state. Admins manage milestone registers and donors verify the flow of assets instantly.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Technical Spec Cells (BMW M Style) */}
      <div className="bg-surface-deep border border-hairline p-8 max-w-7xl mx-auto space-y-8">
        <h2 className="font-sans text-[20px] md:text-[28px] font-bold text-white uppercase tracking-tight text-center">
          SYSTEM SPECIFICATIONS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-soft border border-hairline p-6 flex flex-col justify-between h-32">
            <span className="font-sans text-3xl font-bold text-white uppercase">100%</span>
            <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-mute uppercase">ON-CHAIN TRANSIT</span>
          </div>

          <div className="bg-surface-soft border border-hairline p-6 flex flex-col justify-between h-32">
            <span className="font-sans text-3xl font-bold text-white uppercase">0ms</span>
            <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-mute uppercase">LATENCY DELAY</span>
          </div>

          <div className="bg-surface-soft border border-hairline p-6 flex flex-col justify-between h-32">
            <span className="font-sans text-3xl font-bold text-white uppercase">v22</span>
            <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-mute uppercase">SOROBAN SDK</span>
          </div>

          <div className="bg-surface-soft border border-hairline p-6 flex flex-col justify-between h-32">
            <span className="font-sans text-3xl font-bold text-white uppercase">0px</span>
            <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-mute uppercase">CORNER RADIUS</span>
          </div>
        </div>
      </div>

    </div>
  );
}
