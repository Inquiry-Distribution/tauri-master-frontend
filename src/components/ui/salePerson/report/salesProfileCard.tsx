import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { useGetSalesPersonById } from "@/src/hooks/salesPerson/useGetSalesPerson";
import CommonLoader from "../../loader/loader";
import Swal from "sweetalert2";

export default function SalesPersonProfileCard({ id }: { id: string }) {
  const { getSalesPersonById, loading, error } = useGetSalesPersonById();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await getSalesPersonById(id);
        setUser(res.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to load user",
          text: error || "Please try again later",
        });
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return <CommonLoader size={32} fullScreen={false} overlay={true} />;

  if (!user) return <div className="text-danger">Failed to load user</div>;

  return (
    <div className="p-6 rounded-2xl border bg-surface">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.profileImage || `https://picsum.photos/seed/${id}/200/200`}
          className="w-24 h-24 rounded-2xl mb-4"
        />

        <h2 className="text-xl font-bold">{user.name}</h2>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            user.isActive
              ? "bg-successLight text-success"
              : "bg-dangerLight text-danger"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={14} /> {user.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} /> {user.phone || "N/A"}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(user.createdAt).toDateString()}
          </div>
          {user.assignedArea && (
            <div className="flex items-center gap-2">
              <MapPin size={14} /> {user.assignedArea}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
