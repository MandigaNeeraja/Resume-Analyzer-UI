import { Chip } from "@mui/material";

const statusStyles = {
  Parsed: { bg: "#D1FAE5", color: "#059669" },
  Failed: { bg: "#FEE2E2", color: "#DC2626" },
  Shortlisted: { bg: "#D1FAE5", color: "#059669" },
  Review: { bg: "#FEF3C7", color: "#D97706" },
  "Not Matched": { bg: "#FEE2E2", color: "#DC2626" },
};

function StatusBadge({ status }) {
  const style = statusStyles[status] || { bg: "#F1F5F9", color: "#64748B" };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 26,
      }}
    />
  );
}

export default StatusBadge;
