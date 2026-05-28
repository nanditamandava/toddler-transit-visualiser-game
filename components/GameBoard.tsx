'use client';

import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Entity } from './Entity';
import { ValidationToast } from './ValidationToast';
import { getViolationReason } from '../lib/gameLogic';

export function GameBoard() {
  const {
    state,
    resetGame,
    triggerAutoSolve,
    backtrack,
    boardEntity,
    disembarkEntity,
    crossRiver,
    isPlayingBack,
    toasts,
  } = useGameState();

  const [showRules, setShowRules] = useState(false);
  const [activeViolation, setActiveViolation] = useState<string | null>(null);

  const isSolved = state.status === 'solved';

  // Monitor toasts to show a cute dialogue box whenever a violation occurs
  useEffect(() => {
    const errorToast = toasts.find(t => t.type === 'error');
    if (errorToast) {
      setActiveViolation(errorToast.message);
      // Auto-clear violation dialogue after 4.5 seconds
      const timer = setTimeout(() => {
        setActiveViolation(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Determine sorted list of all 6 entities to ensure fixed positioning indices on banks
  const sortedEntities = [...state.entities].sort((a, b) => a.id.localeCompare(b.id));

  // Accessible trigger for crossing
  const handleCrossClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.boatPassengers.length === 0) return;
    crossRiver();
  };

  const handleUndo = () => {
    if (state.history.length > 0) {
      backtrack(state.history.length - 1);
      setActiveViolation(null);
    }
  };

  // Check if a husband is jealous/angry based on current board state
  const isHusbandJealous = (husbandId: string) => {
    // Find matching wife
    const coupleId = husbandId.split('_')[1];
    const wife = state.entities.find(e => e.id === `W_${coupleId}`);
    const husband = state.entities.find(e => e.id === husbandId);
    if (!wife || !husband) return false;

    // Check bank configuration
    const wifeBank = state.boatPassengers.includes(wife.id) 
      ? (state.boatPosition === 'left' ? 'left' : 'right') // effectively boarding bank
      : wife.bank;

    const husbandBank = state.boatPassengers.includes(husband.id)
      ? (state.boatPosition === 'left' ? 'left' : 'right')
      : husband.bank;

    // If wife is on a bank without her husband
    if (wifeBank !== husbandBank) {
      // Are there other husbands on that bank?
      const otherHusbands = state.entities.filter(e => 
        e.type === 'husband' && 
        e.coupleId !== coupleId &&
        (state.boatPassengers.includes(e.id) ? (state.boatPosition === 'left' ? 'left' : 'right') : e.bank) === wifeBank
      );
      if (otherHusbands.length > 0) return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-[#0B0E14] text-slate-100 max-w-7xl mx-auto w-full relative select-none">
      
      {/* 1. Header Bar */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-mono text-[9px] font-extrabold bg-amber-500/10 text-yellow-400 border border-yellow-500/25 px-2 py-0.5 rounded uppercase tracking-wider">
              Classic River Riddle
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              CSP Game Simulation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 mt-1 font-sans text-center md:text-left">
            Jealous Husbands Crossing
          </h1>
        </div>

        {/* Dynamic Game stats */}
        <div className="flex items-center gap-6">
          <div className="text-center md:text-right">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">
              Move Counter
            </span>
            <span className="text-xl font-bold font-mono text-yellow-400">
              #{state.moveCount}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="text-center md:text-right">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">
              Left Bank
            </span>
            <span className="text-sm font-mono text-slate-300 font-bold">
              {state.entities.filter(e => e.bank === 'left' && !state.boatPassengers.includes(e.id)).length} / 6
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="text-center md:text-right">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">
              Right Bank
            </span>
            <span className="text-sm font-mono text-emerald-400 font-bold">
              {state.entities.filter(e => e.bank === 'right' && !state.boatPassengers.includes(e.id)).length} / 6
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Illustrative Game Canvas */}
      <main className="flex-grow flex flex-col justify-center items-center w-full relative mb-6">
        
        {/* Playback Overlay Banner */}
        {isPlayingBack && (
          <div className="absolute top-4 z-30 px-6 py-2 rounded-full border border-yellow-500/30 bg-slate-950/90 text-yellow-400 font-mono text-xs tracking-widest font-extrabold uppercase animate-pulse flex items-center gap-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
            ⚡ Auto-Solving Simulation Playback...
          </div>
        )}

        <div className="w-full aspect-[16/9] max-h-[580px] rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-700">
          
          {/* A. Sky Scenery & Atmospheric Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Glowing Moon */}
            <div className="absolute top-[8%] left-[6%] w-16 h-16 opacity-90 select-none">
              <svg className="w-full h-full filter drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" viewBox="0 0 100 100">
                <path d="M70,30 C50,30 35,45 35,65 C35,75 40,84 48,90 C32,86 20,70 20,52 C20,30 38,12 60,12 C64,12 68,13 72,15 C71,20 70,25 70,30 Z" fill="#FEF08A" />
              </svg>
            </div>

            {/* Twinkling Stars */}
            <div className="absolute top-[12%] left-[30%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle star-glow" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-[7%] left-[45%] w-1 h-1 bg-white rounded-full animate-twinkle star-glow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[15%] left-[58%] w-2 h-2 bg-yellow-100 rounded-full animate-twinkle star-glow" style={{ animationDelay: '0.8s' }} />
            <div className="absolute top-[9%] left-[72%] w-1 h-1 bg-white rounded-full animate-twinkle star-glow" style={{ animationDelay: '2.1s' }} />
            <div className="absolute top-[18%] left-[88%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle star-glow" style={{ animationDelay: '0.4s' }} />
            <div className="absolute top-[22%] left-[18%] w-1 h-1 bg-white rounded-full animate-twinkle star-glow" style={{ animationDelay: '1.1s' }} />

            {/* Scrolling Clouds */}
            <div className="absolute top-[20%] left-0 w-24 h-6 opacity-15 animate-cloud-slow">
              <svg className="w-full h-full fill-white" viewBox="0 0 120 40">
                <path d="M20,30 C30,30 35,20 45,22 C55,24 60,15 75,18 C90,20 95,30 110,30 Z" />
              </svg>
            </div>
            <div className="absolute top-[10%] left-0 w-32 h-8 opacity-20 animate-cloud-fast" style={{ animationDelay: '-15s' }}>
              <svg className="w-full h-full fill-white" viewBox="0 0 120 40">
                <path d="M20,30 C30,30 35,15 50,18 C65,20 75,10 90,15 C105,20 110,30 120,30 Z" />
              </svg>
            </div>
          </div>

          {/* B. Ground / Cliffs & River Landscape */}
          {/* Left Cliff Bank */}
          <div className="absolute left-0 bottom-0 w-[30%] h-[50%] z-10 flex flex-col pointer-events-none">
            <div className="w-full h-8 grassy-bank rounded-tr-2xl" />
            <div className="w-full flex-grow cliff-soil" />
          </div>

          {/* Right Cliff Bank */}
          <div className="absolute right-0 bottom-0 w-[30%] h-[50%] z-10 flex flex-col pointer-events-none">
            <div className="w-full h-8 grassy-bank rounded-tl-2xl" />
            <div className="w-full flex-grow cliff-soil" />
          </div>

          {/* River Water Bed */}
          <div className="absolute left-[30%] right-[30%] bottom-0 h-[48%] z-0 river-water overflow-hidden pointer-events-none">
            {/* Wave Layer 1 */}
            <div className="absolute bottom-[-10px] inset-x-[-100px] h-[75px] opacity-20 bg-repeat-x animate-wave-1"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' fill='%23FFFFFF'%3E%3Cpath d='M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1350,20 1500,60 L1500,120 L0,120 Z'/%3E%3C/svg%3E")`, backgroundSize: '600px 75px' }} />
            
            {/* Wave Layer 2 */}
            <div className="absolute bottom-[-20px] inset-x-[-100px] h-[90px] opacity-25 bg-repeat-x animate-wave-2"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' fill='%2367E8F9'%3E%3Cpath d='M0,50 C150,20 350,90 500,50 C650,100 850,20 1000,50 C1150,90 1350,20 1500,50 L1500,120 L0,120 Z'/%3E%3C/svg%3E")`, backgroundSize: '500px 90px' }} />
          </div>

          {/* C. The Floating wooden Boat */}
          <div
            className={`
              absolute w-[18%] z-10 transition-all duration-800 ease-in-out animate-bobbing pointer-events-auto
              ${state.boatPosition === 'left' ? 'left-[29%]' : 'left-[53%]'}
            `}
            style={{ bottom: '23%' }}
          >
            {/* Wooden Boat Hull SVG */}
            <svg className="w-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" viewBox="0 0 140 60" fill="none">
              <defs>
                <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="50%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>
              {/* Oars */}
              <line x1="25" y1="35" x2="5" y2="55" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="5" cy="55" r="3" fill="#D97706" />
              <line x1="115" y1="35" x2="135" y2="55" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="135" cy="55" r="3" fill="#D97706" />
              {/* Hull */}
              <path d="M12 25 L25 50 H115 L128 25 C100 35 40 35 12 25 Z" fill="url(#woodGrad)" stroke="#292524" strokeWidth="1.5" />
              {/* Golden trim */}
              <path d="M12 25 C40 35 100 35 128 25" stroke="#FCD34D" strokeWidth="1.5" fill="none" />
              {/* Boat seat / deck floor */}
              <rect x="35" y="32" width="70" height="4" fill="#582F0E" rx="1" />
            </svg>

            {/* Invisible tapping dock area on the boat itself */}
            <div 
              onClick={handleCrossClick}
              className={`absolute inset-0 cursor-pointer rounded-full ${state.boatPassengers.length > 0 ? 'pointer-events-auto' : 'pointer-events-none'}`} 
              title="Click boat to cross the river"
            />
          </div>

          {/* D. Hovering "GO!" Crossing Sign */}
          <button
            onClick={handleCrossClick}
            disabled={state.boatPassengers.length === 0 || isPlayingBack}
            className={`
              absolute left-[45%] top-[18%] z-20 w-16 h-16 rounded-lg pointer-events-auto transition-all duration-300
              ${
                state.boatPassengers.length > 0 && !isPlayingBack
                  ? 'animate-pulse-sign cursor-pointer opacity-100 scale-100'
                  : 'opacity-40 cursor-not-allowed scale-90 grayscale'
              }
            `}
          >
            {/* Yellow Diamond Sign */}
            <svg className="w-full h-full filter drop-shadow-lg" viewBox="0 0 100 100">
              <polygon points="50,5 95,50 50,95 5,50" fill="#FCD34D" stroke="#1E293B" strokeWidth="6" />
              <polygon points="50,9 91,50 50,91 9,50" fill="#FCD34D" stroke="#1E293B" strokeWidth="1" />
              {/* Text GO */}
              <text x="50" y="58" textAnchor="middle" fill="#1E293B" fontSize="24" fontWeight="900" fontFamily="sans-serif">
                GO!
              </text>
            </svg>
          </button>

          {/* E. Character Entities - Absolute Canvas Mapping */}
          {sortedEntities.map(entity => {
            const isPassenger = state.boatPassengers.includes(entity.id);
            const isDockedBank = state.boatPosition === entity.bank;
            
            // 1. Determine disabled state
            // Characters can only be clicked if they reside on the SAME bank where the boat is docked, and we are not playing back.
            // Exception: If they are currently inside the boat, they can be clicked to disembark.
            const isInteractive = isPassenger ? !isPlayingBack : (isDockedBank && !isPlayingBack);
            const isDisabled = !isInteractive;

            // 2. Position Coordinates mapping
            let leftStyle = '0%';
            let bottomStyle = '0%';

            if (isPassenger) {
              const pIndex = state.boatPassengers.indexOf(entity.id);
              if (state.boatPosition === 'left') {
                leftStyle = pIndex === 0 ? '30.5%' : '35.5%';
                bottomStyle = '29.5%';
              } else {
                leftStyle = pIndex === 0 ? '54.5%' : '59.5%';
                bottomStyle = '29.5%';
              }
            } else if (entity.bank === 'left') {
              const spot = sortedEntities.findIndex(e => e.id === entity.id);
              leftStyle = `${2.5 + spot * 4.3}%`;
              bottomStyle = '46.5%';
            } else {
              const spot = sortedEntities.findIndex(e => e.id === entity.id);
              leftStyle = `${73.5 + spot * 4.3}%`;
              bottomStyle = '46.5%';
            }

            // 3. Selection Event trigger
            const handleSelect = () => {
              if (isPassenger) {
                disembarkEntity(entity.id);
              } else {
                if (state.boatPassengers.length >= 2) {
                  // Throw a friendly capacity warning toast
                  return;
                }
                boardEntity(entity.id);
              }
            };

            // 4. Check if jealous husband (renders a sweat bead or red highlight)
            const isJealous = entity.type === 'husband' && isHusbandJealous(entity.id);

            return (
              <div
                key={entity.id}
                className="absolute z-20 transition-all duration-800 ease-in-out"
                style={{ left: leftStyle, bottom: bottomStyle }}
              >
                <Entity
                  entity={entity}
                  onSelect={handleSelect}
                  disabled={isDisabled}
                  isPassenger={isPassenger}
                />

                {/* Jealous emoji warning indicator floating above the husband's head */}
                {isJealous && (
                  <span className="absolute -top-3 left-[40%] text-sm animate-bounce z-30" title="Jealous/Angry! Rule infraction!">
                    💢
                  </span>
                )}
              </div>
            );
          })}

          {/* F. Conversational Warning Dialogue bubble for rule violations */}
          {activeViolation && (
            <div className="absolute bottom-[3%] left-[15%] right-[15%] z-30 flex items-center gap-4 bg-slate-950/95 border-2 border-red-500/50 glow-amber p-3.5 rounded-2xl animate-fade-in shadow-2xl">
              <div className="w-11 h-11 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center text-xl flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-grow">
                <span className="font-mono text-[9px] uppercase tracking-wider text-red-400 font-extrabold block">
                  Safety Violation Blocked
                </span>
                <p className="text-xs font-semibold text-slate-100 leading-normal mt-0.5">
                  {activeViolation}
                </p>
              </div>
              <button
                onClick={() => setActiveViolation(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 hover:bg-slate-900 rounded"
              >
                ✕
              </button>
            </div>
          )}

        </div>
      </main>

      {/* 3. Bottom Controls Panel */}
      <footer className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Rules button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowRules(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold font-sans text-slate-300 hover:text-white transition-colors cursor-pointer w-full sm:w-auto flex items-center justify-center gap-1.5"
          >
            ❓ How To Play
          </button>
          
          <button
            onClick={handleUndo}
            disabled={state.history.length === 0 || isPlayingBack}
            className={`
              px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all w-full sm:w-auto flex items-center justify-center gap-1.5
              ${
                state.history.length === 0 || isPlayingBack
                  ? 'bg-slate-800/20 text-slate-600 cursor-not-allowed border border-transparent'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer'
              }
            `}
          >
            ↩ Undo Move
          </button>
        </div>

        {/* Instructions Summary */}
        <p className="text-[10px] text-slate-500 font-sans text-center max-w-sm hidden lg:block leading-normal">
          Click characters to toggle boarding. When occupied, tap the yellow <strong className="text-yellow-400">GO!</strong> sign to sail. Backtrack at any time.
        </p>

        {/* Primary Solving operations */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={resetGame}
            disabled={isPlayingBack}
            className={`
              px-4 py-2.5 rounded-xl border font-sans font-bold text-xs uppercase tracking-wider transition-colors w-full sm:w-auto text-center
              ${
                isPlayingBack 
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer'
              }
            `}
          >
            Reset
          </button>

          <button
            onClick={triggerAutoSolve}
            disabled={isPlayingBack || isSolved}
            className={`
              px-5 py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider text-center transition-all w-full sm:w-auto
              ${
                isPlayingBack || isSolved
                  ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/20 cursor-pointer'
              }
            `}
          >
            {isPlayingBack ? '⚡ Playing...' : '🤖 BFS Auto-Solve'}
          </button>
        </div>
      </footer>

      {/* 4. Full Celebration Solved Overlay */}
      {isSolved && (
        <div className="fixed inset-0 bg-[#07090E]/95 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center animate-fade-in">
          <div className="max-w-md w-full p-8 rounded-3xl border border-emerald-500/30 glow-emerald bg-slate-950/80 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl" />

            <div className="w-16 h-16 p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-5 animate-bounce">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75a1.125 1.125 0 0 0-1.125 1.125v3.375m9 0h-9m9-11.25H21a3 3 0 0 0-3-3h-1.5M9 5.25H6a3 3 0 0 0-3 3h1.5m10.5-3v11.25m-6-11.25v11.25m.75-12h4.5c.138 0 .273.012.404.035M6.75 8.25c.13 0 .257-.012.387-.035" />
              </svg>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-400 font-extrabold border border-emerald-500/20 bg-emerald-500/5 py-1 px-3.5 rounded-full mb-3 inline-block">
              ✓ Constraint Satisfied
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 font-sans">
              Safe Crossing Complete!
            </h2>
            
            <p className="text-xs text-slate-400 mt-3 font-sans leading-relaxed">
              All 6 residents have successfully crossed the river to the Right Bank! No safety constraints were compromised, and all wives remained completely protected from other husbands.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full my-6 font-mono text-left bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[8px] uppercase tracking-wider block">
                  Total Steps Taken
                </span>
                <span className="text-lg font-bold text-slate-100">
                  {state.moveCount} moves
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[8px] uppercase tracking-wider block">
                  Shortest Feasible Path
                </span>
                <span className="text-lg font-bold text-emerald-400">
                  11 steps
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={resetGame}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold font-sans text-sm tracking-wide shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                Play Again
              </button>

              <button
                onClick={triggerAutoSolve}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold font-sans text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Watch Playback Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. How to Play rules modal */}
      {showRules && (
        <div className="fixed inset-0 bg-[#07090E]/90 backdrop-blur-sm z-50 flex flex-col justify-center items-center p-6 text-center animate-fade-in">
          <div className="max-w-md w-full p-6 md:p-8 rounded-3xl border border-slate-800 bg-[#0F111A] flex flex-col shadow-2xl relative">
            <h3 className="text-xl font-extrabold tracking-tight text-yellow-400 font-sans mb-3 text-left">
              📜 Jealous Husbands Crossing Rules
            </h3>
            
            <div className="text-left font-sans text-xs text-slate-300 space-y-3 leading-relaxed max-h-[360px] overflow-y-auto pr-1">
              <p>
                Three married couples (represented in <strong className="text-indigo-400">Blue</strong>, <strong className="text-pink-400">Pink</strong>, and <strong className="text-teal-400">Teal</strong> colors) must cross a deep river gorge using a boat.
              </p>

              <h4 className="font-bold text-slate-200 mt-2 text-sm">Boat Constraints:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>The boat holds a **maximum of 2 people** at a time.</li>
                <li>The boat **cannot cross empty** (requires at least 1 person to navigate).</li>
              </ul>

              <h4 className="font-bold text-slate-200 mt-2 text-sm">⚠️ The Jealously Constraint:</h4>
              <p className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-yellow-300 font-semibold leading-normal">
                A wife can NEVER be in the presence of another husband on either bank (or in the boat) unless her own husband is ALSO present to protect her.
              </p>

              <h4 className="font-bold text-slate-200 mt-2 text-sm">Examples:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><span className="text-emerald-400 font-semibold">Legal:</span> Wife A and Wife B are alone on a bank. (No other husbands are present, so they are safe!)</li>
                <li><span className="text-emerald-400 font-semibold">Legal:</span> Wife A and Husband A are on a bank with Husband B. (Wife A is protected by Husband A.)</li>
                <li><span className="text-red-400 font-semibold">ILLEGAL:</span> Wife A is left on a bank with Husband B, while Husband A is on the other side. (Wife A is unprotected from Husband B!)</li>
              </ul>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide cursor-pointer transition-colors"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      {/* Floating Validation Toast stack */}
      <ValidationToast />
    </div>
  );
}
