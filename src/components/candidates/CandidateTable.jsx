import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StatusBadge from "../common/StatusBadge";

function CandidateTable({ candidates }) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Candidate</TableCell>
            <TableCell>Skills</TableCell>
            <TableCell>Experience</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {candidate.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {candidate.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: "#EDE9FE",
                        color: "#6D28D9",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 24,
                      }}
                    />
                  ))}
                  {candidate.skills.length > 3 && (
                    <Chip
                      label={`+${candidate.skills.length - 3}`}
                      size="small"
                      sx={{ backgroundColor: "#F1F5F9", color: "#64748B", height: 24 }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {candidate.experience}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusBadge status={candidate.status} />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  sx={{ color: "#7C3AED" }}
                  onClick={() => navigate(`/candidate/${candidate.id}`)}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CandidateTable;
