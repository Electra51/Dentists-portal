const handlePrint = (prescription) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${prescription.prescriptionId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #06b6d4; }
            .header { border-bottom: 2px solid #06b6d4; padding-bottom: 10px; margin-bottom: 20px; }
            .medicine { background: #f0f9ff; padding: 10px; margin: 10px 0; border-left: 4px solid #06b6d4; }
            .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p><strong>Prescription ID:</strong> ${
              prescription.prescriptionId
            }</p>
            <p><strong>Date:</strong> ${new Date(
              prescription.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Patient:</strong> ${prescription.patientName}</p>
          </div>
          <h2>Diagnosis</h2>
          <p>${prescription.diagnosis || "N/A"}</p>
          <h2>Prescribed Medicines</h2>
          ${
            prescription.medicines
              ?.map(
                (med, i) => `
            <div class="medicine">
              <h3>${i + 1}. ${med.medicineName}</h3>
              <p><strong>Dosage:</strong> ${med.dosage}</p>
              <p><strong>Frequency:</strong> ${med.frequency}</p>
              <p><strong>Duration:</strong> ${med.duration}</p>
              <p><strong>Instructions:</strong> ${
                med.instructions || "As directed"
              }</p>
            </div>
          `
              )
              .join("") || "<p>No medicines prescribed</p>"
          }
          ${
            prescription.generalInstructions
              ? `<h2>General Instructions</h2><p>${prescription.generalInstructions}</p>`
              : ""
          }
          <div class="footer">
            <p><strong>Doctor:</strong> ${prescription.doctorName}</p>
            <p><strong>Specialization:</strong> ${
              prescription.doctorSpecialization
            }</p>
            ${
              prescription.nextVisit
                ? `<p><strong>Next Visit:</strong> ${new Date(
                    prescription.nextVisit
                  ).toLocaleDateString()}</p>`
                : ""
            }
          </div>
        </body>
      </html>
    `);
  printWindow.document.close();
  printWindow.print();
};

export default handlePrint;
