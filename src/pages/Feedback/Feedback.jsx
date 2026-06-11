import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { getInterviews } from "../../api/interviews";
import { createFeedback, getFeedbackByCandidate } from "../../api/interviewFeedback";
import { mapInterviewFromApi, mapFeedbackFromApi } from "../../utils/mappers";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input, Textarea, Select } from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/enterprise/PageHeader";
import { refreshNotifications } from "../../utils/notificationEvents";

async function loadInterviewsWithFeedbackStatus() {
  const data = await getInterviews();
  const completed = data.map(mapInterviewFromApi).filter((i) => i.status === "Completed");

  const candidateIds = [...new Set(completed.map((i) => i.candidateId))];
  const feedbackByCandidate = {};

  await Promise.all(
    candidateIds.map(async (candidateId) => {
      try {
        const fb = await getFeedbackByCandidate(candidateId);
        feedbackByCandidate[candidateId] = (fb || []).map(mapFeedbackFromApi);
      } catch {
        feedbackByCandidate[candidateId] = [];
      }
    })
  );

  return completed.map((interview) => {
    const candidateFeedback = feedbackByCandidate[interview.candidateId] || [];
    const hasFeedback = candidateFeedback.some(
      (f) => Number(f.interviewId) === Number(interview.id)
    );
    return { ...interview, hasFeedback };
  });
}

export default function Feedback() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    technicalKnowledgeRating: 3, problemSolvingRating: 3, communicationRating: 3,
    comments: "", decision: "Selected",
  });
  const [saving, setSaving] = useState(false);

  const load = () =>
    loadInterviewsWithFeedbackStatus()
      .then(setInterviews)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await createFeedback({
        interviewId: selected.id,
        candidateId: selected.candidateId,
        ...form,
        technicalKnowledgeRating: Number(form.technicalKnowledgeRating),
        problemSolvingRating: Number(form.problemSolvingRating),
        communicationRating: Number(form.communicationRating),
      });
      toast.success("Feedback submitted");
      setSelected(null);
      setForm({
        technicalKnowledgeRating: 3, problemSolvingRating: 3, communicationRating: 3,
        comments: "", decision: "Selected",
      });
      await loadInterviewsWithFeedbackStatus().then(setInterviews);
      refreshNotifications();
    } catch (err) {
      toast.error(err.response?.data || "Failed to submit feedback");
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = interviews.filter((i) => !i.hasFeedback).length;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Interview Feedback"
        description="Submit interview feedback and technical selection decisions."
      />

      <Card>
        <CardHeader
          title="Completed Interviews"
          subtitle={pendingCount > 0 ? `${pendingCount} awaiting manager feedback` : "All feedback submitted"}
        />
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-3 pr-4">Candidate</th>
                <th className="pb-3 pr-4">Job</th>
                <th className="pb-3 pr-4">Date & Time</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr key={i.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium">{i.candidateName}</td>
                  <td className="py-3 pr-4">{i.jobTitle}</td>
                  <td className="py-3 pr-4">
                    {i.date}{i.time ? ` · ${i.time}` : ""}
                  </td>
                  <td className="py-3">
                    {i.hasFeedback ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Submitted
                      </span>
                    ) : (
                      <Button size="sm" onClick={() => setSelected(i)}>Submit Feedback</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {interviews.length === 0 && (
            <p className="text-center text-slate-400 py-8">No completed interviews awaiting feedback.</p>
          )}
        </CardBody>
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Interview Feedback" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-600">
            Feedback for <strong>{selected?.candidateName}</strong>
            {selected?.date && (
              <span className="text-slate-400"> · {selected.date}{selected.time ? ` ${selected.time}` : ""}</span>
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Technical (1-5)" type="number" min={1} max={5} value={form.technicalKnowledgeRating}
              onChange={(e) => setForm({ ...form, technicalKnowledgeRating: e.target.value })} />
            <Input label="Problem Solving (1-5)" type="number" min={1} max={5} value={form.problemSolvingRating}
              onChange={(e) => setForm({ ...form, problemSolvingRating: e.target.value })} />
            <Input label="Communication (1-5)" type="number" min={1} max={5} value={form.communicationRating}
              onChange={(e) => setForm({ ...form, communicationRating: e.target.value })} />
          </div>
          <Textarea label="Comments" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} required />
          <Select label="Decision" value={form.decision} onChange={(e) => setForm({ ...form, decision: e.target.value })}
            options={[{ value: "Selected", label: "Selected" }, { value: "Rejected", label: "Rejected" }]} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setSelected(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Submitting..." : "Submit Feedback"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
