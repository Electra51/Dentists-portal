import toast from "react-hot-toast";

const useRejectDoctor = (rejectDoctorMutation, refetch) => {
  const handleReject = async ({ doctorId, reason }) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const res = await rejectDoctorMutation({ doctorId, reason }).unwrap();
      toast.success(res.message || "Doctor verification rejected");

      refetch && refetch();
      return true; // success
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to reject doctor");
      return false; // fail
    }
  };

  return { handleReject };
};

export default useRejectDoctor;
