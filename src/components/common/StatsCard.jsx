import { Box, Card, CardContent, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const iconMap = {
  description: DescriptionOutlinedIcon,
  star: StarOutlineOutlinedIcon,
  work: WorkOutlineOutlinedIcon,
  compare: CompareArrowsIcon,
  people: PeopleOutlineOutlinedIcon,
};

function StatsCard({ title, value, change, icon, color, bgColor }) {
  const Icon = iconMap[icon] ?? DescriptionOutlinedIcon;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
              {value}
            </Typography>
            {change ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 14, color: "#10B981" }} />
                <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 500 }}>
                  {change}
                </Typography>
              </Box>
            ) : null}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color, fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
