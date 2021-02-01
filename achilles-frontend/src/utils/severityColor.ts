export const criticalSeverityColor = 'rgb(155,37,116)';
export const highSeverityColor = 'rgb(235, 26, 33)';
export const moderateSeverityColor = 'rgb(240, 178, 84)';
export const lowSeverityColor = 'rgb(241, 233, 23)';

export const severityColor = (severity: string) => {
  const severityCase = severity.toLowerCase();

  if (severityCase === 'critical') return criticalSeverityColor;
  if (severityCase === 'high') return highSeverityColor;
  else if (severityCase === 'low') return lowSeverityColor;
  else if (severityCase === 'moderate') return moderateSeverityColor;
};
