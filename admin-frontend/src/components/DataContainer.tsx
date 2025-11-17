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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${textColour}`}>{data}</p>
      <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
    </div>
  );
}
