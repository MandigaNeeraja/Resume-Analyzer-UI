import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, createUser, deleteUser } from "../../api/users";
import { mapUserFromApi } from "../../utils/mappers";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "HR", organization: "Company" });
  const [saving, setSaving] = useState(false);

  const load = () => getUsers().then((d) => setUsers(d.map(mapUserFromApi))).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createUser(form);
      toast.success("User created");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Spinner />;

  const hrUsers = users.filter((u) => u.role === "HR");
  const managers = users.filter((u) => u.role === "Manager");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">Manage internal employee accounts — no self-registration needed.</p>
        <Button onClick={() => setModalOpen(true)}>+ Add User</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UserGroup title="Administrators" users={users.filter((u) => u.role === "Admin")} onDelete={handleDelete} />
        <UserGroup title="HR Team" users={hrUsers} onDelete={handleDelete} />
        <UserGroup title="Managers" users={managers} onDelete={handleDelete} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Employee">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Company Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Temporary Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[{ value: "HR", label: "HR" }, { value: "Manager", label: "Manager" }, { value: "Admin", label: "Admin" }]} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Account"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function UserGroup({ title, users, onDelete }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={`${users.length} users`} />
      <CardBody className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div>
              <p className="font-medium text-sm">{u.name}</p>
              <p className="text-xs text-slate-500">{u.email}</p>
            </div>
            {u.role !== "Admin" && (
              <button onClick={() => onDelete(u.id)} className="text-red-500 text-xs hover:underline">Remove</button>
            )}
          </div>
        ))}
        {users.length === 0 && <p className="text-slate-400 text-sm">No users</p>}
      </CardBody>
    </Card>
  );
}
