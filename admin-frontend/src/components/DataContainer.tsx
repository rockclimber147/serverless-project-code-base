interface DataContainerProps {
  title: string;
  data: number;
  subtitle: string;
  textColour: string;
}

export default function DataContainer({
  title,
  data,
  subtitle,
  textColour
}: DataContainerProps) {
  return (
    <div className="admin-card p-6">
      <h2 className="admin-card-title mb-3">{title}</h2>
      <p className={`admin-card-value ${textColour}`}>{data}</p>
      <p className="admin-card-subtitle mt-2">{subtitle}</p>
    </div>
  );
}
