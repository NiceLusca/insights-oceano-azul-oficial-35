
// Helper functions for FunnelDashboard components

export const calculateMetricStatus = (actual: number, ideal: number, isHigherBetter: boolean = true) => {
  if (isHigherBetter) {
    if (actual >= ideal) return "success";
    if (actual >= ideal * 0.8) return "warning";
    return "error";
  } else {
    if (actual <= ideal) return "success";
    if (actual <= ideal * 1.2) return "warning";
    return "error";
  }
};

export const getIdealMetrics = () => ({
  cpaIdeal: 17,
  icMaximo: 6,
  cpcMaximo: 2,
  hookRateBom: 30,
  hookRatePromissor: 40,
  hookRateExcelente: 45,
  viewRate: 1
});

export const getSeverityVariant = (severity: string) => {
  if (severity === "error") return "destructive";
  if (severity === "warning") return "default";
  return "success";
};
