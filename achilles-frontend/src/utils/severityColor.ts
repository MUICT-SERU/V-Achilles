export const highSeverityColor = "rgb(178, 54, 52)";
export const moderateSeverityColor = "rgb(240, 178, 84)";
export const lowSeverityColor = "rgb(132, 140, 193)";

export const severityColor = (severity: string) => {
  const severityCase = severity.toLowerCase();

  if (severityCase === "high") return highSeverityColor;
  else if (severityCase === "low") return lowSeverityColor;
  else if (severityCase === "moderate") return moderateSeverityColor;
};
