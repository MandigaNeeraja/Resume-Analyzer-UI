import { useState, useEffect } from "react";

import {

  AppBar,

  Toolbar,

  IconButton,

  Typography,

  Box,

  Badge,

  Avatar,

  Menu,

  MenuItem,

  Breadcrumbs,

  Link,

  Divider,

  ListItemText,

} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useNavigate } from "react-router-dom";

import { getNotifications } from "../../api/dashboard";

import { formatRelativeTime } from "../../utils/formatRelativeTime";



function getUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Navbar({ title, breadcrumbs, onMenuClick }) {

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState({ count: 0, items: [] });

  const [now, setNow] = useState(Date.now());

  const [user, setUser] = useState(getUserFromStorage);



  useEffect(() => {

    const loadNotifications = async () => {

      try {

        const data = await getNotifications();

        setNotifications({

          count: data.count ?? 0,

          items: data.items ?? [],

        });

      } catch {

        setNotifications({ count: 0, items: [] });

      }

    };



    loadNotifications();

    const interval = setInterval(() => {

      loadNotifications();

      setNow(Date.now());

    }, 60000);



    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    const syncUser = () => setUser(getUserFromStorage());
    window.addEventListener("storage", syncUser);
    window.addEventListener("user-updated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-updated", syncUser);
    };
  }, []);



  return (

    <AppBar

      position="sticky"

      elevation={0}

      sx={{

        backgroundColor: "#fff",

        borderBottom: "1px solid #E2E8F0",

        color: "text.primary",

      }}

    >

      <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, md: 64 } }}>

        <IconButton

          edge="start"

          onClick={onMenuClick}

          sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}

        >

          <MenuIcon />

        </IconButton>



        <Box sx={{ flexGrow: 1 }}>

          {breadcrumbs ? (

            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 0.5 }}>

              {breadcrumbs.map((crumb, index) =>

                crumb.path ? (

                  <Link

                    key={index}

                    underline="hover"

                    color="text.secondary"

                    sx={{ cursor: "pointer", fontSize: "0.85rem" }}

                    onClick={() => navigate(crumb.path)}

                  >

                    {crumb.label}

                  </Link>

                ) : (

                  <Typography key={index} color="text.primary" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>

                    {crumb.label}

                  </Typography>

                )

              )}

            </Breadcrumbs>

          ) : null}

          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>

            {title}

          </Typography>

        </Box>



        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          <IconButton

            sx={{ color: "text.secondary" }}

            onClick={(e) => setNotificationAnchorEl(e.currentTarget)}

          >

            <Badge badgeContent={notifications.count} color="error">

              <NotificationsOutlinedIcon />

            </Badge>

          </IconButton>



          <Menu

            anchorEl={notificationAnchorEl}

            open={Boolean(notificationAnchorEl)}

            onClose={() => setNotificationAnchorEl(null)}

            transformOrigin={{ horizontal: "right", vertical: "top" }}

            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}

            slotProps={{

              paper: {

                sx: { width: 320, maxHeight: 400 },

              },

            }}

          >

            <Box sx={{ px: 2, py: 1.5 }}>

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>

                Notifications

              </Typography>

            </Box>

            <Divider />

            {notifications.items.length === 0 ? (

              <MenuItem disabled>

                <Typography variant="body2" color="text.secondary">

                  No recent notifications

                </Typography>

              </MenuItem>

            ) : (

              notifications.items.map((item, index) => (

                <MenuItem

                  key={`${item.type}-${item.occurredAt}-${index}`}

                  onClick={() => setNotificationAnchorEl(null)}

                  sx={{ alignItems: "flex-start", py: 1.5, whiteSpace: "normal" }}

                >

                  <ListItemText

                    primary={

                      <Typography variant="body2" sx={{ fontWeight: 600 }}>

                        {item.message}

                      </Typography>

                    }

                    secondary={

                      <>

                        <Typography variant="caption" color="text.secondary" display="block">

                          {item.detail}

                        </Typography>

                        <Typography variant="caption" color="text.secondary">

                          {formatRelativeTime(item.occurredAt, now)}

                        </Typography>

                      </>

                    }

                  />

                </MenuItem>

              ))

            )}

          </Menu>



          <Box

            sx={{

              display: "flex",

              alignItems: "center",

              gap: 1,

              cursor: "pointer",

              px: 1,

              py: 0.5,

              borderRadius: 2,

              "&:hover": { backgroundColor: "#F8FAFC" },

            }}

            onClick={(e) => setAnchorEl(e.currentTarget)}

          >

            <Avatar

              sx={{

                width: 36,

                height: 36,

                background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",

                fontSize: "0.9rem",

                fontWeight: 600,

              }}

            >

              {getInitials(user.name)}

            </Avatar>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>

              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>

                {user.name || "User"}

              </Typography>

              <Typography variant="caption" color="text.secondary">

                {user.role || "HR"}

              </Typography>

            </Box>

          </Box>



          <Menu

            anchorEl={anchorEl}

            open={Boolean(anchorEl)}

            onClose={() => setAnchorEl(null)}

            transformOrigin={{ horizontal: "right", vertical: "top" }}

            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}

          >

            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>

            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/settings");
              }}
            >
              Settings
            </MenuItem>

            <MenuItem

              onClick={() => {

                localStorage.removeItem("token");

                localStorage.removeItem("user");

                navigate("/");

              }}

            >

              Logout

            </MenuItem>

          </Menu>

        </Box>

      </Toolbar>

    </AppBar>

  );

}



export default Navbar;

