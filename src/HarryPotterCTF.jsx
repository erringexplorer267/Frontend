import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, Star, Zap, Code, Clock, Trophy, Sparkles } from 'lucide-react'; 

// --- Data & Constants ---
const TARGET_TIME_DEMO_MS = Date.now() + 9 * 1000;
const HACKERRANK_LINK = 'https://www.hackerrank.com/test-coding-challenge'; 

const CIRCUIT_QUESTIONS = [
  {
    id: 1, name: "The Sorting Circuit", house: "Gryffindor", difficulty: "Easy",
    points: 100, question: "What is the output of a 2-input AND gate when both inputs are HIGH?",
    hint: "Think about when the gate allows current to pass through...", answer: "1",
    description: "Begin your journey at the Sorting Hat's chamber",
    hintType: "text"
  },
  {
    id: 2, name: "Potions Class Logic", house: "Slytherin", difficulty: "Easy",
    points: 150, question: "In a half-adder circuit, which two outputs are produced?",
    hintImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Half_Adder.svg/400px-Half_Adder.svg.png",
    answer: "sum and carry",
    description: "Professor Snape's arithmetic challenges await",
    hintType: "image"
  },
  {
    id: 3, name: "Charms of Multiplexing", house: "Ravenclaw", difficulty: "Medium",
    points: 200, question: "How many select lines are needed for an 8:1 multiplexer?",
    hint: "2^n = 8, solve for n...", answer: "3",
    description: "Flitwick's magical selection circuits",
    hintType: "text"
  },
  {
    id: 4, name: "Defense Against Dark Circuits", house: "Hufflepuff", difficulty: "Medium",
    points: 250, question: "What type of flip-flop toggles its output when both inputs are 1?",
    hintImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/JK_flip-flop.svg/400px-JK_flip-flop.svg.png",
    answer: "jk",
    description: "Protected storage elements await discovery",
    hintType: "image"
  },
  {
    id: 5, name: "The Forbidden Forest of Karnaugh", house: "Gryffindor", difficulty: "Hard",
    points: 300, question: "In a K-map, what is the maximum number of cells that can be grouped for a 4-variable expression?",
    hint: "Think of the largest power of 2 within 16...", answer: "16",
    description: "Navigate the maze of logic minimization",
    hintType: "text"
  },
  {
    id: 6, name: "The Chamber of Sequential Secrets", house: "Slytherin", difficulty: "Hard",
    points: 350, question: "What is the modulus of a counter with 6 states?",
    hint: "Modulus equals the number of unique states...", answer: "6",
    description: "Ancient sequential magic lies within",
    hintType: "text"
  },
  {
    id: 7, name: "The Triwizard Memory Tournament", house: "Ravenclaw", difficulty: "Expert",
    points: 400, question: "How many address lines are needed to address 1KB of memory?",
    hint: "1KB = 1024 bytes, find log₂(1024)...", answer: "10",
    description: "The ultimate test of circuit mastery",
    hintType: "text"
  },
  {
    id: 8, name: "The Marauder's Decoder Ring", house: "Hufflepuff", difficulty: "Expert",
    points: 450, question: "In a 3-to-8 decoder, how many output lines will be active (HIGH) at any given time?",
    hint: "Only one output corresponds to each unique input combination...", answer: "1",
    description: "Decode the secrets of digital logic",
    hintType: "text"
  },
  {
    id: 9, name: "The Patronus Oscillator", house: "Gryffindor", difficulty: "Expert",
    points: 500, question: "What is the time period of a 555 timer in astable mode if R1=10kΩ, R2=10kΩ, and C=10μF?",
    hint: "T = 0.693 × (R1 + 2×R2) × C. Calculate in seconds...", answer: "0.2079",
    description: "Master the art of timing circuits",
    hintType: "text"
  },
  {
    id: 10, name: "The Elder Circuit Challenge", house: "Ravenclaw", difficulty: "Master",
    points: 600, 
    question: "Build a full working circuit in Tinkercad: Create a 4-bit binary counter using JK flip-flops that counts from 0 to 15 and displays the output on 4 LEDs.",
    hint: "Access the Tinkercad challenge and build your circuit. Take a screenshot of your completed working circuit.",
    tinkercadLink: "https://www.tinkercad.com/",
    answer: "upload",
    description: "The ultimate practical challenge awaits",
    hintType: "text",
    requiresUpload: true
  }
];

const QUESTION_SETS = {
  set1: 'O.W.L. Level (Basic Electronics)',
  set2: 'N.E.W.T. Level (Advanced Signal Processing)',
};

const HOUSE_COLORS = {
  Gryffindor: { border: '#ae0001', bg: 'rgba(174, 0, 1, 0.1)', accent: '#d3a625' },
  Slytherin: { border: '#1a472a', bg: 'rgba(26, 71, 42, 0.1)', accent: '#aaaaaa' },
  Ravenclaw: { border: '#0e1a40', bg: 'rgba(14, 26, 64, 0.1)', accent: '#946b2d' },
  Hufflepuff: { border: '#ecb939', bg: 'rgba(236, 185, 57, 0.1)', accent: '#000000' }
};

// --- Sub-Components ---

const Countdown = ({ onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.ceil((TARGET_TIME_DEMO_MS - Date.now()) / 1000)));

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t - 1 <= 0) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center p-90 ">
      <h2 className="text-5xl text-white mb-8 tracking-wide hp-heading" style={{ letterSpacing: '0.1em' }}>Challenge Initiating...</h2>
      <p className="text-gray-400 text-xl mb-12 uppercase tracking-widest text-sm">The Marauder's Map will be revealed in:</p>
      <div className="text-8xl font-light text-white tracking-wider mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

const Landing = ({ onStart }) => {
  const [teamName, setTeamName] = useState('');
  const [selectedSet, setSelectedSet] = useState('set1');
  const [isReady, setIsReady] = useState(false);

  if (isReady) return <Countdown onFinish={() => onStart(teamName, selectedSet)} />;

  return (
    <div className="text-center  w-full relative">
      {/* Magical Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes floatMagic {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            33% { transform: translateY(-40px) translateX(20px) rotate(10deg); }
            66% { transform: translateY(-20px) translateX(-20px) rotate(-10deg); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
        `}</style>
        
        {/* Floating magical elements */}
        <div className="absolute top-20 left-10" style={{ animation: 'floatMagic 10s ease-in-out infinite' }}>
          <div className="text-5xl opacity-30">🏰</div>
        </div>
        <div className="absolute top-40 right-16" style={{ animation: 'floatMagic 12s ease-in-out infinite', animationDelay: '2s' }}>
          <div className="text-5xl opacity-30">🔮</div>
        </div>
        <div className="absolute bottom-32 left-20" style={{ animation: 'floatMagic 11s ease-in-out infinite', animationDelay: '4s' }}>
          <div className="text-5xl opacity-30">⚡</div>
        </div>
        <div className="absolute bottom-20 right-24" style={{ animation: 'floatMagic 9s ease-in-out infinite', animationDelay: '1s' }}>
          <div className="text-5xl opacity-30">✨</div>
        </div>
        
        {/* Shimmering particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `shimmer ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <h1 className="text-3xl text-white-200 mb-4 tracking-wide relative z-10 hp-sub-title" style={{ letterSpacing: '0.15em' }}>
       Welcome to the Harry Potter Realm..!
      </h1>
      <div className="w-24 h-1 bg-gray-600 mx-auto mb-12 relative z-10"></div>
      <p className="text-gray-400 mb-16 text-lg uppercase tracking-wider text-sm relative z-10">
        Prove your engineering mastery against the dark arts of circuitry and code
      </p>

      <div className="space-y-8 relative z-10">
        <input
          type="text"
          placeholder="Enter Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-5 text-lg bg-transparent border-2 border-gray-700 text-white focus:outline-none focus:border-white transition-colors"
          style={{ fontFamily: 'Georgia, serif' }}
        />

        <select
          value={selectedSet}
          onChange={(e) => setSelectedSet(e.target.value)}
          className="w-full p-5 text-lg bg-black border-2 border-gray-700 text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {Object.entries(QUESTION_SETS).map(([key, label]) => (
            <option key={key} value={key} className="bg-black">{label}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={() => teamName.trim() && setIsReady(true)}
        disabled={!teamName.trim()}
        className="mt-16 px-12 py-4 text-base font-bold text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest relative z-10 group overflow-hidden"
        style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}
      >
        <span className="relative z-10">Start Challenge</span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>
    </div>
  );
};

const Home = ({ teamName, setPage, handleSubmit }) => (
  <div className="text-center p-90 relative">
    {/* Magical Background */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
      `}</style>
      
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl"
          style={{
            left: '50%',
            top: '50%',
            animation: `orbit ${20 + i * 2}s linear infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.2
          }}
        >
          {['⚡', '🌟', '✨', '🔮', '🪄', '📜', '🦉', '🏰'][i]}
        </div>
      ))}
    </div>
    
    <h2 className="text-5xl text-white mb-6 tracking-wide relative z-10 hp-heading" style={{ letterSpacing: '0.1em' }}>
      Welcome, {teamName}
    </h2>
    <div className="w-full h-1 bg-gray-600  mb-12 relative z-10"></div>
    <p className="text-gray-200 text-base mb-20 uppercase tracking-widest relative z-10">Choose your path to glory</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 relative z-10">
      <button
        className="group p-12 text-white border-2 border-gray-700 hover:border-white transition-all duration-300 relative overflow-hidden"
        onClick={() => setPage('circuits')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="text-6xl mb-6">⚡</div>
          <h3 className="text-2xl mb-3 font-bold hp-heading" style={{ letterSpacing: '0.08em' }}>Circuit Challenge</h3>
          <p className="text-gray-500 text-sm uppercase tracking-wider">Test Your Knowledge</p>
        </div>
      </button>
      
      <button
        className="group p-12 text-white border-2 border-gray-700 hover:border-white transition-all duration-300 relative overflow-hidden"
        onClick={() => setPage('coding')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="text-6xl mb-6">💻</div>
          <h3 className="text-2xl mb-3 font-bold hp-heading" style={{ letterSpacing: '0.08em' }}>Coding Challenge</h3>
          <p className="text-gray-500 text-sm uppercase tracking-wider">Prove Your Skills</p>
        </div>
      </button>
    </div>

    <button
      className="px-10 py-4 text-sm text-white font-bold border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all uppercase tracking-widest relative z-10"
      onClick={handleSubmit}
      style={{ letterSpacing: '0.2em' }}
    >
      Submit Final Score
    </button>
  </div>
);

const Circuits = ({ teamProgress, setProgress }) => {
  const levels = CIRCUIT_QUESTIONS;
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [answer, setAnswer] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);

  const circuitsScore = Object.values(teamProgress).reduce((sum, item) => sum + item.points, 0);

  const isCompleted = useCallback((levelId) => {
    return teamProgress[levelId]?.solved || false;
  }, [teamProgress]);

  const isUnlocked = useCallback((levelId) => {
    if (levelId === 1) return true;
    return isCompleted(levelId - 1);
  }, [isCompleted]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedLevel) return;

    const level = selectedLevel;
    
    // Special handling for upload question
    if (level.requiresUpload) {
      if (!uploadedImage) {
        console.log('Please upload your circuit screenshot!');
        return;
      }
      // Mark as completed when image is uploaded
      if (!isCompleted(level.id)) {
        setProgress(level.id, level.points);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setUploadedImage(null);
      setSelectedLevel(null);
      return;
    }

    // Normal answer checking for other questions
    const normalizedAnswer = answer.toLowerCase().trim();
    const correctAnswers = level.answer.toLowerCase().split(',').map(a => a.trim());
    
    if (correctAnswers.some(correct => normalizedAnswer === correct || normalizedAnswer.includes(correct))) {
      if (!isCompleted(level.id)) {
        setProgress(level.id, level.points);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setAnswer('');
      setSelectedLevel(null);
    } else {
      setAttempts(prev => ({...prev, [level.id]: (prev[level.id] || 0) + 1}));
      console.log('Incorrect! The magic fizzles... Try again!'); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-full text-white relative overflow-hidden p-8 w-full">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(10px); }
          66% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                        0 0 60px rgba(255, 215, 0, 0.6),
                        0 0 90px rgba(255, 215, 0, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 1),
                        0 0 80px rgba(255, 215, 0, 0.8),
                        0 0 120px rgba(255, 215, 0, 0.6);
          }
        }
        .float-spell {
          animation: float 8s ease-in-out infinite;
        }
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Magical Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating golden snitches */}
        <div className="absolute top-20 left-10 w-8 h-8 float-spell" style={{ animationDelay: '0s' }}>
          <div className="text-4xl">⚡</div>
        </div>
        <div className="absolute top-40 right-20 w-8 h-8 float-spell" style={{ animationDelay: '2s' }}>
          <div className="text-4xl">✨</div>
        </div>
        <div className="absolute bottom-40 left-32 w-8 h-8 float-spell" style={{ animationDelay: '4s' }}>
          <div className="text-4xl">🔮</div>
        </div>
        <div className="absolute top-60 right-40 w-8 h-8 float-spell" style={{ animationDelay: '1s' }}>
          <div className="text-4xl">🌟</div>
        </div>
        <div className="absolute bottom-20 right-10 w-8 h-8 float-spell" style={{ animationDelay: '3s' }}>
          <div className="text-4xl">⚡</div>
        </div>
        
        {/* Twinkling stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Magical particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: '20px',
              opacity: 0.6
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {showSuccess && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 bg-white text-black px-10 py-5 border-2 border-white shadow-2xl fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg font-serif tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Challenge Complete</span>
          </div>
        </div>
      )}
      {/* Questions Display Section */}
      <div className="w-full">
        <header className="flex items-center justify-center mb-16 relative">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 border border-gray-700">
              <Trophy className="text-white w-5 h-5" />
              <span className="font-serif text-lg" style={{ fontFamily: 'Georgia, serif' }}>{circuitsScore} Points</span>
            </div>
          </div>
        </header>

        {!selectedLevel ? (
          <>
            <div className="mb-16 text-center">
              <h2 className="text-5xl text-white mb-4 tracking-wide hp-heading" style={{ letterSpacing: '0.1em' }}>
                Circuit Challenges
              </h2>
              <div className="w-24 h-1 bg-gray-600 mx-auto mb-6"></div>
              <p className="text-gray-500 text-sm uppercase tracking-widest">
                Test your knowledge across seven levels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {levels.map((level) => {
                const unlocked = isUnlocked(level.id);
                const completed = isCompleted(level.id);
                const colors = HOUSE_COLORS[level.house];
                
                return (
                  <div
                    key={level.id}
                    className={`relative overflow-hidden border-2 transition-all duration-300 ${
                      unlocked
                        ? 'border-gray-700 hover:border-white cursor-pointer'
                        : 'border-gray-800 cursor-not-allowed opacity-40'
                    }`}
                    style={unlocked ? { 
                      backgroundColor: colors.bg,
                      borderColor: completed ? colors.border : undefined
                    } : {}}
                    onClick={() => unlocked && !completed && setSelectedLevel(level)}
                  >
                    {completed && (
                      <div className="absolute top-4 right-4 z-10">
                        <Star className="w-6 h-6 text-white fill-white" />
                      </div>
                    )}
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          {unlocked ? (
                            <Unlock className="text-white w-5 h-5" />
                          ) : (
                            <Lock className="text-gray-700 w-5 h-5" />
                          )}
                          <span className="text-xs uppercase tracking-widest text-gray-500">
                            Level {level.id}
                          </span>
                        </div>
                        <span className="text-xs uppercase tracking-wider px-3 py-1 border border-gray-700 text-gray-400">
                          {level.difficulty}
                        </span>
                      </div>

                      <h3 className="text-2xl text-white mb-4 hp-heading" style={{ letterSpacing: '0.08em' }}>
                        {level.name}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {level.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-gray-600" />
                          <span className="text-xs text-gray-600 uppercase tracking-wider">{level.house}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-600" />
                          <span className="text-xs text-gray-600 uppercase tracking-wider">{level.points} pts</span>
                        </div>
                      </div>

                      {attempts[level.id] > 0 && !completed && (
                        <div className="mt-4 text-xs text-red-500 uppercase tracking-wider">
                          Attempts: {attempts[level.id]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="w-full mb-3">
            <button
              onClick={() => setSelectedLevel(null)}
              className="mb-10 px-6 py-3 border border-gray-700 hover:border-white transition-colors text-sm uppercase tracking-widest"
              style={{ letterSpacing: '0.2em' }}
            >
              ← Back to Challenges
            </button>

            <div className="border-2 overflow-hidden" style={{ 
              borderColor: HOUSE_COLORS[selectedLevel.house].border,
              backgroundColor: HOUSE_COLORS[selectedLevel.house].bg
            }}>
              <div className="p-8 mb-1 -mt-4 border-b-2" style={{ borderColor: HOUSE_COLORS[selectedLevel.house].border }}>
                <div className="flex items-start justify-between mb-0.5">
                  <h2 className="text-4xl text-white tracking-wide hp-heading" style={{ letterSpacing: '0.1em' }}>
                    {selectedLevel.name}
                  </h2>
                  <span className="px-5 py-2 border-2 border-white font-serif text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                    {selectedLevel.points}
                  </span>
                </div>
                <div className="flex items-center gap-8 text-gray-500 text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>{selectedLevel.house}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Level {selectedLevel.id}</span>
                  </div>
                </div>
              </div>

              <div className="p-90">
                <div className="mb-1 pb-10 border-b border-gray-800">
                  <h3 className="text-s uppercase tracking-widest text-gray-200 mb-6">
                    The Challenge
                  </h3>
                  <p className="text-2xl text-white leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif ' }}>
                    {selectedLevel.question}
                  </p>
                </div>

                <div className="mb-10 p-6 border border-gray-800">
                  <h4 className="text-xs uppercase tracking-widest text-gray-200 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Hint
                  </h4>
                  <p className="text-gray-300 text-sm">{selectedLevel.hint}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-200 mb-4">
                      Your Answer:
                    </label>
                    <input
                      type="text"
                      value={isCompleted(selectedLevel.id) ? selectedLevel.answer : answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your solution"
                      disabled={isCompleted(selectedLevel.id)}
                      className={`w-full px-6 py-4 bg-transparent border-2 text-white placeholder-gray-700 focus:outline-none transition-colors ${
                        isCompleted(selectedLevel.id) 
                          ? 'border-white text-white' 
                          : 'border-gray-700 focus:border-white'
                      }`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    />
                  </div>

                  {!isCompleted(selectedLevel.id) ? (
                    <button
                      onClick={handleSubmit}
                      className={`w-full py-5 font-bold transition-all duration-500 text-sm uppercase tracking-widest relative overflow-hidden group ${
                        answer.trim() 
                          ? 'bg-black text-white shadow-[0_0_5px_rgba(255,255,255,0.8)]' 
                          : 'bg-black text-white hover:bg-gray-500 hover:border-white rounded-xl'
                      }`}
                      style={{ letterSpacing: '0.2em' }}
                    >
                      <span className="relative z-10">Submit Answer</span>
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 transform transition-transform duration-300 ${
                        answer.trim() ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
                      }`}></div>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-5 bg-green-900 border-2 border-green-700 text-white font-bold cursor-not-allowed text-sm uppercase tracking-widest"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      ✓ Completed
                    </button>
                  )}
                </div>

                {attempts[selectedLevel.id] > 0 && !isCompleted(selectedLevel.id) && (
                  <div className="mt-6 text-center text-red-500 text-xs uppercase tracking-wider">
                    Attempts: {attempts[selectedLevel.id]}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Coding = ({ setCodingScore }) => {
  const [testCasesPassed, setTestCasesPassed] = useState('');

  const handleTestCasesChange = (e) => {
    const value = e.target.value;
    setTestCasesPassed(value);
    const score = parseInt(value) || 0;
    setCodingScore(score * 10); // Each test case = 10 points (adjust multiplier as needed)
  };

  return (
    <div className="text-center p-8 relative w-full">
      {/* Magical Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes wandFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
            50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
          }
        `}</style>
        
        {[...Array(10)].map((_, i) => (
          <div
            key={`wand-${i}`}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `wandFloat ${5 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3
            }}
          >
            {['🪄', '📜', '🕯️', '⚗️', '🦉'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
      
      <h2 className="text-5xl text-white mb-6 tracking-wide relative z-10 hp-heading" style={{ letterSpacing: '0.1em', animation: 'glow 2s ease-in-out infinite' }}>
        The Coding Challenge
      </h2>
      <div className="w-24 h-1 bg-gray-600 mx-auto mb-12 relative z-10"></div>
      <p className="text-gray-400 mb-16 text-base leading-relaxed relative z-10">
        The ultimate test of logic: The Golden Snitch Algorithm. Follow the link below and input your test cases passed upon completion.
      </p>

      <a 
        href={HACKERRANK_LINK} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block px-12 py-4 text-sm text-white font-bold border-2 border-white hover:bg-white hover:text-black transition-all uppercase tracking-widest mb-16 relative z-10 group overflow-hidden"
        style={{ letterSpacing: '0.2em' }}
      >
        <span className="relative z-10">Begin Challenge</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
      </a>

      <div className="mt-16 pt-12 border-t border-gray-800 relative z-10">
        <label htmlFor="testcases-input" className="block text-xs uppercase tracking-widest text-gray-500 mb-6">
          Number of Test Cases Passed:
        </label>
        <input
          id="testcases-input"
          type="number"
          placeholder="0"
          min="0"
          value={testCasesPassed}
          onChange={handleTestCasesChange}
          className="w-full max-w-md mx-auto p-5 text-2xl text-center bg-transparent border-2 border-gray-700 text-white focus:outline-none focus:border-white transition-colors"
          style={{ fontFamily: 'Georgia, serif' }}
        />
        {testCasesPassed && (
          <p className="mt-4 text-green-400 text-sm uppercase tracking-wider">
            Score: {parseInt(testCasesPassed) * 10} points
          </p>
        )}
      </div>
    </div>
  );
};

const Score = ({ teamName, teamScores }) => {
  const totalScore = teamScores.circuits + teamScores.coding;

  return (
    <div className="text-center p-16 max-w-3xl mx-auto">
      <h1 className="text-6xl text-white mb-6 tracking-wide hp-title" style={{ letterSpacing: '0.15em' }}>
        Final Results
      </h1>
      <div className="w-24 h-1 bg-gray-600 mx-auto mb-12"></div>
      <h2 className="text-2xl font-light text-gray-400 mb-20 uppercase tracking-widest text-sm">
        Team {teamName}
      </h2>
      
      <div className="space-y-1 mb-16">
        <div className="flex justify-between items-center text-xl text-gray-400 py-6 border-b border-gray-800">
          <span className="font-serif" style={{ fontFamily: 'Georgia, serif' }}>Circuit Challenge</span>
          <span className="font-serif" style={{ fontFamily: 'Georgia, serif' }}>{teamScores.circuits}</span>
        </div>
        <div className="flex justify-between items-center text-xl text-gray-400 py-6 border-b border-gray-800">
          <span className="font-serif" style={{ fontFamily: 'Georgia, serif' }}>Coding Challenge</span>
          <span className="font-serif" style={{ fontFamily: 'Georgia, serif' }}>{teamScores.coding}</span>
        </div>
      </div>

      <div className="py-12 border-2 border-white">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Total Score</h3>
        <p className="text-7xl font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>{totalScore}</p>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [page, setPage] = useState('landing');
  const [teamName, setTeamName] = useState('');
  const [questionSet, setQuestionSet] = useState('');
  const [circuitProgress, setCircuitProgress] = useState({}); 
  const [codingScore, setCodingScore] = useState(0);

  const teamScores = {
    circuits: Object.values(circuitProgress).reduce((sum, item) => sum + item.points, 0),
    coding: codingScore,
  };

  const handleStart = (name, set) => {
    setTeamName(name);
    setQuestionSet(set);
    setPage('home');
  };
  
  const setCircuitProgressAndScore = useCallback((qId, points) => {
      setCircuitProgress(prev => ({ 
          ...prev, 
          [qId]: { solved: true, points: points } 
      }));
  }, []);

  const handleSubmit = () => setPage('score');

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home teamName={teamName} setPage={setPage} handleSubmit={handleSubmit} />;
      case 'circuits':
        return <Circuits teamProgress={circuitProgress} setProgress={setCircuitProgressAndScore} />;
      case 'coding':
        return <Coding setCodingScore={setCodingScore} />;
      case 'score':
        return <Score teamName={teamName} teamScores={teamScores} />;
      case 'landing':
      default:
        return <Landing onStart={handleStart} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100 font-sans w-full">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
          
          .hp-title {
            font-family: 'Cinzel', serif;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 700;
          }
            .hp-sub-title {
            font-family: 'Cinzel', serif;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 500;
          }
          
          .hp-heading {
            font-family: 'Cinzel', serif;
            letter-spacing: 0.1em;
            font-weight: 600;
          }
        `}</style>
        
        <header className="p-6 bg-black shadow-xl flex justify-between items-center border-b border-gray-900 sticky top-0 z-20">
          <h1 className="text-2xl text-white tracking-wider hp-title">
            ELECZZA {questionSet && `— ${questionSet.toUpperCase()}`}
          </h1>
          {page !== 'landing' && page !== 'score' && (
            <button 
              onClick={() => setPage('home')} 
              className="py-2 px-6 text-xs text-white font-bold border border-gray-700 hover:border-white transition-all uppercase tracking-widest"
              style={{ letterSpacing: '0.2em' }}
            >
              Home
            </button>
          )}
        </header>
        <main className="flex flex-grow w-full p-4">
            {renderPage()}
        </main>
    </div>
  );
}