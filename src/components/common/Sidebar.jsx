import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: DashboardOutlinedIcon },
  { label: "Job Descriptions", path: "/jobs", icon: WorkOutlineOutlinedIcon },
  { label: "Candidates", path: "/candidates", icon: PeopleOutlineOutlinedIcon },
  { label: "Analytics", path: "/analytics", icon: BarChartOutlinedIcon },
  { label: "Settings", path: "/settings", icon: SettingsOutlinedIcon },
];

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => navigate("/");

  const isNavActive = (path) => {
    if (path === "/jobs") {
      return location.pathname === "/jobs" || location.pathname.startsWith("/jobs/");
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FindInPageOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
              Resume Analyzer
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              AI Recruitment
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List
        sx={{
          px: 2,
          py: 2,
          flex: 1,
          "& .MuiListItemText-primary": {
            color: "#fff !important",
          },
        }}
      >
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = isNavActive(path);
          return (
            <ListItemButton
              key={path}
              onClick={() => {
                navigate(path);
                onClose?.();
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.2,
                color: "#fff",
                backgroundColor: isActive ? "rgba(124, 58, 237, 0.25)" : "transparent",
                "&:hover": {
                  backgroundColor: isActive ? "rgba(124, 58, 237, 0.3)" : "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#fff" }}>
                <Icon sx={{ color: "#fff", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 500,
                      color: "#fff",
                    },
                  },
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    backgroundColor: "#A78BFA",
                    ml: 1,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutOutlinedIcon sx={{ color: "#fff" }} />}
          onClick={handleLogout}
          sx={{
            color: "#fff",
            justifyContent: "flex-start",
            px: 2,
            py: 1.2,
            borderRadius: 2,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            background: "linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            background: "linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)",
            border: "none",
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
export default Sidebar;
