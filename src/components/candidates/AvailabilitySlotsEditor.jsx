import Button from "../ui/Button";
import { Input } from "../ui/Input";

const emptySlot = () => ({ date: "", startTime: "09:00", endTime: "10:00" });

export default function AvailabilitySlotsEditor({ slots, onChange }) {
  const updateSlot = (index, field, value) => {
    const next = slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot));
    onChange(next);
  };

  const addSlot = () => onChange([...slots, emptySlot()]);

  const removeSlot = (index) => {
    if (slots.length === 1) return;
    onChange(slots.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">Available Time Slots</p>
        <Button type="button" variant="secondary" size="sm" onClick={addSlot}>+ Add Slot</Button>
      </div>
      {slots.map((slot, index) => (
        <div key={index} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
          <Input
            label="Date"
            type="date"
            value={slot.date}
            onChange={(e) => updateSlot(index, "date", e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="From"
              type="time"
              value={slot.startTime}
              onChange={(e) => updateSlot(index, "startTime", e.target.value)}
              required
            />
            <Input
              label="To"
              type="time"
              value={slot.endTime}
              onChange={(e) => updateSlot(index, "endTime", e.target.value)}
              required
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeSlot(index)}
            disabled={slots.length === 1}
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Remove Slot
          </Button>
        </div>
      ))}
      <p className="text-xs text-slate-400">HR will only be able to schedule interviews within these slots.</p>
    </div>
  );
}

export function AvailabilitySlotsList({ slots }) {
  if (!slots?.length) {
    return <p className="text-sm text-slate-400">No manager availability provided.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot, index) => (
        <span
          key={`${slot.date}-${slot.startTime}-${index}`}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100 text-xs font-medium"
        >
          {slot.date} · {slot.startTime?.slice(0, 5)} – {slot.endTime?.slice(0, 5)}
        </span>
      ))}
    </div>
  );
}
