const FormattedTime = ({ timeString }) => {
  if (!timeString) return <span>N/A</span>;
  return <span>{timeString}</span>;
};

export default FormattedTime;
