import React, { useState, useEffect, useRef } from 'react';
import { Award, Dna, Users, FlaskConical, CheckCircle, XCircle, Lock, Unlock, Star, Target, Brain, Search, AlertCircle, BookOpen, Scroll, Sparkles } from 'lucide-react';

const DNADetectiveGame = () => {
  const [currentGame, setCurrentGame] = useState('hero'); // Start with hero
  const [completedGames, setCompletedGames] = useState([]);
  const [gaveUpGames, setGaveUpGames] = useState([]); // Track tasks where user gave up
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [caseStarted, setCaseStarted] = useState(false);

  // Game 1: Mitochondrial Haplogroup Sorting
  const [mtDNAAnswers, setMtDNAAnswers] = useState({});
  const [mtDNASubmitted, setMtDNASubmitted] = useState(false);

  // Game 2: Y-Chromosome Assignment
  const [yChromAnswers, setYChromAnswers] = useState({});
  const [yChromSubmitted, setYChromSubmitted] = useState(false);
  const [showGiveUpGame2, setShowGiveUpGame2] = useState(false);

  // Game 3: Suspect Elimination
  const [eliminatedSuspects, setEliminatedSuspects] = useState([]);
  const [suspectSubmitted, setSuspectSubmitted] = useState(false);
  const [showGiveUpGame3, setShowGiveUpGame3] = useState(false);

  // Game 4: Final Identification
  const [finalAnswer, setFinalAnswer] = useState('');
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [showGiveUpGame4, setShowGiveUpGame4] = useState(false);

  const familyTree = {
    1: { name: "Individual 1", gender: "M", children: [3, 4, 5] },
    2: { name: "Individual 2", gender: "F", children: [3, 4, 5] },
    3: { name: "Individual 3", gender: "M", children: [9, 10] },
    4: { name: "Individual 4", gender: "F", children: [] },
    5: { name: "Individual 5", gender: "F", children: [11, 12] },
    6: { name: "Individual 6", gender: "M", children: [9, 10] },
    7: { name: "Individual 7", gender: "M", children: [13, 14] },
    8: { name: "Individual 8", gender: "F", children: [13, 14] },
    9: { name: "Individual 9", gender: "M", children: [20, 21] },
    10: { name: "Individual 10", gender: "F", children: [22, 23] },
    11: { name: "Individual 11", gender: "M", children: [24, 25, 26] },
    12: { name: "Individual 12", gender: "F", children: [24, 25, 26] },
    13: { name: "Individual 13", gender: "M", children: [27, 28, 29] },
    14: { name: "Individual 14", gender: "F", children: [27, 28, 29] },
    15: { name: "Individual 15", gender: "M", children: [30, 31, 32] },
    16: { name: "Individual 16", gender: "F", children: [30, 31, 32] },
    17: { name: "Individual 17", gender: "M", children: [33, 34] },
    18: { name: "Individual 18", gender: "F", children: [33, 34] },
    19: { name: "Individual 19", gender: "F", children: [35, 36] },
    20: { name: "Individual 20", gender: "M", children: [37, 38] },
    21: { name: "Individual 21", gender: "F", children: [37, 38] },
    22: { name: "Individual 22", gender: "M", children: [] },
    23: { name: "Individual 23", gender: "F", children: [] },
    24: { name: "Individual 24", gender: "M", children: [] },
    25: { name: "Individual 25", gender: "F", children: [] },
    26: { name: "Individual 26", gender: "F", children: [] },
    27: { name: "Individual 27", gender: "M", children: [39, 40] },
    28: { name: "Individual 28", gender: "F", children: [] },
    29: { name: "Individual 29", gender: "F", children: [] },
    30: { name: "Individual 30", gender: "M", children: [] },
    31: { name: "Individual 31", gender: "F", children: [] },
    32: { name: "Individual 32", gender: "M", children: [] },
    33: { name: "Individual 33", gender: "M", children: [] },
    34: { name: "Individual 34", gender: "F", children: [] },
    35: { name: "Individual 35", gender: "M", children: [] },
    36: { name: "Individual 36", gender: "M", children: [] },
    37: { name: "Individual 37", gender: "F", children: [] },
    38: { name: "Individual 38", gender: "M", children: [] },
    39: { name: "Individual 39", gender: "F", children: [] },
    40: { name: "Individual 40", gender: "M", children: [] }
  };

  const yHaplotypes = {
    1: "Y1", 3: "Y2", 7: "Y3", 15: "Y6", 20: "Y7", 33: "Y4", 36: "Y5"
  };

  // CORRECTED mitochondrial haplogroups based on actual pedigree - 12 GROUPS
  const correctMtDNA = {
    1: [2, 5, 8, 9, 10, 11, 19],   // Group 1 - From Individual 2♀
    2: [4, 12, 13, 14, 21, 22, 30, 31, 32], // Group 2 - From Individual 4♀
    3: [6, 16, 17, 18, 24, 25, 26, 27, 28, 29], // Group 3 - From Individual 6♀
    4: [23, 34, 35, 37, 38, 39, 40], // Group 4 - From Individual 23♀
    5: [1],                        // Group 5 - Male married in
    6: [3],                        // Group 6 - Male married in
    7: [7],                        // Group 7 - Male married in
    8: [15],                       // Group 8 - Male married in
    9: [20],                       // Group 9 - Male married in
    10: [33],                      // Group 10 - Male married in
    11: [36],                      // Group 11 - Male married in
    12: []                         // Group 12 - Reserved/Empty
  };

  // Haplogroup names with hints - FIXED: Removed duplicate definition
  const haplogroupHints = {
    1: "Group 1 - From Individual 2♀",
    2: "Group 2 - From Individual 4♀",
    3: "Group 3 - From Individual 6♀",
    4: "Group 4 - From Individual 23♀",
    5: "Group 5 - Male married in (1)",
    6: "Group 6 - Male married in (3)",
    7: "Group 7 - Male married in (7)",
    8: "Group 8 - Male married in (15)",
    9: "Group 9 - Male married in (20)",
    10: "Group 10 - Male married in (33)",
    11: "Group 11 - Male married in (36)",
    12: "Group 12 - Reserved/Empty"
  };

  // Correct pedigree structure matching the uploaded image
  const pedigreeData = {
    couples: [
      { partners: [1, 2], children: [5, 7, 9, 10, 11] },
      { partners: [3, 4], children: [13, 14] },
      { partners: [5, 6], children: [15, 17, 18] },
      { partners: [7, 8], children: [19] },
      { partners: [11, 12], children: [21, 22] },
      { partners: [15, 16], children: [24, 25, 26, 27, 28, 29] },
      { partners: [20, 21], children: [30, 31, 32] },
      { partners: [22, 23], children: [33, 35] },
      { partners: [33, 34], children: [37, 38, 39] },
      { partners: [35, 36], children: [40] }
    ],
    genders: {
      1: 'M', 2: 'F', 3: 'M', 4: 'F', 5: 'M', 6: 'F', 7: 'M', 8: 'F',
      9: 'M', 10: 'F', 11: 'M', 12: 'F', 13: 'M', 14: 'F', 15: 'M', 16: 'F',
      17: 'M', 18: 'F', 19: 'M', 20: 'M', 21: 'F', 22: 'M', 23: 'F', 24: 'M',
      25: 'F', 26: 'M', 27: 'M', 28: 'M', 29: 'M', 30: 'F', 31: 'M', 32: 'F',
      33: 'M', 34: 'F', 35: 'F', 36: 'M', 37: 'M', 38: 'M', 39: 'M', 40: 'M'
    }
  };

  // WebGL Shader Background Hook
  const useShaderBackground = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef();
    const rendererRef = useRef(null);
    const pointersRef = useRef(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      class WebGLRenderer {
        constructor(canvas, scale) {
          this.canvas = canvas;
          this.scale = scale;
          this.gl = canvas.getContext('webgl2');
          this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
          this.program = null;
          this.vs = null;
          this.fs = null;
          this.buffer = null;
          this.mouseMove = [0, 0];
          this.mouseCoords = [0, 0];
          this.pointerCoords = [0, 0];
          this.nbrOfPointers = 0;

          this.vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

          this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
          
          this.shaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;
        }

        updateMove(deltas) {
          this.mouseMove = deltas;
        }

        updateMouse(coords) {
          this.mouseCoords = coords;
        }

        updatePointerCoords(coords) {
          this.pointerCoords = coords;
        }

        updatePointerCount(nbr) {
          this.nbrOfPointers = nbr;
        }

        updateScale(scale) {
          this.scale = scale;
          this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
        }

        compile(shader, source) {
          const gl = this.gl;
          gl.shaderSource(shader, source);
          gl.compileShader(shader);

          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
          }
        }

        setup() {
          const gl = this.gl;
          this.vs = gl.createShader(gl.VERTEX_SHADER);
          this.fs = gl.createShader(gl.FRAGMENT_SHADER);
          this.compile(this.vs, this.vertexSrc);
          this.compile(this.fs, this.shaderSource);
          this.program = gl.createProgram();
          gl.attachShader(this.program, this.vs);
          gl.attachShader(this.program, this.fs);
          gl.linkProgram(this.program);

          if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program));
          }
        }

        init() {
          const gl = this.gl;
          const program = this.program;
          
          this.buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

          const position = gl.getAttribLocation(program, 'position');
          gl.enableVertexAttribArray(position);
          gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

          program.resolution = gl.getUniformLocation(program, 'resolution');
          program.time = gl.getUniformLocation(program, 'time');
          program.move = gl.getUniformLocation(program, 'move');
          program.touch = gl.getUniformLocation(program, 'touch');
          program.pointerCount = gl.getUniformLocation(program, 'pointerCount');
          program.pointers = gl.getUniformLocation(program, 'pointers');
        }

        render(now = 0) {
          const gl = this.gl;
          const program = this.program;
          
          if (!program) return;

          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
          
          gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
          gl.uniform1f(program.time, now * 1e-3);
          gl.uniform2f(program.move, ...this.mouseMove);
          gl.uniform2f(program.touch, ...this.mouseCoords);
          gl.uniform1i(program.pointerCount, this.nbrOfPointers);
          gl.uniform2fv(program.pointers, this.pointerCoords);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      }

      class PointerHandler {
        constructor(element, scale) {
          this.scale = scale;
          this.active = false;
          this.pointers = new Map();
          this.lastCoords = [0, 0];
          this.moves = [0, 0];
          
          const map = (element, scale, x, y) => 
            [x * scale, element.height - y * scale];

          element.addEventListener('pointerdown', (e) => {
            this.active = true;
            this.pointers.set(e.pointerId, map(element, this.scale, e.clientX, e.clientY));
          });

          element.addEventListener('pointerup', (e) => {
            if (this.pointers.size === 1) {
              this.lastCoords = Array.from(this.pointers.values())[0];
            }
            this.pointers.delete(e.pointerId);
            this.active = this.pointers.size > 0;
          });

          element.addEventListener('pointerleave', (e) => {
            if (this.pointers.size === 1) {
              this.lastCoords = Array.from(this.pointers.values())[0];
            }
            this.pointers.delete(e.pointerId);
            this.active = this.pointers.size > 0;
          });

          element.addEventListener('pointermove', (e) => {
            if (!this.active) return;
            this.lastCoords = [e.clientX, e.clientY];
            this.pointers.set(e.pointerId, map(element, this.scale, e.clientX, e.clientY));
            this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
          });
        }

        get count() {
          return this.pointers.size;
        }

        get move() {
          return this.moves;
        }

        get coords() {
          return this.pointers.size > 0 
            ? Array.from(this.pointers.values()).flat() 
            : [0, 0];
        }

        get first() {
          return this.pointers.values().next().value || this.lastCoords;
        }
      }

      const canvas = canvasRef.current;
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      rendererRef.current = new WebGLRenderer(canvas, dpr);
      pointersRef.current = new PointerHandler(canvas, dpr);
      
      rendererRef.current.setup();
      rendererRef.current.init();

      const resize = () => {
        const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        if (rendererRef.current) {
          rendererRef.current.updateScale(dpr);
        }
      };

      const loop = (now) => {
        if (!rendererRef.current || !pointersRef.current) return;
        
        rendererRef.current.updateMouse(pointersRef.current.first);
        rendererRef.current.updatePointerCount(pointersRef.current.count);
        rendererRef.current.updatePointerCoords(pointersRef.current.coords);
        rendererRef.current.updateMove(pointersRef.current.move);
        rendererRef.current.render(now);
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      loop(0);
      window.addEventListener('resize', resize);
      
      return () => {
        window.removeEventListener('resize', resize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    return canvasRef;
  };

  const HeroLanding = () => {
    const canvasRef = useShaderBackground();

    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <style>{`
          @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-down {
            animation: fade-in-down 0.8s ease-out forwards;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          
          .animation-delay-600 {
            animation-delay: 0.6s;
          }
          
          .animation-delay-800 {
            animation-delay: 0.8s;
          }
        `}</style>
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain touch-none"
          style={{ background: 'black' }}
        />
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
          {/* Trust Badge */}
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 backdrop-blur-md border border-red-300/30 rounded-full text-sm">
              <span className="text-2xl">🧬</span>
              <span className="text-red-100">Forensic DNA Analysis Training</span>
            </div>
          </div>

          <div className="text-center space-y-6 max-w-5xl mx-auto px-4">
            {/* Main Heading with Animation */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-red-300 via-orange-400 to-amber-300 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                DNA Detective
              </h1>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-300 via-red-400 to-rose-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-400">
                Academy
              </h1>
            </div>
            
            {/* Subtitle with Animation */}
            <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
              <p className="text-lg md:text-xl lg:text-2xl text-red-100/90 font-light leading-relaxed">
                Master forensic DNA analysis through real-world case investigations. 
                Trace maternal & paternal lineages, eliminate suspects, and solve the case.
              </p>
            </div>
            
            {/* CTA Buttons with Animation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up animation-delay-800">
              <button 
                onClick={() => setCurrentGame('scenario')}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
              >
                🔬 Begin Investigation
              </button>
              <button 
                onClick={() => setCurrentGame('evidence')}
                className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-300/30 hover:border-red-300/50 text-red-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                📊 View Evidence First
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-800">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="text-3xl mb-3">🧬</div>
                <h3 className="text-lg font-semibold text-white mb-2">Mitochondrial DNA</h3>
                <p className="text-sm text-white/70">Trace maternal lineages through generations</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold text-white mb-2">Y-Chromosome Analysis</h3>
                <p className="text-sm text-white/70">Track paternal inheritance patterns</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Case Resolution</h3>
                <p className="text-sm text-white/70">Use DNA evidence to identify perpetrators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CaseScenario = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setCurrentGame('hero')}
          className="mb-4 px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
        >
          ← Back to Home
        </button>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <FlaskConical className="w-12 md:w-16 h-12 md:h-16 text-red-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">DNA Detective Academy</h1>
            <FlaskConical className="w-12 md:w-16 h-12 md:h-16 text-red-400 animate-pulse" />
          </div>
          <p className="text-xl md:text-3xl text-red-300 font-bold mb-2">⚖️ CASE FILE ⚖️</p>
          <p className="text-lg md:text-2xl text-red-200">The State of Hogwarts v Tom Marvolo Riddle</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 mb-6 border-2 border-red-400">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Case Briefing</h2>
          </div>
          
          <div className="space-y-4 text-white text-base md:text-lg leading-relaxed">
            <div className="bg-red-500/20 border-l-4 border-red-400 p-4 rounded">
              <p className="font-semibold text-red-200 mb-2">📅 KEY DATES:</p>
              <p>• <strong>December 10, 2014</strong> - Incident occurred at Shell Manor</p>
              <p>• <strong>February 26, 2015</strong> - Victim hospitalized, pregnancy discovered</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-300 text-xl mb-3">👤 The Victim: Miss Lavender Brown</h3>
              <p className="mb-2">On February 26, 2015, Miss Lavender Brown was admitted to hospital with stomach cramps. She was informed that she was suffering from "morning sickness" and was pregnant.</p>
              
              <p className="mb-2">Miss Brown is single and worked as a nanny for <strong>Mr. 20 and Mrs. 21</strong>. At interview, she reported to hospital staff that she had been <strong className="text-red-300">raped on December 10, 2014</strong>.</p>
              
              <p>She was referred to local police where she made a formal report of the incident.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-300 text-xl mb-3">🏰 The Scene: Shell Manor</h3>
              <p className="mb-2">On December 10, 2014, Miss Brown attended a party at the remote location of <strong>Shell Manor</strong> to mind the children she was employed to care for: <strong>Individuals 30, 31, and 32</strong>.</p>
              
              <p className="mb-2">The party was held to celebrate the <strong>christening of twins (Individuals 37 and 38)</strong>. It was a private affair with only extended family members in attendance.</p>
              
              <p className="mb-2">The guest list comprised of only <strong className="text-yellow-300">fourty individuals</strong>. No one else attended the party. All catering staff were in the dinning room or kitchen at the time of the incident and were eliminated from the suspect pool.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-300 text-xl mb-3">🔬 The Investigation</h3>
              <p className="mb-2">Miss Brown was <strong>unable to identify her attacker</strong>.</p>
              
              <p className="mb-2">All 40 guests were compelled to provide a <strong>buccal swab (cheek swab)</strong> so that DNA profiling could be used to exclude them as the perpetrator.</p>
              
              <p className="mb-2">Miss Brown provided a DNA sample as a reference, and during a routine examination, <strong>samples from the foetus were also collected</strong>.</p>
              
              <p>DNA profiling was undertaken by the <strong>Hogwarth State DNA Laboratory</strong> by highly competent staff under the direct supervision of the highly credentialed <strong className="text-cyan-300">Professor Albus Dumbledore</strong>.</p>
            </div>

            <div className="bg-gradient-to-r from-red-500/30 to-orange-500/30 border-2 border-red-400 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-300 text-xl mb-3">🎯 Your Mission</h3>
              <p className="mb-2">As a DNA analyst at the Hogwarts State DNA Laboratory, you must:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Analyze the mitochondrial DNA to trace maternal lineages</li>
                <li>Examine Y-chromosome profiles to track paternal lineages</li>
                <li>Use genetic evidence to eliminate suspects</li>
                <li>Identify the perpetrator using comprehensive DNA analysis</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentGame('evidence')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-lg text-xl shadow-lg transform transition-all hover:scale-105"
          >
            Proceed to Evidence Review →
          </button>
        </div>
      </div>
    </div>
  );

  const EvidenceScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setCurrentGame('hero')}
            className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => setCurrentGame('scenario')}
            className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
          >
            ← Back to Case Briefing
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">📊 Evidence & Data</h1>
          <p className="text-lg md:text-xl text-purple-200">Review the forensic evidence before analysis</p>
        </div>

        {/* Gender Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Search className="w-8 h-8 text-cyan-400" />
            Table: Sample Information & Gender
          </h2>
          <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-lg p-4 mb-4">
            <p className="text-white text-base md:text-lg">
              All samples collected from party guests. Gender determined by amelogenin typing (DNA test for X/Y chromosomes).
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-3 py-2">Sample ID</th>
                  <th className="border border-gray-400 px-3 py-2">Gender</th>
                  <th className="border border-gray-400 px-3 py-2">Sample Type</th>
                  <th className="border border-gray-400 px-3 py-2">Date Received</th>
                  <th className="border border-gray-400 px-3 py-2">Received From</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-3 py-1">Victim</td><td className="border px-3 py-1 font-bold">F</td><td className="border px-3 py-1">Tissue</td><td className="border px-3 py-1">1-Mar-15</td><td className="border px-3 py-1">Pathologist H Granger</td></tr>
                <tr><td className="border px-3 py-1">Foetal</td><td className="border px-3 py-1 font-bold text-blue-600">M</td><td className="border px-3 py-1">Tissue</td><td className="border px-3 py-1">1-Mar-15</td><td className="border px-3 py-1">Pathologist H Granger</td></tr>
                {[
                  [1, 'M'], [2, 'F'], [3, 'M'], [4, 'F'], [5, 'M'], [6, 'F'], [7, 'M'], [8, 'F'],
                  [9, 'M'], [10, 'F'], [11, 'M'], [12, 'F'], [13, 'M'], [14, 'F'], [15, 'M'], [16, 'F'],
                  [17, 'M'], [18, 'F'], [19, 'M'], [20, 'M'], [21, 'F'], [22, 'M'], [23, 'F'], [24, 'M'],
                  [25, 'F'], [26, 'M'], [27, 'M'], [28, 'M'], [29, 'M'], [30, 'F'], [31, 'M'], [32, 'F'],
                  [33, 'M'], [34, 'F'], [35, 'F'], [36, 'M'], [37, 'M'], [38, 'M'], [39, 'M'], [40, 'M']
                ].map(([id, gender]) => (
                  <tr key={id}>
                    <td className="border px-3 py-1">{id}</td>
                    <td className={`border px-3 py-1 font-bold ${gender === 'M' ? 'text-blue-600' : 'text-pink-600'}`}>{gender}</td>
                    <td className="border px-3 py-1">Buccal swab</td>
                    <td className="border px-3 py-1">10-15 Mar</td>
                    <td className="border px-3 py-1">{[3,7,9,13,22,24,33].includes(id) ? 'Constable R Weasley' : 'Inspector H Potter'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guest List Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Search className="w-8 h-8 text-cyan-400" />
            Guest List - All 40 Party Attendees
          </h2>
          <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-lg p-4 mb-4">
            <p className="text-white text-base md:text-lg">
              Everyone present at Shell Manor on December 10, 2014. All provided DNA samples for analysis.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 overflow-x-auto">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 text-center">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(num => (
                <div key={num} className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-lg">
                  <p className="text-white font-bold text-lg">{num}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Known Y-STR Profiles */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Dna className="w-8 h-8 text-pink-400" />
            Known Y-STR Haplotypes (Lab Results)
          </h2>
          <div className="bg-pink-500/20 border-2 border-pink-400 rounded-lg p-4 mb-4">
            <p className="text-white text-base md:text-lg">
              Some individuals' Y-chromosome profiles were directly determined by laboratory testing. 
              These will help you deduce other profiles.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 1, profile: 'Y1' },
                { id: 3, profile: 'Y2' },
                { id: 7, profile: 'Y3' },
                { id: 15, profile: 'Y6' },
                { id: 20, profile: 'Y7' },
                { id: 33, profile: 'Y4' },
                { id: 36, profile: 'Y5' }
              ].map(item => (
                <div key={item.id} className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-lg">
                  <p className="text-white text-lg">
                    <strong>Individual {item.id}:</strong> {item.profile}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Foetal DNA Results */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            Critical Evidence: Foetal DNA Analysis
          </h2>
          <div className="bg-red-500/30 border-2 border-red-400 rounded-lg p-6">
            <p className="text-white text-xl md:text-2xl font-bold mb-3">
              🧬 The unborn child is <span className="text-yellow-300">MALE</span>
            </p>
            <p className="text-white text-xl md:text-2xl font-bold">
              🧬 Y-STR Haplotype: <span className="text-yellow-300">Y6</span>
            </p>
            <p className="text-red-200 text-base md:text-lg mt-4">
              This means the biological father must also have Y-STR haplotype Y6!
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setCaseStarted(true);
              setCurrentGame('menu');
            }}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-lg text-xl shadow-lg transform transition-all hover:scale-105"
          >
            Begin DNA Analysis 🔬
          </button>
        </div>
      </div>
    </div>
  );

  const tutorials = {
    game1: [
      {
        title: "Welcome to DNA Detective Training!",
        content: "Let's learn about Mitochondrial DNA (mtDNA). This is special DNA that helps us trace maternal lineages.",
        visual: "🧬"
      },
      {
        title: "What is Mitochondrial DNA?",
        content: "Mitochondrial DNA is inherited ONLY from mothers. It's like a family recipe passed down from grandmother to mother to children - but only daughters can pass it on further!",
        visual: "👵 → 👩 → 👧"
      },
      {
        title: "How It Works",
        content: "All children of the same mother share her mtDNA. But when sons have children, they DON'T pass on their mother's mtDNA - only daughters do!",
        visual: "Mother → All Children ✓\nSon → His Children ✗\nDaughter → Her Children ✓"
      },
      {
        title: "Your Mission",
        content: "Group all 40 individuals who share the same maternal ancestor into 'haplogroups'. Look for maternal lines - follow the mothers and daughters!",
        visual: "🎯"
      }
    ],
    game2: [
      {
        title: "Y-Chromosome Basics",
        content: "The Y-chromosome is special - only males have it! It passes from father to son, creating a paternal lineage.",
        visual: "♂️"
      },
      {
        title: "Father to Son",
        content: "Think of the Y-chromosome like a family name that only sons inherit. Father → Son → Grandson, and so on. Daughters don't receive it!",
        visual: "👨 → 👦 → 👶♂️"
      },
      {
        title: "Y-STR Haplotypes",
        content: "Y-STR is like a unique barcode on the Y-chromosome. All males in the same paternal line share the same Y-STR haplotype (with rare exceptions).",
        visual: "📊"
      },
      {
        title: "Your Mission",
        content: "Some individuals have known Y-STR profiles from lab tests. Use this information to figure out the Y-STR profiles of other males in their paternal line!",
        visual: "🔬"
      }
    ],
    game3: [
      {
        title: "The Critical Clue",
        content: "We analyzed the baby's DNA and discovered the baby is MALE with Y-STR haplotype Y6!",
        visual: "👶♂️"
      },
      {
        title: "What This Means",
        content: "Since the Y-chromosome passes from father to son, the father MUST also have Y6 haplotype. Any male without Y6 couldn't be the father!",
        visual: "Father Y6 → Baby Y6 ✓"
      },
      {
        title: "Process of Elimination",
        content: "We can eliminate all male suspects who don't have the Y6 haplotype. This will dramatically reduce our suspect pool!",
        visual: "🎯"
      },
      {
        title: "Your Mission",
        content: "Click on suspects to eliminate them. Keep only the males with Y6 haplotype. Remember from Mission 2 which individuals have Y6!",
        visual: "✖️"
      }
    ],
    game4: [
      {
        title: "Final Analysis",
        content: "We're down to 7 suspects - all with Y6 haplotype. Now we need to use Autosomal STR analysis for the final identification!",
        visual: "🔍"
      },
      {
        title: "Autosomal DNA",
        content: "Unlike mtDNA (mom only) or Y-DNA (dad only), autosomal DNA comes from BOTH parents. At each genetic marker, you get one copy from mom and one from dad.",
        visual: "👨 + 👩 → 👶"
      },
      {
        title: "How to Match",
        content: "The baby must have received one allele (version) from the father at each marker. So the father's DNA must match at least one allele at every marker!",
        visual: "📊"
      },
      {
        title: "Your Mission",
        content: "Examine the 7 remaining suspects. Compare their DNA profiles with the baby's. The father will match the baby's DNA at all markers!",
        visual: "🎯"
      }
    ]
  };

  const Tutorial = ({ gameType, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const gameTutorials = tutorials[gameType] || [];
    const tutorial = gameTutorials[currentStep];

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{tutorial?.visual}</div>
            <h2 className="text-3xl font-bold text-white mb-3">{tutorial?.title}</h2>
            <p className="text-xl text-white/90 leading-relaxed whitespace-pre-line">
              {tutorial?.content}
            </p>
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {gameTutorials.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentStep ? 'bg-yellow-300 w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all"
                >
                  ← Previous
                </button>
              )}
              {currentStep < gameTutorials.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={onComplete}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-lg"
                >
                  Start Mission! 🚀
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onComplete}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-sm"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    );
  };

  const HelpButton = ({ gameType }) => {
    const helpContent = {
      game1: {
        title: "Mitochondrial DNA Help",
        tips: [
          "There are 12 haplogroups total",
          "Start with founding females: 2, 4, 6, 8, 12, 16, 23, 34",
          "Follow maternal lines - mother to ALL her children",
          "Remember: sons don't pass mtDNA to their children",
          "Males who married in (1,3,7,15,20,33,36) each form separate groups"
        ]
      },
      game2: {
        title: "Y-Chromosome Help",
        tips: [
          "Only males have Y-chromosomes",
          "Y-chromosome passes father → son → grandson",
          "Find a known male's haplotype, then trace it to his sons",
          "All males in the same paternal line share the same Y-STR"
        ]
      },
      game3: {
        title: "Elimination Help",
        tips: [
          "The baby has Y6 haplotype",
          "The father MUST also have Y6",
          "Eliminate all males who don't have Y6",
          "Keep only: 15, 17, 24, 26, 27, 28, and 29"
        ]
      },
      game4: {
        title: "Final ID Help",
        tips: [
          "Compare each suspect's DNA with the baby's",
          "The father must match at all markers",
          "Look for which suspect shares alleles with the baby",
          "Check every genetic marker carefully"
        ]
      }
    };

    const content = helpContent[gameType];

    return (
      <>
        <button
          onClick={() => setShowHelp(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white font-bold text-2xl z-40 transform transition-all hover:scale-110"
          title="Need Help?"
        >
          ?
        </button>

        {showHelp && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl max-w-lg w-full p-8">
              <h3 className="text-3xl font-bold text-white mb-6">{content?.title}</h3>
              <div className="space-y-4">
                {content?.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl">💡</div>
                    <p className="text-white text-lg">{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full px-6 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-bold rounded-lg transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const MainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setCurrentGame('hero')}
            className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => setCurrentGame('evidence')}
            className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
          >
            ← Review Evidence
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Dna className="w-12 md:w-16 h-12 md:h-16 text-pink-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">DNA Analysis Lab</h1>
            <Dna className="w-12 md:w-16 h-12 md:h-16 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-pink-200 mb-4">🔬 Complete Your Forensic Analysis 🔬</p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-left max-w-3xl mx-auto mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-yellow-300 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 md:w-6 md:h-6" />
              Analysis Tasks
            </h2>
            <div className="space-y-3 text-white text-base md:text-lg">
              <p className="leading-relaxed">
                🧬 Complete 4 genetic analysis tasks to identify the perpetrator
              </p>
              <p className="leading-relaxed">
                📊 Fill in missing data based on DNA inheritance patterns
              </p>
              <p className="leading-relaxed">
                🎯 Use your findings to narrow down and identify the suspect
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-green-200 text-lg font-semibold">
              👨‍🔬 Professor Dumbledore's Note: Each task includes a tutorial explaining the DNA concepts!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {[
            {
              id: 'game1',
              title: 'Task 1: Maternal Lineages',
              subtitle: 'Mitochondrial DNA Haplogroups',
              description: 'Sort all 40 individuals into maternal haplogroups',
              icon: Users,
              color: 'from-blue-500 to-cyan-500',
              difficulty: 'Beginner',
              time: '10-15 min',
              task: 'Fill in haplogroup assignments'
            },
            {
              id: 'game2',
              title: 'Task 2: Paternal Lineages',
              subtitle: 'Y-Chromosome Haplotypes',
              description: 'Determine Y-STR profiles for all male individuals',
              icon: Dna,
              color: 'from-purple-500 to-pink-500',
              difficulty: 'Intermediate',
              time: '10-15 min',
              locked: !completedGames.includes('game1'),
              task: 'Fill in Y-STR assignments'
            },
            {
              id: 'game3',
              title: 'Task 3: Suspect Elimination',
              subtitle: 'Y-STR Exclusion Analysis',
              description: 'Eliminate suspects who don\'t match foetal Y-STR',
              icon: Target,
              color: 'from-orange-500 to-red-500',
              difficulty: 'Intermediate',
              time: '5-10 min',
              locked: !completedGames.includes('game2'),
              task: 'Eliminate non-matching suspects'
            },
            {
              id: 'game4',
              title: 'Task 4: Final Identification',
              subtitle: 'Autosomal STR Comparison',
              description: 'Identify perpetrator using complete DNA profile',
              icon: FlaskConical,
              color: 'from-green-500 to-emerald-500',
              difficulty: 'Advanced',
              time: '5-10 min',
              locked: !completedGames.includes('game3'),
              task: 'Make final identification'
            }
          ].map((game) => (
            <div
              key={game.id}
              className={`relative bg-gradient-to-br ${game.color} p-4 md:p-6 rounded-xl shadow-2xl transform transition-all ${
                game.locked ? 'opacity-50' : 'hover:scale-105 cursor-pointer'
              }`}
            >
              {game.locked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              )}
              {completedGames.includes(game.id) && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <game.icon className="w-10 h-10 md:w-12 md:h-12 text-white flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{game.title}</h3>
                  <p className="text-white/80 text-sm md:text-base font-semibold">{game.subtitle}</p>
                </div>
              </div>
              
              <p className="text-white/90 mb-2 text-sm md:text-base">{game.description}</p>
              <div className="bg-white/20 rounded-lg p-2 mb-4">
                <p className="text-white text-sm font-semibold">📝 {game.task}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs md:text-sm text-white font-semibold">
                  {game.difficulty}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs md:text-sm text-white">
                  ⏱️ {game.time}
                </span>
                {completedGames.includes(game.id) && (
                  <span className="px-3 py-1 bg-yellow-300/30 rounded-full text-xs md:text-sm text-white flex items-center gap-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4" /> Done!
                  </span>
                )}
              </div>

              {!game.locked && (
                <button
                  onClick={() => {
                    setShowTutorial(true);
                    setCurrentGame(game.id);
                  }}
                  className="mt-4 w-full px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition-all text-sm md:text-base"
                >
                  {completedGames.includes(game.id) ? '🔄 Redo Task' : '▶️ Start Task'}
                </button>
              )}
            </div>
          ))}
        </div>

        {completedGames.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
              <h3 className="text-xl md:text-2xl font-bold text-white">Analysis Progress</h3>
            </div>
            <p className="text-white text-base md:text-lg mb-4">
              {completedGames.length} of 4 tasks completed • 🏆 {score} points
            </p>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-300 via-pink-400 to-green-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedGames.length / 4) * 100}%` }}
              />
            </div>
            {completedGames.length === 4 && (
              <div className="mt-4 text-yellow-300 font-bold text-lg animate-pulse">
                🎉 Case Solved! Perpetrator Identified! 🎉
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const Game1 = () => {
    const haplogroups = Array.from({ length: 12 }, (_, i) => i + 1);
    const individuals = Array.from({ length: 40 }, (_, i) => i + 1);
    const [showReference, setShowReference] = useState(true);
    const [showGiveUp, setShowGiveUp] = useState(false);

    const genderMap = pedigreeData.genders;

    const handleDrop = (individual, haplogroup) => {
      setMtDNAAnswers(prev => ({
        ...prev,
        [individual]: haplogroup
      }));
    };

    const checkAnswers = () => {
      let correct = 0;
      individuals.forEach(ind => {
        const userAnswer = mtDNAAnswers[ind];
        const correctAnswer = Object.keys(correctMtDNA).find(key =>
          correctMtDNA[key].includes(ind)
        );
        if (userAnswer && userAnswer === parseInt(correctAnswer)) {
          correct++;
        }
      });
      setScore(prev => prev + correct * 5);
      setMtDNASubmitted(true);
      if (correct === 40 && !completedGames.includes('game1')) {
        setCompletedGames(prev => [...prev, 'game1']);
      }
    };

    const handleGiveUp = () => {
      const answers = {};
      individuals.forEach(ind => {
        const correctAnswer = Object.keys(correctMtDNA).find(key =>
          correctMtDNA[key].includes(ind)
        );
        answers[ind] = parseInt(correctAnswer);
      });
      setMtDNAAnswers(answers);
      setShowGiveUp(true);
    };

    const getProgress = () => {
      return Object.keys(mtDNAAnswers).length;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setCurrentGame('hero')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setCurrentGame('menu');
                setShowTutorial(false);
              }}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              ← Back to Menu
            </button>
            <button
              onClick={() => setShowReference(!showReference)}
              className="px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              {showReference ? 'Hide' : 'Show'} Pedigree & Tables
            </button>
            {!mtDNASubmitted && !showGiveUp && (
              <button
                onClick={handleGiveUp}
                className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-all"
              >
                🏳️ Give Up & Show Answers
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-8 mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
              Mission 1: Maternal Lines (Mitochondrial DNA)
            </h2>
            
            <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-cyan-200 mb-2">🎯 Your Task:</h3>
              <p className="text-white text-base md:text-lg mb-2">
                Sort all 40 individuals into <strong>12 maternal haplogroups</strong> based on mitochondrial DNA inheritance.
              </p>
              <p className="text-cyan-100 text-sm">
                💡 Use the pedigree chart and gender table below to trace maternal lines!
              </p>
            </div>
          </div>

          {/* PEDIGREE CHART & TABLES - REFERENCE PANEL IN MISSION 1 */}
          {showReference && (
            <div className="bg-white rounded-lg p-4 md:p-6 mb-6 border-4 border-green-500">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                📚 Reference Guide: Pedigree Chart & Gender Table
              </h3>

              {/* HOW TO USE SECTION */}
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-4 rounded-lg mb-6 border-2 border-yellow-600">
                <h4 className="text-xl font-bold text-gray-800 mb-3">💡 How to Group into 12 Maternal Haplogroups:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-800 text-base">
                  <li><strong>Find founding mothers</strong> - Females who start maternal lines (there are 4 main founding mothers)</li>
                  <li><strong>Trace through daughters ONLY</strong> - Sons receive mtDNA but DON'T pass it on</li>
                  <li><strong>Group by shared ancestor</strong> - Everyone descended through females = ONE haplogroup</li>
                  <li><strong>Males who married in</strong> - Each has their own unique haplogroup (7 males total)</li>
                  <li><strong>Use the chart below</strong> - Follow the circles (♀) down through generations</li>
                </ol>
              </div>

              {/* THE 11 MATERNAL GROUPS GUIDE */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mb-6 border-2 border-green-600">
                <h4 className="text-xl font-bold text-gray-800 mb-3">📋 The 12 Maternal Groups (Hint Guide):</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-800 text-sm">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <strong className="text-blue-700">Group 1</strong>
                    <p className="text-xs mt-1">From Individual 2♀</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                    <strong className="text-purple-700">Group 2</strong>
                    <p className="text-xs mt-1">From Individual 4♀</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-pink-500">
                    <strong className="text-pink-700">Group 3</strong>
                    <p className="text-xs mt-1">From Individual 6♀</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                    <strong className="text-orange-700">Group 4</strong>
                    <p className="text-xs mt-1">From Individual 23♀</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-500">
                    <strong className="text-red-700">Group 5</strong>
                    <p className="text-xs mt-1">Male 1 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
                    <strong className="text-yellow-700">Group 6</strong>
                    <p className="text-xs mt-1">Male 3 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-500">
                    <strong className="text-green-700">Group 7</strong>
                    <p className="text-xs mt-1">Male 7 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-teal-500">
                    <strong className="text-teal-700">Group 8</strong>
                    <p className="text-xs mt-1">Male 15 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-indigo-500">
                    <strong className="text-indigo-700">Group 9</strong>
                    <p className="text-xs mt-1">Male 20 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-gray-500">
                    <strong className="text-gray-700">Group 10</strong>
                    <p className="text-xs mt-1">Male 33 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-cyan-500">
                    <strong className="text-cyan-700">Group 11</strong>
                    <p className="text-xs mt-1">Male 36 married in</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-slate-500">
                    <strong className="text-slate-700">Group 12</strong>
                    <p className="text-xs mt-1">Reserved/Empty</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-3 font-semibold">
                  💡 Tip: Find the founding mother for each person, then assign them to that group!
                </p>
              </div>

              {/* PEDIGREE CHART MATCHING MERMAID DIAGRAM */}
              <div className="bg-purple-50 p-4 rounded-lg mb-6 border-2 border-purple-600">
                <h4 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  📊 Family Pedigree Chart
                </h4>
                <p className="text-center text-gray-700 mb-4">
                  <strong>Legend:</strong> ⬜ = Male (♂) • ⚪ = Female (♀) • Lines = Marriage & Parent-Child
                </p>
                
                <div className="bg-white p-6 rounded-lg overflow-x-auto">
                  {/* SVG matching the mermaid diagram structure */}
                  <svg width="1400" height="900" viewBox="0 0 1400 900" className="mx-auto">
                    {/* Generation 1 - Couple 1-2 */}
                    <rect x="100" y="50" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="120" y="75" textAnchor="middle" fontSize="16" fontWeight="bold">1♂</text>
                    <line x1="140" y1="70" x2="180" y2="70" stroke="black" strokeWidth="2"/>
                    <circle cx="200" cy="70" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="200" y="75" textAnchor="middle" fontSize="16" fontWeight="bold">2♀</text>
                    
                    {/* Children of 1-2: 5,8,9,10,11 */}
                    <line x1="160" y1="90" x2="160" y2="130" stroke="black" strokeWidth="2"/>
                    <line x1="80" y1="130" x2="280" y2="130" stroke="black" strokeWidth="2"/>
                    
                    {/* Child 5 */}
                    <line x1="100" y1="130" x2="100" y2="170" stroke="black" strokeWidth="2"/>
                    <rect x="80" y="170" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="100" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">5♂</text>
                    
                    {/* Child 8 */}
                    <line x1="140" y1="130" x2="140" y2="170" stroke="black" strokeWidth="2"/>
                    <circle cx="140" cy="190" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="140" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">8♀</text>
                    
                    {/* Children 9,10,11 */}
                    <line x1="180" y1="130" x2="180" y2="170" stroke="black" strokeWidth="2"/>
                    <rect x="160" y="170" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="180" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">9♂</text>
                    
                    <line x1="220" y1="130" x2="220" y2="170" stroke="black" strokeWidth="2"/>
                    <circle cx="220" cy="190" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="220" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">10♀</text>
                    
                    <line x1="260" y1="130" x2="260" y2="170" stroke="black" strokeWidth="2"/>
                    <rect x="240" y="170" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="260" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">11♂</text>

                    {/* Couple 3-4 */}
                    <rect x="400" y="50" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="420" y="75" textAnchor="middle" fontSize="16" fontWeight="bold">3♂</text>
                    <line x1="440" y1="70" x2="480" y2="70" stroke="black" strokeWidth="2"/>
                    <circle cx="500" cy="70" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="500" y="75" textAnchor="middle" fontSize="16" fontWeight="bold">4♀</text>
                    
                    {/* Children of 3-4: 12,13,14 */}
                    <line x1="460" y1="90" x2="460" y2="130" stroke="black" strokeWidth="2"/>
                    <line x1="400" y1="130" x2="550" y2="130" stroke="black" strokeWidth="2"/>
                    
                    <line x1="420" y1="130" x2="420" y2="170" stroke="black" strokeWidth="2"/>
                    <circle cx="420" cy="190" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="420" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">12♀</text>
                    
                    <line x1="475" y1="130" x2="475" y2="170" stroke="black" strokeWidth="2"/>
                    <rect x="455" y="170" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="475" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">13♂</text>
                    
                    <line x1="530" y1="130" x2="530" y2="170" stroke="black" strokeWidth="2"/>
                    <circle cx="530" cy="190" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="530" y="195" textAnchor="middle" fontSize="16" fontWeight="bold">14♀</text>

                    {/* Generation 2 - Couple 5-6 */}
                    <line x1="100" y1="210" x2="100" y2="250" stroke="black" strokeWidth="2"/>
                    <line x1="100" y1="250" x2="150" y2="250" stroke="black" strokeWidth="2"/>
                    <circle cx="170" cy="250" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="170" y="255" textAnchor="middle" fontSize="16" fontWeight="bold">6♀</text>
                    
                    {/* Children of 5-6: 16,17,18 */}
                    <line x1="125" y1="270" x2="125" y2="310" stroke="black" strokeWidth="2"/>
                    <line x1="80" y1="310" x2="200" y2="310" stroke="black" strokeWidth="2"/>
                    
                    <line x1="90" y1="310" x2="90" y2="350" stroke="black" strokeWidth="2"/>
                    <circle cx="90" cy="370" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="90" y="375" textAnchor="middle" fontSize="14" fontWeight="bold">16♀</text>
                    
                    <line x1="135" y1="310" x2="135" y2="350" stroke="black" strokeWidth="2"/>
                    <rect x="115" y="350" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="135" y="375" textAnchor="middle" fontSize="14" fontWeight="bold">17♂</text>
                    
                    <line x1="180" y1="310" x2="180" y2="350" stroke="black" strokeWidth="2"/>
                    <circle cx="180" cy="370" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="180" y="375" textAnchor="middle" fontSize="14" fontWeight="bold">18♀</text>

                    {/* Couple 7-8 */}
                    <rect x="250" y="250" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="270" y="275" textAnchor="middle" fontSize="16" fontWeight="bold">7♂</text>
                    <line x1="290" y1="270" x2="310" y2="270" stroke="black" strokeWidth="2"/>
                    <line x1="140" y1="210" x2="140" y2="270" stroke="black" strokeWidth="2"/>
                    <line x1="140" y1="270" x2="310" y2="270" stroke="black" strokeWidth="2"/>
                    
                    {/* Child 19 */}
                    <line x1="225" y1="290" x2="225" y2="350" stroke="black" strokeWidth="2"/>
                    <rect x="205" y="350" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="225" y="375" textAnchor="middle" fontSize="14" fontWeight="bold">19♂</text>

                    {/* Couple 11-12 */}
                    <line x1="260" y1="210" x2="260" y2="270" stroke="black" strokeWidth="2"/>
                    <line x1="260" y1="270" x2="370" y2="270" stroke="black" strokeWidth="2"/>
                    <line x1="420" y1="210" x2="420" y2="270" stroke="black" strokeWidth="2"/>
                    <line x1="370" y1="270" x2="420" y2="270" stroke="black" strokeWidth="2"/>
                    
                    {/* Children of 11-12: 21,22 */}
                    <line x1="340" y1="270" x2="340" y2="310" stroke="black" strokeWidth="2"/>
                    <line x1="300" y1="310" x2="380" y2="310" stroke="black" strokeWidth="2"/>
                    
                    <line x1="320" y1="310" x2="320" y2="350" stroke="black" strokeWidth="2"/>
                    <circle cx="320" cy="370" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="320" y="375" textAnchor="middle" fontSize="14" fontWeight="bold">21♀</text>
                    
                    <line x1="360" y1="310" x2="360" y2="350" stroke="black" strokeWidth="2"/>
                    <rect x="340" y="350" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="360" y="375" textAnchor="middle" fontSize="14" fontWeight="bold">22♂</text>

                    {/* Generation 3 - Couple 15-16 */}
                    <rect x="20" y="430" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="40" y="455" textAnchor="middle" fontSize="16" fontWeight="bold">15♂</text>
                    <line x1="60" y1="450" x2="80" y2="450" stroke="black" strokeWidth="2"/>
                    <line x1="90" y1="390" x2="90" y2="450" stroke="black" strokeWidth="2"/>
                    <line x1="80" y1="450" x2="90" y2="450" stroke="black" strokeWidth="2"/>
                    
                    {/* Children of 15-16: 24,25,26,27,28,29 */}
                    <line x1="70" y1="470" x2="70" y2="510" stroke="black" strokeWidth="2"/>
                    <line x1="20" y1="510" x2="180" y2="510" stroke="black" strokeWidth="2"/>
                    
                    {[24, 25, 26, 27, 28, 29].map((id, idx) => {
                      const x = 35 + (idx * 25);
                      const isMale = [24, 26, 27, 28, 29].includes(id);
                      return (
                        <g key={id}>
                          <line x1={x} y1="510" x2={x} y2="550" stroke="black" strokeWidth="2"/>
                          {isMale ? (
                            <rect x={x-15} y="550" width="30" height="30" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                          ) : (
                            <circle cx={x} cy="565" r="15" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                          )}
                          <text x={x} y="570" textAnchor="middle" fontSize="12" fontWeight="bold">{id}</text>
                        </g>
                      );
                    })}

                    {/* Couple 20-21 */}
                    <rect x="250" y="430" width="40" height="40" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="270" y="455" textAnchor="middle" fontSize="16" fontWeight="bold">20♂</text>
                    <line x1="290" y1="450" x2="310" y2="450" stroke="black" strokeWidth="2"/>
                    <line x1="320" y1="390" x2="320" y2="450" stroke="black" strokeWidth="2"/>
                    <line x1="310" y1="450" x2="320" y2="450" stroke="black" strokeWidth="2"/>
                    
                    {/* Children of 20-21: 30,31,32 */}
                    <line x1="285" y1="470" x2="285" y2="510" stroke="black" strokeWidth="2"/>
                    <line x1="240" y1="510" x2="330" y2="510" stroke="black" strokeWidth="2"/>
                    
                    {[30, 31, 32].map((id, idx) => {
                      const x = 255 + (idx * 38);
                      const isMale = [31].includes(id);
                      return (
                        <g key={id}>
                          <line x1={x} y1="510" x2={x} y2="550" stroke="black" strokeWidth="2"/>
                          {isMale ? (
                            <rect x={x-15} y="550" width="30" height="30" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                          ) : (
                            <circle cx={x} cy="565" r="15" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                          )}
                          <text x={x} y="570" textAnchor="middle" fontSize="12" fontWeight="bold">{id}</text>
                        </g>
                      );
                    })}

                    {/* Couple 22-23 */}
                    <line x1="360" y1="390" x2="360" y2="450" stroke="black" strokeWidth="2"/>
                    <line x1="360" y1="450" x2="410" y2="450" stroke="black" strokeWidth="2"/>
                    <circle cx="430" cy="450" r="20" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="430" y="455" textAnchor="middle" fontSize="16" fontWeight="bold">23♀</text>
                    
                    {/* Children of 22-23: 34,35 */}
                    <line x1="395" y1="470" x2="395" y2="510" stroke="black" strokeWidth="2"/>
                    <line x1="360" y1="510" x2="430" y2="510" stroke="black" strokeWidth="2"/>
                    
                    <line x1="380" y1="510" x2="380" y2="550" stroke="black" strokeWidth="2"/>
                    <circle cx="380" cy="565" r="15" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="380" y="570" textAnchor="middle" fontSize="12" fontWeight="bold">34♀</text>
                    
                    <line x1="415" y1="510" x2="415" y2="550" stroke="black" strokeWidth="2"/>
                    <circle cx="415" cy="565" r="15" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                    <text x="415" y="570" textAnchor="middle" fontSize="12" fontWeight="bold">35♀</text>

                    {/* Generation 4 - Couple 33-34 */}
                    <rect x="330" y="620" width="30" height="30" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="345" y="640" textAnchor="middle" fontSize="14" fontWeight="bold">33♂</text>
                    <line x1="360" y1="635" x2="375" y2="635" stroke="black" strokeWidth="2"/>
                    <line x1="380" y1="580" x2="380" y2="635" stroke="black" strokeWidth="2"/>
                    <line x1="375" y1="635" x2="380" y2="635" stroke="black" strokeWidth="2"/>
                    
                    {/* Children of 33-34: 37,38,39 */}
                    <line x1="357" y1="650" x2="357" y2="680" stroke="black" strokeWidth="2"/>
                    <line x1="320" y1="680" x2="395" y2="680" stroke="black" strokeWidth="2"/>
                    
                    {[37, 38, 39].map((id, idx) => {
                      const x = 332 + (idx * 32);
                      const isMale = [38].includes(id);
                      return (
                        <g key={id}>
                          <line x1={x} y1="680" x2={x} y2="720" stroke="black" strokeWidth="2"/>
                          {isMale ? (
                            <rect x={x-12} y="720" width="24" height="24" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                          ) : (
                            <circle cx={x} cy="732" r="12" fill="#FFB6C1" stroke="black" strokeWidth="2"/>
                          )}
                          <text x={x} y="736" textAnchor="middle" fontSize="10" fontWeight="bold">{id}</text>
                        </g>
                      );
                    })}

                    {/* Couple 35-36 */}
                    <line x1="415" y1="580" x2="415" y2="635" stroke="black" strokeWidth="2"/>
                    <line x1="415" y1="635" x2="455" y2="635" stroke="black" strokeWidth="2"/>
                    <rect x="455" y="620" width="30" height="30" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="470" y="640" textAnchor="middle" fontSize="14" fontWeight="bold">36♂</text>
                    
                    {/* Child 40 */}
                    <line x1="435" y1="650" x2="435" y2="680" stroke="black" strokeWidth="2"/>
                    <line x1="435" y1="680" x2="435" y2="720" stroke="black" strokeWidth="2"/>
                    <rect x="423" y="720" width="24" height="24" fill="#87CEEB" stroke="black" strokeWidth="2"/>
                    <text x="435" y="736" textAnchor="middle" fontSize="10" fontWeight="bold">40♂</text>
                  </svg>
                </div>

                {/* Complete Couples List */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 mb-2">📋 Complete Couples → Children List:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    {pedigreeData.couples.map((couple, idx) => {
                      const [p1, p2] = couple.partners;
                      const g1 = pedigreeData.genders[p1];
                      const g2 = pedigreeData.genders[p2];
                      return (
                        <div key={idx} className="bg-white p-2 rounded border border-gray-300">
                          <strong>({p1}{g1 === 'M' ? '♂' : '♀'} + {p2}{g2 === 'M' ? '♂' : '♀'})</strong> → {couple.children.join(', ')}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* GENDER TABLE */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-600">
                <h4 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  👥 Gender Reference Table - All 40 Individuals
                </h4>
                <p className="text-center text-gray-700 mb-3">
                  Quick reference: Blue = Male (♂) • Pink = Female (♀)
                </p>
                <div className="grid grid-cols-8 md:grid-cols-10 gap-2">
                  {individuals.map(ind => (
                    <div key={ind} className={`p-3 rounded text-center font-bold text-sm ${
                      genderMap[ind] === 'M' ? 'bg-blue-200 text-blue-900' : 'bg-pink-200 text-pink-900'
                    }`}>
                      {ind} {genderMap[ind] === 'M' ? '♂' : '♀'}
                    </div>
                  ))}
                </div>
              </div>

              {/* EXAMPLE WALKTHROUGH */}
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-600">
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  🎓 Example: Tracing Individual 6's Maternal Line (Group 3)
                </h4>
                <div className="space-y-2 text-gray-800">
                  <p><strong>Step 1:</strong> Individual 6♀ is a founding mother</p>
                  <p><strong>Step 2:</strong> Individual 6♀ passes mtDNA to ALL her children</p>
                  <p><strong>Step 3:</strong> Sons of 6♀ have her mtDNA but DON'T pass it to their children</p>
                  <p><strong>Step 4:</strong> Daughter 16♀ passes 6's mtDNA to all her children</p>
                  <p className="text-green-700 font-bold mt-3">
                    ✅ Everyone who got mtDNA from 6♀ (including through daughter 16♀) = Group 3
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-green-300">
                  <p className="font-bold text-gray-800 mb-2">🔍 Another Example: Group 2 from Individual 4♀</p>
                  <p className="text-sm text-gray-700">4♀ passes mtDNA to all her children including daughter 12♀. Then 12♀ passes it to daughter 21♀, who passes it to her children.</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-bold text-white">Progress</h3>
              <span className="text-xl md:text-2xl font-bold text-cyan-300">
                {getProgress()} / 40
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(getProgress() / 40) * 100}%` }}
              />
            </div>
            <p className="text-white/80 text-sm mt-2">
              {getProgress() === 0 && "Let's start! Pick a group for Individual 1"}
              {getProgress() > 0 && getProgress() < 40 && `Great! Keep going - ${40 - getProgress()} more to go!`}
              {getProgress() === 40 && "Perfect! All assigned - ready to submit!"}
            </p>
          </div>

          {/* Give Up Message */}
          {showGiveUp && (
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-300" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">✅ Answers Revealed!</h3>
                  <p className="text-white text-base md:text-lg">
                    All correct answers have been filled in below. Review them to understand the maternal lineages!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Individuals Grid */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              👥 Assign Each Individual to a Maternal Group
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {individuals.map(ind => (
                <div
                  key={ind}
                  className={`p-3 md:p-4 rounded-lg transition-all ${
                    mtDNAAnswers[ind]
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}
                >
                  <div className="text-center mb-2">
                    <span className="text-white font-bold text-base md:text-lg">
                      Person {ind}
                    </span>
                  </div>
                  <select
                    value={mtDNAAnswers[ind] || ''}
                    onChange={(e) => handleDrop(ind, parseInt(e.target.value))}
                    disabled={mtDNASubmitted || showGiveUp}
                    className="w-full px-2 md:px-3 py-2 md:py-3 bg-white/20 text-white rounded-lg font-semibold cursor-pointer text-sm md:text-base hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Choose Group</option>
                    {haplogroups.map(hg => (
                      <option key={hg} value={hg} className="bg-gray-800">
                        {haplogroupHints[hg]}
                      </option>
                    ))}
                  </select>
                  {mtDNASubmitted && (
                    <div className="mt-2 text-center">
                      {(() => {
                        const correctAnswer = Object.keys(correctMtDNA).find(key =>
                          correctMtDNA[key].includes(ind)
                        );
                        return mtDNAAnswers[ind] === parseInt(correctAnswer) ? (
                          <div className="flex items-center justify-center gap-1 text-green-200">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs md:text-sm font-semibold">Correct!</span>
                          </div>
                        ) : (
                          <div className="text-red-200 text-xs md:text-sm">
                            Should be Group {correctAnswer}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={checkAnswers}
              disabled={mtDNASubmitted || showGiveUp || Object.keys(mtDNAAnswers).length !== 40}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-lg text-lg md:text-xl shadow-lg transform transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mtDNASubmitted ? '✓ Submitted - Check Results Above!' : 
               showGiveUp ? '❌ Cannot Submit After Giving Up' :
               Object.keys(mtDNAAnswers).length === 40 ? '🚀 Submit All Answers' : 
               `Assign All 40 First (${Object.keys(mtDNAAnswers).length}/40)`}
            </button>
          </div>

          {mtDNASubmitted && (
            <div className="mt-6 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg p-4 md:p-6 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-8 h-8" />
                Mission Complete!
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                You've learned about maternal inheritance through mitochondrial DNA! 
                {completedGames.includes('game1') && " 🎉 Great job - you got them all right!"}
              </p>
              <button
                onClick={() => setCurrentGame('menu')}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-green-700 font-bold rounded-lg transition-all"
              >
                Continue to Next Mission →
              </button>
            </div>
          )}

          {showGiveUp && !mtDNASubmitted && (
            <div className="mt-6 bg-gradient-to-br from-orange-600 to-amber-700 rounded-lg p-4 md:p-6 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-8 h-8" />
                Answers Revealed
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                Review the correct answers above to understand the maternal lineages. You can still continue to the next mission!
              </p>
              <button
                onClick={() => {
                  if (!completedGames.includes('game1')) {
                    setCompletedGames(prev => [...prev, 'game1']);
                  }
                  setCurrentGame('menu');
                }}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-orange-700 font-bold rounded-lg transition-all"
              >
                Continue to Next Mission →
              </button>
            </div>
          )}
        </div>
        <HelpButton gameType="game1" />
      </div>
    );
  };

  const Game2 = () => {
    const individuals = Array.from({ length: 40 }, (_, i) => i + 1);
    const males = individuals.filter(i => familyTree[i].gender === 'M');
    const yHaplotypeOptions = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7'];

    const correctYAnswers = {
      1: 'Y1',  // Given
      3: 'Y2',  // Given
      5: 'Y1',  // Son of 1
      7: 'Y3',  // Given (married into family)
      9: 'Y1',  // Son of 1
      11: 'Y1', // Son of 1
      13: 'Y2', // Son of 3
      15: 'Y6', // Given (married into family)
      17: 'Y6', // Son of 15
      19: 'Y3', // Son of 7
      20: 'Y7', // Given (married into family)
      22: 'Y1', // Son of 11 (who has Y1)
      24: 'Y6', // Son of 15
      26: 'Y6', // Son of 15
      27: 'Y6', // Son of 15
      28: 'Y6', // Son of 15
      29: 'Y6', // Son of 15
      31: 'Y7', // Son of 20
      33: 'Y4', // Given (married into family)
      36: 'Y5', // Given (married into family)
      37: 'Y4', // Son of 33
      38: 'Y4', // Son of 33
      39: 'Y4', // Son of 33
      40: 'Y5'  // Son of 36
    };

    const checkYAnswers = () => {
      let correct = 0;
      males.forEach(ind => {
        if (yChromAnswers[ind] === correctYAnswers[ind]) {
          correct++;
        }
      });
      setScore(prev => prev + correct * 10);
      setYChromSubmitted(true);
      
      // Only mark as completed if ALL answers are correct
      if (correct === males.length && !completedGames.includes('game2')) {
        setCompletedGames(prev => [...prev, 'game2']);
      }
    };

    const handleGiveUpGame2 = () => {
      const answers = {};
      males.forEach(ind => {
        if (!yHaplotypes[ind]) {
          answers[ind] = correctYAnswers[ind];
        }
      });
      setYChromAnswers(prev => ({ ...prev, ...answers }));
      setShowGiveUpGame2(true);
    };

    const getProgress = () => {
      const unknownMales = males.filter(m => !yHaplotypes[m]);
      return Object.keys(yChromAnswers).length;
    };

    const totalUnknown = males.filter(m => !yHaplotypes[m]).length;

    // Calculate how many are correct
    const getCorrectCount = () => {
      let correct = 0;
      males.forEach(ind => {
        if (yChromAnswers[ind] === correctYAnswers[ind]) {
          correct++;
        }
      });
      return correct;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 mb-4 md:mb-6">
            <button
              onClick={() => setCurrentGame('hero')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setCurrentGame('menu');
                setShowTutorial(false);
              }}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              ← Back to Menu
            </button>
            {!yChromSubmitted && !showGiveUpGame2 && (
              <button
                onClick={handleGiveUpGame2}
                className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-all"
              >
                🏳️ Give Up & Show Answers
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-8 mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <Dna className="w-8 h-8 md:w-10 md:h-10 text-pink-400" />
              Mission 2: Paternal Lines
            </h2>
            
            <div className="bg-pink-500/20 border-2 border-pink-400 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-pink-200 mb-2">📋 Quick Instructions:</h3>
              <ol className="text-white text-base md:text-lg space-y-2 list-decimal list-inside">
                <li>Green boxes show males with KNOWN Y-STR profiles from lab tests</li>
                <li>Purple boxes are males you need to figure out</li>
                <li>Sons inherit their father's Y-STR - trace the paternal line!</li>
                <li>Assign Y-STR profiles to all purple boxes</li>
              </ol>
            </div>

            <div className="bg-yellow-300/20 border-l-4 border-yellow-300 p-4 rounded">
              <p className="text-yellow-100 text-base md:text-lg">
                <strong>💡 Key Info:</strong> Individual 1=Y1, Individual 3=Y2, Individual 7=Y3, 
                Individual 15=Y6, Individual 20=Y7, Individual 33=Y4, Individual 36=Y5
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-bold text-white">Progress</h3>
              <span className="text-xl md:text-2xl font-bold text-pink-300">
                {getProgress()} / {totalUnknown}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(getProgress() / totalUnknown) * 100}%` }}
              />
            </div>
          </div>

          {/* Give Up Message */}
          {showGiveUpGame2 && (
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-300" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">✅ Answers Revealed!</h3>
                  <p className="text-white text-base md:text-lg">
                    All correct answers have been filled in below. Review them to understand the paternal lineages!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {males.map(ind => {
              const isKnown = yHaplotypes[ind];
              return (
                <div
                  key={ind}
                  className={`p-4 md:p-6 rounded-xl shadow-lg ${
                    isKnown ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-purple-500 to-pink-600'
                  }`}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                    Person {ind}
                  </h3>
                  {isKnown ? (
                    <div className="bg-white/30 rounded-lg p-4">
                      <p className="text-white font-bold text-center text-xl mb-1">
                        {isKnown}
                      </p>
                      <p className="text-white/80 text-sm text-center">
                        ✅ Known from lab
                      </p>
                    </div>
                  ) : (
                    <>
                      <select
                        value={yChromAnswers[ind] || ''}
                        onChange={(e) => setYChromAnswers(prev => ({
                          ...prev,
                          [ind]: e.target.value
                        }))}
                        className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/20 text-white rounded-lg font-semibold cursor-pointer text-base md:text-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={yChromSubmitted || showGiveUpGame2}
                      >
                        <option value="" className="bg-gray-800">Select Y-STR...</option>
                        {yHaplotypeOptions.map(ht => (
                          <option key={ht} value={ht} className="bg-gray-800">{ht}</option>
                        ))}
                      </select>
                      {yChromAnswers[ind] && !yChromSubmitted && (
                        <div className="mt-2 text-center">
                          <span className="text-white/80 text-sm">Selected: {yChromAnswers[ind]} ✓</span>
                        </div>
                      )}
                    </>
                  )}
                  {yChromSubmitted && (
                    <div className="mt-3">
                      {(isKnown ? isKnown : yChromAnswers[ind]) === correctYAnswers[ind] ? (
                        <div className="flex items-center justify-center gap-2 text-green-200 bg-green-500/30 rounded-lg p-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Correct!</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-red-200 bg-red-500/30 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            <span className="font-semibold">Incorrect</span>
                          </div>
                          <span className="text-sm">Should be: {correctYAnswers[ind]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6 md:mt-8">
            <button
              onClick={checkYAnswers}
              disabled={yChromSubmitted || showGiveUpGame2 || getProgress() < totalUnknown}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-lg text-lg md:text-xl shadow-lg transform transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {yChromSubmitted ? '✓ Submitted - Check Results!' : 
               showGiveUpGame2 ? '❌ Cannot Submit After Giving Up' :
               getProgress() === totalUnknown ? '🚀 Submit All Answers' : 
               `Assign All First (${getProgress()}/${totalUnknown})`}
            </button>
          </div>

          {yChromSubmitted && (
            <div className={`mt-6 rounded-lg p-4 md:p-6 shadow-xl ${
              getCorrectCount() === males.length 
                ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                : 'bg-gradient-to-br from-orange-600 to-red-700'
            }`}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                {getCorrectCount() === males.length ? (
                  <>
                    <CheckCircle className="w-8 h-8" />
                    Mission Complete!
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8" />
                    Review Your Answers
                  </>
                )}
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                {getCorrectCount() === males.length ? (
                  <>
                    You've learned about paternal inheritance through Y-chromosomes! 
                    🎉 Perfect score - all {males.length} correct!
                  </>
                ) : (
                  <>
                    You got {getCorrectCount()} out of {males.length} correct. 
                    Review the incorrect answers above (marked in red). The next task will unlock once you complete this one successfully.
                  </>
                )}
              </p>
              {getCorrectCount() === males.length && (
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-green-700 font-bold rounded-lg transition-all"
                >
                  Continue to Next Mission →
                </button>
              )}
            </div>
          )}

          {showGiveUpGame2 && !yChromSubmitted && (
            <div className="mt-6 bg-gradient-to-br from-orange-600 to-amber-700 rounded-lg p-4 md:p-6 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-8 h-8" />
                Answers Revealed
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                Review the correct answers above to understand the paternal lineages. You can still continue to the next mission!
              </p>
              <button
                onClick={() => {
                  if (!completedGames.includes('game2')) {
                    setCompletedGames(prev => [...prev, 'game2']);
                  }
                  setCurrentGame('menu');
                }}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-orange-700 font-bold rounded-lg transition-all"
              >
                Continue to Next Mission →
              </button>
            </div>
          )}
        </div>
        <HelpButton gameType="game2" />
      </div>
    );
  };

  const Game3 = () => {
    const individuals = Array.from({ length: 40 }, (_, i) => i + 1);
    const males = individuals.filter(i => familyTree[i].gender === 'M');
    
    const y6Males = [15, 17, 24, 26, 27, 28, 29];
    const correctEliminated = males.filter(m => !y6Males.includes(m));

    const toggleSuspect = (ind) => {
      if (suspectSubmitted || showGiveUpGame3) return;
      setEliminatedSuspects(prev =>
        prev.includes(ind)
          ? prev.filter(i => i !== ind)
          : [...prev, ind]
      );
    };

    const checkElimination = () => {
      const correct = correctEliminated.every(ind => eliminatedSuspects.includes(ind)) &&
                     eliminatedSuspects.length === correctEliminated.length;
      if (correct) {
        setScore(prev => prev + 200);
        if (!completedGames.includes('game3')) {
          setCompletedGames(prev => [...prev, 'game3']);
        }
      }
      setSuspectSubmitted(true);
    };

    const handleGiveUpGame3 = () => {
      setEliminatedSuspects(correctEliminated);
      setShowGiveUpGame3(true);
    };

    const isCorrect = () => {
      return correctEliminated.every(ind => eliminatedSuspects.includes(ind)) &&
             eliminatedSuspects.length === correctEliminated.length;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-rose-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 mb-4 md:mb-6">
            <button
              onClick={() => setCurrentGame('hero')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setCurrentGame('menu');
                setShowTutorial(false);
              }}
              className="mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              ← Back to Menu
            </button>
            {!suspectSubmitted && !showGiveUpGame3 && (
              <button
                onClick={handleGiveUpGame3}
                className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-all"
              >
                🏳️ Give Up & Show Answers
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-8 mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <Target className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
              Mission 3: Narrow It Down
            </h2>
            
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-red-200 mb-2">🎯 Your Goal:</h3>
              <p className="text-white text-base md:text-lg mb-2">
                The baby is male with Y-STR haplotype <strong className="text-yellow-300">Y6</strong>.
              </p>
              <p className="text-white text-base md:text-lg">
                Click on suspects to ELIMINATE them. Keep only the males who have Y6!
              </p>
            </div>

            <div className="bg-green-500/20 border-l-4 border-green-400 p-4 rounded mb-4">
              <p className="text-green-100 text-base md:text-lg">
                <strong>✅ Keep These (Y6):</strong> Persons 15, 17, 24, 26, 27, 28, and 29
              </p>
            </div>

            <div className="bg-yellow-300/20 border-l-4 border-yellow-300 p-4 rounded">
              <p className="text-yellow-100 text-base md:text-lg">
                <strong>💡 How to Play:</strong> Click a suspect once to eliminate (gray). 
                Click again to bring them back. Eliminate everyone who doesn't have Y6!
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Elimination Progress</h3>
                <p className="text-white/80 text-base">
                  Eliminated: {eliminatedSuspects.length} suspects
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-3xl md:text-4xl font-bold text-orange-300">
                  {males.length - eliminatedSuspects.length}
                </p>
                <p className="text-white/80 text-sm">Remaining Suspects</p>
                {males.length - eliminatedSuspects.length === 7 && !suspectSubmitted && (
                  <p className="text-green-300 font-semibold mt-1">✓ Perfect! Ready to submit</p>
                )}
              </div>
            </div>
          </div>

          {/* Give Up Message */}
          {showGiveUpGame3 && (
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-300" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">✅ Answers Revealed!</h3>
                  <p className="text-white text-base md:text-lg">
                    All suspects who don't have Y6 haplotype have been eliminated for you. Review the results below!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
            {males.map(ind => {
              const isEliminated = eliminatedSuspects.includes(ind);
              const shouldBeEliminated = !y6Males.includes(ind);
              const isY6 = y6Males.includes(ind);

              return (
                <div
                  key={ind}
                  onClick={() => toggleSuspect(ind)}
                  className={`p-4 md:p-6 rounded-xl shadow-lg cursor-pointer transform transition-all hover:scale-105 ${
                    isEliminated
                      ? 'bg-gray-700 opacity-40'
                      : isY6
                      ? 'bg-gradient-to-br from-red-500 to-rose-600'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}
                >
                  <h3 className="text-lg md:text-xl font-bold text-white text-center mb-2">
                    Person {ind}
                  </h3>
                  <div className="flex justify-center mb-2">
                    {isEliminated ? (
                      <XCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    ) : isY6 ? (
                      <div className="text-center">
                        <div className="text-yellow-300 font-bold text-sm">Y6</div>
                        <div className="text-white text-xs">Keep!</div>
                      </div>
                    ) : (
                      <div className="text-white text-xs">Click to eliminate</div>
                    )}
                  </div>
                  {suspectSubmitted && (
                    <div className="mt-2 text-center">
                      {isEliminated === shouldBeEliminated ? (
                        <div className="bg-green-500/30 rounded px-2 py-1">
                          <CheckCircle className="w-5 h-5 text-green-300 mx-auto" />
                        </div>
                      ) : (
                        <div className="bg-red-500/30 rounded px-2 py-1">
                          <XCircle className="w-5 h-5 text-red-300 mx-auto" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={checkElimination}
              disabled={suspectSubmitted || showGiveUpGame3}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-lg text-lg md:text-xl shadow-lg transform transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suspectSubmitted ? '✓ Submitted - Check Results!' : 
               showGiveUpGame3 ? '❌ Cannot Submit After Giving Up' :
               '🚀 Submit Elimination'}
            </button>
          </div>

          {suspectSubmitted && (
            <div className={`mt-6 rounded-lg p-4 md:p-6 shadow-xl ${
              isCorrect() 
                ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                : 'bg-gradient-to-br from-orange-600 to-red-700'
            }`}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                {isCorrect() ? (
                  <>
                    <CheckCircle className="w-8 h-8" />
                    Mission Complete!
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8" />
                    Review Your Elimination
                  </>
                )}
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                {isCorrect() ? (
                  <>
                    You've narrowed it down to 7 suspects with Y6 haplotype! 🎉 Perfect elimination!
                  </>
                ) : (
                  <>
                    Your elimination isn't quite right. Review the suspects above - you should eliminate all males who don't have Y6 haplotype and keep the 7 who do (15, 17, 24, 26, 27, 28, 29). The next task will unlock once you complete this one successfully.
                  </>
                )}
              </p>
              {isCorrect() && (
                <>
                  <div className="bg-white/20 rounded-lg p-4 mb-4">
                    <p className="text-white font-semibold">
                      ✅ Remaining Suspects: Persons 15, 17, 24, 26, 27, 28, and 29
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentGame('menu')}
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-green-700 font-bold rounded-lg transition-all"
                  >
                    Continue to Final Mission →
                  </button>
                </>
              )}
            </div>
          )}

          {showGiveUpGame3 && !suspectSubmitted && (
            <div className="mt-6 bg-gradient-to-br from-orange-600 to-amber-700 rounded-lg p-4 md:p-6 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-8 h-8" />
                Answers Revealed
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                All correct eliminations have been shown. The 7 remaining suspects (15, 17, 24, 26, 27, 28, 29) all have Y6 haplotype. You can still continue to the next mission!
              </p>
              <button
                onClick={() => {
                  if (!completedGames.includes('game3')) {
                    setCompletedGames(prev => [...prev, 'game3']);
                  }
                  setCurrentGame('menu');
                }}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-orange-700 font-bold rounded-lg transition-all"
              >
                Continue to Final Mission →
              </button>
            </div>
          )}
        </div>
        <HelpButton gameType="game3" />
      </div>
    );
  };

  const Game4 = () => {
    const remainingSuspects = [15, 17, 24, 26, 27, 28, 29];
    const correctAnswer = '24';

    const suspectInfo = {
      15: { name: "Person 15", relation: "👨 Adult male, married to Individual 16", age: "Adult" },
      17: { name: "Person 17", relation: "👨 Adult male, brother of Individual 15", age: "Adult" },
      24: { name: "Person 24", relation: "👦 Young adult, son of Individual 15", age: "Young adult" },
      26: { name: "Person 26", relation: "👦 Young adult, son of Individual 15", age: "Young adult" },
      27: { name: "Person 27", relation: "👦 Young adult, son of Individual 15", age: "Young adult" },
      28: { name: "Person 28", relation: "👦 Young adult, son of Individual 15", age: "Young adult" },
      29: { name: "Person 29", relation: "👦 Young adult, son of Individual 15", age: "Young adult" }
    };

    const checkFinal = () => {
      if (finalAnswer === correctAnswer) {
        setScore(prev => prev + 500);
        if (!completedGames.includes('game4')) {
          setCompletedGames(prev => [...prev, 'game4']);
        }
      }
      setFinalSubmitted(true);
      setShowResults(true);
    };

    const handleGiveUpGame4 = () => {
      setFinalAnswer(correctAnswer);
      setShowGiveUpGame4(true);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 mb-4 md:mb-6">
            <button
              onClick={() => setCurrentGame('hero')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setCurrentGame('menu');
                setShowTutorial(false);
              }}
              className="mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all"
            >
              ← Back to Menu
            </button>
            {!finalSubmitted && !showGiveUpGame4 && (
              <button
                onClick={handleGiveUpGame4}
                className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-all"
              >
                🏳️ Give Up & Show Answer
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-8 mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <FlaskConical className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
              Mission 4: Solve the Case!
            </h2>
            
            <div className="bg-emerald-500/20 border-2 border-emerald-400 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-emerald-200 mb-2">🎯 Final Step:</h3>
              <p className="text-white text-base md:text-lg">
                You have 7 suspects left, all with Y6. Now use autosomal STR (DNA matching from both parents) 
                to find THE perpetrator. Click on who you think is guilty!
              </p>
            </div>

            <div className="bg-yellow-300/20 border-l-4 border-yellow-300 p-4 rounded">
              <p className="text-yellow-100 text-base md:text-lg">
                <strong>💡 Think About:</strong> The baby's DNA must match the father's at all genetic markers. 
                Who is most likely based on the context and DNA evidence?
              </p>
            </div>
          </div>

          {/* Give Up Message */}
          {showGiveUpGame4 && (
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-300" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">✅ Answer Revealed!</h3>
                  <p className="text-white text-base md:text-lg">
                    The correct answer (Person 24) has been highlighted below. Review the DNA evidence to understand why!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {remainingSuspects.map(ind => (
              <div
                key={ind}
                onClick={() => !finalSubmitted && !showGiveUpGame4 && setFinalAnswer(ind.toString())}
                className={`p-6 md:p-8 rounded-xl shadow-2xl transform transition-all ${
                  finalSubmitted || showGiveUpGame4 ? '' : 'cursor-pointer hover:scale-105'
                } ${
                  finalSubmitted && ind.toString() === correctAnswer
                    ? 'bg-gradient-to-br from-red-600 to-rose-700 ring-4 ring-red-400'
                    : showGiveUpGame4 && ind.toString() === correctAnswer
                    ? 'bg-gradient-to-br from-orange-500 to-amber-600 ring-4 ring-orange-300'
                    : finalAnswer === ind.toString()
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-600 ring-4 ring-yellow-300'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                } ${finalSubmitted || showGiveUpGame4 ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl md:text-5xl">
                    {ind === 15 || ind === 17 ? '👨' : '👦'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {suspectInfo[ind].name}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base">
                      {suspectInfo[ind].age}
                    </p>
                  </div>
                </div>
                
                <p className="text-white/90 text-base md:text-lg mb-4">
                  {suspectInfo[ind].relation}
                </p>
                
                <div className="bg-white/20 rounded-lg p-3 md:p-4 mb-3">
                  <p className="text-white font-semibold text-sm mb-1">DNA Profile:</p>
                  <p className="text-white text-sm md:text-base">✓ Y-STR: Y6 (matches baby)</p>
                  <p className="text-white text-sm md:text-base">✓ Autosomal STR: {ind === 24 ? 'Full Match' : 'Partial'}</p>
                </div>

                {finalAnswer === ind.toString() && !finalSubmitted && (
                  <div className="bg-yellow-300/30 border-2 border-yellow-300 rounded-lg p-3 text-center">
                    <p className="text-white font-bold">✓ Selected</p>
                  </div>
                )}
                
                {finalSubmitted && (
                  <div className="mt-4">
                    {ind.toString() === correctAnswer ? (
                      <div className="bg-red-500/40 border-3 border-red-300 rounded-lg p-4">
                        <div className="flex items-center justify-center gap-2 text-white">
                          <AlertCircle className="w-6 h-6 md:w-8 md:h-8" />
                          <span className="font-bold text-lg md:text-xl">PERPETRATOR IDENTIFIED</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-500/30 border-2 border-gray-400 rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 text-gray-300">
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                          <span className="font-semibold text-sm md:text-base">Innocent</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!finalSubmitted && !showGiveUpGame4 && (
            <div className="text-center">
              <button
                onClick={checkFinal}
                disabled={!finalAnswer}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-lg text-lg md:text-xl shadow-lg transform transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {finalAnswer ? '⚖️ Make Final Accusation' : 'Select a Suspect First'}
              </button>
            </div>
          )}

          {showGiveUpGame4 && !finalSubmitted && (
            <div className="mt-6 bg-gradient-to-br from-orange-600 to-amber-700 rounded-lg p-4 md:p-6 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-8 h-8" />
                Answer Revealed
              </h3>
              <p className="text-white text-lg md:text-xl mb-4">
                The correct answer is Person 24. Review the DNA evidence above to see why Person 24's profile matches the baby's DNA at all markers!
              </p>
              <button
                onClick={() => {
                  if (!completedGames.includes('game4')) {
                    setCompletedGames(prev => [...prev, 'game4']);
                  }
                  setCurrentGame('menu');
                  setShowResults(false);
                }}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-orange-700 font-bold rounded-lg transition-all"
              >
                Return to Academy 🏆
              </button>
            </div>
          )}

          {showResults && (
            <div className={`rounded-xl p-6 md:p-8 shadow-2xl ${
              finalAnswer === correctAnswer 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : 'bg-gradient-to-br from-red-600 to-rose-700'
            }`}>
              <div className="text-center mb-6">
                {finalAnswer === correctAnswer ? (
                  <>
                    <Award className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4 animate-bounce" />
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">🎉 Case Solved! 🎉</h3>
                    <p className="text-white text-xl md:text-2xl mb-4">Final Score: {score} points</p>
                    <div className="bg-green-500/30 border-2 border-green-300 rounded-lg p-4 mb-4">
                      <p className="text-white text-lg md:text-xl font-bold">
                        ✅ Perfect! You identified the correct perpetrator!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4" />
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">❌ Incorrect Identification</h3>
                    <p className="text-white text-xl md:text-2xl mb-4">Current Score: {score} points</p>
                    <div className="bg-white/20 border-2 border-white/40 rounded-lg p-4 mb-4">
                      <p className="text-white text-lg md:text-xl font-bold">
                        That's not the right person. The correct answer is Person 24.
                        Review the DNA profiles above to see why Person 24 matches at all markers.
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {finalAnswer === correctAnswer && (
                <div className="bg-white/20 rounded-lg p-4 md:p-6 text-white mb-6">
                <h4 className="text-xl md:text-2xl font-bold mb-3">📋 Case Summary:</h4>
                <p className="text-base md:text-lg leading-relaxed mb-3">
                  Through systematic DNA analysis, you correctly identified <strong>Person 24</strong> as 
                  the perpetrator using multiple lines of evidence:
                </p>
                <ul className="space-y-2 text-base md:text-lg">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span><strong>Mitochondrial DNA:</strong> Traced maternal lineages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span><strong>Y-Chromosome:</strong> Matched Y6 haplotype to narrow suspects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span><strong>Autosomal STR:</strong> Confirmed DNA match at all markers</span>
                  </li>
                </ul>
                <p className="text-base md:text-lg leading-relaxed mt-4">
                  Person 24 was a young adult male who attended the party at Shell Manor. 
                  The DNA evidence was conclusive and led to a successful prosecution.
                </p>
              </div>
              )}
              
              <div className="text-center">
                <p className="text-white text-lg md:text-xl mb-4 font-semibold">
                  {finalAnswer === correctAnswer 
                    ? '🎓 Congratulations, Detective! You\'ve mastered DNA forensic analysis!' 
                    : '📚 Review the evidence to understand how DNA matching works in forensic analysis. You can try again or return to the menu.'}
                </p>
                <button
                  onClick={() => {
                    if (finalAnswer === correctAnswer && !completedGames.includes('game4')) {
                      setCompletedGames(prev => [...prev, 'game4']);
                    }
                    setCurrentGame('menu');
                    setShowResults(false);
                  }}
                  className={`px-6 md:px-8 py-3 bg-white hover:bg-gray-100 font-bold rounded-lg text-base md:text-lg transition-all shadow-lg ${
                    finalAnswer === correctAnswer ? 'text-orange-600' : 'text-red-700'
                  }`}
                >
                  Return to Academy 🏆
                </button>
              </div>
            </div>
          )}
        </div>
        <HelpButton gameType="game4" />
      </div>
    );
  };

  return (
    <div>
      {showTutorial && currentGame !== 'menu' && currentGame !== 'scenario' && currentGame !== 'evidence' && currentGame !== 'hero' && (
        <Tutorial 
          gameType={currentGame} 
          onComplete={() => setShowTutorial(false)} 
        />
      )}
      {(!showTutorial || currentGame === 'menu' || currentGame === 'scenario' || currentGame === 'evidence' || currentGame === 'hero') && (
        <>
          {currentGame === 'hero' && <HeroLanding />}
          {currentGame === 'scenario' && <CaseScenario />}
          {currentGame === 'evidence' && <EvidenceScreen />}
          {currentGame === 'menu' && <MainMenu />}
          {currentGame === 'game1' && <Game1 />}
          {currentGame === 'game2' && <Game2 />}
          {currentGame === 'game3' && <Game3 />}
          {currentGame === 'game4' && <Game4 />}
        </>
      )}
    </div>
  );
};

export default DNADetectiveGame;
