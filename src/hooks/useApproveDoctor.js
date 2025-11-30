import toast from "react-hot-toast";
import Swal from "sweetalert2";

const useApproveDoctor = (approveDoctorMutation, refetch) => {
  const handleApprove = async ({ doctorId, doctorName }) => {
    const confirmMessage = doctorName
      ? `Approve Dr. ${doctorName}?`
      : "Are you sure you want to approve this doctor?";

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",

      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },

      buttonsStyling: false,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await approveDoctorMutation(doctorId).unwrap();
      toast.success(res?.message || "Doctor approved successfully!");
      refetch && refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to approve doctor");
    }
  };

  return { handleApprove };
};

export default useApproveDoctor;
