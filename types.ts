
export interface CustomerData {
  tenure: number;
  monthlyCharges: number;
  totalCharges: number;
  contract: 'Month-to-month' | 'One year' | 'Two year';
  internetService: 'DSL' | 'Fiber optic' | 'No';
  techSupport: 'Yes' | 'No';
  paperlessBilling: 'Yes' | 'No';
  paymentMethod: string;
}

export interface ModelMetrics {
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  confusionMatrix: {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
  };
}

export interface PredictionResult {
  churnProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  topFactors: { factor: string; weight: number }[];
  recommendation: string;
  reasoning: string;
  modelComparison: { name: string; score: number }[];
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
}
