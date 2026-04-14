import BaseLoader from "./baseLoader";

interface SectionLoaderProps {
  height?: string;
}

const SectionLoader = ({ height = "200px" }: SectionLoaderProps) => {
  return (
    <div className="flex items-center justify-center w-full" style={{ height }}>
      <BaseLoader size={36} />
    </div>
  );
};

export default SectionLoader;
