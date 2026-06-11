import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import { getSettings, updateProfile, updatePreferences } from "../../api/settings";

function Settings() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  const [emailNewResumes, setEmailNewResumes] = useState(true);
  const [notifyMatchComplete, setNotifyMatchComplete] = useState(true);
  const [weeklyAnalyticsReport, setWeeklyAnalyticsReport] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(60);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setName(data.name || "");
        setEmail(data.email || "");
        setOrganization(data.organization || "");
        setRole(data.role || "");
        setEmailNewResumes(data.emailNewResumes ?? true);
        setNotifyMatchComplete(data.notifyMatchComplete ?? true);
        setWeeklyAnalyticsReport(data.weeklyAnalyticsReport ?? false);
        setMinMatchScore(data.minMatchScore ?? 60);
        setError("");
      } catch {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        organization: organization.trim(),
      });
      setName(updated.name);
      setOrganization(updated.organization);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: updated.name,
          email: updated.email,
          role: updated.role,
        })
      );
      window.dispatchEvent(new Event("user-updated"));
      toast.success("Profile saved successfully.");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    const score = Number(minMatchScore);
    if (Number.isNaN(score) || score < 0 || score > 100) {
      toast.error("Minimum match score must be between 0 and 100.");
      return;
    }

    setSavingPreferences(true);
    try {
      const updated = await updatePreferences({
        emailNewResumes,
        notifyMatchComplete,
        weeklyAnalyticsReport,
        minMatchScore: score,
      });
      setEmailNewResumes(updated.emailNewResumes);
      setNotifyMatchComplete(updated.notifyMatchComplete);
      setWeeklyAnalyticsReport(updated.weeklyAnalyticsReport);
      setMinMatchScore(updated.minMatchScore);
      toast.success("Preferences saved successfully.");
    } catch {
      toast.error("Failed to save preferences.");
    } finally {
      setSavingPreferences(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Profile Settings
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                value={email}
                disabled
                sx={{ mb: 2.5 }}
                helperText="Email cannot be changed"
              />

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Role
              </Typography>
              <TextField
                fullWidth
                value={role}
                disabled
                sx={{ mb: 2.5 }}
              />

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Organization
              </Typography>
              <TextField
                fullWidth
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Your company name"
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                sx={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                }}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Notification Preferences
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={emailNewResumes}
                    onChange={(e) => setEmailNewResumes(e.target.checked)}
                    color="primary"
                  />
                }
                label="Email notifications for new resumes"
                sx={{ display: "flex", mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyMatchComplete}
                    onChange={(e) => setNotifyMatchComplete(e.target.checked)}
                    color="primary"
                  />
                }
                label="Notify on match completion"
                sx={{ display: "flex", mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={weeklyAnalyticsReport}
                    onChange={(e) => setWeeklyAnalyticsReport(e.target.checked)}
                    color="primary"
                  />
                }
                label="Weekly analytics report"
                sx={{ display: "flex", mb: 2 }}
              />

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Matching Settings
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Default Minimum Match Score
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(e.target.value)}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                helperText="Candidates scoring below this are marked as Not Matched"
                sx={{ mb: 3 }}
              />

              <Button
                variant="outlined"
                color="primary"
                onClick={handleSavePreferences}
                disabled={savingPreferences}
              >
                {savingPreferences ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;
