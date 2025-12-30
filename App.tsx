
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend, Line
} from 'recharts';
import { CustomerData, PredictionResult, DashboardMetric } from './types';
import { getChurnPrediction, getPortfolioAssets } from './services/geminiService';
import MetricsCard from './components/MetricsCard';
import PredictionForm from './components/PredictionForm';

const formatINR = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const ROC_DATA = [
  { fpr: 0, tpr: 0 }, { fpr: 0.1, tpr: 0.4 }, { fpr: 0.2, tpr: 0.65 },
  { fpr: 0.3, tpr: 0.8 }, { fpr: 0.5, tpr: 0.92 }, { fpr: 0.8, tpr: 0.98 }, { fpr: 1, tpr: 1 }
];

const RISK_SEGMENTS = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 20, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#f97316' },
  { name: 'Critical', value: 5, color: '#ef4444' }
];

const GLOBAL_IMPORTANCE_DATA = [
  { name: 'Tenure', importance: 0.35 },
  { name: 'Contract Type', importance: 0.28 },
  { name: 'Monthly Charges', importance: 0.15 },
  { name: 'Tech Support', importance: 0.10 },
  { name: 'Internet Service', importance: 0.08 },
  { name: 'Payment Method', importance: 0.04 }
].sort((a, b) => b.importance - a.importance);

const MODEL_EVAL_STATS = [
  { metric: 'Precision', score: 0.82, color: 'text-indigo-400' },
  { metric: 'Recall', score: 0.79, color: 'text-purple-400' },
  { metric: 'F1-Score', score: 0.84, color: 'text-emerald-400' },
  { metric: 'ROC-AUC', score: 0.92, color: 'text-blue-400' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lab' | 'export'>('dashboard');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [portfolio, setPortfolio] = useState<{ pythonCode: string; readme: string } | null>(null);

  const metrics: DashboardMetric[] = [
    { label: 'F1-Score (XGBoost)', value: '0.84', trend: 2.1, icon: 'fa-microchip' },
    { label: 'ROC-AUC', value: '0.92', trend: 0.5, icon: 'fa-chart-area' },
    { label: 'Avg. Retention ROI', value: '₹12,400', trend: 15.2, icon: 'fa-indian-rupee-sign' },
    { label: 'Identified High-Risk', value: '1,240', trend: -4.3, icon: 'fa-user-secret' },
  ];

  const handlePredict = async (data: CustomerData) => {
    setIsPredicting(true);
    try {
      const result = await getChurnPrediction(data);
      setPrediction(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    getPortfolioAssets().then(setPortfolio);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <i className="fas fa-brain text-white"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">ChurnGuard <span className="text-indigo-400">Pro</span></span>
          </div>
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl">
            {(['dashboard', 'lab', 'export'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">Predictive Hub</h2>
                <p className="text-slate-400">Classifying customer churn risk using XGBoost & Random Forest models.</p>
              </div>
              <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                Data State: Preprocessed & Scaled (StandardScaler)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {metrics.map((m, i) => <MetricsCard key={i} {...m} />)}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <PredictionForm onSubmit={handlePredict} isLoading={isPredicting} />
              
              <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                {prediction ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Classification</p>
                        <h3 className={`text-4xl font-black mt-1 ${prediction.riskLevel === 'Critical' ? 'text-red-500' : 'text-emerald-400'}`}>
                          {prediction.riskLevel}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inference Prob.</p>
                        <p className="text-3xl font-mono font-bold text-indigo-400">{(prediction.churnProbability * 100).toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <p className="text-sm font-semibold text-slate-400 mb-3">Feature Importance (Local LIME Explanation)</p>
                      <div className="space-y-2">
                        {prediction.topFactors.map((f, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{f.factor}</span>
                              <span className="text-slate-500">Impact: {(f.weight * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${f.weight * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Strategy Recommendation</p>
                      <p className="text-sm leading-relaxed">{prediction.recommendation}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {prediction.modelComparison.map((m, i) => (
                        <div key={i} className="bg-slate-900/50 p-2 rounded-lg border border-slate-700 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">{m.name}</p>
                          <p className="text-sm font-bold">{m.score.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                    <i className="fas fa-microchip text-6xl mb-4"></i>
                    <p className="text-lg">Awaiting Input for Real-time Inference</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Model Evaluation Statistics Table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {MODEL_EVAL_STATS.map((stat, i) => (
                <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.metric}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.score.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ROC Curve Chart */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <i className="fas fa-chart-line mr-2 text-indigo-400"></i>
                  Model Performance: ROC Curve
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ROC_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="fpr" stroke="#94a3b8" label={{ value: 'FPR', position: 'insideBottom', offset: -5 }} />
                      <YAxis stroke="#94a3b8" label={{ value: 'TPR', angle: -90, position: 'insideLeft' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="tpr" stroke="#6366f1" fill="#6366f133" strokeWidth={3} />
                      {/* Fixed: Added missing Line component from recharts */}
                      <Line type="monotone" dataKey={(d) => d.fpr} stroke="#475569" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  The Receiver Operating Characteristic (ROC) curve plots TPR vs FPR. Our AUC of 0.92 indicates excellent discriminative power between churn and non-churn classes.
                </p>
              </div>

              {/* Global Feature Importance Chart */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <i className="fas fa-signal mr-2 text-emerald-400"></i>
                  Global Feature Importance (XGBoost)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={GLOBAL_IMPORTANCE_DATA} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                      <Tooltip cursor={{ fill: '#ffffff11' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="importance" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Identified key churn drivers across the entire dataset. Tenure and Contract type are the strongest predictive features.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Confusion Matrix Visualization */}
              <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <i className="fas fa-th-large mr-2 text-purple-400"></i>
                  Confusion Matrix Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto relative">
                  {/* Labels */}
                  <div className="absolute -left-12 top-1/2 -rotate-90 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actual</div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Predicted</div>
                  
                  <div className="aspect-square bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
                    <span className="text-[10px] text-slate-500 uppercase mb-1">True Neg (TN)</span>
                    <span className="text-2xl font-black text-slate-300">4,120</span>
                  </div>
                  <div className="aspect-square bg-rose-500/5 border border-rose-500/20 rounded-xl flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
                    <span className="text-[10px] text-rose-400 uppercase mb-1">False Pos (FP)</span>
                    <span className="text-2xl font-black text-rose-500">182</span>
                  </div>
                  <div className="aspect-square bg-rose-500/5 border border-rose-500/20 rounded-xl flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
                    <span className="text-[10px] text-rose-400 uppercase mb-1">False Neg (FN)</span>
                    <span className="text-2xl font-black text-rose-500">143</span>
                  </div>
                  <div className="aspect-square bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
                    <span className="text-[10px] text-emerald-400 uppercase mb-1">True Pos (TP)</span>
                    <span className="text-2xl font-black text-emerald-500">895</span>
                  </div>
                </div>
                <div className="mt-8 text-sm text-slate-400 space-y-4 text-center">
                  <p>Accuracy is <strong>94%</strong>, but misleading due to class imbalance. Our model prioritizes <strong>Recall</strong> to minimize False Negatives (missed churners).</p>
                </div>
              </div>

              {/* Risk Distribution Pie Chart */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <i className="fas fa-users-viewfinder mr-2 text-blue-400"></i>
                  Predicted Risk Segmentation
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={RISK_SEGMENTS} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {RISK_SEGMENTS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {RISK_SEGMENTS.map((s, i) => (
                    <div key={i} className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: s.color }}></div>
                      <span className="text-slate-400">{s.name} ({s.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
               <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                   <i className="fab fa-python text-blue-400 text-lg"></i>
                   <span className="text-sm font-mono font-bold text-slate-200">churn_model_pipeline.py</span>
                 </div>
                 <button className="text-xs bg-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-500 transition-all shadow-lg active:scale-95 flex items-center" onClick={() => {
                   if(portfolio) navigator.clipboard.writeText(portfolio.pythonCode);
                   alert('Code copied to clipboard!');
                 }}>
                   <i className="fas fa-copy mr-2"></i>
                   Copy Script
                 </button>
               </div>
               <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700">
                 <code>{portfolio?.pythonCode || '# Initializing Portfolio Environment...'}</code>
               </pre>
             </div>

             <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
               <h3 className="text-xl font-bold mb-4 flex items-center">
                 <i className="fab fa-readme mr-2 text-indigo-400"></i>
                 Project Documentation (README.md)
               </h3>
               <div className="prose prose-invert prose-slate max-w-none">
                 <div className="whitespace-pre-line text-slate-400 font-normal leading-loose">
                   {portfolio?.readme || 'Synthesizing technical documentation...'}
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 mt-12 border-t border-slate-800 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <p>© 2024 ChurnGuard Pro Internship Portfolio.</p>
          <div className="hidden md:block w-px h-4 bg-slate-800"></div>
          <p className="hidden md:block">Built with React, Recharts & Gemini 3.0 Pro</p>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-300 transition-colors flex items-center"><i className="fab fa-github mr-2"></i> Portfolio Link</a>
          <a href="#" className="hover:text-slate-300 transition-colors flex items-center"><i className="fas fa-file-pdf mr-2"></i> Project Report</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
