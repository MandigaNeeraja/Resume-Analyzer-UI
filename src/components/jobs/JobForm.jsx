import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input, Textarea } from "../ui/Input";

const emptyForm = {
  jobTitle: "",
  designation: "",
  department: "",
  location: "",
  employmentType: "Full-Time",
  experienceRequired: "",
  description: "",
};

export default function JobForm({ open, onClose, onSave, editJob = null, saving = false, departments = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (open) {
      if (editJob) {
        setForm({
          jobTitle: editJob.title || "",
          designation: editJob.designation || "",
          department: editJob.department || "",
          location: editJob.location || "",
          employmentType: editJob.employmentType || "Full-Time",
          experienceRequired: editJob.experience || "",
          description: editJob.description || "",
        });
        setSkills(editJob.skills || []);
      } else {
        setForm(emptyForm);
        setSkills([]);
      }
      setSkillInput("");
    }
  }, [open, editJob]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      requiredSkills: skills,
    });
  };

  const canSave = form.jobTitle && form.experienceRequired && skills.length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editJob ? "Edit Job" : "Create New Job"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Job Title"
          placeholder="e.g. Backend Developer"
          value={form.jobTitle}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          required
        />

        <Textarea
          label="Job Description"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Designation"
            placeholder="e.g. Senior Backend Developer"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              {form.department && !departments.includes(form.department) && (
                <option value={form.department}>{form.department}</option>
              )}
            </select>
          </div>
          <Input
            label="Location"
            placeholder="e.g. Mumbai"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            label="Employment Type"
            placeholder="e.g. Full-Time"
            value={form.employmentType}
            onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
          />
        </div>

        <Input
          label="Experience Required"
          placeholder="e.g. 2+ Years"
          value={form.experienceRequired}
          onChange={(e) => setForm({ ...form, experienceRequired: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddSkill}>
              + Add
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-400 hover:text-blue-800 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {skills.length === 0 && (
            <p className="text-xs text-slate-400 mt-1">Add at least one skill</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSave || saving}>
            {saving ? "Saving..." : editJob ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
