import { useState } from "react";
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
  IconButton,
} from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ResumeUpload from "../../components/resumes/ResumeUpload";
import StatusBadge from "../../components/common/StatusBadge";
import { uploadedResumes as initialResumes } from "../../data/mockData";

function UploadResumes() {
  const [resumes, setResumes] = useState(initialResumes);

  const handleDelete = (id) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".pdf")) {
      return <PictureAsPdfOutlinedIcon sx={{ color: "#EF4444", fontSize: 22 }} />;
    }
    return <DescriptionOutlinedIcon sx={{ color: "#3B82F6", fontSize: 22 }} />;
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Upload Resume
          </Typography>
          <ResumeUpload />
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Uploaded Resumes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Candidate Name</TableCell>
                  <TableCell>Uploaded On</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow key={resume.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {getFileIcon(resume.fileName)}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {resume.fileName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{resume.candidateName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {resume.uploadedOn}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={resume.status} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: "#7C3AED" }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "#EF4444" }} onClick={() => handleDelete(resume.id)}>
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UploadResumes;
