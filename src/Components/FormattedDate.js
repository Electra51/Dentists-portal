const FormattedDate = ({ date }) => {
  if (!date) return null;

  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return (
    <span>
      {day} {month} {year}
    </span>
  );
};

export default FormattedDate;
