import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Pagination,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import StatusBadge from "../../components/common/StatusBadge";
import { matchResults as initialResults, jobOptions } from "../../data/mockData";

const ITEMS_PER_PAGE = 5;

function getScoreColor(score) {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function ATSResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState(initialResults);
  const [selectedJob, setSelectedJob] = useState("");
  const [minScore, setMinScore] = useState("");
  const [page, setPage] = useState(1);

  const handleApplyFilter = () => {
    let filtered = [...initialResults];
    if (minScore) {
      filtered = filtered.filter((r) => r.matchScore >= Number(minScore));
    }
    setResults(filtered);
    setPage(1);
  };

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-end" }}>
            <FilterListIcon sx={{ color: "#7C3AED", mt: 1 }} />
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Select Job</InputLabel>
              <Select
                value={selectedJob}
                label="Select Job"
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <MenuItem value="">All Jobs</MenuItem>
                {jobOptions.map((job) => (
                  <MenuItem key={job.value} value={job.value}>
                    {job.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Minimum Match Score"
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              sx={{ width: 200 }}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
            />
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              sx={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                px: 3,
              }}
            >
              Apply Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Skills Matched</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Match Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedResults.map((result) => (
                  <TableRow key={result.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {result.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {result.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {result.skillsMatched.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{
                              backgroundColor: "#DBEAFE",
                              color: "#1D4ED8",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                              height: 24,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {result.experience}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 160 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={result.matchScore}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#F1F5F9",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                backgroundColor: getScoreColor(result.matchScore),
                              },
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: getScoreColor(result.matchScore), minWidth: 36 }}
                        >
                          {result.matchScore}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={result.status} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        sx={{ color: "#7C3AED" }}
                        onClick={() => navigate(`/candidate/${result.id}`)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2.5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ATSResults;
