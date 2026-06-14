import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}
